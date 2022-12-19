import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { ResultComponent } from './result/result.component';


const routes: Routes = [
  { path:'login', component:LoginComponent},
  { path:'signin', component:SigninComponent},
  { path:'dashboard', component:DashboardComponent},
  { path:'chgpwd', component:ChangePasswordComponent},
  { path:'result',component:ResultComponent},
  { path:'', component:LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
