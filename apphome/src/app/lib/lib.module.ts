import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Vendor
import { 
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatSliderModule,
} from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';

// Directive
import { libHeightDirective } from './directive/lib-height.directive';
import { MatchHeightDirective } from './directive/match-height.directive';

// Service
import { productService } from './service/product.service';
import { AvailableItemsService } from './component/available-items.service';

// Pipe
import { productFilterPipe } from './pipe/filter-product';
import { AvailableProductFilterPipe } from './pipe/filter-available-product';
import { SellerFilterPipe } from './pipe/filter-seller';

// Component
import { ProductComponent } from './component/product/product.component';
import { ItemShelfComponent } from './component/product-item-shelf/item-shelf.component';
import { ItemZoomComponent } from './component/product-item-zoom/item-zoom.component';
import { SellerZoomComponent } from './component/seller-zoom/seller-zoom.component';
import { ItemsListComponent } from './component/product-items-list/items-list.component';
import { PersonStandComponent } from './component/seller-person-stand/person-stand.component';
import { AddDeleteItemComponent } from './component/adddeleteitem/adddeleteitem.component';

import { GridLogoComponent } from './component/grid-logo/grid-logo.component';
import { LightboxComponent } from './component/lightbox/lightbox.component';
import { BreadcumbComponent } from './component/breadcumb/breadcumb.component';
import { RatingComponent } from './component/rating/rating.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatSliderModule,
    NgxPaginationModule,
    RouterModule
  ],
  providers: [productService,AvailableItemsService],
  declarations: [
    ProductComponent,
    ItemShelfComponent,
    ItemZoomComponent,
    SellerZoomComponent,
    ItemsListComponent,
    PersonStandComponent,
    AddDeleteItemComponent,
    libHeightDirective,
    MatchHeightDirective,
    GridLogoComponent,
    LightboxComponent,
    productFilterPipe,
    AvailableProductFilterPipe,
    SellerFilterPipe,
    BreadcumbComponent,
    RatingComponent
  ],
  exports: [
    ProductComponent,
    ItemShelfComponent,
    ItemZoomComponent,
    SellerZoomComponent,
    ItemsListComponent,
    PersonStandComponent,
    AddDeleteItemComponent,
    GridLogoComponent,
    BreadcumbComponent,
    RatingComponent
  ]
})
export class libModule { }
