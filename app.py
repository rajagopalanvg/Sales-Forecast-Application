import pickle
from flask import Flask , request , Blueprint
from flask_cors import CORS 
from flask_pymongo import pymongo
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import datetime
import statsmodels.api as sm
from statsmodels.tools.eval_measures import rmse
import base64
from io import BytesIO



con_string = "mongodb+srv://UserName:Password@cluster0.fjgwxye.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(con_string)

db=client.get_database('First-DB')

user_collection=pymongo.collection.Collection(db,'First')

print("Mongo Db Connected Successfully")


def create_web_app():
    web_app = Flask(__name__)
    
    CORS(web_app)

    api_blueprint = Blueprint('api_blueprint',__name__)
    
    @api_blueprint.route('/hello',methods=['GET'])
    def hello():
        print("Hello World")
        return "Hello World"

    @api_blueprint.route('/register_user',methods=['POST'])
    def register_user():
        print("Hi")
        res = {}
        try:
            req_body = request.json
            user_collection.insert_one(req_body)
            print(req_body)
            print("User successfully Registered")
            status = {
                "message" : "success",
                "statusMsg" : "user successfully created"
            }
        except Exception as e:
            print(e)
            status = {
                "message" : "success",
                "error" : "400"
            }
        finally:
            print("register function completed")
        res["status"] = status
        return res
    
    @api_blueprint.route('/login_user/',methods=['GET'])
    def login_user():
        res = {}
        try:
            print(request.args)
            user = {}
            user["UserName"] = request.args.get("UserName")
            user["Password"] = request.args.get("Password")
            dbuser = user_collection.find(user)
            final_user = list(dbuser)
            if(len(final_user) == 0):
                status = {
                    "message" : "failed",
                    "statusMsg" : "not an existing user"
                }
                res["status"] = status
                return res
            status = {
                "message" : "success",
                "statusMsg" : "existing user"
            }
            data = [{'_id' : str(user['_id']),'UserName' : user["UserName"] , 'Password' : user["Password"], 'Location' : user["Location"], 'Age' : user["Age"], 'Designation' : user["Designation"], 'Salary' : user["Salary"],} for user in final_user]
            res["data"] = data
        except Exception as e:
            print(e)
            status = {
                "message" : "success",
                "error" : "400"
            }
        finally:
            print("get user completed")
        res["status"] = status
        print(res)
        return res
    
    
    @api_blueprint.route("/csvupload",methods=["POST"])
    def csvupload():
        req = request.files.get("file")
        yearOffset = request.form.get("offsetYears")
        if(int(yearOffset) > 0):
            req = create_new_dataset(req, int(yearOffset) - 1)

        data = training(req,yearOffset)
        res = {}
        res["status"] = {
            "status": 400,
            "data" : data
        }
        return res
        
    def create_new_dataset(file, yearOffset):

        dt = datetime.datetime(2018, 1, 1)
        end = datetime.datetime(2018 + yearOffset, 12, 30, 23, 59, 59)
        step = datetime.timedelta(days=1)

        result = []

        while dt < end:
            result.append(dt.strftime('%Y-%m-%d %H:%M:%S'))
            dt += step
            
        result = pd.DataFrame(result)
        
        result.rename(columns={0: 'date'}, inplace=True)
        
        result.date = pd.to_datetime(result.date, format = "%Y-%m-%d")
        
        result = pd.DataFrame(result)

        csvFile = pd.read_csv(file)

        predictdata = csvFile.append(result,sort=False,ignore_index=True)
        
        predictdata.date = pd.to_datetime(predictdata.date, format = "%Y-%m-%d")

        return predictdata
        

    def training(csvFile, yearOffset):
        if(int(yearOffset) == 0):
            train = pd.read_csv(csvFile)
        else:
            train = csvFile
        temp = pd.DataFrame()
        temp["Date"] = 0
        l = []
        for i in train.date:
            l.append(str(i)[0:7])
        temp["Date"] = l
        
        train.date = temp.Date
        train.date = pd.to_datetime(train.date)
        grouped1 = train.groupby('date')['sales'].sum()

        grouped1= pd.DataFrame(grouped1)
        
        second = train.groupby(train.date.dt.year)['sales'].mean().reset_index()
        
        second.date = pd.to_datetime(second.date, format='%Y')
 
        grouped1.sales[grouped1.sales==0.0] = np.NaN
        
        sar = sm.tsa.statespace.SARIMAX(grouped1.sales, order=(12,0,0), seasonal_order=(0,1,0,12), trend='c').fit()
        
        start, end, dynamic = 40, 100, 7
        
        plotimage = BytesIO()

        grouped1['forecast'] = sar.predict(start=start, end=end, dynamic=dynamic)
        
        grouped1[['sales', 'forecast']].plot(color=['darkorange', 'indigo'])

        plt.savefig(plotimage , format="png")

        plt.close()

        plotimage.seek(0)

        print(plotimage)

        predictedURL = base64.b64encode(plotimage.getvalue()).decode('utf')

        returnData = {} 

        returnData["predictedimage"] = "data:image/png;base64," + predictedURL

        final_data = grouped1.to_csv()

        final_columns = [x.split(',') for x in final_data.split('\r\n')]

        final_columns = final_columns[:-1]

        returnData["resCsv"] = final_columns

        return returnData


        
    web_app.register_blueprint( api_blueprint , url_prefix = "/api")
    return web_app

        

app = create_web_app()



if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
