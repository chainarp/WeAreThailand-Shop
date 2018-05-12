import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
//const swal = require('sweetalert');
import swal from 'sweetalert2';
@Component({
    selector: 'app-recover',
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

    valForm: FormGroup;   
    constructor(public settings: SettingsService, fb: FormBuilder, public router: Router) {
        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            //console.log('Valid!');
            //console.log(value);
            var auth = firebase.auth();
            var emailAddress = value.email;//"user@example.com";

            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
                swal('สำเร็จแล้ว !!', 'วิธีการกู้กลับ รหัสผ่านถูกส่งไปแล้ว ที่! ('+emailAddress+')', 'success');
            }).catch(function (error) {
                // An error happened.
                swal('ERROR !!', ">> " + error + " <<", "error")
            });


        }
    }

    ngOnInit() {
    }

    public gotoLoginPage(): void {
        this.router.navigate(['/login']);
    }

}
