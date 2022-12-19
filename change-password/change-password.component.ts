import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagerService } from '../usermanager.service';

export interface User_1 {
  UserName?: string;
  Password: string;
  Location: string;
  Age: string;
  Designation: string;
  Salary: string;
}

export interface Profile {
  UserName : string | null,
  Password : string | null,
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  UserName=localStorage.getItem('token');
  _UserName='';
  Password="";
  Location='';
  Age='';
  Designation='';
  Salary='';
  Old_Password='';
  New_Password='';
  myimage:string="assets/images/avatar.jpg";

  user: User_1 = {
    UserName: '',
    Password: '',
    Location: '',
    Age: '',
    Designation: '',
    Salary: ''
  }

  user_1 : Profile = {
    UserName: "",
    Password: "",
  }

  UserDetails: { UserName: string, Password:string, Location:string, Age:string, Designation:string, Salary:string}[]=[]; 

  constructor(private route:Router, private userman:UsermanagerService) { }

  ngOnInit(): void {
    this.UserDetails=this.userman.UserDetails;
    this.Check_JSON();
  }

  Check_JSON(): void{
    for(let i=0; i<this.UserDetails.length; i++){
        console.log(this.UserDetails[i].UserName, this.UserName)
        if(this.UserDetails[i].UserName==this.UserName){
          this._UserName=this.UserDetails[i].UserName;
          this.Password=this.UserDetails[i].Password;
          this.Location=this.UserDetails[i].Location;
          this.Age=this.UserDetails[i].Age;
          this.Designation=this.UserDetails[i].Designation;
          this.Salary=this.UserDetails[i].Salary;
        }
    }
  }

  Validate(): boolean {
    let check = this.userman.Check_Validity();
    console.log(check);
    if(check==false){
      alert("LogIn first to access the content");
      this.route.navigateByUrl('/login');
    }
    return check
  }

  Change_Pwd(){
    if(this.Old_Password==this.New_Password){
      alert("Both Old and New Passwords are same");
    }
    else{
      let UserName = localStorage.getItem('token');
      console.log(UserName);
      if(UserName!=null){
        let check = this.userman.ValidateUser(UserName,this.Old_Password);
        if(check==true){
          let chg = this.userman.Change_Password(UserName,this.New_Password);
          if(chg==true){
            this.user.UserName=this._UserName;
            this.user.Password=this.Password;
            this.user.Location=this.Location;
            this.user.Age=this.Age;
            this.user.Designation=this.Designation;
            this.user.Salary=this.Salary;
            this.userman.createUser(this.user).subscribe(success => console.log(success));
            alert("New Password Set!!");
            this.route.navigateByUrl("/dashboard");
          }
          else{
            alert("Oops Some error occured, try again!!");
          }
        }
        else{
          alert("Existing Passwords Don't match, Logging Out!!");
          localStorage.clear();
          this.route.navigateByUrl('/login');
        }
      }
    }
  }

  LogOut(){
    localStorage.clear();
    alert("LogOut Success!!");
    this.route.navigateByUrl('/login');
  }
}
