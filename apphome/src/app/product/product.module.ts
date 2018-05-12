import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Dependencies
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSliderModule,
    MatTabsModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatListModule,
} from '@angular/material';
import 'hammerjs';
import { CustomFormsModule } from 'ng2-validation';

// Angushop Library module
import { libModule } from '../lib/lib.module';
import { productService } from '../lib/service/product.service';
import { MatchHeightDirective } from '../lib/directive/match-height.directive';

// Product Component
import { DashboardProdut } from './dashboard/dashboard.component';
import { product1Component } from './product1/product1.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ItemDetailComponent } from './available-item-detail/item-detail.component';
import { Product2Component } from './product2/product2.component';
import { Product3Component } from './product3/product3.component';
import { Product4Component } from './product4/product4.component';
import { Product5Component } from './product5/product5.component';
import { CartComponent } from './cart/cart.component';
import { ShippingComponent } from './shipping/shipping.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { WishlistComponent } from './wishlist//wishlist.component';
import { CookieService } from '../lib/service/cookie.service';
import { CompareComponent } from './compare/compare.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { CustomerLocationsComponent } from './customer-location/customer-locations/customer-locations.component';
import { AddCustomerLocationComponent } from './customer-location/add-customer-location/add-customer-location.component';

import { ProductionOrdersComponent } from '../product/prod-order/production-orders.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatSliderModule,
        MatTabsModule,
        MatInputModule,
        FormsModule,
        libModule,
        RouterModule,
        MatSnackBarModule,
        MatSelectModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatListModule,
        CustomFormsModule,
    ],
    declarations: [ 
        DashboardProdut,
        product1Component,
        DetailProductComponent,
        ItemDetailComponent,
        Product2Component,
        Product3Component,
        CartComponent,
        ShippingComponent,
        Product4Component,
        Product5Component,
        ReceiptComponent,
        WishlistComponent,
        CompareComponent,
        ShoppingCartComponent,
        DeliveryListComponent,
        PaymentListComponent,
        CustomerLocationsComponent,
        AddCustomerLocationComponent,
        ProductionOrdersComponent
        
    ],
    providers: [CookieService],        
    exports: [ 
        DashboardProdut
    ]
})
export class ProductModule { }
