import { Injectable } from '@angular/core';
//import { ShoppingCartConstants } from './cart-constants';

import { RESTClientService } from '../restclient/restclient.service';
import { ReadyState } from '@angular/http/src/enums';
import { SharingDataServiceProvider } from '../sharing-data-service/sharing-data.service';

import { ShoppingCart, CartElement, SelectedProductItemElement } from '../app-data-model/app-data-model';

//import { AngularFireModule } from 'angularfire2';
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase, /*FirebaseObjectObservable,*/ FirebaseListObservable } from 'angularfire2/database';
//import * as firebase from 'firebase/app';
//import 'firebase/storage';


/*
  Generated class for the SharingDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
import * as dateandtime from 'date-and-time';
//let dateandtime = require('date-and-time');
dateandtime.locale('th');

@Injectable()
export class CartServiceProvider {

    public static CART_ELEMENT_DISCOUNT: number = -150; //if > 300 
    public static CART_ELEMENT_DISCOUNT_IF_MORETHAN: number = 300;

    //private Cart: any[] = [];
    //private itemCart: any = {};
    //private itemsInCart = [];

    //private shoppingCartConstants: ShoppingCartConstants;
    //public shoppingCart: Array<CartElement> = new Array<CartElement>();
    public shoppingCart: ShoppingCart = new ShoppingCart();

    public restClientService: RESTClientService;
    constructor(
        //public angularFireAuth: AngularFireAuth,
        //public angularFireDatabase: AngularFireDatabase,
        private sharingDataServiceProvider: SharingDataServiceProvider
    ) {

        console.log('>>>>>> >>>>> >>> >> > Hello CartServiceProvider Provider');
        this.restClientService = new RESTClientService(); //getDeliveryQuotation
        //this.shoppingCartConstants = new ShoppingCartConstants();
        this.resumeCart();
        this.calculateAllEntities();
        //this.calculateTotalCostOfGoods();
        //this.calculateTotalCostOfDelivery();
        //this.calculateGrandTotal();

    }

    public resumeCart(): void {
        this.shoppingCart = <ShoppingCart>JSON.parse(localStorage.getItem(ShoppingCart.SHOPPING_CART));
        console.log("this.shoppingCart=" + JSON.stringify(this.shoppingCart));

        if (this.shoppingCart == null) {
            //this.shoppingCart = new Array<any>();
            this.shoppingCart = new ShoppingCart();
            this.hibernateCart();
        }
        //console.log("resumeCart(), this.shoppingCart=" + JSON.stringify(this.shoppingCart));
    }

    public hibernateCart(): void {
        localStorage.setItem(ShoppingCart.SHOPPING_CART, JSON.stringify(this.shoppingCart));
    }
    /*{
      productItemKey: String,
      productItemTitle: String,
      productItemImage: String,
      selectedExtraOptions: [], / *{"name":"","value":""} * /
      selectedItemPrice: {}, / *{"name": "","value":"","specialPrice":""}* /
      requiredQuantity: Number
    } */
    //private selectedProductItem: any = null;

    public addToShoppingCart(selectedProductItem: SelectedProductItemElement, isOnlyOneAdding: boolean): void {
        console.log("addToShoppingCart...............................started");
        //console.log("addToShoppingCart selectedProductItem=" + JSON.stringify(selectedProductItem));
        //console.log("this.shoppingCart=" + JSON.stringify(this.shoppingCart));
        /////this.selectedProductItem = selectedProductItem;


        let foundSelectedSellerProductItemIndex: number = this.findSelectedSellerProductItem(selectedProductItem);
        //console.log("foundSelectedSellerProductItemIndex=" + foundSelectedSellerProductItemIndex);
        if (foundSelectedSellerProductItemIndex == -1) {
            this.shoppingCart.cartElements.push(this.newCartElement(selectedProductItem));
            foundSelectedSellerProductItemIndex = this.shoppingCart.cartElements.length - 1;

            //console.log("++++++++++++++++++  +++++ ++++ this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex]=" + JSON.stringify(this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex]));
            this.loadDeliveryVendorInfo(this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex], "COD");
        }

        let foundSelectedProductItemIndex: number = this.findSelectedProductItem(foundSelectedSellerProductItemIndex, selectedProductItem);//indexSelectedSellerProductItem, selectedProductItem);
        //console.log("foundSelectedProductItemIndex=" + foundSelectedProductItemIndex);
        if (foundSelectedProductItemIndex == -1) {
            this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems.push(this.newSelectedProductItem(selectedProductItem));
        } else {
            let requiredQuantity: number;
            if (isOnlyOneAdding == true) {
                requiredQuantity = 1;
            } else {
                requiredQuantity = selectedProductItem.requiredQuantity;
            }
            this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[foundSelectedProductItemIndex].requiredQuantity =
                this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[foundSelectedProductItemIndex].requiredQuantity + requiredQuantity;
        }
        /////this.selectedProductItem = null;
        this.calculateAllEntities();
        /*
        this.calculateTotalCostOfGoods();
        this.calculateTotalCostOfDelivery();
        this.calculateGrandTotal();
        console.log("addToShoppingCart this.shoppingCart=" + JSON.stringify(this.shoppingCart));
        this.hibernateCart();
        */
    }

    public removeFromShoppingCart(selectedProductItem: SelectedProductItemElement, isAllToRemove: boolean): void {
        console.log("removeFromShoppingCart selectedProductItem=" + JSON.stringify(selectedProductItem));
        /////this.selectedProductItem = selectedProductItem;
        let foundSelectedSellerProductItemIndex: number;
        let foundSelectedProductItemIndex: number;

        foundSelectedSellerProductItemIndex = this.findSelectedSellerProductItem(selectedProductItem);
        if (foundSelectedSellerProductItemIndex == -1) { //NOT FOUND Seller & ProductItem, Do nothing
            return;
        } else {
            foundSelectedProductItemIndex = this.findSelectedProductItem(foundSelectedSellerProductItemIndex, selectedProductItem);
            if (foundSelectedProductItemIndex == -1) {  //NOT FOUND ProductItem, Do nothing
                return;
            } else {
                this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[foundSelectedProductItemIndex].requiredQuantity =
                    this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[foundSelectedProductItemIndex].requiredQuantity - 1;
            }
        }

        if (this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[foundSelectedProductItemIndex].requiredQuantity <= 0 || isAllToRemove) {
            this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems.splice(foundSelectedProductItemIndex, 1);
            //console.log("this.shoppingCart.cartElements[" + foundSelectedSellerProductItemIndex + "].selectedProductItems.length=" + this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems.length);
            if (this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems.length == 0) {
                this.shoppingCart.cartElements.splice(foundSelectedSellerProductItemIndex, 1);
            }
        }
        //////this.selectedProductItem = null;
        if (this.shoppingCart.cartElements.length == 0) {
            this.resetAllValue();
        }
        this.calculateAllEntities();
        /*
        this.calculateTotalCostOfGoods();
        this.calculateTotalCostOfDelivery();
        this.calculateGrandTotal();
        //console.log("removeFromShoppingCart this.shoppingCart=" + JSON.stringify(this.shoppingCart));
        this.hibernateCart();
        */
    }

    /*
    "selectedDeliveryTimePreroid":{
      "selectedDateRequired":{
         "RangeId":0,
         "Date":{
            "dateString":"16 มี.ค. 18 (ศุกร์)",
            "dateUTC":"2018-03-15T17:00:00.000Z"
         }
      },
      "selectedTimeRangeRequired":"09:30 - 10:00"
   },

    */

    private async loadDeliveryVendorInfo(newSelectedSellerProductItem: CartElement, paymentMethod: string): Promise<any> {
        newSelectedSellerProductItem.deliveryServiceProvider = "...Processing....";
        newSelectedSellerProductItem.totalCostOfDelivery = -1;
        //"selectedDeliveryTimePreroid":{"startDate":"24 ก.พ. 18 (เสาร์) 09:30"
        //console.log("-=-=-=-==-=-====-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=====");//+JSON.stringify(newSelectedSellerProductItem))
        //console.log(newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.substr(0,10)+" "+newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.substr(newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.length-5,5));
        //let deliveryTimeStartString: string = newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.substr(0, 10) + " " + newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.substr(newSelectedSellerProductItem.selectedDeliveryTimePreroid.startDate.length - 5, 5);
        //console.log(deliveryTimeStartString);
        //let deliveryTimeStartDate: Date = dateandtime.parse(deliveryTimeStartString, "DD MMM YY HH:mm", false);\
        let deliveryDate: Date = new Date(Date.parse(newSelectedSellerProductItem.selectedDeliveryTimePreroid.selectedDateRequired.Date.dateUTC));
        //console.log("X 0 X 0 X 0 X 0 X 0 X 0 >"+deliveryDate.toISOString());
        let deliveryTime: Date = dateandtime.parse(newSelectedSellerProductItem.selectedDeliveryTimePreroid.selectedTimeRangeRequired.split(" - ")[0], "HH:mm", true);
        //console.log("X 0 X 0 X 0 X 0 X 0 X 0 >"+deliveryTime.toISOString()+" milSec = "+deliveryTime.getTime());
        let deliveryTimeStartDate: Date = dateandtime.addMilliseconds(deliveryDate, deliveryTime.getTime());
        //console.log("X 0 X 0 X 0 X 0 X 0 X 0 >"+deliveryTimeStartDate.toISOString());
        let deliveryQuotation: any = await this.restClientService.getDeliveryQuotation(deliveryTimeStartDate.toISOString(), newSelectedSellerProductItem.sellerLocationLatLng, newSelectedSellerProductItem.customerLocationLatLng, paymentMethod);
        //console.log("==== === == = >> deliveryQuotation" + JSON.stringify(deliveryQuotation));
        newSelectedSellerProductItem.deliveryServiceProvider = deliveryQuotation.deliveryServiceProvider;
        newSelectedSellerProductItem.totalCostOfDelivery = deliveryQuotation.totalCostForDelivery;
        
        this.calculateAllEntities();
        /*
        this.calculateTotalCostOfGoods();
        this.calculateTotalCostOfDelivery();
        this.calculateGrandTotal();
        this.hibernateCart();
        */
    }

    private async loadAllDeliveryVendorInfo(): Promise<any> {
        for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
            await this.loadDeliveryVendorInfo(this.shoppingCart.cartElements[i], (this.paymentMethod == "COD" ? "COD" : ""));
        }
    }

    private findSelectedSellerProductItem(selectedProductItem: SelectedProductItemElement): number {
        console.log("findSelectedSellerProductItem() ... selectedProductIte=" + JSON.stringify(selectedProductItem));

        let existingSelectedSellerProductItem: any = null;
        for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
            console.log("___________________________________________________________________________________________________");
            console.log("this.shoppingCart.cartElements[i].sellerKey=" + this.shoppingCart.cartElements[i].sellerKey + " >>>><<<< selectedProductItem.sellerKey=" + selectedProductItem.sellerKey);
            console.log("this.shoppingCart.cartElements[i].customerLocationLatLng=" + JSON.stringify(this.shoppingCart.cartElements[i].customerLocationLatLng) + " >>>><<<< selectedProductItem.customerLocationLatLng=" + JSON.stringify(selectedProductItem.customerLocationLatLng));
            console.log("this.shoppingCart.cartElements[i].selectedDeliveryTimePreroid=" + JSON.stringify(this.shoppingCart.cartElements[i].selectedDeliveryTimePreroid) + " >>>><<<< selectedProductItem.selectedDeliveryTimePreroid=" + JSON.stringify(selectedProductItem.selectedDeliveryTimePreroid));

            //console.log("findSelectedSellerProductItem()...this.shoppingCart.cartElements[" + i + "]=" + JSON.stringify(this.shoppingCart.cartElements[i]));
            //existingSelectedSellerProductItem = this.shoppingCart.cartElements[i];
            if (this.shoppingCart.cartElements[i].sellerKey == selectedProductItem.sellerKey &&
                JSON.stringify(this.shoppingCart.cartElements[i].customerLocationLatLng) == JSON.stringify(selectedProductItem.customerLocationLatLng) &&
                JSON.stringify(this.shoppingCart.cartElements[i].selectedDeliveryTimePreroid) == JSON.stringify(selectedProductItem.selectedDeliveryTimePreroid)
                //this.compareSelectedDeliveryTimePreroid(this.shoppingCart.cartElements[i].selectedDeliveryTimePreroid, selectedProductItem.selectedDeliveryTimePreroid)
            ) {
                return i;
            }
        }
        return -1;
    }
    /*
        "sellerKey": "-KyuEP034GXPShXday8h",
        "customerLatLng": {"latitude":"13.721288","longitude":"100.526477"},
        "selectedDeliveryTimePreroid": {"startDate":"2017-11-29T10:00:00.000Z","endDate":"2017-11-29T12:00:00.000Z"},
        "productItemKey": "-KyuN0kihNCshE0Thsbn",
        "selectedExtraOptions": ["วุ้นเส้น","10"],
        "selectedItemPrice": {"name":"พิเศษ","specialPrice":"180","value":"200"}
    */
    private newCartElement(selectedProductItem: SelectedProductItemElement): CartElement {
        let cartElement: CartElement = new CartElement();//this.shoppingCartConstants.getBlankSelectedSellerProductItem();
        //console.log("selectedProductItem.sellerKey=" + selectedProductItem.sellerKey);
        /*
            "sellerKey": "",
            "sellerTitle":"",
            "sellerCode":"",
            "sellerImage":"",
            "sellerLocationLatLng":{"latitude":"","longitude":""},
            "customerLocationTitle":"",
            "customerLocationLatLng": {"latitude":"","longitude":""},
            "selectedDeliveryTimePreroid": {"startDate":"","endDate":""},
            "productItemKey": "",
            "productItemTitle":"",
            "productItemImage":"",
            "selectedExtraOptions": [], //[{"name":"","value":""},{"name":"","value":""}]
            "selectedItemPrice": {"name":"","specialPrice":"","value":""},
            "requiredQuantity" : -1,
            "totalPricePerSet" : -1
        */
        cartElement.sellerKey = selectedProductItem.sellerKey;
        cartElement.sellerCode = selectedProductItem.sellerCode;;
        cartElement.sellerTitle = selectedProductItem.sellerTitle;;
        cartElement.sellerImage = selectedProductItem.sellerImage;;
        cartElement.sellerLocationLatLng = selectedProductItem.sellerLocationLatLng;;
        cartElement.sellerDistance = selectedProductItem.sellerDistance;

        cartElement.customerKey = this.sharingDataServiceProvider.currentUser != null ? this.sharingDataServiceProvider.currentUser.key : "NO LOGGING IN";
        cartElement.customerName = this.sharingDataServiceProvider.currentUser != null ? this.sharingDataServiceProvider.currentUser.name : "NO LOGGING IN";
        cartElement.customerMobilePhone = this.sharingDataServiceProvider.currentUser != null ? this.sharingDataServiceProvider.currentUser.mobilePhoneNo : "NO LOGGING IN";;
        cartElement.customerLocationTitle = selectedProductItem.customerLocationTitle;
        cartElement.customerLocationLatLng = selectedProductItem.customerLocationLatLng;
        cartElement.selectedDeliveryTimePreroid = selectedProductItem.selectedDeliveryTimePreroid;

        cartElement.totalCostOfGoods = -1;
        cartElement.deliveryServiceProvider = "";
        cartElement.totalCostOfDelivery = -1;
        cartElement.paymentMethod = "";
        //cartElement.costOfPaymentMethod = -1;
        cartElement.selectedProductItems = new Array<SelectedProductItemElement>();

        //this.shoppingCart.push(selectedSellerProductItem);
        return cartElement;
    }
    //return { "index": this.shoppingCart.length - 1, "SelectedSellerProductItem": selectedSellerProductItem };
    //}

    private compareSelectedDeliveryTimePreroid(selectedDeliveryTimePreroid1: any, selectedDeliveryTimePreroid2: any): boolean {
        //console.log("compareSelectedDeliveryTimePreroid(..) .. selectedDeliveryTimePreroid1=" + JSON.stringify(selectedDeliveryTimePreroid1) + ":: selectedDeliveryTimePreroid2=" + JSON.stringify(selectedDeliveryTimePreroid2));

        if (selectedDeliveryTimePreroid1.startDate == selectedDeliveryTimePreroid2.startDate &&
            selectedDeliveryTimePreroid1.endDate == selectedDeliveryTimePreroid2.endDate) {
            return true;
        }
        return false;
    }




    private findSelectedProductItem(foundSelectedSellerProductItemIndex: number, selectedProductItem: any): number {
        //console.log("findSelectedProductItem-foundSelectedSellerProductItemIndex=" + foundSelectedSellerProductItemIndex);
        let selectedSellerProductItem: any = null;

        if (this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems == null) {
            this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems = new Array<any>();
        }
        let existingSelectedProductItem: any = null;
        for (let i = 0; i < this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems.length; i++) {
            //existingSelectedProductItem = this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[i];
            if (this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[i].productItemKey == selectedProductItem.productItemKey &&
                this.compareSelectedExtraOptions(this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[i].selectedExtraOptions, selectedProductItem.selectedExtraOptions) &&
                this.compareSelectedItemPrice(this.shoppingCart.cartElements[foundSelectedSellerProductItemIndex].selectedProductItems[i].selectedItemPrice, selectedProductItem.selectedItemPrice)
            ) {
                return i;
            }
        }
        return -1;

    }
    /*
        "sellerKey": "-KyuEP034GXPShXday8h",
        "customerLatLng": {"latitude":"13.721288","longitude":"100.526477"},
        "selectedDeliveryTimePreroid": {"startDate":"2017-11-29T10:00:00.000Z","endDate":"2017-11-29T12:00:00.000Z"},
        "productItemKey": "-KyuN0kihNCshE0Thsbn",
        "selectedExtraOptions": ["วุ้นเส้น","10"],
        "selectedItemPrice": {"name":"พิเศษ","specialPrice":"180","value":"200"}
  
        productItemKey: String,
        //sellerKey: String,
        //customerLatLng: String,
        //selectedDeliveryTimePreroid: {},
        productItemTitle: String,
        productItemImage: String,
        selectedExtraOptions: [], / * {"name":"","value":""} * /
        selectedItemPrice: {}, / * {"name": "","value":"","specialPrice":""} * /
        requiredQuantity: Number
    */
    private newSelectedProductItem(selectedProductItem: SelectedProductItemElement): any {
        //let newSelectedProductItem = this.shoppingCartConstants.getBlankSelectedProductItem();
        let newSelectedProductItem: SelectedProductItemElement = new SelectedProductItemElement();
        newSelectedProductItem.sellerKey = selectedProductItem.sellerKey;
        newSelectedProductItem.customerLocationLatLng = selectedProductItem.customerLocationLatLng;
        newSelectedProductItem.selectedDeliveryTimePreroid = selectedProductItem.selectedDeliveryTimePreroid;

        newSelectedProductItem.productItemKey = selectedProductItem.productItemKey;
        newSelectedProductItem.productItemTitle = selectedProductItem.productItemTitle;
        newSelectedProductItem.productItemImage = selectedProductItem.productItemImage;
        newSelectedProductItem.selectedExtraOptions = selectedProductItem.selectedExtraOptions;

        newSelectedProductItem.selectedExtraOptionsComma = "";
        for (let i = 0; i < selectedProductItem.selectedExtraOptions.length; i++) {
            newSelectedProductItem.selectedExtraOptionsComma = newSelectedProductItem.selectedExtraOptionsComma + newSelectedProductItem.selectedExtraOptions[i].name + ", ";
        }


        if (newSelectedProductItem.selectedExtraOptionsComma.length > 0 && newSelectedProductItem.selectedExtraOptionsComma.lastIndexOf(", ") > 0) {
            newSelectedProductItem.selectedExtraOptionsComma = newSelectedProductItem.selectedExtraOptionsComma.substring(0, newSelectedProductItem.selectedExtraOptionsComma.lastIndexOf(", "));
        }

        newSelectedProductItem.selectedItemPrice = selectedProductItem.selectedItemPrice;
        newSelectedProductItem.totalPricePerSet = selectedProductItem.totalPricePerSet;

        newSelectedProductItem.requiredQuantity = selectedProductItem.requiredQuantity;

        //existingSelectedSellerProductItem.selectedProductItems.push(existingSelectedProductItem);
        //return { "index": existingSelectedSellerProductItem.selectedProductItems.length - 1, "ExistingSelectedProductItem": existingSelectedProductItem };
        return newSelectedProductItem;
    }



    private compareSelectedExtraOptions(selectedExtraOptions1: any[], selectedExtraOptions2: any[]): boolean {
        /*{"name":"","value":""} */
        if (selectedExtraOptions1 != null && selectedExtraOptions2 != null && selectedExtraOptions1.length == selectedExtraOptions2.length) {
            for (let i = 0; i < selectedExtraOptions1.length; i++) {
                let nameValue: any = null;
                nameValue = selectedExtraOptions2.find(item => {
                    return item.name == selectedExtraOptions1[i].name;
                });
                if (nameValue == null) {
                    return false;
                } else {
                    if (selectedExtraOptions1[i].vaule != nameValue.vaule) {
                        return false;
                    }
                }
            }

            return true;
        }
        return false;
    }
    private compareSelectedItemPrice(selectedItemPrice1: any, selectItemPrice2: any): boolean {
        /*{"name": "","value":"","specialPrice":""} */
        if (selectedItemPrice1.name == selectItemPrice2.name &&
            selectedItemPrice1.value == selectItemPrice2.value &&
            selectedItemPrice1.specialPrice == selectItemPrice2.specialPrice) {
            return true;
        }
        return false;
    }
    /*
            sellerKey: String, / * Key1.1, Key2.1 * /
            sellerCode: String,
            sellerTitle: String,
            sellerImage: String,selectedProductItem
            sellerLatLng: String,
            customerKey: String,
            customerName: String,
            customerLocation: String,
            customerLatLng: String, / * Key1.2, Key2.2 * /
            selectedDeliveryTimePreroid: {}, / * Key1.3, Key2.3 * /
            deliveryServiceProvider: String,/ * Key2.4 * /
            paymentMethod: String, / * Key2.5 * /
            selectedProductItems: [],
    */
    //public grandTotalCostOfGoods: number = 0;

    private calculateAllEntities() : void {
        this.calculateTotalCostOfGoods();
        this.calculateTotalCostOfDelivery();
        this.calculateTotalCostOfCartElement();
        this.calculateGrandTotal();

        this.hibernateCart();
    }

    private calculateTotalCostOfGoods(): void {
        console.log(">>>>>>>>>> calculateTotalCostOfGoods");
        this.shoppingCart.grandTotalCostOfGoods = 0;
        this.shoppingCart.grandTotalCostOfGoodsDiscount = 0;
        for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
            this.shoppingCart.cartElements[i].totalCostOfGoods = 0;
            for (let j = 0; j < this.shoppingCart.cartElements[i].selectedProductItems.length; j++) {
                //this.shoppingCart.cartElements[i].selectedProductItems[j].totalAmount = Number.parseInt(this.shoppingCart.cartElements[i].selectedProductItems[j].totalPricePerSet) *
                //    Number.parseInt(this.shoppingCart.cartElements[i].selectedProductItems[j].requiredQuantity);
                this.shoppingCart.cartElements[i].selectedProductItems[j].totalAmount = this.shoppingCart.cartElements[i].selectedProductItems[j].totalPricePerSet *
                    this.shoppingCart.cartElements[i].selectedProductItems[j].requiredQuantity;

                this.shoppingCart.cartElements[i].totalCostOfGoods = this.shoppingCart.cartElements[i].totalCostOfGoods + this.shoppingCart.cartElements[i].selectedProductItems[j].totalAmount;


            }//end for

            console.log("this.shoppingCart.cartElements[i].cartElementDiscountAmount========" + this.shoppingCart.cartElements[i].cartElementDiscountAmount);
            //this.shoppingCart.cartElements[i].totalCostOfCartElement = /*this.shoppingCart.cartElements[i].totalCostOfGoods +
              //  (this.shoppingCart.cartElements[i].totalCostOfPaymentMethod == -1 ? 0 : this.shoppingCart.cartElements[i].totalCostOfPaymentMethod) +
              //  (this.shoppingCart.cartElements[i].totalCostOfDelivery == -1 ? 0 : this.shoppingCart.cartElements[i].totalCostOfDelivery); */
                //this.shoppingCart.cartElements[i].costOfCartElement + this.shoppingCart.cartElements[i].cartElementDiscountAmount;
            //this.grandTotalCostOfGoods = this.grandTotalCostOfGoods + Number.parseInt(this.shoppingCart.cartElements[i].totalCostOfGoods);
            //this.shoppingCart.grandTotalDiscount = this.shoppingCart.grandTotalDiscount + this.shoppingCart.cartElements[i].cartElementDiscountAmount;
            this.shoppingCart.grandTotalCostOfGoods = this.shoppingCart.grandTotalCostOfGoods + this.shoppingCart.cartElements[i].totalCostOfGoods;
            this.shoppingCart.grandTotalCostOfGoodsDiscount = this.shoppingCart.grandTotalCostOfGoodsDiscount + this.shoppingCart.cartElements[i].goodsDiscountAmount;
        }
    }

    //public grandTotalCostForDelivery: number = 0;
    private calculateTotalCostOfDelivery(): void {
        this.shoppingCart.grandTotalCostOfDelivery = 0;
        this.shoppingCart.grandTotalCostOfDeliveryDiscount = 0;
        for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
            this.shoppingCart.grandTotalCostOfDelivery = this.shoppingCart.grandTotalCostOfDelivery + this.shoppingCart.cartElements[i].totalCostOfDelivery;
            this.shoppingCart.grandTotalCostOfDeliveryDiscount = this.shoppingCart.grandTotalCostOfDeliveryDiscount + this.shoppingCart.cartElements[i].deliveryDiscountAmount;
        }
    }

    private calculateTotalCostOfCartElement(): void {
        console.log(".............................this.shoppingCart.cartElements.length="+this.shoppingCart.cartElements.length);
        this.shoppingCart.grandTotalCostOfCartElement = 0;
        this.shoppingCart.grandTotalCostOfCartElementDiscount = 0;
        for (let i: number = 0; i < this.shoppingCart.cartElements.length; i++) {
            //this.shoppingCart.grandTotalCostOfDelivery = this.shoppingCart.grandTotalCostOfDelivery + this.shoppingCart.cartElements[i].totalCostOfDelivery
            console.log("this.shoppingCart.cartElements["+i+"].totalCostOfGoods="+this.shoppingCart.cartElements[i].totalCostOfGoods);
            console.log("this.shoppingCart.cartElements["+i+"].totalCostOfDelivery="+this.shoppingCart.cartElements[i].totalCostOfDelivery);
            
            if (this.shoppingCart.cartElements[i].totalCostOfGoods + this.shoppingCart.cartElements[i].totalCostOfDelivery >= CartServiceProvider.CART_ELEMENT_DISCOUNT_IF_MORETHAN) {
                this.shoppingCart.cartElements[i].cartElementDiscountAmount = CartServiceProvider.CART_ELEMENT_DISCOUNT;
            } else {
                this.shoppingCart.cartElements[i].cartElementDiscountAmount = 0;
            }
            console.log("this.shoppingCart.cartElements["+i+"].cartElementDiscountAmount="+this.shoppingCart.cartElements[i].cartElementDiscountAmount);
            this.shoppingCart.cartElements[i].costOfCartElement = this.shoppingCart.cartElements[i].totalCostOfGoods + this.shoppingCart.cartElements[i].totalCostOfDelivery;
            console.log("this.shoppingCart.cartElements["+i+"].costOfCartElement="+this.shoppingCart.cartElements[i].costOfCartElement);
            this.shoppingCart.cartElements[i].totalCostOfCartElement =  this.shoppingCart.cartElements[i].costOfCartElement + this.shoppingCart.cartElements[i].cartElementDiscountAmount;
            console.log("this.shoppingCart.cartElements["+i+"].totalCostOfCartElement="+this.shoppingCart.cartElements[i].totalCostOfCartElement);

            
            this.shoppingCart.grandTotalCostOfCartElement = this.shoppingCart.grandTotalCostOfCartElement + this.shoppingCart.cartElements[i].totalCostOfCartElement;
            console.log("this.shoppingCart.grandTotalCostOfCartElement@["+i+"]="+this.shoppingCart.grandTotalCostOfCartElement);
            this.shoppingCart.grandTotalCostOfCartElementDiscount = this.shoppingCart.grandTotalCostOfCartElementDiscount + this.shoppingCart.cartElements[i].cartElementDiscountAmount;
            
            //this.shoppingCart.grandTotalDiscount = this.shoppingCart.grandTotalDiscount + this.shoppingCart.cartElements[i].cartElementDiscountAmount;
            console.log("this.shoppingCart.grandTotalCostOfCartElementDiscount@["+i+"]="+this.shoppingCart.grandTotalCostOfCartElementDiscount);
        }
    }

    //public grandTotal: number = 0;
    private calculateGrandTotal(): void {
        this.shoppingCart.grandTotalDiscount = /*this.shoppingCart.grandTotalCostOfGoodsDiscount + this.shoppingCart.grandTotalCostOfDeliveryDiscount*/this.shoppingCart.grandTotalCostOfCartElementDiscount + this.shoppingCart.grandTotalCostOfPaymentDiscount;
        this.shoppingCart.grandTotal = this.shoppingCart.grandTotalCostOfGoods + this.shoppingCart.grandTotalCostOfDelivery + this.shoppingCart.grandTotalCostOfPayment + this.shoppingCart.grandTotalDiscount;
        
    }

    public async placeOrder(cart: any): Promise<any> {
        cart.isCheckingOutReady = false;

        let pofireFirebaseRef;// = firebase.database().ref('/purchaseOrder/');

        var removeCart = function () {
            for (let i = 0; i < this.shoppingCart.length; i++) {
                if (this.shoppingCart.cartElements[i] == cart) {
                    //console.log("i=" + i);
                }
            }
        }

        //var isPushSuccess: boolean = false;

        return await pofireFirebaseRef.push(cart);
    }

    public clearFromShoppingCart(cart: any): void {

        for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
            if (this.shoppingCart.cartElements[i] == cart) {
                //console.log("i=" + i);
                this.shoppingCart.cartElements.splice(i, 1);
            }
        }

        this.hibernateCart();
    }

    public hasGoodsInCart(): boolean {

        if (this.shoppingCart != null && this.shoppingCart.cartElements.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    get goodsCountInCart(): number {
        let goodsCountInCart: number = 0;
        if (this.shoppingCart != null) {
            for (let i = 0; i < this.shoppingCart.cartElements.length; i++) {
                if (this.shoppingCart.cartElements[i].selectedProductItems != null) {
                    for (let j = 0; j < this.shoppingCart.cartElements[i].selectedProductItems.length; j++) {
                        goodsCountInCart = goodsCountInCart + 1;
                    }
                }
            }
            return goodsCountInCart;
        } else {
            return -1;
        }
    }

    public paymentMethod: string = "COD";
    //public grandTotalCostForPayment: number = 0;
    public setSelectedPaymentMethod(selectedPaymentMethod: string) {
        this.paymentMethod = selectedPaymentMethod;

        switch (selectedPaymentMethod) {
            case "COD": {
                this.shoppingCart.grandTotalCostOfPayment = 0;
                this.loadAllDeliveryVendorInfo().then((value) => {
                    this.calculateGrandTotal();
                    this.hibernateCart();
                }).catch((error) => {

                });
                break;
            }
            case "CREDIT_CARD": {
                this.loadAllDeliveryVendorInfo().then((value) => {
                    this.shoppingCart.grandTotalCostOfPayment = Math.round((this.shoppingCart.grandTotalCostOfGoods + this.shoppingCart.grandTotalCostOfDelivery) * 0.0365);
                    this.calculateGrandTotal();
                    this.hibernateCart();
                }).catch((error) => {

                });
                break;
            }
            case "OTHERS": {
                this.shoppingCart.grandTotalCostOfPayment = 0;
                this.loadAllDeliveryVendorInfo().then((value) => {
                    this.calculateGrandTotal();
                    this.hibernateCart();
                }).catch((error) => {

                });
                break;
            }

            default: {
                break;
            }
        }

    }

    private resetAllValue(): void {
        /*
        public grandTotalCostOfGoods: number = 0; //sum of cost of goods
        public grandTotalCostOfGoodsDiscount: number = 0; // discount of cost of goods
    
        public grandTotalCostOfDelivery: number = 0;
        public grandTotalCostOfDeliveryDiscount: number = 0;
    
        public grandTotalCostOfPayment: number = 0; // COD = 0
        public grandTotalCostOfPaymentDiscount: number = 0;
    
        public grandTotalCostOfCartElement : number = 0; //   cost of goods + cost of delivery
        public grandTotalCostOfCartElementDiscount : number = 0; // discount of (cost of goods + cost of delivery)
    
        public grandTotal: number = 0;  // cost of goods + cost of delivery + cost of payment
        public grandTotalDiscount: number = 0; //
        */

        this.shoppingCart.grandTotalCostOfGoods = 0;
        this.shoppingCart.grandTotalCostOfGoodsDiscount = 0;

        this.shoppingCart.grandTotalCostOfDelivery = 0;
        this.shoppingCart.grandTotalCostOfDeliveryDiscount = 0;

        this.shoppingCart.grandTotalCostOfPayment = 0;
        this.shoppingCart.grandTotalCostOfPaymentDiscount = 0;

        this.shoppingCart.grandTotalCostOfCartElement = 0;
        this.shoppingCart.grandTotalCostOfCartElementDiscount = 0;

        this.shoppingCart.grandTotal = 0;
        this.shoppingCart.grandTotalDiscount = 0;


    }
    public submitToCreatePO_OLD(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.restClientService.save("/purchaseOrder", this.shoppingCart).then((value) => {
                this.resetAllValue();
                //this.shoppingCart = new Array<any>();
                this.shoppingCart = new ShoppingCart();
                this.hibernateCart();
                resolve(value);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /*
    public submitToCreatePO(): Promise<any> {
        return new Promise((resolve, reject) => {
            let functionInfo: any = {
                "functionInfo": {
                    "classPathFileName": "./productionOrders.service",  //"./availableItems.service",
                    "className": "ProductionOrdersService",//"AvailableItemService",
                    "functionName": "createProductionOrder",//"findAllAvailableItems",
                    "functionArgument": { "shoppingCart": this.shoppingCart }
                }
            };
            this.restClientService.callAFunction(functionInfo).then((value) => {
                console.log("value=" + JSON.stringify(value));

                this.resetAllValue();
  
                this.shoppingCart = new ShoppingCart();
                this.hibernateCart();

                resolve(value);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    */
    public submitToCreatePO(): Promise<any> {
        return new Promise((resolve, reject) => {
            /*
            let functionInfo: any = {
                "functionInfo": {
                    "classPathFileName": "./productionOrders.service",  //"./availableItems.service",
                    "className": "ProductionOrdersService",//"AvailableItemService",
                    "functionName": "createProductionOrder",//"findAllAvailableItems",
                    "functionArgument": { "shoppingCart": this.shoppingCart }
                }
            };
            */
            this.restClientService.createProductionOrder(this.shoppingCart).then((value) => {
                console.log("value=" + JSON.stringify(value));

                this.resetAllValue();

                this.shoppingCart = new ShoppingCart();
                this.hibernateCart();

                resolve(value);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}