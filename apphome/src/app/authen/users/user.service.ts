import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

//import { firebaseConfig } from '../../../firebase.config';
import { AngularFireModule } from 'angularfire2/angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import { storage } from 'firebase';
import { UserInfo } from '../../services/app-data-model/app-data-model';
//import * as admin from 'firebase-admin';

//import { UserInfo } from './user.info';

@Injectable()
export class UserService {
    constructor(private authentication: AngularFireAuth, private angularFireDatabase: AngularFireDatabase) { };


    public addUser(userInfo: UserInfo): Promise<any> {
        console.log("UserService.addUser(any)..." + JSON.stringify(userInfo));
        return new Promise((resolve, reject) => {
            this.authentication.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
                .then(newuser => {
                    console.log("UserService.addUser(userRecord)...newuser = " + JSON.stringify(userInfo));
                    let nowDate = new Date();
                    userInfo.key = newuser.uid;
                    userInfo.email = userInfo.email.toLowerCase();
                    userInfo.isActive = false;
                    userInfo.email_isActive = userInfo.email + "&&" + (new Boolean(userInfo.isActive)).toString();
                    userInfo.userRoles = userInfo.userRolesString.split(",");//["ADMIN", "CUSTOMER_SERVICE", "SELLER", "CUSTOMER"];
                    userInfo.userRolesString = null;
                    userInfo.password = "";
                    userInfo.isEmailVerified = false;
                    userInfo.emailVerificationCode = UserService.newVerificationCode();
                    //userRecord.mobilePhoneNo = "";
                    userInfo.isPhoneNoVerified = false;
                    //userRecord.name = "";
                    userInfo.lastLoginAt = null;
                    userInfo.lastLoginBy = null;
                    userInfo.isDeleted = false;
                    userInfo.createdAt = nowDate.toISOString();
                    userInfo.createdBy = "ADMIN"
                    userInfo.updatedAt = nowDate.toISOString();
                    userInfo.updatedBy = "ADMIN";

                    this.angularFireDatabase.object('/users/' + newuser.uid).update(
                        userInfo
                    ).then(() => {
                        console.log("User Creation Success !!");
                        resolve("User Creation Success !!");//this.router.navigate(['/users/manageUsers'])
                    }).catch((rej) => {
                        console.log("db.object('').update User Creation Fail");
                        reject(rej);
                    });
                }).catch(error => {
                    console.log("auth.createUserWithEmailAndPassword Fail :: " + JSON.stringify(error));
                    reject(error);
                });

        });
    }



    private static newVerificationCode(): string {
        return UUID.UUID();
    }

    public disableUser(userInfo: UserInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            this.angularFireDatabase.object('/users/' + userInfo.key).update({
                isDeleted: true
            }).then((res) => {
                //this.authentication.auth.de

            }).catch((rej) => {

            });
        });
    }
    public updateUser(userInfo: UserInfo): Promise<any> {
        console.log("UserService.addUser(any)..." + JSON.stringify(userInfo));

        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    user.updatePassword(userInfo.password).then(function () {
                        // Update successful.
                        /*
                        this.angularFireDatabase.object('/users/' + userInfo.key).update(
                            userInfo
                        ).then(() => {
                            console.log("User Updating Success !!");
                            resolve("User Updating Success !!");//this.router.navigate(['/users/manageUsers'])
                        }).catch((rej) => {
                            console.log("db.object('').update User Updating Fail");
                            reject(rej);
                        });
                        */
                        userInfo.updatedAt = (new Date()).toISOString();
                        userInfo.updatedBy = userInfo.email;
                        firebase.database().ref('/users/'+userInfo.key).update(userInfo).then((res)=>{
                            console.log("User Updating Success !!");
                            resolve("User Updating Success !!");
                        }).catch((err)=>{
                            console.log("db.object('').update User Updating Fail");
                            reject("Updating UserInfo Fail (Changing Password Success)"+err);
                        });
                        //resolve("updatePassword Success.")
                    }).catch(function (error) {
                        // An error happened.
                        reject("Changing Password Fail..."+error);
                    });
                } else {
                    // No user is signed in.
                    reject("No user is signed in.");
                }
            });
            /*
            this.authentication.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
                .then(newuser => {
                    console.log("UserService.addUser(userRecord)...newuser = " + JSON.stringify(userInfo));
                    let nowDate = new Date();
                    userInfo.key = newuser.uid;
                    //userRecord.email = "";
                    userInfo.isActive = false;
                    userInfo.email_isActive = userInfo.email + "&&" + (new Boolean(userInfo.isActive)).toString();
                    userInfo.userRoles = userInfo.userRolesString.split(",");//["ADMIN", "CUSTOMER_SERVICE", "SELLER", "CUSTOMER"];
                    userInfo.userRolesString = null;
                    userInfo.password = "";
                    userInfo.isEmailVerified = false;
                    userInfo.emailVerificationCode = UserService.newVerificationCode();
                    //userRecord.mobilePhoneNo = "";
                    userInfo.isPhoneNoVerified = false;
                    //userRecord.name = "";
                    userInfo.lastLoginAt = null;
                    userInfo.lastLoginBy = null;
                    userInfo.isDeleted = false;
                    userInfo.createdAt = nowDate.toISOString();
                    userInfo.createdBy = "ADMIN"
                    userInfo.updatedAt = nowDate.toISOString();
                    userInfo.updatedBy = "ADMIN";

                    this.angularFireDatabase.object('/users/' + newuser.uid).update(
                        userInfo
                    ).then(() => {
                        console.log("User Creation Success !!");
                        resolve("User Creation Success !!");//this.router.navigate(['/users/manageUsers'])
                    }).catch((rej) => {
                        console.log("db.object('').update User Creation Fail");
                        reject(rej);
                    });
                }).catch(error => {
                    console.log("auth.createUserWithEmailAndPassword Fail :: " + JSON.stringify(error));
                    reject(error);
                });
                */
        });
    }

}
/*
export class UserInfo {
    key: string;
    email: string;
    isActive: boolean;
    email_isActive: string;
    userRoles: [{}];
    password: string;
    isEmailVerified: boolean;
    emailVerificationCode: string;
    mobilePhoneNo: string;
    isPhoneNoVerified: boolean;
    name: string;
    lastLoginAt: Date;
    lastLoginBy: string; //channel of user logging in

    isDeleted: boolean;
    createdAt: Date;
    createdBy: string;  //channel of user creation
    updatedAt: Date;
    updatedBy: string;

    public static USER_ROLE_SELLER: string = "SELLER";
    public static USER_ROLE_CUSTOMER: string = "CUSTOMER";
    public static USER_ROLE_CUSTOMER_SERVICE: string = "CUSTOMER_SERVICE";
    public static USER_ROLE_ADMINISTATOR: string = "ADMINISTATOR";

    public static getBlankUserRecord(): any {

        return {
            "key": "",
            "email": "",
            "isActive": false,
            "email_isActive": "",
            "userRoles": [{}],
            "password": "",
            "isEmailVerified": false,
            "emailVerificationCode": "",
            "mobilePhoneNo": "",
            "isPhoneNoVerified": false,
            "name": "",
            "lastLoginAt": "",
            "lastLoginBy": "",
            "isDeleted": false,
            "createdAt": "",
            "createdBy": "",
            "updatedAt": "",
            "updatedBy": "",

        };
    }
    
}
*/