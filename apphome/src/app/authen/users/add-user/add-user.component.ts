import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserInfo } from '../../../services/app-data-model/app-data-model';
import { UserService } from '../user.service';
import { AbstractControl } from '@angular/forms';

//const swal = require('sweetalert');
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  public barLabel: string = "password strength"
  public userForm: FormGroup;
  //public userRecord: any = Object.assign({}, UserInfo.getBlankUserRecord());
  public userRecord : UserInfo = new UserInfo();
  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public authentication: AngularFireAuth, public formBuilder: FormBuilder, public userService: UserService) {
    //this.af.object('/users');
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
        'userRoles': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
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
  public isSubmitted: boolean = false;
  public onSubmitAddUser(): void {
    this.isSubmitted = true;
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

        this.userService.addUser(this.userRecord).then((res => {
          //console.log("AddUserComponent.onSubmitAddUser(form)...SUCCESS::" + JSON.stringify(res));
          swal('OK !!', 'User Created Successfully !', 'success');
          this.router.navigate(['/users/manageUsers']);
        })).catch((rej => {
          //console.log("AddUserComponent.onSubmitAddUser(form)...ERROR::" + JSON.stringify(rej));
          swal(rej.code, ">> " + rej.message + " <<", "error")
          this.router.navigate(['/users/addUser']);
        }));
      }
    });
    */
  }


  cancel() {
    this.router.navigate(['/users/manageUsers'])
  }

}

/*
export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      console.log('false');
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      console.log('true');
      return null
    }
  }

  static matchingPasswords = (control: AbstractControl): { [key: string]: boolean } => {

    const newPassword = control.get('passwords');
    const confirmPassword = control.get('confirmpwd');
    // if no values, valid
    if (!newPassword || !confirmPassword) {
      return null;
    }
    // if values match return null, else 'mismatchedPasswords:true'  
    return newPassword.value === confirmPassword.value ? null : { mismatchedPasswords: true };
  }
}
*/