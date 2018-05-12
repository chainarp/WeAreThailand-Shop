import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Component
import { Home1Component } from './home1/home1.component';
import { Home2Component } from './home2/home2.component';
import { HomeslideDirective } from './home2/home-slide.directive';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';
import 'hammerjs';

// Anguushop Lib
import { libModule } from '../lib/lib.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    libModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  declarations: [
    Home1Component, 
    Home2Component,
    HomeslideDirective
  ],
  exports: [Home1Component, Home2Component]
})
export class HomeModule { }
