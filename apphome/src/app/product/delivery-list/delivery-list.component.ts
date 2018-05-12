import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CookieService } from '../../lib/service/cookie.service';
import { Router } from '@angular/router';
import * as _ from "lodash";

import { SharingDataServiceProvider } from '../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationInfo } from '../../services/app-data-model/app-data-model';
import { CustomerLocationServiceProvider } from '../../product/customer-location/customer-location-service/customer-location-service';
import { CartServiceProvider } from '../../services/cart-service/cart-service-provider';


import swal from 'sweetalert2';
//const swal = require('sweetalert2');

declare var google;
var pinnedLocationLatitude: number = 13.743452174912246;
var pinnedLocationLongitude: number = 100.49889832735062;


@Component({
    selector: 'app-delivery-list',
    templateUrl: './delivery-list.component.html',
    styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {

    @ViewChild('map', { read: ElementRef }) mapElement: ElementRef;
    map: any;

    private productsOrder = [];
    private total: number;
    private subTotal: number;
    private promo: string;
    private promoValue: number = 0;
    public nottouched = true;
    public touched = false;

    //public firstname : any;
    //public lastname : any;
    public email: any;
    //public phone : any;
    public address: any;
    public latlng: any;

    public name: any;
    public mobilePhoneNo: any;
    public customerLocationTitle: any;
    public customerLocationLocation: any;
    public customerLocationMessageToDriver: any;

    constructor(
        private router: Router,
        private cookie: CookieService,
        public snackBar: MatSnackBar,
        public customerLocationServiceProvider: CustomerLocationServiceProvider,
        public sharingDataServiceProvider: SharingDataServiceProvider,
        public cartServiceProvider: CartServiceProvider,
    ) {
        if (this.sharingDataServiceProvider.currentUser == null) {
            this.sharingDataServiceProvider.setSharingData("/shop/deliverylist");
            this.router.navigate(['/login']);
        } else {
            this.email = this.sharingDataServiceProvider.currentUser.email;
            this.name = this.sharingDataServiceProvider.currentUser.name;
            this.mobilePhoneNo = this.sharingDataServiceProvider.currentUser.mobilePhoneNo;

            this.customerLocationTitle = this.customerLocationServiceProvider.currentCustomerLocationInfo.title;
            this.customerLocationLocation = this.customerLocationServiceProvider.currentCustomerLocationInfo.location == "SEE_MAP" ? "" : this.customerLocationServiceProvider.currentCustomerLocationInfo.location;
            this.customerLocationMessageToDriver = this.customerLocationServiceProvider.currentCustomerLocationInfo.messageToDriver == "SEE_PO" ? "" : this.customerLocationServiceProvider.currentCustomerLocationInfo.messageToDriver;
        }
    }

    ngOnInit() {
        var products = this.cookie['productsOrder'];
        _.map(products, (x) => {
            return x.slug = _.kebabCase(x.slug)
        });
        this.productsOrder = products;
        this.promo = JSON.stringify(this.cookie['promo']);
        this.promoValue = this.cookie['promoValue'];
        this.subTotal = this.cookie['subtotal'];
        this.total = this.cookie['subtotal'] - this.promoValue;
        if (this.total < 0) {
            this.total = 0;
        }
        // if(this.productsOrder.length == 0){
        //     this.router.navigate(['/shop/cart']);
        // }      
    }

    ngAfterViewInit() {
        this.createMap();

    }

    private createMap(): void {
        let customerLocation: CustomerLocationInfo = this.customerLocationServiceProvider.currentCustomerLocationInfo;

        console.log("customerLocation.latitude" + customerLocation.latitude + " :: customerLocation.longitude" + customerLocation.longitude)

        if (customerLocation.latitude != null && customerLocation.longitude != null) {
            pinnedLocationLatitude = customerLocation.latitude;
            pinnedLocationLongitude = customerLocation.longitude;
        }
        (<HTMLInputElement>document.getElementById('latlng')).value = pinnedLocationLatitude + "," + pinnedLocationLongitude;
        let latLng = new google.maps.LatLng(pinnedLocationLatitude, pinnedLocationLongitude);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //////////////////////////////////////////////
        try {
            var request = {
                location: latLng,
                radius: '500',
                type: ['restaurant']
            };

            var createMarker = function (place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: this.map,
                    position: place.geometry.location
                });
                var infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name);
                    infowindow.open(this.map, this);
                });
            }
        } catch (error) {
            console.log(error);
        }
        //////////////////////////////////////////////
        this.addMarker();
    }

    private addMarker(): void {
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter(),
            draggable: false
        });
        //var this_sellerInfo_latlng : string = "";
        google.maps.event.addListener(marker, 'dragend', function (event) {
            (<HTMLInputElement>document.getElementById('latlng')).value = event.latLng.lat() + "," + event.latLng.lng();
            //this_sellerInfo_latlng = event.latLng.lat() + "," + event.latLng.lng();

            pinnedLocationLatitude = event.latLng.lat();
            pinnedLocationLongitude = event.latLng.lng();

            var infowindow = new google.maps.InfoWindow({
                content: 'Latitude: ' + event.latLng.lat() + '<br>Longitude:' + event.latLng.lng()
            });
            infowindow.open(this.map, marker);
        });
        //this.sellerInfo.latlng = this_sellerInfo_latlng == null?this.sellerInfo.latlng:this_sellerInfo_latlng;
        let content = "<p>This is your current position !</p>";
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }

    //
    public selectedPaymentMethod: string = null;
    public onPaymentRadioChange(event): void {
        console.log("event.value=" + event.value);
        console.log("this.selectedPaymentMethod=" + this.selectedPaymentMethod);
        this.cartServiceProvider.setSelectedPaymentMethod(event.value);
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
                setTimeout(() => {
                    this.router.navigate(['/shop/receipt']);
                }, 1000);
            },
            closed: () => {
                this.nottouched = true;
                this.touched = false;
                console.log('asd');
            }
        });

        // handler Open
        handler.open({
            image: '/assets/images/brand/logo-stripe.jpg',
            name: 'WeChef (Thailand)',
            description: 'Complete payment',
            amount: this.cartServiceProvider.shoppingCart.grandTotal
        });
    }

    public showMsgWrongLocation(): void {
        swal(
            'หากไม่ตำแหน่งไม่ถูกต้อง?',
            'จะต้องลบอาหารในตระกร้านี้ไป ต้องสร้างสถานที่จัดส่งใหม่',
            'question'
        )
    }
    // Submit
    onSubmit(form) {
        /*
        console.log(form.value); // Object Shipping Object
        console.log(this.cookie['productsOrder']); // Array Obect Products order
        console.log(this.cookie['promo']); // Object Promo
        console.log(this.cookie['promoValue']); // Object Promo Value From calculation
        console.log(this.cookie['subtotal']); // Object Sub Total     

          public customerKey: string;
    public customerEmail: string;
    public customerName: string;
    public customerMobilePhone: string;
    public customerLocationTitle: string;
    public customerLocationLatLng: any; 

        */

        for (let i: number = 0; i < this.cartServiceProvider.shoppingCart.cartElements.length; i++) {
            this.cartServiceProvider.shoppingCart.cartElements[i].customerKey = "";
            this.cartServiceProvider.shoppingCart.cartElements[i].customerEmail = this.sharingDataServiceProvider.currentUser.email;
            this.cartServiceProvider.shoppingCart.cartElements[i].customerName = this.sharingDataServiceProvider.currentUser.name;
																																			
		  
		
            this.cartServiceProvider.shoppingCart.cartElements[i].customerMobilePhone = this.sharingDataServiceProvider.currentUser.mobilePhoneNo;
		
            this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationTitle = this.customerLocationServiceProvider.currentCustomerLocationInfo.title;
            this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationLatLng = {latitude:this.customerLocationServiceProvider.currentCustomerLocationInfo.latitude,longitude:this.customerLocationServiceProvider.currentCustomerLocationInfo.longitude};
            if (this.customerLocationTitle == "CURRENT_LOCATION") {
                this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationLocation = this.customerLocationLocation;
                this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationMessageToDriver = this.customerLocationMessageToDriver;
            } else {
                this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationLocation = this.customerLocationServiceProvider.currentCustomerLocationInfo.location;
                this.cartServiceProvider.shoppingCart.cartElements[i].customerLocationMessageToDriver = this.customerLocationServiceProvider.currentCustomerLocationInfo.messageToDriver;;
            }

            this.cartServiceProvider.shoppingCart.cartElements[i].paymentMethod = this.cartServiceProvider.paymentMethod;
        }

        if (this.cartServiceProvider.paymentMethod == "CREDIT_CARD") {
            this.openCheckout();
            this.touched = true;
            this.nottouched = false;

        } else {

            swal({
                title: 'คุณแน่ใจหรือไม่ ?',
                text: 'คุณกำลังจะสั่งซื้ออาหารจาก WeChef !?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'ใช่ !!',
                cancelButtonText: 'ไม่ใช่ ขอ ยกเลิก',
            }).then((result) => {
                if (result.value) {

                    this.cartServiceProvider.submitToCreatePO().then((value) => {
                        swal('OK !!', 'รายการสั่งซื้ออาหารของท่าน เรียบร้อยแล้ว !', 'success');
                        console.log("cartServiceProvider :: value :: " + JSON.stringify(value));
                        this.router.navigate(['/shop/receipt']);
                    }).catch((error) => {
                        swal('Sorry ;(', ">> เกิดปัญหาในการสั่งอาหาร โปรดลองอีกใหม่ <<", "error");
                        console.log("cartServiceProvider :: error :: " + JSON.stringify(error));
                    });
                }
            })

            //console.log("this.cartServiceProvider="+JSON.stringify(this.cartServiceProvider.shoppingCart))
            /*
            swal({
                title: 'Are you sure?',
                text: 'You are going to place order(s) to WeChef!!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'YES!!,please ..',
                cancelButtonText: 'No,Thanks ;(',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {
                if (isConfirm) {
                    this.cartServiceProvider.submitToCreatePO().then((value) => {
                        //swal('OK !!', 'You order(s) has been placed successfully !', 'success');
                        console.log("cartServiceProvider :: value :: " + JSON.stringify(value));
                    }).catch((error) => {
                        //swal('Sorry ;(', ">> Your order(s) may have failed <<", "error");
                        console.log("cartServiceProvider :: error :: " + JSON.stringify(error));
                    });
                }
            });
            */

        }


    }
}
