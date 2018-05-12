import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserInfo } from '../../../services/app-data-model/app-data-model';
import { UserService } from '../user.service';
import { SharingDataServiceProvider } from '../../../services/sharing-data-service/sharing-data.service';

import { AbstractControl } from '@angular/forms';
import * as firebase from "firebase";
//const swal = require('sweetalert');
import swal from 'sweetalert2';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

    public barLabel: string = "password strength"
    public userForm: FormGroup;
    //public userRecord: any = Object.assign({}, UserInfo.getBlankUserRecord());
    public userRecord: UserInfo = new UserInfo();
    constructor(
        private route: ActivatedRoute, 
        public router: Router, 
        public af: AngularFireDatabase, 
        public authentication: AngularFireAuth, 
        public formBuilder: FormBuilder, 
        public userService: UserService,
        public sharingDataServiceProvider: SharingDataServiceProvider) {
        if(sharingDataServiceProvider.currentUser == null){
            this.router.navigate(['/login']);
        }else{
            this.userRecord = sharingDataServiceProvider.currentUser;
        }
        //this.af.object('/users');
        /*
        this.route.params.map(params => params['id']).subscribe((Id) => {
            if (Id != null) {
                /*
                firebase.database().ref('/users/' + Id).once("value").then((value) => {
                    if (value.length == 1) {
                        this.userRecord = value[0];
                    }
                }).catch((error) => {
                    console.log("ERROR" + error);
                });
                * /

                this.af.object('/users/' + Id).subscribe(
                    (response) => {
                        this.userRecord = response;
                    }
                )

            }
        });
        */
    }

    ngOnInit(): any {
        this.buildForm();
    }

    //Validation
    buildForm(): void {
        /*
        this.userForm = new FormGroup({
          'email': new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")]),
          'password': new FormControl('', Validators.compose([Validators.required, Validators.min(6), Validators.max(24)])),
          'confirmPassword' : new FormControl('',),
          'name': new FormControl('', Validators.required),
          'mobilePhoneNo': new FormControl('', Validators.required),
        } ,{validator: this.matchingPasswords})
        */
        this.userForm = this.formBuilder.group(
            {
                'email': new FormControl({ value: '', disabled: true } /*, [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")] */),
                'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(24)])),
                'confirmPassword': new FormControl('', Validators.required),
                'name': new FormControl('', Validators.required),
                'mobilePhoneNo': new FormControl('', Validators.compose([Validators.required /*, Validators.pattern("/^+91(7\d|8\d|9\d)\d{9}$/") */]) /*[Validators.required, Validators.pattern("/^+91(7\d|8\d|9\d)\d{9}$/")]*/),
            }, { validator: this.matchingPasswords }
        );
    }
    //https://stackoverflow.com/questions/44063756/im-getting-error-in-matching-password-validation-in-angular-2
    matchingPasswords = (control: AbstractControl): { [key: string]: boolean } => {

        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        // if no values, valid
        if (!password || !confirmPassword) {
            return null;
        }
        // if values match return null, else 'mismatchedPasswords:true'  
        return password.value === confirmPassword.value ? null : { mismatchedPasswords: true };
    }
    /*
      onSubmitAddUser2(form: FormGroup) {
        console.log("Users Data : " + JSON.stringify(this.userRecord));
        this.authentication.auth.createUserWithEmailAndPassword(this.userRecord.email, this.userRecord.password)
          .then(success => {
            console.log("AddUserComponent.onSubmitAddUser(form)...success::" + JSON.stringify(success));
            this.af.object('/users/' + success.auth.uid).update({
              email: this.userRecord.email,
              name: this.userRecord.name,
              mobileNo: this.userRecord.mobileNo,
              role: 'User'
            }).then((res) => {
              console.log("Success");
              this.router.navigate(['/users/manageUsers'])
            })
          })
    
      }
    */



    //https://limonte.github.io/sweetalert2/
    public onSubmitEditUser(): void {
        let userInfo: UserInfo = Object.assign({}, this.userRecord);
        this.userService.updateUser(userInfo).then((res => {
            console.log("EditUserComponent.onSubmitEditUser()...SUCCESS::" + JSON.stringify(res));
            firebase.auth().signOut().then(function () {
                swal('OK !!', 'User Created Successfully !', 'success');
                
            }, function (error) {
                // An error happened.
                
            });
            this.router.navigate(['/login']);
            //this.router.navigate(['/users/manageUsers']);
        })).catch((rej => {
            console.log("EditUserComponent.onSubmitEditUser()...ERROR::" + JSON.stringify(rej));
            firebase.auth().signOut().then(function () {
                swal("ERROR !!", ">> " + rej + " <<", "error");
            }, function (error) {
                // An error happened.
                
            });
            this.router.navigate(['/login']);
            //this.router.navigate(['/users/manageUsers']);
        }));
    }


    cancel() {
        this.router.navigate(['/home'])
    }

}