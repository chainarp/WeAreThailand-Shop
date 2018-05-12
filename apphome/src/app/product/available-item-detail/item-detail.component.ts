import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { CookieService } from '../../lib/service/cookie.service';

import { Cookie } from 'ng2-cookies';
import { MatSnackBar, MatSelect, MatDialog } from '@angular/material';

import { Product } from '../../lib/service/data/product';
import { productService } from '../../lib/service/product.service';

import { SharingDataServiceProvider } from '../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationServiceProvider } from '../../product/customer-location/customer-location-service/customer-location-service';
import { CartServiceProvider } from '../../services/cart-service/cart-service-provider';
import { AvailableItemInfo, SelectedProductItemElement } from '../../services/app-data-model/app-data-model';

import * as dateandtime from 'date-and-time';
//let dateandtime = require('date-and-time');
dateandtime.locale('th');
//let daterange = require('daterange');
import * as daterange from 'daterange';

//const swal = require('sweetalert');
import swal from 'sweetalert2';



@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

    private availableItem: AvailableItemInfo = null;

    private productName: string;
    private product: Product;
    private cloneProduct: Product[] = [];
    private productImage: string;
    private selectedImage: any;
    private objectOrder: any;
    private productsOrder = [];
    private productWishlist = [];
    private productCompare = [];
    private procustCount: number = 0;

    productState: boolean = false;
    loadingState: boolean = true;

    public selected: boolean;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private productService: productService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private cookie: CookieService,
        private sharingDataServiceProvider: SharingDataServiceProvider,
        private customerLocationServiceProvider: CustomerLocationServiceProvider,
        private cartServiceProvider: CartServiceProvider
    ) {
        console.log("ItemDetailComponent.constructor()...");
        this.productsOrder = this.cookie['productsOrder'];
        this.productWishlist = this.cookie['arrWishList'];
        this.productCompare = this.cookie['arrCompare'];
        /*
        this.activatedRoute.params.map(params => params['availableItem']).subscribe((availableItem) => {
            if (availableItem != null) {
                console.log("ItemDetailComponent.constructor()...\n"+JSON.stringify(availableItem));
            }else{
                console.log("NOOO");
            }
        });
        */
    }

    ngOnInit() {
        this.availableItem = Object.assign({}, this.sharingDataServiceProvider.getSharingData());
        console.log("availableItem=" + JSON.stringify(this.availableItem));
        if (JSON.stringify(this.availableItem) === "{}") {
            this.router.navigate(['/shop/product1']);
        }
        if (this.availableItem.productItem.selectedExtraOptions == null) {
            this.availableItem.productItem.selectedExtraOptions = new Array<any>();
        }
        this.selectedImage = this.availableItem.productItem.images[0];
        this.loadingState = false;
        this.productState = true;

        this.availableItem.productItem.requiredQuantity = 1;
        this.createAvailableDateTimeList(this.availableItem.productItem.availableDateTimeRanges, this.availableItem.productItem.orderBeforeDays);
        /*
        this.activatedRoute.params.subscribe(params => {
            this.productName = params["detail"];
            this.productService.getSlugProduct(this.productName).subscribe(product => {
                this.product = product;
                this.productState = true;
                this.loadingState = false;
                this.productImage = product.image;

                // Set Object Order Product
                this.objectOrder = {
                    id: product.id,
                    slug: product.slug,
                    quantity: 1,
                    stock: product.stock,
                    price: product.price,
                    image: product.image,
                    productName: product.productName
                };

                // Init Demo Image
                this.selectedImage = _.find(product.gallery, (o) => {
                    return o.images == product.image
                });

                // Init Counter product button
                this.buttonCounter(product.id);
            });
        });
        */
    }




    ngAfterViewInit() {
        //swal('Sorry !', ">> No NearBy Available Items Found <<", "error");
        swal({
            title: 'ท่านกำลังสั่งซื้ออาหาร',
            text: 'โดยให้ส่งไปยัง >> ' + this.customerLocationServiceProvider.currentCustomerLocationInfo.title,
            timer: 2000,
            footer: '<a href="/#/shop/customerlocation  ">แก้ไข สถานที่จัดส่ง</a>',
            onOpen: () => {
                swal.showLoading()
            }
        }).then((result) => {
            /*
          if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.timer
          ) {
            console.log('I was closed by the timer')
          } */
        })
    }

    public gotoCustomerLocation(): void {
        this.router.navigate(['/shop/customerlocation']);
    }

    public selectedAvailableDate: any = {};
    public selectedTimeRangeRequired: any = {};

    public allAvailableDates: Array<any> = new Array<any>(); //{RangeId:i,Date:expandedAvailableDates[j]}
    private allAvailableTimeRanges: Array<any> = new Array<any>();

    public createAvailableDateTimeList(availableDateTimeRanges: Array<any>, orderBeforeDays: number): void {
        console.log("availableDateTimeRanges=" + JSON.stringify(availableDateTimeRanges));

        availableDateTimeRanges.sort(function (a, b) {
            let aStartUTCDate: Date = new Date(Date.parse(a.startUTCDate));
            let bStartUTCDate: Date = new Date(Date.parse(b.startUTCDate));
            if (aStartUTCDate < bStartUTCDate) {
                return -1;
            }
            if (aStartUTCDate > bStartUTCDate) {
                return 1;
            }
            // names must be equal
            return 0;
        });


        this.allAvailableDates = new Array<any>();
        this.allAvailableTimeRanges = new Array<string>();
        //let availableDateTimeList: Array<any> = Array<any>();
        if (availableDateTimeRanges != null) {
            for (var i = 0; i < availableDateTimeRanges.length; i++) {
                //let dateRange: string = availableDateTimeRanges[i].name;
                //let timeRange: string = availableDateTimeRanges[i].value;
                let expandedAvailableTimeRanges: Array<string> = this.expandAvailableTimeRanges(availableDateTimeRanges[i].timeRange);
                let expandedAvailableDates: Array<any> = this.expandAvailableDates(availableDateTimeRanges[i].startUTCDate, availableDateTimeRanges[i].endUTCDate, orderBeforeDays);
                //spread operator:
                //https://stackoverflow.com/questions/4156101/javascript-push-array-values-into-another-array
                //this.requiredDates.push(...expandedAvailableDates);

                for (let j = 0; j < expandedAvailableDates.length; j++) {
                    // let x : any = {};
                    // x["RangeId"] = i;
                    // x["Date"] = expandedAvailableDates[j];
                    // this.requiredDates.push(x);
                    this.allAvailableDates.push({ RangeId: i, Date: expandedAvailableDates[j] });
                }

                //var obj: any = {};
                //obj[i.toLocaleString()] = { "date": expandedAvailableDates, "time": expandedAvailableTimeRanges };
                this.allAvailableTimeRanges.push({ RangeId: i, TimeRange: expandedAvailableTimeRanges });
            }
        }

        console.log("this.allAvailableDates=" + JSON.stringify(this.allAvailableDates));
        console.log("this.allAvailableTimeRanges=" + JSON.stringify(this.allAvailableTimeRanges));
    }


    public requiredTimeRanges: Array<string> = new Array<string>();
    public requiredDateChangeHandler() {
        //  console.log("event=" + JSON.stringify(event));
        var thisSelectedAvailableDateRangeId = this.selectedAvailableDate.RangeId;
        console.log("this.selectedAvailableDate=" + JSON.stringify(this.selectedAvailableDate));
        this.requiredTimeRanges = _.find(this.allAvailableTimeRanges, function (o) {
            return o.RangeId === thisSelectedAvailableDateRangeId;
        }).TimeRange;

        /*
        this.requiredTimeRanges = this.allAvailableTimeRanges.find((element) => {
             element.RangeId = this.selectedAvailableDate.RangeId;
        }).TimeRange;
        */
        //    console.log("this.requiredTimeRanges="+JSON.stringify(this.requiredTimeRanges));
    }

    private static validTimes: Array<string> =
        ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00",
            "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
            "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
            "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00",];

    private expandAvailableTimeRanges(timeRange: string): Array<string> {
        //input "09:30 - 20:30"
        //output ["08:30 - 09:00","09:00 - 09:30","09:30 - 10:00","10:00" ... ... .."20:00 - 20:30"]
        console.log("timeRange=" + timeRange);
        let startTime: string = timeRange.split(" - ")[0];
        let endTime: string = timeRange.split(" - ")[1];
        console.log("startTime=" + startTime + " :: endTime=" + endTime);
        let startTimeIndex: number = _.indexOf(ItemDetailComponent.validTimes, startTime);
        let endTimeIndex: number = _.indexOf(ItemDetailComponent.validTimes, endTime);
        console.log("startTimeIndex=" + startTimeIndex + " :: endTimeIndex=" + endTimeIndex);

        let timeRangeList: Array<string> = new Array<string>();
        for (let i = startTimeIndex; i < endTimeIndex; i++) {
            timeRangeList.push(ItemDetailComponent.validTimes[i] + " - " + ItemDetailComponent.validTimes[i + 1]);
        }
        console.log("timeRangeList=" + JSON.stringify(timeRangeList));

        return timeRangeList;
    }


    private expandAvailableDates(startUTCDate: string, endUTCDate: string, orderBeforeDays: number): Array<any> {
        let dateAnyArray = new Array<any>();
        let dateAny = { "dateString": "", "dateUTC": "" }
        //console.log("dateRangeString=" + dateRangeString);
        //console.log("XX >" + dateRangeString.split(" - ")[0].substr(0, 10) + "<");
        //console.log("YY >" + dateRangeString.split(" - ")[1].substr(0, 10) + "<");
        //input "15 ก.พ. 18 (พฤหัส) - 17 ก.พ. 18 (เสาร์)"
        //output ["15 ก.พ. 18 (พฤหัส)","16 ก.พ. 18 (ศุกร์)","17 ก.พ. 18 (เสาร์)"]
        let newStartDate: Date = new Date(Date.parse(startUTCDate));//dateandtime.parse(dateRangeString.split(" - ")[0].substr(0, 10), "DD MMM YY", false);
        let newEndDate: Date = new Date(Date.parse(endUTCDate));//dateandtime.parse(dateRangeString.split(" - ")[1].substr(0, 10), "DD MMM YY", false);
        //console.log("newStartDate=" + newStartDate + " :: newEndDate=" + newEndDate);

        let validDateRange = daterange.create(newStartDate, newEndDate);
        let currentDate: Date = newStartDate;
        let orderAfterDate: Date = dateandtime.addDays(new Date(), orderBeforeDays);
        while (currentDate.getTime() <= newEndDate.getTime()) {
            console.log("currentDate=" + currentDate);
            if (currentDate > orderAfterDate) {
                let dateAny2 = Object.assign({}, dateAny);
                dateAny2.dateString = dateandtime.format(currentDate, 'DD MMM YY (ddd)');
                dateAny2.dateUTC = currentDate.toISOString();
                dateAnyArray.push(dateAny2);
            }
            currentDate = dateandtime.addDays(currentDate, +1);
        };
        console.log("dateArrayList=" + JSON.stringify(dateAnyArray));
        return dateAnyArray;
    }


    /*
            "name":"13 ก.พ. 18 (อังคาร) - 14 ก.พ. 18 (พุธ)",
            "value":"09:30 - 20:30"
    */
    /*
    // Button Counter
    buttonCounter(idProduct: number) {
        var findObj = _.find(this.cookie['productsOrder'], ['id', idProduct]);
        if (findObj != undefined) {
            this.procustCount = findObj.quantity;
        }
    }
    */
    /*
    // Add Cart to Cookie
    addCart(cName, cValue) {
        let obj = _.find(this.productsOrder, ['id', this.product.id]);
        if (obj == undefined) {
            this.productsOrder.push(this.objectOrder);
        } else {
            obj.quantity = obj.quantity + 1;
        }
        this.buttonCounter(this.product.id);
        this.cookie.addCookie(cName, JSON.stringify(cValue));
        this.openSnackBar(this.product.productName, 'Added to Cart');
    }
    */
    // Add wishlist to cookie
    addWishlist(cName, cValue) {
        let obj = _.find(this.productWishlist, (x) => {
            return x == this.product['index'];
        });
        if (obj == undefined) {
            this.productWishlist.push(this.product['index']);
        }

        this.cookie.addCookie(cName, JSON.stringify(cValue));
        this.openSnackBar(this.product.productName, 'Added to Wishlist');
    }

    // Add Compare
    addCompare(cName, cValue) {
        let obj = _.find(this.productCompare, (x) => {
            return x == this.product['index'];
        });
        if (obj == undefined) {
            this.productCompare.push(this.product['index']);
        }

        this.cookie.addCookie(cName, JSON.stringify(cValue));
        this.openSnackBar(this.product.productName, 'Added to Compare');
    }

    // Snack Bar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    // Image Gallery
    /*
    selectImage(gallery) {
        this.selectedImage = gallery;
        this.productImage = gallery.images;
    }
    */
    selectImage(image: string) {
        this.selectedImage = image;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private handlePriceRadioChecked(selectedItemPrice): void {
        console.log("selectedItemPrice=" + selectedItemPrice);
        this.availableItem.productItem.selectedItemPrice = selectedItemPrice;
        console.log("this.availableItem.productItem.selectedItemPrice=" + JSON.stringify(this.availableItem.productItem.selectedItemPrice));
        this.recalculateTotalPrice();
    }

    private handleExtraChoiceOptionsChanged(extraOption): void {
        console.log("extraOption=" + JSON.stringify(extraOption));
        if (this.availableItem.productItem.selectedExtraOptions != null && this.availableItem.productItem.selectedExtraOptions.length != 0) {
            let foundAtIndex: number = -1;
            for (let i = 0; i <= this.availableItem.productItem.selectedExtraOptions.length - 1; i++) {
                //console.log("this.productItem.selectedExtraOptions[i].name="+this.productItem.selectedExtraOptions[i].name+"::extraOption.name="+extraOption.name);
                if (this.availableItem.productItem.selectedExtraOptions[i].name == extraOption.name &&
                    this.availableItem.productItem.selectedExtraOptions[i].value == extraOption.value) {
                    foundAtIndex = i;
                    break;
                }
            }
            if (foundAtIndex == -1) {
                this.availableItem.productItem.selectedExtraOptions.push(extraOption);
            } else {
                this.availableItem.productItem.selectedExtraOptions.splice(foundAtIndex, 1);
            }
        }
        else {
            this.availableItem.productItem.selectedExtraOptions.push(extraOption);
        }
        //console.log("this.productItem.selectedExtraOptions="+JSON.stringify(this.productItem.selectedExtraOptions));
        this.recalculateTotalPrice();
    }
    private addQuantity(): void {
        //this.cartServiceProvider.addToShoppingCart(selectedProductItem);
        if (this.availableItem.productItem.requiredQuantity == null) {
            this.availableItem.productItem.requiredQuantity = 1;
        } else {
            if (this.availableItem.productItem.requiredQuantity < 10) {
                this.availableItem.productItem.requiredQuantity = this.availableItem.productItem.requiredQuantity + 1;
            }
        }
        //this.cartServiceProvider.addToShoppingCart(this.productItem);
        //console.log("addQuantiy()...this.productItem.requiredQuantity="+this.productItem.requiredQuantity);
        this.recalculateTotalPrice();
    }

    private removeQuantity(): void {
        //this.cartServiceProvider.removeFromShoppingCart(this.selectedProductItem);
        if (this.availableItem.productItem.requiredQuantity == null) {
            this.availableItem.productItem.requiredQuantity = 0;
        } else {
            if (this.availableItem.productItem.requiredQuantity > 1) {
                this.availableItem.productItem.requiredQuantity = this.availableItem.productItem.requiredQuantity - 1;
            }
        }
        //this.cartServiceProvider.addToShoppingCart(this.productItem);
        //console.log("removeQuantity()...this.productItem.requiredQuantity="+this.productItem.requiredQuantity);
        this.recalculateTotalPrice();
    }

    private calculatedTotalPrice: any = {};
    private recalculateTotalPrice(): void {
        console.log("recalculateTotalPrice()");
        let calculatedResult: any = { "pricePerSet": -1, "extraOptionsPerSet": -1, "requiredQuantity": -1, "totalAmount": -1 };
        if (this.availableItem.productItem.selectedItemPrice === undefined ||
            this.availableItem.productItem.selectedItemPrice == null ||
            JSON.stringify(this.availableItem.productItem.selectedItemPrice) == "{}") {
            calculatedResult.pricePerSet = 0;
            calculatedResult.extraOptionsPerSet = 0;
            calculatedResult.requiredQuantity = 0;
            calculatedResult.totalAmount = 0;
            this.calculatedTotalPrice = calculatedResult;
            console.log("this.calculatedTotalPrice=" + JSON.stringify(this.calculatedTotalPrice));
        } else {
            calculatedResult.pricePerSet = Number.parseInt((this.availableItem.productItem.selectedItemPrice.specialPrice === 'undefined' || this.availableItem.productItem.selectedItemPrice.specialPrice == null) ? this.availableItem.productItem.selectedItemPrice.value : this.availableItem.productItem.selectedItemPrice.specialPrice);
            calculatedResult.extraOptionsPerSet = 0;
            if (this.availableItem.productItem.selectedExtraOptions == null) {
                this.availableItem.productItem.selectedExtraOptions = new Array<any>();
            }
            for (let i = 0; i < this.availableItem.productItem.selectedExtraOptions.length; i++) {
                calculatedResult.extraOptionsPerSet = Number.parseInt(calculatedResult.extraOptionsPerSet) + Number.parseInt(this.availableItem.productItem.selectedExtraOptions[i].value);

            }
            calculatedResult.requiredQuantity = this.availableItem.productItem.requiredQuantity;
            calculatedResult.totalAmount = (Number.parseInt(calculatedResult.pricePerSet) + Number.parseInt(calculatedResult.extraOptionsPerSet)) * Number.parseInt(calculatedResult.requiredQuantity);
            this.calculatedTotalPrice = calculatedResult;
            console.log("this.calculatedTotalPrice=" + JSON.stringify(this.calculatedTotalPrice));
        }

    }

    /*
    private blankSelectedProductItem: any = {
        "sellerId": "",
        "sellerTitle": "",
        "sellerCode": "",
        "sellerImage": "",
        "sellerLocationLatLng": { "latitude": "", "longitude": "" },
        "sellerDistance": 0.0,
        "customerLocationTitle": "",
        "customerLocationLatLng": { "latitude": "", "longitude": "" },
        "selectedDeliveryTimePreroid": { "startDate": "", "endDate": "" },
        "productItemId": "",
        "productItemTitle": "",
        "productItemImage": "",
        "selectedExtraOptions": [], //[{"name":"","value":""},{"name":"","value":""}]
        "selectedItemPrice": { "name": "", "specialPrice": "", "value": "" },
        "requiredQuantity": -1,
        "totalPricePerSet": -1
    }
    */
    //private dateRequired: any = {};
    //private timeRequired: any = {};

    public addToCart(): void {
        //console.log("addToCart this.productItem.selectedItemPrice=" + JSON.stringify(this.availableItem.productItem.selectedItemPrice));
        console.log("addToCart this.availableItem=" + JSON.stringify(this.availableItem));

        if (JSON.stringify(this.selectedAvailableDate) == "{}") {
            console.log('if');
            swal('Please!', ">> Select Date Required! <<", "error");
            /*
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Date Required!',
                buttons: ['OK']
            });
            alert.present();
            */
            return;
        }
        if (JSON.stringify(this.selectedTimeRangeRequired) == "{}") {
            console.log('if');
            swal('Please!', ">> Select Time Required! <<", "error");
            /*
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Time Required',
                buttons: ['OK']
            });
            alert.present();
            */
            return;
        }
        /*
        if (JSON.stringify(this.productItem.selectedItemPrice) == "{}") {
            console.log('if');
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
            return;
        }
        */

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> JSON.stringify(this.availableItem.productItem.selectedItemPrice)=" + JSON.stringify(this.availableItem.productItem.selectedItemPrice));
        if (this.availableItem.productItem.selectedItemPrice === undefined || this.availableItem.productItem.selectedItemPrice === null || JSON.stringify(this.availableItem.productItem.selectedItemPrice) == "{}") {
            console.log('if');
            swal('Please!', ">> Select Size and Price! <<", "error");
            /*
            let alert = this.alertCtrl.create({
                title: 'Please!',
                subTitle: 'Select Size and Price!',
                buttons: ['OK']
            });
            alert.present();
            */
            return;
        }
        /*
    public sellerKey : string;
    public sellerTitle : string;
    public sellerCode : string;
    public sellerImage : string;
    public sellerLocationLatLng : any; //{ "latitude": "", "longitude": "" }
    public sellerDistance : number;
    public customerLocationTitle : string;
    public customerLocationLatLng : string; //{ "latitude": "", "longitude": "" }
    public selectedDeliveryTimePreroid : {}; //{ "startDate": "", "endDate": "" }
    public productItemKey : string;
    public productItemTitle : string;
    public productItemImage : string;
    public selectedExtraOptions : Array<any>;
    public selectedItemPrice : {}; //{ "name": "", "specialPrice": "", "value": "" }
    public requiredQuantity : number = -1;
    public totalPricePerSet : number = -1;
        */

        let selectedProductItem = new SelectedProductItemElement();
        //console.log(">>>>>>>>>>>>>>>> >>> >>>>>>>> >>> this.productItem="+JSON.stringify(this.productItem));
        selectedProductItem.sellerKey = this.availableItem.seller.key;
        selectedProductItem.sellerTitle = this.availableItem.seller.title;
        selectedProductItem.sellerCode = this.availableItem.seller.code;
        selectedProductItem.sellerImage = this.availableItem.seller.images[0];
        selectedProductItem.sellerLocationLatLng = JSON.parse("{\"latitude\":" + this.availableItem.seller.latlng.split(",")[0] + ",\"longitude\":" + this.availableItem.seller.latlng.split(",")[1] + "}");
        //selectedProductItem.sellerLocationLatLng = JSON.parse("{\"latitude\":" + this.availableItem.seller.latlng[0] + ",\"longitude\":" + this.availableItem.seller.latlng[1] + "}");
        selectedProductItem.sellerDistance = this.availableItem.distance;
        //{ "id": "0.00000000000000000", "title": "CURRENT_LOCATION", "detail1": "", "detail2": "", "latitude": 13.74349185255942, "longitude": 100.49879542518465, "icon": "pin", "checked": true }

        /*
        selectedProductItem.customerEmail = this.sharingDataServiceProvider.currentUser.email;
        selectedProductItem.customerName = this.sharingDataServiceProvider.currentUser.name;
        selectedProductItem.customerMobilePhoneNo = this.sharingDataServiceProvider.currentUser.mobilePhoneNo;
        */

        let customerLocationItemChecked: any = this.customerLocationServiceProvider.currentCustomerLocationInfo;

        selectedProductItem.customerLocationTitle = customerLocationItemChecked.title;
        selectedProductItem.customerLocationLatLng = JSON.parse("{\"latitude\":" + customerLocationItemChecked.latitude + ",\"longitude\":" + customerLocationItemChecked.longitude + "}");//  this.sharingDataServiceProvider.getCustomerLocationItemChecked()

        //console.log('dateRequired='+this.dateRequired);
        //console.log('timeRequired='+this.timeRequired);

        //let startHM: string[] = this.selectedTimeRangeRequired.split(" - ")[0].split(":");
        //let endHM: string[] = this.selectedTimeRangeRequired.split(" - ")[1].split(":");

        //console.log("startHM H="+startHM[0]+"::startHM M="+startHM[1]);
        //console.log("endHM H="+endHM[0]+"::endHM M="+endHM[1]);

        //console.log("this.selectedAvailableDate="+JSON.stringify(this.selectedAvailableDate.Date.substr(0,10)));

        ////>>>> let dateTimeUTCRequiredStart = new Date((new Date(JSON.stringify(this.dateRequired))).getTime() + (Number.parseInt(startHM[0]) * 60 * 60 * 1000) + (Number.parseInt(startHM[1]) * 60 * 1000)).toISOString();

        //console.log('>>>>>>>>>>>>>>>>>>>>'+dateTimeUTCRequiredStart);

        ////>>>> let dateTimeUTCRequiredEnd = new Date((new Date(JSON.stringify(this.dateRequired))).getTime() + (Number.parseInt(endHM[0]) * 60 * 60 * 1000) + (Number.parseInt(endHM[1]) * 60 * 1000)).toISOString();

        //console.log('>>>>>>>>>>>>>>>>>>>>'+dateTimeUTCRequiredEnd);

        /////let dateTimeUTCRequiredStart: Date = dateandtime.parse(this.selectedAvailableDate.Date.substr(0, 10) + " " + this.selectedTimeRangeRequired.split(" - ")[0], "DD MMM YY HH:mm", false);
        /////console.log("dateTimeUTCRequiredStart=" + dateTimeUTCRequiredStart);

        /////let dateTimeUTCRequiredEnd: Date = dateandtime.parse(this.selectedAvailableDate.Date.substr(0, 10) + " " + this.selectedTimeRangeRequired.split(" - ")[1], "DD MMM YY HH:mm", false);
        /////console.log("dateTimeUTCRequiredEnd=" + dateTimeUTCRequiredEnd);
        let selectedDeliveryTimePreroid: any = { "selectedDateRequired": this.selectedAvailableDate, "selectedTimeRangeRequired": this.selectedTimeRangeRequired }
        //selectedAvailableDate
        selectedProductItem.selectedDeliveryTimePreroid = selectedDeliveryTimePreroid;//JSON.parse("{\"startDate\":\"" + dateandtime.format(dateTimeUTCRequiredStart, "DD MMM YY (ddd) HH:mm") + "\",\"endDate\":\"" + dateandtime.format(dateTimeUTCRequiredEnd, "DD MMM YY (ddd) HH:mm") + "\"}");
        console.log("selectedProductItem.selectedDeliveryTimePreroid=" + JSON.stringify(selectedProductItem.selectedDeliveryTimePreroid));

        selectedProductItem.productItemKey = this.availableItem.productItem.key;
        selectedProductItem.productItemTitle = this.availableItem.productItem.title;
        selectedProductItem.productItemImage = this.availableItem.productItem.images[0];
        selectedProductItem.selectedExtraOptions = this.availableItem.productItem.selectedExtraOptions;

        selectedProductItem.selectedItemPrice = this.availableItem.productItem.selectedItemPrice;

        selectedProductItem.requiredQuantity = this.availableItem.productItem.requiredQuantity;
        selectedProductItem.totalPricePerSet = Number.parseInt(this.calculatedTotalPrice.pricePerSet) + Number.parseInt(this.calculatedTotalPrice.extraOptionsPerSet);

        //Other Information for 





        //this.selectedProductItem.sellerId = "";
        //this.selectedProductItem.customerLatLng = {};
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("selectedProductItem=" + JSON.stringify(selectedProductItem));
        this.cartServiceProvider.addToShoppingCart(selectedProductItem, false);
        //this.cartServiceProvider.removeFromShoppingCart(this.selectedProductItem);

        ////this.app.getRootNav().push("CartTabsPage");
        this.router.navigate(['/shop/shoppingcart']);
    }

}

