import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagerService } from '../usermanager.service';
import { HttpClient } from '@angular/common/http';

export interface User {
  UserName?: string;
  Password: string;
  Location: string;
  Age: string;
  Designation: string;
  Salary: string;
}


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  UserName='';
  Password='';
  Location='';
  Age='';
  Designation='';
  Salary='';

  UserDetails: { UserName: string, Password:string, Location:string, Age:string, Designation:string, Salary:string}[]=[];

  user: User = {
    UserName: '',
    Password: '',
    Location: '',
    Age: '',
    Designation: '',
    Salary: ''
  }

  constructor(private http : HttpClient, private route:Router,private userman:UsermanagerService) { }

  ngOnInit(): void {
    this.UserDetails=this.userman.UserDetails;
  }

  Register(){
    if(this.UserName=="" || this.Password=="" || this.Age=="" || this.Designation=="" || this.Salary=="" || this.Location==""){
      alert("User Details Cannot be Blank!! Fill in the User Details");
    }
    else{
      let check = this.userman.Check_UserName(this.UserName);
      if(check==false){
        this.userman.AddUser(this.UserName,this.Password,this.Location,this.Age,this.Designation,this.Salary);
        this.user.UserName=this.UserName;
        this.user.Password=this.Password;
        this.user.Location=this.Location;
        this.user.Age=this.Age;
        this.user.Designation=this.Designation;
        this.user.Salary=this.Salary;
        this.userman.createUser(this.user).subscribe(success => console.log(success));
        this.route.navigateByUrl('/login');
        alert("Sign-up Success!! Log In to Continue");
      }    
      else{
        alert("UserName in Use, Please take another UserName");
      }
    }
  }


}
