import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import { ToastrService } from 'toastr-ng2';
import { SharingDataServiceProvider } from '../../services/sharing-data-service/sharing-data.service';
import { UserInfo } from '../../services/app-data-model/app-data-model';

import swal from 'sweetalert2';
//import { SharingDataService } from '../../../services/'
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;
    public isSubmitButtonDisabled: boolean = false;

    constructor(public af: AngularFireAuth, public settings: SettingsService, fb: FormBuilder, public router: Router, public db: AngularFireDatabase /*, public toastr: ToastrService*/, public sharingDataServiceProvider: SharingDataServiceProvider) //,public toastr: ToastrService
    {

        this.valForm = fb.group({
            'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
            'password': ['', Validators.required]
        });

    }

    submitForm($ev, value: any) {
        this.isSubmitButtonDisabled = true;
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            //console.log('Valid!');
            console.log("LoginComponent.submitForm(...)=" + JSON.stringify(value));
            this.af.auth.signInWithEmailAndPassword((<string>value.email).toLowerCase(), value.password).then((success) => {
                this.db.list('/users', {
                    query: {
                        orderByChild: 'email',
                        equalTo: success.email,
                    }
                }).subscribe(identicalEmailUsers => {
                    console.log("LoginComponent.submitForm(...)...identicalEmailUsers.length=" + identicalEmailUsers.length);
                    if (identicalEmailUsers.length == 1) {
                        //return reject("This User " + userRecord.email + " Existing Already (1)");
                        if (identicalEmailUsers[0].userRoles.indexOf("CUSTOMER") > -1 || identicalEmailUsers[0].userRoles.indexOf("SELLER") > -1 || identicalEmailUsers[0].userRoles.indexOf("ADMIN") > -1 || identicalEmailUsers[0].userRoles.indexOf("CUSTOMER_SERVICE") > -1) {
                            let backwardURI : {} = this.sharingDataServiceProvider.getSharingData();
                            if(backwardURI!=null){
                                this.router.navigate([backwardURI]);
                            }else{
                                this.router.navigate(['home']);
                            }
                            localStorage.setItem('uid', success.uid);
                            let currentUser: UserInfo = <UserInfo>identicalEmailUsers[0];
                            this.sharingDataServiceProvider.setCurrentUser(currentUser);
                            //localStorage.setItem('userKey', success.key)
                            //this.toastr.success('เข้าสู่ระบบ สำเร็จแล้ว!', 'ยินดีต้อนรับ! คุณ '+this.sharingDataServiceProvider.currentUser.name);
                            swal({
                                position: 'top-end',
                                type: 'success',
                                title: 'เข้าสู่ระบบ สำเร็จแล้ว!',
                                text: 'ยินดีต้อนรับ คุณ' + this.sharingDataServiceProvider.currentUser.name,
                                showConfirmButton: false,
                                timer: 2000
                            });
                            /*
                            swal({
                                title: 'เข้าสู่ระบบ สำเร็จแล้ว!',
                                text: 'ยินดีต้อนรับ คุณ' + this.sharingDataServiceProvider.currentUser.name,
                                timer: 1000,
                                onOpen: () => {
                                    swal.showLoading()
                                }
                            }).then((result) => {
                                /*
                              if (
                                // Read more about handling dismissals
                                result.dismiss === swal.DismissReason.timer
                              ) {
                                console.log('I was closed by the timer')
                              } * /
                            }) */
                        } else {
                            //this.toastr.error('เข้าสู่ระบบล้มเหลว!', 'คุณไม่ใช่ พ่อครัวหรือแม่ครัว ห้ามเข้าใช้ !!');
                        }
                    } else {
                        if (identicalEmailUsers.length > 1) {
                            //goToSyncBetweenFbAuthenVSUsers();
                            console.log("identicalEmailUsers.length > 1");
                            //return reject("This User " + userRecord.email + " Existing Already (" + identicalEmailUsers.length + ")");
                        }
                    }
                    this.isSubmitButtonDisabled = false;
                });
                /*
                this.db.object('/users').subscribe(res => {

                    if (res.userRoles.indexOf("ADMIN") > -1 || res.userRoles.indexOf("CUSTOMER_SERVICE") > -1) {
                        this.router.navigate(['home']);
                        localStorage.setItem('uid', success.uid)
                        this.toastr.success('Login Successfully!', 'Success!');

                    } else {
                        //this.toastr.error('Login Failed!', 'You are not an ADMIN!');
                    }
                });
                */
            }).catch((error) => {
                ///////this.toastr.error('เข้าสู่ระบบล้มเหลว!', 'อีเมล์ หรือ รหัสผ่านไม่ถูกต้อง');
                swal({
                    position: 'top-end',
                    type: 'error',
                    title: 'แย่จัง เกิดปัญหา!',
                    text: 'อีเมล์ หรือ รหัสผ่าน ไม่ถูกต้อง',
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log("LoginComponent.submitForm >>> error=" + JSON.stringify(error));
                this.isSubmitButtonDisabled = false;
            });
        }
    }

    ngOnInit() {

    }

}
