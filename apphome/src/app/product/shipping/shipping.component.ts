import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CookieService } from '../../lib/service/cookie.service';
import { Router } from '@angular/router';
import * as _ from "lodash";

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
    public productsOrder = [];
    public total: number; 
    public subTotal: number; 
    private promo: string;
    public promoValue: number = 0;    
    public nottouched = true;
    public touched = false;

    //to fix src\app\product\shipping\shipping.component.html(39,37): : Property 'firstname' does not exist on type 'ShippingComponent'.
    public firstname : any;
    public lastname : any;
    public email : any;
    public phone : any;
    public address : any;
    public city : any;
    public zipcode : any;
    public state : any;
    public country : any;


    constructor(
        private router: Router,
        private cookie: CookieService,
        public snackBar: MatSnackBar, 
    ) {}

    ngOnInit() {
        var products = this.cookie['productsOrder'];
        _.map(products, (x)=>{
            return x.slug = _.kebabCase(x.slug)
        });
        this.productsOrder = products;
        this.promo = JSON.stringify(this.cookie['promo']);
        this.promoValue = this.cookie['promoValue'];
        this.subTotal = this.cookie['subtotal'];                
        this.total = this.cookie['subtotal'] - this.promoValue;  
        if(this.total < 0){
            this.total = 0;
        }
        if(this.productsOrder.length == 0){
            this.router.navigate(['/shop/cart']);
        }      
    }

    // Open Popup Checkout
    openCheckout() {
        var handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_RdW4DTIQXiTLULbUy1vnQUsV',
            locale: 'auto',
            token: (token: any) => {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                // Documentation charge https://stripe.com/docs/charges
                console.log(token.id);
                this.cookie.addCookie('payed', 'payed');
                this.cookie.removeCookie('products');                           
                this.cookie.removeCookie('promo');                           
                this.cookie.removeCookie('promoValue');                           
                this.cookie.removeCookie('subtotal');    
                setTimeout(()=>{
                this.router.navigate(['/shop/receipt']);
                }, 1000);                      
            },
            closed : () =>{
                this.nottouched = true;
                this.touched = false;
                console.log('asd');
            }
        });
        
        // handler Open
        handler.open({
            image: '/assets/images/brand/logo-stripe.jpg',
            name: 'Angushop',
            description: 'Complete payment',
            amount: this.total
        });
    }


    // Submit
    onSubmit(form){
        console.log(form.value); // Object Shipping Object
        console.log(this.cookie['productsOrder']); // Array Obect Products order
        console.log(this.cookie['promo']); // Object Promo
        console.log(this.cookie['promoValue']); // Object Promo Value From calculation
        console.log(this.cookie['subtotal']); // Object Sub Total     
        
        this.openCheckout();

        this.nottouched = false;
        this.touched = true;
    }
}
