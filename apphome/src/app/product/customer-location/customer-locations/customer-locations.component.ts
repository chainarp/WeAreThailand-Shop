import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { CookieService } from '../../../lib/service/cookie.service';

import { Cookie } from 'ng2-cookies';
import { MatSnackBar } from '@angular/material';

import { SharingDataServiceProvider } from '../../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationServiceProvider } from '../customer-location-service/customer-location-service';
import { CustomerLocationInfo } from '../../../services/app-data-model/app-data-model';

declare var google;
var pinnedLocationLatitude: number = 13.743452174912246;
var pinnedLocationLongitude: number = 100.49889832735062;

//const swal = require('sweetalert');
import swal from 'sweetalert2';

@Component({
    selector: 'app-customer-location',
    templateUrl: './customer-locations.component.html',
    styleUrls: ['./customer-locations.component.scss']
})
export class CustomerLocationsComponent implements OnInit {

    @ViewChild('map', { read: ElementRef }) mapElement: ElementRef;
    map: any;

    //@ViewChild('list') listElement: ElementRef;
    //public customerLocationInfos : Array<CustomerLocationInfo>;
    private currentCustomerLocationInfo: CustomerLocationInfo;


    public loadingState: any;
    favoriteSeason: any;

    //public items: any[] = [];
    //private rangeValue: number;

    //public 

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        public snackBar: MatSnackBar,
        private cookie: CookieService,
        public sharingDataServiceProvider: SharingDataServiceProvider,
        public customerLocationServiceProvider: CustomerLocationServiceProvider
    ) {
        //this.customerLocationInfos = Object.assign({},this.customerLocationServiceProvider.synchronizedCustomerLocationInfos);
        /*
         if (localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS) != null) {
             console.log("localStorage.getItem('"+CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS+"') != null");
             this.customerLocationInfos = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
         }
        */
 
         //console.log("CustomerLocationListPage.constructor(...)  this.sharingDataServiceProvider.getCustomerLocationItemChecked()=" + JSON.stringify(this.sharingDataServiceProvider.getCustomerLocationItemChecked()));
         
        //this.currentCustomerLocationInfo = this.currentLocationServiceProvider.currentCustomerLocationInfo;
        //this.sharingDataServiceProvider.getCustomerLocationItemChecked();
        //this.rangeValue = this.sharingDataServiceProvider.getRadius();

    }

    private isNgAfterViewInited: boolean = false;
    ngAfterViewInit() {
        this.isNgAfterViewInited = true;
        


        this.createMap();
    }

    private createMap(): void {
    
        let customerLocation: CustomerLocationInfo = this.customerLocationServiceProvider.currentCustomerLocationInfo;//this.sharingDataServiceProvider.getCustomerLocationItemChecked();

        console.log("customerLocation.latitude=" + customerLocation.latitude + " :: customerLocation.longitude=" + customerLocation.longitude)

        if (customerLocation.latitude != null && customerLocation.longitude != null) {
            pinnedLocationLatitude = customerLocation.latitude;
            pinnedLocationLongitude = customerLocation.longitude;
        }
        //(<HTMLInputElement>document.getElementById('latlng')).value = pinnedLocationLatitude + "," + pinnedLocationLongitude;
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
        /*
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
        */
    }

    addMap(lat, long) {
        //console.log("addMap(lat,lng)...lat=" + lat + " :long=" + long);
        let latLng = new google.maps.LatLng(lat, long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();

    }

    ngOnInit() {
        /*
        this.activeRoute.params.subscribe(params => {
        });
        */
        //console.log("CustomerLocationComponent ::: items="+JSON.stringify(this.items))
        //console.log("CustomerLocationComponent :::  rangeValue="+this.rangeValue)
        //console.log("CustomerLocationComponent :::  customerLocationItemChecked="+JSON.stringify(this.customerLocationItemChecked));
    }


    // Snack Bar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    // Image Gallery
    selectImage(gallery) {
        //this.selectedImage = gallery;
        //this.productImage = gallery.images;
    }

    ////////////////////////////////////////////////////////////////////////////
    private radioCheckedId: any;
    private handleRadioCheckedIdChangeEvent(customerLocationInfo: CustomerLocationInfo): void {

        if (this.isNgAfterViewInited) {
            //console.log('CustomerLocationListPage.handleRadioCheckedIdChangeEvent(customerLocationItemChecked) >> customerLocationItemChecked=' + JSON.stringify(customerLocationItemChecked));
            //<<<<<this.customerLocationItemChecked = customerLocationItemChecked;
            //this.sharingDataServiceProvider. setCustomerLocationItemChecked(customerLocationItemChecked);
            this.customerLocationServiceProvider.selectACustomerLocationInfo(customerLocationInfo.id);
            this.addMap(customerLocationInfo.latitude, customerLocationInfo.longitude);
            //this.sharingDataServiceProvider.reloadNearByAvailableItems();
        }
    }

    private handleAddItemPressEvent(items: any[]): void {
        console.log("handleAddItemPressEvent items=" + JSON.stringify(items));
        //<<<<<this.sharingDataServiceProvider.setSharingData(items);
        this.router.navigate(['shop/addcustomerlocation']);
        //this.navCtrl.push("AddCustomerLocationPage");
        //let randomNumber: number = Math.random();
        //items.push({ id: '' + randomNumber, title: 'Thing ' + (items.length + 1), detail1: '', detail2: '', latlng: '', icon: 'book', checked: false });
    }

    private handleRemoveCheckedItemPressEvent(items: any[]): void {
        console.log("handleRemoveCheckedItemPressEvent items=" + JSON.stringify(items));
        //localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(items));
        this.customerLocationServiceProvider.synchronize();
    }

    private handleRangeChangeEvent(radius: any) {
        console.log("radius=" + radius);
        this.customerLocationServiceProvider.setRadius = radius;
        //<<<<<this.sharingDataServiceProvider.setRadius(radius);
        //this.sharingDataServiceProvider.reloadNearByAvailableItems();
    }

    private handleGotoHomeEvent() {
        this.router.navigate(['/home']);
    }
}
