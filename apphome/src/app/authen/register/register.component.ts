import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//////import { ToastrService } from 'toastr-ng2';

import { UserService } from '../users/user.service';

import { UserInfo } from '../../services/app-data-model/app-data-model';

//const swal = require('sweetalert');
import swal from 'sweetalert2';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public barLabel: string = "password strength"
    public userForm: FormGroup;
    //public userRecord: any = Object.assign({}, UserInfo.getBlankUserRecord());
    public userRecord: UserInfo = new UserInfo();

    //valForm : FormGroup;
    constructor(
        public af: AngularFireAuth,
        public settings: SettingsService,
        private formBuilder: FormBuilder,
        public router: Router,
        //public toastr: ToastrService,
        private db: AngularFireDatabase,
        private userService: UserService) {
        /*
           this.valForm = fb.group({
                'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
                'name':[null],
                'mobileNo':[null],
                'password': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,10}$')])]
            });
        */
    }
    ngOnInit() {
        this.buildForm();
    }
    private buildForm(): void {
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
                //'userRoles': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
                'email': new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")]),
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
    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            console.log('Valid!');
            console.log(value.password);
             this.af.auth.createUserWithEmailAndPassword(value.email,value.password).then(success => {
          this.db.object('/users/' + success.uid).update({
                    email:value.email,
                    name:value.name,
                    mobileNo:value.mobileNo,
                    role:'User'
        }).then((res)=>{
           this.toastr.success('Register Successfully!', 'Success!');
            this.router.navigate(['login']);
      })
      });
        }
    }
    */

    //https://limonte.github.io/sweetalert2/
    public isSubmitted: boolean = false;
    public onSubmitAddUser(): void {
        this.isSubmitted = true;

        swal({
            title: 'คุณแน่ใจหรือไม่ว่า ?',
            text: 'ข้อมูลที่กรอก เพื่อสมัครเป็นสมาชิกกับ WeChef ถูกต้องครบถ้วน',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'ใช่! มั่นใจแล้ว',
            cancelButtonText: 'ขอตรวจอีกที',
        }).then((result) => {
            if (result.value) {
                this.userRecord.userRolesString = "CUSTOMER";
                this.userService.addUser(this.userRecord).then((res => {
                    //console.log("AddUserComponent.onSubmitAddUser(form)...SUCCESS::" + JSON.stringify(res));
                    swal('สำเร็จ !!', 'ขอตอนรับสมาชิกใหม่ !', 'success');
                    this.router.navigate(['/login']);
                })).catch((rej => {
                    //console.log("AddUserComponent.onSubmitAddUser(form)...ERROR::" + JSON.stringify(rej));
                    swal('แย่จัง !! เกิดความผิดพลาด', ">> " + rej.message + " <<", "error")
                    this.router.navigate(['/login']);
                }));
                /*
                this.cartServiceProvider.submitToCreatePO().then((value) => {
                    swal('OK !!', 'You order(s) has been placed successfully !', 'success');
                    console.log("cartServiceProvider :: value :: " + JSON.stringify(value));
                    this.router.navigate(['/shop/receipt']);
                }).catch((error) => {
                    swal('Sorry ;(', ">> Your order(s) may have failed <<", "error");
                    console.log("cartServiceProvider :: error :: " + JSON.stringify(error));
                });
                */
            }
        })

        /*
                swal({
                    title: 'Are you sure?',
                    text: 'You are going to create a new user!!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'YES!!,do talk too much ... just create it!',
                    cancelButtonText: 'No,please cancel ;(',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, (isConfirm) => {
                    if (isConfirm) {
                        //this.userRecord = this.userForm.value;
                        this.userRecord.userRolesString = "SELLER,CUSTOMER";
                        this.userService.addUser(this.userRecord).then((res => {
                            //console.log("AddUserComponent.onSubmitAddUser(form)...SUCCESS::" + JSON.stringify(res));
                            swal('OK !!', 'User Created Successfully !', 'success');
                            this.router.navigate(['/login']);
                        })).catch((rej => {
                            //console.log("AddUserComponent.onSubmitAddUser(form)...ERROR::" + JSON.stringify(rej));
                            swal(rej.code, ">> " + rej.message + " <<", "error")
                            this.router.navigate(['/login']);
                        }));
                    }
                });
        */
    }


    cancel() {
        this.router.navigate(['/users/manageUsers'])
    }
}