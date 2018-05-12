import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatListModule,
    MatTabsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonToggleModule
} from '@angular/material';
import 'hammerjs';

// Angushop Library module
import { libModule } from '../lib/lib.module';

import { ProductElement } from './product/product.component';
import { DashboardELementComponent } from './dashboard-element/dashboard-element.component';
import { FormControlComponent } from './form-control/form-control.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonComponent } from './button/button.component';
import { GridComponent } from './grid/grid.component';
import { TyphographyComponent } from './typhography/typhography.component';
import { HelperComponent } from './helper/helper.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatListModule,
        MatTabsModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatInputModule,
        MatButtonToggleModule,
        CommonModule,
        RouterModule,
        FormsModule,
        libModule
    ],
    exports: [
        DashboardELementComponent
    ],
    declarations: [
        ProductElement, 
        DashboardELementComponent, 
        FormControlComponent, 
        LayoutComponent, 
        ButtonComponent,
        GridComponent,
        TyphographyComponent,
        HelperComponent
    ]
})
export class ElementModule { }
