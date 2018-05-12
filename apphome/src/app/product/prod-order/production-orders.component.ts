import { Component } from '@angular/core';
//import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
//import { ToastrService } from 'toastr-ng2';
import { Router, ActivatedRoute } from "@angular/router";
//import { ProductionOrdersService } from './production-orders.service';

import { ProductionOrderInfo, AllAboutOrderStatus } from '../../services/app-data-model/app-data-model'

import { RESTClientService } from '../../services/restclient/restclient.service';
//import { ModalService } from '../../../layout/modal/_services/modal.service';

import * as firebase from 'firebase';

//let dateandtime = require('date-and-time');
import * as dateandtime from 'date-and-time';

dateandtime.locale('th');

//const swal = require('sweetalert2');

@Component({
    selector: 'app-orders',
    templateUrl: './production-orders.component.html',
    styleUrls: ['./production-orders.component.scss'],
    //providers: [ProductionOrdersService]
})
export class ProductionOrdersComponent {

    public mainStatuses: Array<{ en: string, th: string }> = ProductionOrderInfo.mainStatuses;
    public orderStatuses: Array<{ en: string, th: string }> = ProductionOrderInfo.orderStatuses;
    public paymentStatuses: Array<{ en: string, th: string }> = ProductionOrderInfo.paymentStatuses;
    public deliveryStatuses: Array<{ en: string, th: string }> = ProductionOrderInfo.deliveryStatuses;

    public mainDisplayStatus: string;
    public orderDisplayStatus: string;
    public paymentDisplayStatus: string;
    public deliveryDisplayStatus: string;


    public productionOrderInfo: ProductionOrderInfo = new ProductionOrderInfo();
    public productionOrders: Array<ProductionOrderInfo> = new Array<ProductionOrderInfo>();
    ordersData: FirebaseListObservable<any>;


    constructor(public angularFireDatabase: AngularFireDatabase,
        //public toastr: ToastrService,
        public router: Router,
        //public ordersService: ProductionOrdersService,
        public restClientService: RESTClientService,
        //private modalService: ModalService
    ) {
        //.orderByChild("selectedDeliveryTimeStamp")
        /*
         firebase.database().ref("/productionOrders2").orderByChild("selectedDeliveryTimeStamp").once("value").then((value)=>{
           console.log(JSON.stringify(value.val()));
           
           value.forEach(element => {
             let productionOrder = <ProductionOrderInfo> element.val();
             //console.log(JSON.stringify(productionOrder.allAboutOrderStatus))
             productionOrder.allAboutOrderStatus.mainDisplayStatus = productionOrder.allAboutOrderStatus.mainCurrentStatus;
             productionOrder.allAboutOrderStatus.orderDisplayStatus = productionOrder.allAboutOrderStatus.orderCurrentStatus;
             productionOrder.allAboutOrderStatus.deliveryDisplayStatus = productionOrder.allAboutOrderStatus.deliveryCurrentStatus;
             productionOrder.allAboutOrderStatus.paymentDisplayStatus = productionOrder.allAboutOrderStatus.paymentCurrentStatus;
             this.productionOrders.push(productionOrder);
           
           }); 
         }).catch((error)=>{
           console.log("ProductionOrdersComponent.constructor() ... ERROR::"+JSON.stringify(error));
         });
         */

        angularFireDatabase.list('/productionOrders2', {
            query: {
                orderByChild: 'selectedDeliveryTimeStamp'
            }
        }).subscribe((res) => {
            //console.log("res" + JSON.stringify(res))
            res.forEach(element => {
                let productionOrder = <ProductionOrderInfo>element;
                //console.log(JSON.stringify(productionOrder.allAboutOrderStatus))
                productionOrder.allAboutOrderStatus.mainDisplayStatus = productionOrder.allAboutOrderStatus.mainCurrentStatus;
                productionOrder.allAboutOrderStatus.orderDisplayStatus = productionOrder.allAboutOrderStatus.orderCurrentStatus;
                productionOrder.allAboutOrderStatus.deliveryDisplayStatus = productionOrder.allAboutOrderStatus.deliveryCurrentStatus;
                productionOrder.allAboutOrderStatus.paymentDisplayStatus = productionOrder.allAboutOrderStatus.paymentCurrentStatus;
            });
            this.productionOrders = res;
        });


    }
    /*
      OnChangeStatus(key, event) {
        this.ordersData.update(key, { status: event.target.value }).then((res) => {
          var message = {
            app_id: "ace5d8a2-5018-4523-ab21-cff285d32524",
            contents: { "en": event.target.value },
            include_player_ids: ["31851f36-3730-4c4d-a129-fdcf380d4d86"]
          };
    
          this.af.list('/orders/' + key + '/statusReading').push({ title: event.target.value, time: Date.now() })
    
          this.ordersService.sendNotification(message).subscribe(response => {
            console.log("hello " + JSON.stringify(response))
          });
          this.toastr.success('Order status updated!', 'Success!');
        });
      }
    */
    public ordersShow(key): void {
        this.router.navigate(['/prod-order/viewOrders', key]);
    }

    public getRequiredDateTime(timestamp: number): string {
        return dateandtime.format(new Date(timestamp), 'DD MMM YY (ddd) HH:mm');
    }




    public deliveryResponseX(productionOrder: ProductionOrderInfo): Array<any> {
        let a: Array<any> = new Array<any>();
        //console.log(JSON.stringify(productionOrder.deliveryServiceProviderResponses));
        //console.log("productionOrder.deliveryServiceProviderResponses != null =="+productionOrder.deliveryServiceProviderResponses != null);
        if (productionOrder.deliveryServiceProviderResponses != null) {
            //console.log("productionOrder.deliveryServiceProviderResponses.length=="+productionOrder.deliveryServiceProviderResponses.length);
            for (let i: number = productionOrder.deliveryServiceProviderResponses.length - 1; i > -1; i--) {
                //console.log(JSON.stringify(productionOrder.deliveryServiceProviderResponses[i]));

                let any: any = JSON.parse(JSON.stringify(productionOrder.deliveryServiceProviderResponses[i]));
                any.createdAt = dateandtime.format(new Date(productionOrder.deliveryServiceProviderResponses[i].createdAt), 'DD MMM YY (ddd) HH:mm');
                any.responseData = JSON.stringify(productionOrder.deliveryServiceProviderResponses[i].responseData);
                a.push(any);
            }
        }
        return a;
    }



}