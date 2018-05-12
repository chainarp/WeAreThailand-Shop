import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule
} from '@angular/material';
import 'hammerjs';

// Validatord
import { CustomFormsModule } from 'ng2-validation';

// Google Map
import { AgmCoreModule } from '@agm/core';

// Angushop Library module
import { libModule } from '../lib/lib.module';

import { ContactComponent } from './contact.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        RouterModule,
        libModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        CustomFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyALMkgKQpcKi_frj9VAYrHE1nRFLegJKtM'
        })
    ],
    declarations: [ 
        ContactComponent
    ],     
    exports: [ 
        ContactComponent
    ]
})
export class contactModule { }