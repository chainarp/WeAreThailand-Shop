import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
//import { CookieService } from '../../lib/service/cookie.service';

import * as geolocation from 'geolocation';

import { Cookie } from 'ng2-cookies';
import { MatSnackBar } from '@angular/material';

import { SharingDataServiceProvider } from '../../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationServiceProvider } from '../customer-location-service/customer-location-service';
import { CustomerLocationInfo } from '../../../services/app-data-model/app-data-model';

import * as $ from 'jquery';


//import { Component, ElementRef, ViewChild } from '@angular/core';
//import { App, IonicPage, NavController, NavParams, Item, ItemSliding } from 'ionic-angular';
//import { FormGroup, FormControl } from '@angular/forms';

//import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';

//import { SharingDataServiceProvider } from '../../../providers/sharing-data-service/sharing-data-service';


declare var google;
var pinnedLocationLatitude: number = 0.0;
var pinnedLocationLongitude: number = 0.0;

var map = null;
var marker;


var geocoder = new google.maps.Geocoder();





function createMap(mapElementNativeElement: any, latitude: number, longitude: number): void {
    //(<HTMLInputElement>document.getElementById('latlngTxtInp')).value = pinnedLocationLatitude + "," + pinnedLocationLongitude;
    //console.log("addMap(lat,lng)");
    pinnedLocationLatitude = latitude;//this.customerLocationServiceProvider.currentCustomerLocationInfo.latitude;
    pinnedLocationLongitude = longitude;//this.customerLocationServiceProvider.currentCustomerLocationInfo.longitude
    //let latLng = new google.maps.LatLng(pinnedLocationLatitude, pinnedLocationLongitude);

    let mapOptions = {
        center: new google.maps.LatLng(pinnedLocationLatitude, pinnedLocationLongitude),
        zoom: 15,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(mapElementNativeElement, mapOptions);
    addMarker();

}

function addMarker(): void {
    console.log("addMarker()");
    let marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: map.getCenter(),
        draggable: true
    });
    
    google.maps.event.addListener(marker, 'drag', function (event) {
        //(<HTMLInputElement>document.getElementById('latlngTxtInp')).innerHTML  = event.latLng.lat()+","+event.latLng.lng();
        //document.getElementById('lat').value = event.latLng.lat();
        //document.getElementById('lng').value = event.latLng.lng();
        pinnedLocationLatitude = event.latLng.lat();
        pinnedLocationLongitude = event.latLng.lng();
        /*
        var infowindow = new google.maps.InfoWindow({
            content: 'Latitude: ' + event.latLng.lat() + '<br>Longitude: ' + event.latLng.lng()
        });
        infowindow.open(this.map, marker);
        */
    });


    google.maps.event.addListener(map, 'center_changed', function (event) {

        marker.setMap(map);
        //marker.setMap()
        /*
        let marker = new google.maps.Marker({
            map: map,
            //animation: google.maps.Animation.DROP,
            position: map.getCenter(),
            draggable: false
        });
        */
        //console.log(".+")
        //(<HTMLInputElement>document.getElementById('latlngTxtInp')).value = event.latLng.lat() + "," + event.latLng.lng();
        //console.log(JSON.stringify(this.item));
        //pinnedLocation = event.latLng.lat() + "," + event.latLng.lng();
        pinnedLocationLatitude = map.getCenter().lat();//event.latLng.lat();
        pinnedLocationLongitude = map.getCenter().lng();//event.latLng.lng();
        //document.getElementById('lat').value =event.latLng.lat();
        //document.getElementById('lng').value =event.latLng.lng();

        marker.position = map.getCenter();
        /* <<<
        var infowindow = new google.maps.InfoWindow({
            content: 'Latitude: ' + map.getCenter().lat() + '<br>Longitude:' + map.getCenter().lng()
        });
        marker.position = map.getCenter();
        infowindow.open(map, marker);

        */
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
        content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
    });

    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
        //do something onclick
        .click(function () {
            console.log("#");
            var that = $(this);
            if (!that.data('win')) {
                that.data('win', new google.maps.InfoWindow({
                    content: 'this is the center'
                }));
                that.data('win').bindTo('position', map, 'center');
            }
            that.data('win').open(map);
        });
}

//@IonicPage()
@Component({
    selector: 'page-addcustomerlocation',
    templateUrl: './add-customer-location.component.html',
    styleUrls: ['./add-customer-location.component.scss']
})

export class AddCustomerLocationComponent {

    //private currentCustomerLocationInfo : CustomerLocationInfo;
    public customerLocationInfo: CustomerLocationInfo = new CustomerLocationInfo();

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    //map : any;
    //marker : any;


    //@ViewChild('mapcanvas') mapCanvasElement: ElementRef;
    //mapCanvas : any;
    //private options: GeolocationOptions;


    constructor(
        private router: Router,
        //9private sharingDataServiceProvider: SharingDataServiceProvider,
        private customerLocationServiceProvider: CustomerLocationServiceProvider,
    ) {
        console.log('AddCustomerLocationPage.constructor(Router,SharingDataServiceProvider)');

        //this.currentCustomerLocationInfo = this.customerLocationServiceProvider.currentCustomerLocationInfo;
        //Object.assign({}, this.sharingDataServiceProvider.getCustomerLocationItemChecked());
        //this.customerLocationItem.id = Math.random();
        //this.getUserPosition();

    }

    public get latLng(): string {
        this.customerLocationInfo.latitude = pinnedLocationLatitude;
        this.customerLocationInfo.longitude = pinnedLocationLongitude;
        return this.customerLocationInfo.latitude + "," + this.customerLocationInfo.longitude;
    }

    public set latLng(latLng: string) {
        this.customerLocationInfo.latitude = Number.parseFloat(latLng.split(",")[0].trim());
        this.customerLocationInfo.longitude = Number.parseFloat(latLng.split(",")[1].trim());
    }
    /*
    private async getUserPosition() {
        console.log("AddCustomerLocationPage.getUserPosition()");

        await this.readGeoLocation().then((position) => {
            pinnedLocationLatitude = position.coords.latitude;
            pinnedLocationLongitude = position.coords.longitude;
            //this.createMap();
        }).catch((err) => {
            console.log("AddCustomerLocationPage:getUserPosition()... Error : " + err.message);
            pinnedLocationLatitude = this.customerLocationItem.latitude;
            pinnedLocationLongitude = this.customerLocationItem.longitude;
            //this.createMap();
        });
    }

    private readGeoLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            geolocation.getCurrentPosition(function (err, position) {
                if (err) {
                    reject(err);
                }
                resolve(position);
            });

        })
    }
    */
    /*
        private createMap(latitude:number,longitude:number): void {
            //(<HTMLInputElement>document.getElementById('latlngTxtInp')).value = pinnedLocationLatitude + "," + pinnedLocationLongitude;
            //console.log("addMap(lat,lng)");
            pinnedLocationLatitude = latitude;//this.customerLocationServiceProvider.currentCustomerLocationInfo.latitude;
            pinnedLocationLongitude = longitude;//this.customerLocationServiceProvider.currentCustomerLocationInfo.longitude
            let latLng = new google.maps.LatLng(pinnedLocationLatitude, pinnedLocationLongitude);
    
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
    
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker();
        }
    */
    /*
    addMap(lat, long) {
        console.log("addMap(lat,lng)");
        let latLng = new google.maps.LatLng(lat, long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();

    }
    */
    /*
    private addMarker(): void {
        console.log("addMarker()");
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter(),
            draggable: true
        });
        /*
        google.maps.event.addListener(marker, 'drag', function (event) {
            //(<HTMLInputElement>document.getElementById('latlngTxtInp')).innerHTML  = event.latLng.lat()+","+event.latLng.lng();
            //document.getElementById('lat').value = event.latLng.lat();
            //document.getElementById('lng').value = event.latLng.lng();
            var infowindow = new google.maps.InfoWindow({
                content: 'Latitude: ' + event.latLng.lat() + '<br>Longitude: ' + event.latLng.lng()
            });
            infowindow.open(this.map, marker);
        });
        * /

        google.maps.event.addListener(marker, 'dragend', function (event) {
            //(<HTMLInputElement>document.getElementById('latlngTxtInp')).value = event.latLng.lat() + "," + event.latLng.lng();
            //console.log(JSON.stringify(this.item));
            //pinnedLocation = event.latLng.lat() + "," + event.latLng.lng();
            pinnedLocationLatitude = event.latLng.lat();
            pinnedLocationLongitude = event.latLng.lng();
            //document.getElementById('lat').value =event.latLng.lat();
            //document.getElementById('lng').value =event.latLng.lng();
            var infowindow = new google.maps.InfoWindow({
                content: 'Latitude: ' + event.latLng.lat() + '<br>Longitude:' + event.latLng.lng()
            });
            infowindow.open(this.map, marker);
        });

        let content = "<p>This is your current position !</p>";
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }
    */

    /*
    private gotoOKPress(): void {
        let items: any[] = [];
        this.blankCustomerLocationItem.latitude = pinnedLocationLatitude;
        this.blankCustomerLocationItem.longitude = pinnedLocationLongitude;
        console.log(JSON.stringify(this.blankCustomerLocationItem));
        if (localStorage.getItem("CustomerLocations") != null) {
            console.log("localStorage.getItem(\"CustomerLocations\") != null");
            items = JSON.parse(localStorage.getItem("CustomerLocations"));
        }
        items.push(this.blankCustomerLocationItem);
        localStorage.setItem("CustomerLocations", JSON.stringify(items));

        //this.navCtrl.push("CustomerLocationListPage");
    }
    */
    public onSubmit(form): void {

        this.customerLocationInfo.latitude = pinnedLocationLatitude;
        this.customerLocationInfo.longitude = pinnedLocationLongitude;
        this.customerLocationInfo.radius = 20;

        this.customerLocationServiceProvider.addNew(this.customerLocationInfo);

        this.router.navigate(['shop/customerlocation']);
    }



    ngAfterViewInit() {
        //this.isNgAfterViewInited = true;
        createMap(this.mapElement.nativeElement, this.customerLocationServiceProvider.currentCustomerLocationInfo.latitude,
            this.customerLocationServiceProvider.currentCustomerLocationInfo.longitude);
    }


    /*
    private createMap(): void {
        //(<HTMLInputElement>document.getElementById('latlngTxtInp')).value = pinnedLocationLatitude + "," + pinnedLocationLongitude;
        console.log("addMap(lat,lng)");
        let latLng = new google.maps.LatLng(pinnedLocationLatitude, pinnedLocationLongitude);
        /*
        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();
        * /

        console.log("in initMap")
        let mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
        map = new google.maps.Map(this.map.nativeElement, mapOptions);
        if (map == null) {
            alert("map==null");
        }
        google.maps.event.addListener(map, 'center_changed', function () {
            (<HTMLInputElement>document.getElementById('default_latitude')).value = map.getCenter().lat();
            (<HTMLInputElement>document.getElementById('default_longitude')).value = map.getCenter().lng();
            //document.getElementById('default_latitude').value = map.getCenter().lat();
            //document.getElementById('default_longitude').value = map.getCenter().lng();
        });


        $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
            //do something onclick
            .click(function () {
                var that = $(this);
                if (!that.data('win')) {
                    that.data('win', new google.maps.InfoWindow({
                        content: 'this is the center'
                    }));
                    that.data('win').bindTo('position', this.map, 'center');
                }
                that.data('win').open(this.map);
            });
        /*
        document.getElementById('submit').addEventListener('click', function () {
            geocodeAddress(geocoder, map);
          });
        * /
    }
    */
    /*
     public showlocation(): void {
         //alert('Hello World');
         //initMap();
         //google.maps.event.addDomListener(window, 'load', initMap;
         if ("geolocation" in navigator) {
             /* geolocation is available * /
             // One-shot position request.
             navigator.geolocation.getCurrentPosition(callback, error);
         } else {
             /* geolocation IS NOT available * /
             console.warn("geolocation IS NOT available");
         }
 
 
         function error(err) {
             console.warn('ERROR(' + err.code + '): ' + err.message);
         };
 
         function callback(position) {
             console.log("in callback(position)")
             var lat = position.coords.latitude;
             var lon = position.coords.longitude;
             (<HTMLInputElement>document.getElementById('default_latitude')).value = lat;
             (<HTMLInputElement>document.getElementById('default_longitude')).value = lon;
             //document.getElementById('default_latitude').value = lat;
             //document.getElementById('default_longitude').value = lon;
             var latLong = new google.maps.LatLng(lat, lon);
             map.setZoom(16);
             map.setCenter(latLong);
         }
 
         function initMap() {
             console.log("in initMap")
             var mapOptions = {
                 center: new google.maps.LatLng(0, 0),
                 zoom: 1,
                 mapTypeId: google.maps.MapTypeId.ROADMAP
             };
             //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
             //map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
             this.map = new google.maps.Map(this.mapCanvasElement.nativeElement, mapOptions);
             if (this.map == null) {
                 alert("map==null");
             }
             google.maps.event.addListener(this.map, 'center_changed', function () {
                 (<HTMLInputElement>document.getElementById('default_latitude')).value = this.map.getCenter().lat();
                 (<HTMLInputElement>document.getElementById('default_longitude')).value = this.map.getCenter().lng();
                 //document.getElementById('default_latitude').value = map.getCenter().lat();
                 //document.getElementById('default_longitude').value = map.getCenter().lng();
             });
 
             $('<div/>').addClass('centerMarker').appendTo(this.map.getDiv())
                 //do something onclick
                 .click(function () {
                     var that = $(this);
                     if (!that.data('win')) {
                         that.data('win', new google.maps.InfoWindow({
                             content: 'this is the center'
                         }));
                         that.data('win').bindTo('position', this.map, 'center');
                     }
                     that.data('win').open(this.map);
                 });
 
         }
 
 
 
     }
     */
    public onBlurMethod(event): void {
        //alert(JSON.stringify(event))
        this.runGeocodeAddress(this.mapElement.nativeElement, event);
    }

    public runGeocodeAddress(mapElementNativeElement: any, placeToSearch: string): void {
        var geocoder = new google.maps.Geocoder();
        //var placeToSearch = (<HTMLInputElement>document.getElementById('placeToSearch')).value;
        geocoder.geocode({
            'address': placeToSearch
        }, function (results, status) {
            console.log("status = " + status);
            console.log("results[0].geometry.location=" + results[0].geometry.location);
            console.log("results[0].geometry.location.lat=" + results[0].geometry.location.lat());
            console.log("results[0].geometry.location.lng=" + results[0].geometry.location.lng());
            console.log("results[0].geometry=" + JSON.stringify(results[0].geometry));
            if (status === 'OK') {
                createMap(mapElementNativeElement, results[0].geometry.location.lat(), results[0].geometry.location.lng());
                //this.map.setCenter(results[0].geometry.location);
                //       var marker = new google.maps.Marker({
                //         map: resultsMap,
                //         position: results[0].geometry.location
                //       });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });



    }

}