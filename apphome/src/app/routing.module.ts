import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './authen/login/login.component';
import { RegisterComponent } from './authen/register/register.component';
import { RecoverComponent } from './authen/recover/recover.component';

import { EditUserComponent } from './authen/users/edit-user/edit-user.component';
// Home
import { Home1Component } from './home/home1/home1.component';
import { Home2Component } from './home/home2/home2.component';

// Products
import { DashboardProdut } from './product/dashboard/dashboard.component';
import { DetailProductComponent } from './product/detail-product/detail-product.component';
import { ItemDetailComponent } from './product/available-item-detail/item-detail.component';
import { product1Component } from './product/product1/product1.component';
import { Product2Component } from './product/product2/product2.component';
import { Product3Component } from './product/product3/product3.component';
import { Product4Component } from './product/product4/product4.component';
import { Product5Component } from './product/product5/product5.component';
import { CartComponent } from './product/cart/cart.component';
import { ShippingComponent } from './product/shipping/shipping.component';
import { ReceiptComponent } from './product/receipt/receipt.component';
import { WishlistComponent } from './product/wishlist/wishlist.component';
import { CompareComponent } from './product/compare/compare.component';
import { ShoppingCartComponent } from './product/shopping-cart/shopping-cart.component';
import { PaymentListComponent } from './product/payment-list/payment-list.component';
import { DeliveryListComponent } from './product/delivery-list/delivery-list.component';
import { CustomerLocationsComponent } from './product/customer-location/customer-locations/customer-locations.component';
import { AddCustomerLocationComponent } from './product/customer-location/add-customer-location/add-customer-location.component'; 

import { ProductionOrdersComponent } from './product/prod-order/production-orders.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { ContactComponent } from './contact/contact.component';

// ELements
import { DashboardELementComponent } from './element/dashboard-element/dashboard-element.component';
import { ProductElement } from './element/product/product.component';
import { FormControlComponent } from './element/form-control/form-control.component';
import { LayoutComponent } from './element/layout/layout.component';
import { ButtonComponent } from './element/button/button.component';
import { GridComponent } from './element/grid/grid.component';
import { TyphographyComponent } from './element/typhography/typhography.component';
import { HelperComponent } from './element/helper/helper.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home1Component },
  { path: 'home2', component: Home2Component },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'editUser', component: EditUserComponent },
  {
    path: 'shop', component: DashboardProdut,
    children: [
      { path: '', redirectTo: '/shop/product1', pathMatch: 'full' },
      { path: 'product1', component: product1Component },
      { path: 'product2', component: Product2Component },
      { path: 'product3', component: Product3Component },
      { path: 'product4', component: Product4Component },
      { path: 'product5', component: Product5Component },
      { path: 'cart', component: CartComponent },
      { path: 'shipping', component: ShippingComponent },
      { path: 'receipt', component: ReceiptComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'compare', component: CompareComponent },
      { path: 'p/:detail', component: DetailProductComponent },
      { path: 'itemdetail', component: ItemDetailComponent },
      { path: 'itemdetail2', component: ItemDetailComponent },
      { path: 'shoppingcart', component: ShoppingCartComponent },
      { path: 'paymentlist', component: PaymentListComponent },
      { path: 'deliverylist', component: DeliveryListComponent },
      { path: 'customerlocation', component: CustomerLocationsComponent },
      { path: 'addcustomerlocation', component: AddCustomerLocationComponent },
      { path: 'prodorder', component: ProductionOrdersComponent },
    ]
  },
  {
    path: 'seller', component: DashboardProdut,
    children: [
      { path: '', redirectTo: '/seller/list', pathMatch: 'full' },
      { path: 'list', component: Product2Component },
    ]
  },
  {
    path: 'element', component: DashboardELementComponent,
    children: [
      { path: '', redirectTo: '/element/product', pathMatch: 'full' },
      { path: 'product', component: ProductElement },
      { path: 'form', component: FormControlComponent },
      { path: 'layout', component: LayoutComponent },
      { path: 'button', component: ButtonComponent },
      { path: 'grid', component: GridComponent },
      { path: 'typography', component: TyphographyComponent },
      { path: 'helper', component: HelperComponent },
    ]
  },
  { path: 'contact', component: ContactComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }