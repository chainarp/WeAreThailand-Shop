import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

// Dependencies
import { MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatMenuModule, MatRadioModule } from '@angular/material';


import 'hammerjs'; //Material Requires This.
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

// Compoenent
import { AppComponent } from './app.component';
import { SideComponent } from './side/side.component';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { contactModule } from './contact/contact.module';
import { ElementModule } from './element/element.module';

import { AuthenModule } from './authen/authen.module';

// Routing MOdule
import { AppRoutingModule } from './routing.module';

// Directive Height
import { FullscreenDirective } from './lib/directive/fullscreen.directive';

// Common Service (Chainaris P.)
import { SettingsService } from './services/settings/settings.service';
import { RESTClientService } from './services/restclient/restclient.service';
import { SharingDataServiceProvider } from './services/sharing-data-service/sharing-data.service';
import { CartServiceProvider } from './services/cart-service/cart-service-provider';
import { UserService } from './authen/users/user.service';
import { CustomerLocationServiceProvider } from './product/customer-location/customer-location-service/customer-location-service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from './firebase.config';



@NgModule({
  declarations: [
    AppComponent,
    SideComponent,
    NotFoundComponent,
    FullscreenDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatRadioModule,
    AppRoutingModule,
    HomeModule,
    ProductModule,
    AuthenModule,
    ElementModule,
    contactModule,
    SlimLoadingBarModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  exports: [
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CustomerLocationServiceProvider ,UserService, RESTClientService, SharingDataServiceProvider, CartServiceProvider,SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
