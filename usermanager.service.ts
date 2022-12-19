import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { User } from "./signin/signin.component";
import { Observable } from 'rxjs';
import { LoginUser } from './login/login.component';
import { Profile } from './change-password/change-password.component';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsermanagerService {

  formdata = new FormData()
  url = "http://localhost:5000/api/file_upload"

  UserDetails=[
    {UserName: "Rajagopalan", Password:"123", Location:"Chennai", Age:"20", Designation:"Trainee", Salary:"5000"}
  ]

  LoginUser = {
    UserName : "",
    Password : ""
  } 

  Profile = {
    UserName:"",
    Password:"",
    Location:"",
    Age:"",
    Designation:"",
    Salary:""
  }

  constructor(private http: HttpClient) { }

  createUser(user: User) {
    return this.http.post("http://127.0.0.1:5000/api/register_user", user, httpOptions);
  }

  getUser(user: LoginUser) : Observable<any>{
    return this.http.get<LoginUser>(`http://127.0.0.1:5000/api/login_user/?UserName=${user.UserName}&Password=${user.Password}`)
  }

  getUserDetails(user_1: Profile): Observable<any>{
    return this.http.get<Profile>(`http://127.0.0.1:5000/api/login_user/?UserName=${user_1.UserName}&Password=${user_1.Password}`)
  }
    

  AddUser(UserName: string, Password: string, Location: string, Age: string, Designation: string, Salary: string){
    console.log(UserName);
    console.log(Password);
    this.UserDetails.push({ UserName: UserName, Password:Password, Location:Location, Age:Age, Designation:Designation, Salary:Salary});
  }

  ValidateUser(UserName: string, Password: string): boolean{
    for(let i=0; i<this.UserDetails.length; i++){
      let check_user=this.UserDetails[i].UserName
      let check_pass=this.UserDetails[i].Password
      if(check_user==UserName && check_pass==Password){
        return true
      }
    }
    return false
  }

  Check_UserName(UserName: string): boolean{
    for(let i=0; i<this.UserDetails.length; i++){
      let Check_UserName=this.UserDetails[i].UserName
      if(Check_UserName==UserName){
        return true
      }
    }
    return false
  }

  Check_Validity(): boolean{
    if(localStorage.getItem('token')!=null){
      return true
    }
    else{
      return false
    }
  }

  Change_Password(UserName: string, New_Password: string): boolean{
    for(let i=0; i<this.UserDetails.length; i++){
      let Check_UserName=this.UserDetails[i].UserName;
      if(Check_UserName==UserName){
        this.UserDetails[i].Password=New_Password;
        return true
      }
    }
    return false
  }

  uploadcsv(file : File, offsetYears : any) : Observable<any>{
    
    const formData = new FormData();

    formData.append("file",file, file.name);

    formData.append("offsetYears",offsetYears)
    
    console.log(formData);  
    return this.http.post("http://127.0.0.1:5000/api/csvupload", formData);
  }
}
