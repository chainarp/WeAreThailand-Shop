import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CookieService } from '../../lib/service/cookie.service';
import * as _ from "lodash";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
    public productsOrder = [];
    public subTotal: any;
    public promoValue: number = 0;
    public total: number;
    public promoInit: any = "";

    constructor(
        private cookie: CookieService,
        public snackBar: MatSnackBar,        
    ){}

    ngOnInit() {
        var products = this.cookie['productsOrder'];

        _.map(products, (x)=>{
            if(x.quantity >= x.stock){
                return x.quantity = x.stock;
            }
            return x.slug = _.kebabCase(x.slug)
        });

        this.productsOrder = products;
        this.cookie.addCookie('subtotal', JSON.stringify(this.total));   
        
        // Initial Promo
        if(this.cookie['promo'] != undefined){
            if(this.productsOrder.length != 0){
                this.promoInit = this.cookie['promo'];  
            }          
        }else{
            this.cookie.addCookie('promo', '');             
        }

        // Initial Promo Value
        if(this.cookie['promoValue'] != undefined){
            if(this.productsOrder.length != 0){
                this.promoValue = this.cookie['promoValue'];           
            }    
        }else{
            this.cookie.addCookie('promoValue', JSON.stringify(0));                               
        }

        this.initTotal(this.productsOrder);        
    }

    // InitSubtotal
    initTotal(products){
        var prices = [];
        _.map(products, (x)=>{
            return prices.push(x['price'] * x['quantity']);
        });

        // Subtotal
        this.subTotal = _.reduce(prices, function(sum, n) {
            return sum + n;
        }, 0);

        // Total
        this.total = this.subTotal - this.promoValue;
        this.cookie.addCookie('subtotal', JSON.stringify(this.subTotal));             
    }

    // On Chage Quantity
    onChage(product){
        if(product.quantity == null || product.quantity == 0){
            product.quantity = 1;
        }

        if(product.quantity >= product.stock){
            product.quantity = product.stock;
        }
        this.initTotal(this.productsOrder);        
        this.cookie.addCookie('products', JSON.stringify(this.productsOrder));
    }

    // Delete Product on cart
    deleteProduct(index){
        _.remove(this.productsOrder, (n) => {
            return n.id == index;
        });
        this.initTotal(this.productsOrder);  
        this.cookie.addCookie('products', JSON.stringify(this.productsOrder)); 

        if(this.productsOrder.length == 0){
            this.promoValue = 0;
            this.promoInit = "";
            this.total = 0;
            this.cookie.addCookie('promo', '');                
            this.cookie.addCookie('promoValue', JSON.stringify(0));                               
        }
    }

    // Sample Promo
    private promos = [
        { label: 'Happy New Year', code: '4234OPD', type: 'percentage', discount: 0.2 },
        { label: 'Happy Eid Mubarok', code: '12312B', type: 'value', discount: 100 }        
    ];

    // Check Promo
    checkPromo(promo){
        this.total = this.subTotal;
        this.promoValue = 0;

        var check = _.find(this.promos, {code: promo});
        if(check != undefined){
            var type = check.type;
            var displayPromo;
            if(type == 'value'){
                this.promoValue = Number(check.discount);
                this.total = this.total - this.promoValue;
                displayPromo = 'Free $'+ check.discount;
            }else if(type == 'percentage'){
                this.promoValue = (this.total * Number(check.discount));
                this.total = this.total - this.promoValue;
                displayPromo = 'Free '+ check.discount * 100 + '%';                
            }

            if(this.total < 0){
                this.total = 0;
            }
            this.cookie.addCookie('promo', check.code);       
            this.cookie.addCookie('promoValue', JSON.stringify(this.promoValue));  
            this.openSnackBar('Promo : ' + check.label,displayPromo);
        }else{
            this.openSnackBar('Promo code not found','');
            this.cookie.addCookie('promo', '');    
            this.cookie.addCookie('promoValue', JSON.stringify(0));                   
        }
        this.cookie.addCookie('subtotal', JSON.stringify(this.subTotal));     
    }

    // Snack Bar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
    }
}
