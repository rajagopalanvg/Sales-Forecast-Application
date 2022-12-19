import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsermanagerService } from '../usermanager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  public csvdata : any[] = [];

  imagename = "";
  UserName=localStorage.getItem('token'); 

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: ['date','sales','forecast'],
    showTitle: false,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: ['date','sales','forecast' ],
    filename : "result"
  };

  buttonToggler = new FormControl('graph');

  Validate(): boolean{
    let check = this.userman.Check_Validity();
    console.log(check);
    if(check==false){
      alert("LogIn first to access the content");
      this.route.navigateByUrl('/login');
    }
    return check
  }

  constructor(private userman:UsermanagerService,private route:Router) {
    var getData = JSON.parse(localStorage.getItem("analysis") || '{}');
    
    this.imagename = getData.data.predictedimage;

    console.log(this.imagename)

    getData.data.resCsv.forEach((ele : any[]) => {
      if(ele[0] !== 'date'){ 
        var newData = {
          date : ele[0],
          sales : ele[1],
          forecast : ele[2],
        }
        this.csvdata.push(newData);
      }
    });

    localStorage.removeItem("image");
    localStorage.setItem("image","1");
    console.log(this.csvdata);
  }

  LogOut(){
    localStorage.clear();
    alert("LogOut Success!!");
    this.route.navigateByUrl('/login');
  }

  ngOnInit(): void {
  }

}
