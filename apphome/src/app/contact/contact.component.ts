import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    lat: number = -6.9222975;
    lng: number = 107.6088145;

    public fullname : any;
    public email : any;
    public subject : any;
    public message : any;



    constructor(public snackBar: MatSnackBar) {}

    ngOnInit() {
    }

    onSubmit(e){
        this.openSnackBar('Message has been sent', 'Done');
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
    }
}
