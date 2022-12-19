import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { UsermanagerService } from './usermanager.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ResultComponent } from './result/result.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { Angular2CsvModule } from 'angular2-csv';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SigninComponent,
    ChangePasswordComponent,
    DashboardComponent,
    ResultComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatOptionModule,
    MatSelectModule,
    Angular2CsvModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule
  ],
  providers: [UsermanagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
