import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagerService } from '../usermanager.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  UserName=localStorage.getItem('token');
  value=localStorage.getItem('image');

  csvFile : any; 

  @ViewChild("fileSelect") myInputVariable?: ElementRef

  Password='';
  Location='';
  Age='';
  Designation='';
  Salary='';

  UserDetails: { UserName: string, Password:string, Location:string, Age:string, Designation:string, Salary:string}[]=[];

  constructor(private route:Router, private userman:UsermanagerService) { }

  filename = ""

  noOfYears = 0

  uploadStatus = "No file chosen"

  fileUpload(event : any) {
    console.log(event.target.files);
    var file = event.target.files[0];
    var filename = file.name;
    var fileExt = filename.split('.');
    if(fileExt[1] === 'csv') {
      this.csvFile = file;
      this.filename = filename;
      this.uploadStatus = "Chosen file"
      console.log(this.csvFile);
    }
  }

  onSubmit() {
    console.log(this.csvFile);
    if(this.csvFile==null){
      alert("Please Upload The File And Submit");
    }
    else if(this.noOfYears==0){
      alert("Please Enter the Forecast Period");
    }
    else
    {
      localStorage.setItem("csvFile", JSON.stringify(this.csvFile));
      alert("Please Wait For The Forecast Results")
      this.userman.uploadcsv(this.csvFile , this.noOfYears).subscribe({next: 
          (res) => {
            console.log(res);
            
            localStorage.setItem("analysis" , JSON.stringify(res.status));

            this.route.navigateByUrl('/result');
          },
          error : (error) => {
            alert("Something Went Wrong!! Contact Admin");
          }
        
        })
    }
  }

  ngOnInit(): void {
    this.UserDetails=this.userman.UserDetails;
  }

  Validate(): boolean{
    let check = this.userman.Check_Validity();
    console.log(check);
    if(check==false){
      alert("LogIn first to access the content");
      this.route.navigateByUrl('/login');
    }
    return check
  }

  Check_Img():boolean{
    if(this.value=="1"){
      return true
    }
    else{
      return false
    }
  }

  LogOut(){
    localStorage.clear();
    alert("LogOut Success!!");
    this.route.navigateByUrl('/login');
  }
}
