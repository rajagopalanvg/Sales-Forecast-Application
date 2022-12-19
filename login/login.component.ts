import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagerService } from '../usermanager.service';

export interface LoginUser {
  UserName : string,
  Password : string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  _UserName='';
  Password='';

  constructor(private route:Router,private userman:UsermanagerService) { }

  ngOnInit(): void {
  }

  user : LoginUser = {
    UserName : "",
    Password : ""
  }


  Authenticate(){
    if(this._UserName=="" || this.Password==""){
      alert("Please Enter The Credentials!!");
    }
    else{
      let check = this.userman.ValidateUser(this._UserName,this.Password);
      localStorage.setItem("image","0");
      console.log(this._UserName,this.Password);
      console.log(check);
      if(check==true){
        localStorage.setItem('token',this._UserName);
        localStorage.setItem('pass',this.Password);
        this.route.navigateByUrl('/dashboard');
        alert('LogIn Success');
      }
      else{
        this.user.UserName = this._UserName;
        this.user.Password = this.Password;
        this.userman.getUser(this.user).subscribe(data => {
          console.log(data);
          if(data.status.message === 'success'){
            this.userman.AddUser(data.data[0].UserName,data.data[0].Password,data.data[0].Location, data.data[0].Age, data.data[0].Designation, data.data[0].Salary);
            console.log("Logged In");
            localStorage.setItem('token',this._UserName);
            localStorage.setItem('pass',this.Password);
            this.route.navigateByUrl('/dashboard');
          }
          else{
            alert('Invalid credentials')
          }
        }); 
      }
    }
  }
}

