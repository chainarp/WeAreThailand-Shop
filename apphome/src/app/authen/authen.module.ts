import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';

//import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverComponent } from './recover/recover.component';
import { PasswordStrengthBar } from './users/passwordStrength';
import { Error404Component } from './error404/error404.component';

import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ViewUserComponent } from './users/view-user/view-users.component';

/* Use this routes definition in case you want to make them lazy-loaded */
/*const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'lock', component: LockComponent },
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '404', component: Error404Component },
    { path: '500', component: Error500Component },
];*/

@NgModule({
    imports: [
        //SharedModule,
        // RouterModule.forChild(routes)
        BrowserModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        //libModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule,
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        RecoverComponent,
        Error404Component,
        PasswordStrengthBar,
        UsersComponent,
        AddUserComponent,
        EditUserComponent,
        ViewUserComponent
    ],
    exports: [
        RouterModule,
        LoginComponent,
        RegisterComponent,
        // RecoverComponent,
        Error404Component,
    ]
})
export class AuthenModule { }
