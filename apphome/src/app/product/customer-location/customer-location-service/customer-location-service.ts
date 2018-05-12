import { Injectable } from '@angular/core';
//import { RESTClientService } from '../restclient/restclient.service';
import { CustomerLocationInfo } from '../../../services/app-data-model/app-data-model';
import * as geolocation from 'geolocation';
import * as _ from 'lodash';

import swal from 'sweetalert2';

declare var google;

var getGeocodeFromGoogleMap = function (nearByAddress: string): Promise<any> {
    let geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({
            'address': nearByAddress
        }, function (results, status) {
            if (status === 'OK') {
                let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
                customerLocationInfos[0].latitude = results[0].geometry.location.lat();
                customerLocationInfos[0].longitude = results[0].geometry.location.lng();
                customerLocationInfos[0].location = nearByAddress;
                customerLocationInfos[0].timestamp = new Date().getTime();
                localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
                //resolve({ location: { latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng() } })
                resolve("SUCCESS:GET_GEO_CODE_FROM_GOOGLE_MAP_DONE");
            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
                console.log("Google Map หา '" + nearByAddress + "' ไม่สำเร็จ (" + status + ")");
                reject("Google Map หา '" + nearByAddress + "' ไม่สำเร็จ (" + status + ")");
            }
        });
    });
}


var readGeoLocationToCurrentLocation = function (): Promise<any> {
    return new Promise((resolve, reject) => {
        /*
        console.log("navigator.geolocation="+navigator.geolocation);
        if (navigator.geolocation) {
            reject("ERROR:BROWSER DOES NOT SUPPORT");
        }
        */
        /*
        setTimeout(() => {
            reject("ERROR:TIMEOUT");
        }, 30000);
        */


        geolocation.getCurrentPosition(function (err, position) {
            if (err) {
                console.log("XXXXXXXXXXXXXXXXXXXX" + JSON.stringify(err));
                reject("ERROR:geolocation.getCurrentPosition(...)");
                return;
            }
            /*
            if (position === 'undefined') {
                reject("ERROR:geolocation.getCurrentPosition(...):position==null")
            } else { */
            //console.log(position)
            let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
            customerLocationInfos[0].latitude = position.coords.latitude;
            customerLocationInfos[0].longitude = position.coords.longitude;
            customerLocationInfos[0].location = "SEE_MAP";
            customerLocationInfos[0].timestamp = new Date().getTime();
            console.log("new record =" + new Date(customerLocationInfos[0].timestamp).toLocaleString());
            //items[0].radius = 100000000;
            //console.log("SharingDataServiceProvider.readGeoLocationToCurrentLocation() >>> customerLocationInfos[0].latitude=" + customerLocationInfos[0].latitude + "::::customerLocationInfos[0].longitude" + customerLocationInfos[0].longitude);
            localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
            //this.customerLocationInfos = <Array<CustomerLocationInfo>> JSON.parse(localStorage.getItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
            resolve("SUCCESS:READ_GEO_LOCATION_DONE");
            //}
        });

    })
}
/*
อ่านก่อน แล้วจะเข้าใจง่ายขึ้นครับ 
หน้าที่ของ service ตัวนี้ คือ หาที่อยู่ ปัจจุบันให้กับ app โดยจะหาได้จาก เรียงตามลำดับดังต่อไปนี้
1. ถ้า User เค้าสร้าง Customer Location และเลือกเอาไว้ แล้วให้ Selected Customer Location ใช้งานก่อน
2. ถ้า Customer Location เป็นค่า Default อยู่ที Current Location (หรือถ้าไม่ได้เลือก ก็เลือกให้เป็น Default) ค่าจะ
2.1 หาค่าจาก geolocation โดยหาค่า  โดยมี Timeout  หากไม่ได้ค่าไม่ว่าเหตุผลใดก็ตาม ให้หาค่าจาก
2.2 หาค่าจาก ให้ User Search ถ้า User ไม่ยอม search อีก  จะเอาจากค่า current location เดิม
2.3 ค่า current location จะมีค่า initial อยู่ที่ หน้าโรงเรียนสวนกุหลาบวิทยาลัย
3. ค่าทุกค่า function ทุกอันจะต้องอยู่ใน service นี้

ต้อง guarantee ว่า ต้องได้ center ให้ app ไม่ว่าจะเกิดอะไรขึ้น
*/



/*
  Generated class for the SharingDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()



export class CustomerLocationServiceProvider {

    public static LOCATION_UPDATING_REQUIRED: boolean = true;
    public static LOCATION_UPDATING_NOT_REQUIRED: boolean = false;

    public static CUSTOMER_LOCATION_INFOS: string = "CustomerLocationInfos";
    public static CURRECT_LOCATION_EXPIRE_TIME: number = 30 * 1000; // 10 นาที

    public static INITIAL_RADIOUS: number = 20;

    //private selectedCustomerLocationInfo : CustomerLocationInfo;
    private customerLocationInfos: Array<CustomerLocationInfo> = new Array<CustomerLocationInfo>();
    private isItInitialed: boolean = false;

    constructor() {
        console.log("CurrentLocationServiceProvider.constructor()............................................................");
        this.initialCustomerLocationLocalStorage();
    }

    private initialCustomerLocationLocalStorage(): void {
        this.synchronize();
    }
    /*
    ในการ initial customer location local storage นี้คือการเตรียมข้อมูล data table ของ customer location ที่ถูกจัดเก็บไว้ขึ้นมาให้พร้อมใช้งาน โดย 
    1.) เมื่อดึงข้อมูลขึ้นมา แล้ว พบว่ายังไม่มีข้อมูลใดๆอยู่ ให้ทำการ ใส่ข้อมูล DEFAULT ให้แล้ว save ลง storage ด้วยและใช้ใน memory รูปของ static arrayด้วย


    */

    /*
    public id: string;
    public title: string;
    public location: string;
    public messageToDriver: string;
    public receiverPhone : number;
    public latitude: number; //13.74349185255942, 
    public longitude: number; //100.49879542518465, 
    public currentRadius: number; //
    public icon: string = "pin";
    public checked: boolean = false;
  
    */

    //let isForceToSetNewValue: boolean = false;




    //ถ้ายังไม่มี CustomerLocations ฝังใน localStorage ให้ add เข้าไปใหม่เลย
    /*
    if (localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS) == null || isForceToSetNewValue) {
        let customersLocations: Array<CustomerLocationInfo> =
            [{ id: 0, title: "ที่อยู่ปัจจุบัน", location: "SEE_MAP", messageToDriver: "SEE_PO", receiverPhone: "BUYER_PHONE", latitude: 13.74349185255942, longitude: 100.49879542518465, timestamp: new Date().getDate(), radius: 100, icon: "my_location", isCurrent: true }];
        localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customersLocations));
    }
    */
    //this.customerLocationInfos = JSON.parse(localStorage.getItem("CustomerLocationInfos"));

    //ตอนนี้มั่นใจแล้ว ว่ามี CustomerLocations ฝั่งไว้แล้ว ดังนั้น UPDATE CURRENT LOCATION ใหม่ตามที่อยู่ใหม่แล้วก็ฝังเก็บไว้ที่เดิม
    //await this.readGeoLocationToCurrentLocation();

    //หาตัวที่ Checked ที่ฝังไว้ ถ้ามีดูว่ามี Id == 0 หรือเปล่า ถ้าใช่ UPDATE LOCATION ใหม่ไปด้วย ถ้าไม่ใช่ไม่ต้อง
    //ถ้าไม่มี ให้เอา index == 0 ลงไปเป็น default

    /*
    if (localStorage.getItem("CustomerLocationItemChecked") != null) {
        //console.log("localStorage.getItem(\"CustomerLocationItemChecked\")" + localStorage.getItem("CustomerLocationItemChecked"));
        this.customerLocationItemChecked = <CustomerLocationInfo>JSON.parse(localStorage.getItem("CustomerLocationItemChecked"));
        if (this.customerLocationItemChecked.id == 0) {
            this.customerLocationItemChecked = (<Array<CustomerLocationInfo>>JSON.parse(localStorage.getItem("CustomerLocations")))[0];
        }
    } else {
        localStorage.setItem("CustomerLocationItemChecked", JSON.stringify((<Array<CustomerLocationInfo>>JSON.parse(localStorage.getItem("CustomerLocations")))[0]));
        this.customerLocationItemChecked = <CustomerLocationInfo>JSON.parse(localStorage.getItem("CustomerLocationItemChecked"));
    }

    if (localStorage.getItem("Radius") != null) {
        this.radius = Number.parseInt(localStorage.getItem("Radius"));
    } else {
        this.radius = (<CustomerLocationInfo>customersLocations[0]).radius;
        localStorage.setItem("Radius", this.radius.toString());
    }
    */


    /*
    methed นี้ เอาไว้ใช้ sync ระหว่าง data model ใน mem กับใน disk 
    ออกแบบมาให้ เรียกใช้ ได้ทุกเมื่อที่ต้องการ หลังจากเรียกต้องมั่นใจกว่า ข้อมูลที่ update ใหม่กว่า จะต้องยังอยู่เสมอตลอดไป
    1. เริ่มจาก initial ตอนนั้น ข้อมูลอยู่ใน disk ไม่มีใน mem ต้อง load มาก่อน
    2. ระหว่างที่ run app จะมีการ insert delete update ข้อมูลจาก app จะมากระทำที่ mem แล้วไปจัดเก็บถาวรไว้ใน disk
       แต่ในการ จัดการข้อมูล ไม่ต้องการให้ ref ของ data model เปลี่ยนไป  เพื่อจะ guarantee ว่าจะมี data model ตัวเดียวใน mem


    */
    public synchronize(): void {
        let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
        if (!this.isItInitialed) { //block ของการ initial 

            let isForceToSetNewValue: boolean = false;

            //data model ใน memory ซึ่งไม่น่าจะมีทางเป็น null แต่กัน

            if (customerLocationInfos == null || isForceToSetNewValue) {
                customerLocationInfos =
                    [{ id: 0, title: "ที่อยู่ปัจจุบัน", location: "SEE_MAP", messageToDriver: "SEE_PO", receiverPhone: "BUYER_PHONE", latitude: 13.74349185255942, longitude: 100.49879542518465, timestamp: new Date().getDate(), radius: 20, icon: "my_location", isCurrent: true }];
                localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
            }
            this.isItInitialed = true;
        }
        if (this.customerLocationInfos.length == 0 && customerLocationInfos.length > 0) {
            for (let i = 0; i < customerLocationInfos.length; i++) {
                this.customerLocationInfos.push(customerLocationInfos[i]);
            }
        } else {
            //console.log("CustomerLocationServiceProvider.synchronize()..." + JSON.stringify(this.customerLocationInfos));
            for (let i: number = 0; i < this.customerLocationInfos.length; i++) {
                this.customerLocationInfos[i].id = i;

            }
            if (this.customerLocationInfos[0].timestamp < customerLocationInfos[0].timestamp) {
                this.customerLocationInfos[0] = customerLocationInfos[0];
            }
            //console.log("CustomerLocationServiceProvider.synchronize()..." + JSON.stringify(this.customerLocationInfos));
            localStorage.setItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(this.customerLocationInfos));
        }

    }

    get synchronizedCustomerLocationInfos(): Array<CustomerLocationInfo> {
        this.synchronize();
        return this.customerLocationInfos;
    }

    get currentCustomerLocationInfo(): CustomerLocationInfo {

        return this.customerLocationInfos.find(element => {
            return element.isCurrent == true;
        });

    }

    get currentRadius(): number {
        //return 30;

        return this.customerLocationInfos.find(element => {
            return element.isCurrent == true;
        }).radius;

    }

    set setRadius(radius: number) {
        this.currentCustomerLocationInfo.radius = radius;
        this.synchronize();
    }

    public addNew(customerLocationInfo: CustomerLocationInfo): void {
        //let items: any[] = [];
        //this.customerLocationInfo.latitude = pinnedLocationLatitude;
        //this.customerLocationInfo.longitude = pinnedLocationLongitude;
        customerLocationInfo.id = this.customerLocationInfos.length;
        customerLocationInfo.radius = customerLocationInfo.radius == -1 ? CustomerLocationServiceProvider.INITIAL_RADIOUS : customerLocationInfo.radius;
        customerLocationInfo.timestamp = new Date().getTime();
        this.customerLocationInfos.push(customerLocationInfo);
        this.selectACustomerLocationInfo(customerLocationInfo.id);
        //this.synchronize();
    }

    public selectACustomerLocationInfo(selectCstomerLocationInfoId: number): void {
        for (let i: number = 0; i < this.customerLocationInfos.length; i++) {
            if (i == selectCstomerLocationInfoId) {
                this.customerLocationInfos[i].isCurrent = true;
            } else {
                this.customerLocationInfos[i].isCurrent = false;
            }
        }
        this.synchronize();
    }

    public recursiveGetCurrentLocation(isUpdatingForced: boolean): Promise<any> {
        console.log("recursiveGetCurrentLocation.this.customerLocationInfos=" + JSON.stringify(this.customerLocationInfos));
        return new Promise((resolve, reject) => {
            this.getCurrentCustomerLocationInfo(isUpdatingForced).then((value) => {
                //this.customerLocationInfos = <Array<CustomerLocationInfo>>JSON.parse(localStorage.getItem("CustomerLocationInfos"));
                //console.log(">>>>>>>>>>> this.customerLocationInfos"+JSON.stringify(this.customerLocationInfos));
                //resolve(this.customerLocationInfos[0]);
                //console.log(">>>>>>>>>>> this.customerLocationInfos[0]"+JSON.stringify(value));
                console.log("DFLKDSJFLD435793457934 value=" + JSON.stringify(value))
                resolve(value);
                //return;
            }).catch((error) => {
                console.log("ERERERERERE" + JSON.stringify(error));
                return this.recursiveGetCurrentLocation(isUpdatingForced);
            });

        });
    }

    private async getCurrentCustomerLocationInfo(isUpdatingForced: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            /*
            public geocodeAddress(): void {
                this.runGeocodeAddress(this.mapElement.nativeElement);
            }
            public runGeocodeAddress(mapElementNativeElement: any): void {
                var geocoder = new google.maps.Geocoder();
                var placeToSearch = (<HTMLInputElement>document.getElementById('placeToSearch')).value;
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
            */



            let customerLocationInfo: CustomerLocationInfo = this.customerLocationInfos.find(element => {
                return element.isCurrent == true;
            });

            if (customerLocationInfo != null && customerLocationInfo.id > 0) {

                //return new Promise((resolve, reject) => {
                resolve(customerLocationInfo);
                //});
            }

            /*
            console.log(">>>>>>>><<<>>><><><>>><>>>> customerLocationInfo"+JSON.stringify(customerLocationInfo));
            if (customerLocationInfo.id != 0) {
                return new Promise((resolve) => { resolve(customerLocationInfo) });
            }
            console.log("now =" + new Date(new Date().getTime()).toLocaleString());
            console.log("record =" + new Date(customerLocationInfo.timestamp).toLocaleString());
            console.log(((new Date()).getTime()) + "-" + customerLocationInfo.timestamp + "=" + (((new Date()).getTime()) - customerLocationInfo.timestamp) + " > " + CustomerLocationServiceProvider.CURRECT_LOCATION_EXPIRE_TIME);
            */
            let isCurrentLocationExpired: boolean = false;
            if (((new Date()).getTime()) - customerLocationInfo.timestamp > CustomerLocationServiceProvider.CURRECT_LOCATION_EXPIRE_TIME) {
                isCurrentLocationExpired = true;
            }


            //console.log("isCurrentLocationExpired=" + isCurrentLocationExpired + " :: isUpdatingForced=" + isUpdatingForced);
            if (customerLocationInfo.id == 0 && (isCurrentLocationExpired || isUpdatingForced)) {
                //return new Promise((resolve, reject) => {
                readGeoLocationToCurrentLocation().then((value) => {
                    //return new Promise((resolve, reject) => {

                    if ((<string>value).indexOf("SUCCESS") == 0) {

                        console.log("<><<><><<>><>><>><>><<><><><> SUCCESS")
                        //let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));

                        resolve(JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS))[0]);
                        //return (value);
                        //return this.customerLocationInfos[0];
                        //this.synchronize();
                        //resolve(this.customerLocationInfos[0]);
                        //return new Promise(resolve => resolve(this.customerLocationInfos[0])) ;
                        /*
                        return new Promise((resolve,reject) => {
                            console.log("XDKJFL:SF"+JSON.stringify(this.customerLocationInfos[0]));
                            //resolve(this.customerLocationInfos[0]);
                            //return;
                            //resolve("XXXXSSSS");
                            return this.customerLocationInfos[0] ;
                        });
                        */
                        /*
                        return new Promise((resolve) => {
                            this.customerLocationInfos = <Array<CustomerLocationInfo>> JSON.parse(localStorage.getItem("CustomerLocationInfos"));
                            //console.log(">>>>>>>>>>> this.customerLocationInfos"+JSON.stringify(this.customerLocationInfos));
                            resolve(this.customerLocationInfos[0]);
                        });
                        */

                    }
                    // });
                }).catch((error) => {
                    //console.log("DFDSFJLDKFJD DSJFLD LDSKFJDS " + JSON.stringify(error));
                    if ((<string>error).indexOf("ERROR") == 0) {
                        //return new Promise((resolve, reject) => {
                        //reject("XXX");
                        //swal("แย่จัง !?","เรายังไม่ได้ ที่อยู่ปัจจุบันของคุณเลย","info");
                        swal({
                            title: 'ที่อยู่ปัจจุบันจำเป็นในการใช้งาน',
                            text: "โปรดบอกเราหน่อยว่า ตอนนี้คุณอยู่ที่ไหน !?",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'ขอตำแหน่งจากเน็ต',
                            cancelButtonText: 'ค้นหาจากแผนที่',
                            confirmButtonClass: 'btn btn-success',
                            cancelButtonClass: 'btn btn-danger',
                            buttonsStyling: false,
                            allowOutsideClick: () => swal.isLoading()
                        }).then(function (isConfirm) {
                            console.log("XXXXXXXXXXXXXXXXXYYYYYYYYY" + JSON.stringify(isConfirm));
                            if (isConfirm.value === true) {
                                //this.getCurrentCustomerLocationInfo();
                                /*
                                swal(
                                    'โปรดอนุญาต ให้เราทราบที่อยู่ปัจจุบัน!',
                                    'โดยการปรับแต่ง Browser ให้ส่งข้อมูลสถานที่ปัจจุบันให้เรา',
                                    'info'
                                );
                                */
                                swal({
                                    title: 'โปรดอนุญาต ให้เราทราบที่อยู่ปัจจุบันของคุณ!',
                                    text: "โดยการปรับแต่ง Browser (Unblock) ให้ส่งข้อมูลสถานที่ปัจจุบันให้เรา",
                                    type: 'info',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    //cancelButtonColor: '#d33',
                                    confirmButtonText: 'ลองดูก่อน ใช้งานได้หรือยัง ?'
                                }).then(function (isConfirm) {
                                    if (isConfirm) {
                                        readGeoLocationToCurrentLocation().then((value) => {
                                            resolve(JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS))[0]);
                                            //resolve(value);

                                        }).catch((error) => {
                                            console.log("EEEEEEEE " + JSON.stringify(error));
                                            reject(error);
                                        });
                                        /*
                                        geolocation.getCurrentPosition(function (err, position) {
                                            if (err) {
                                                console.log("XXXXXXXXXXXXXXXXXXXX" + JSON.stringify(err));
                                                reject("ERROR:geolocation.getCurrentPosition(...)");
                                                return;
                                            }
                                            if (position === 'undefined') {
                                                reject("ERROR:geolocation.getCurrentPosition(...):position==null")
                                            } else {
                                                //console.log(position)
                                                let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
                                                customerLocationInfos[0].latitude = position.coords.latitude;
                                                customerLocationInfos[0].longitude = position.coords.longitude;
                                                customerLocationInfos[0].timestamp = new Date().getTime();
                                                //items[0].radius = 100000000;
                                                //console.log("SharingDataServiceProvider.readGeoLocationToCurrentLocation() >>> customerLocationInfos[0].latitude=" + customerLocationInfos[0].latitude + "::::customerLocationInfos[0].longitude" + customerLocationInfos[0].longitude);
                                                localStorage.setItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
 
                                                resolve("SUCCESS:READ_GEO_LOCATION_DONE");
                                            }
                                        });
                                        */
                                        /*
                                        swal(
                                          'Deleted!',
                                          'Your file has been deleted.',
                                          'success'
                                        );
                                        */
                                    }
                                })
                                //reject("XXX");
                                /*
                                geolocation.getCurrentPosition(function (err, position) {
                                    if (err) {
                                        console.log("XXXXXXXXXXXXXXXXXXXX" + JSON.stringify(err));
                                        reject("ERROR:geolocation.getCurrentPosition(...)");
                                        return;
                                    }
                                    if (position === 'undefined') {
                                        reject("ERROR:geolocation.getCurrentPosition(...):position==null")
                                    } else {
                                        //console.log(position)
                                        let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
                                        customerLocationInfos[0].latitude = position.coords.latitude;
                                        customerLocationInfos[0].longitude = position.coords.longitude;
                                        //items[0].radius = 100000000;
                                        //console.log("SharingDataServiceProvider.readGeoLocationToCurrentLocation() >>> customerLocationInfos[0].latitude=" + customerLocationInfos[0].latitude + "::::customerLocationInfos[0].longitude" + customerLocationInfos[0].longitude);
                                        localStorage.setItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
 
                                        resolve("SUCCESS:READ_GEO_LOCATION_DONE");
                                    }
                                });
                                */
                            } else if (isConfirm.dismiss.toString() === "cancel") {
                                swal({
                                    title: 'เขียนบอกเราหน่อยคุณอยู่ไหนตอนนี้',
                                    input: 'text',
                                    showCancelButton: true,
                                    confirmButtonText: 'หาดูเลยเจอมั๊ย',
                                    showLoaderOnConfirm: true,
                                    /*
                                    preConfirm: (login) => {
                                        return fetch(`//api.github.com/users/${login}`)
                                            .then(response => response.json())
                                            .catch(error => {
                                                swal.showValidationError(
                                                    `Request failed: ${error}`
                                                )
                                            })
                                    },
                                    */
                                    preConfirm: (nearByAddress: string) => {
                                        return new Promise((resolve, reject) => {
                                            getGeocodeFromGoogleMap(nearByAddress).then((value) => {
                                                console.log("value=" + JSON.stringify(value));
                                                //this.synchronize();
                                                //resolve(this.customerLocationInfos[0]);
                                                //return;
                                                resolve('OK');
                                            }).catch((error) => {
                                                console.log("error=" + error);
                                                //swal.showValidationError("ผลการค้นหา:" + error);
                                                swal({
                                                    title: 'ไม่พบ',
                                                    text: "ผลการค้นหา:" + error,
                                                    //imageUrl: result.value.avatar_url
                                                    confirmButtonText: 'ลองใหม่',
                                                    showCancelButton: false,
                                                }).then(function (isConfirm) {
                                                    if (isConfirm) {
                                                        reject("REJECT");
                                                    }

                                                });

                                            });

                                        });
                                    },
                                    allowOutsideClick: () => swal.isLoading()
                                }).then((result) => {
                                    console.log("XXXXXXXXXXXXXXX TTTTTTTT result=" + JSON.stringify(result));
                                    //if (result.value) {
                                    //    console.log("result.value=" + JSON.stringify(result.value));
                                    //}
                                    if (result.dismiss) {
                                        reject("CANCEL");
                                        /*
                                        swal({
                                            title: `${result.value.location}'s avatar`,
                                            //imageUrl: result.value.avatar_url
                                        })*/
                                    }
                                    
                                    if (result.value) {
                                        let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CustomerLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
                                        swal({
                                            title: 'ที่อยู่ปัจจุบันของคุณคือ ' + customerLocationInfos[0].location,
                                            showCancelButton: false,
                                            confirmButtonText: 'รับทราบ',
                                            //imageUrl: result.value.avatar_url
                                        }).then(function (isConfirm) {
                                            if (isConfirm) {
                                                resolve(customerLocationInfos[0]);
                                            }

                                        });

                                        
                                    }
                                    
                                }).catch((error)=> {
                                    reject(error);
                                });
                            } else {
                                // Esc, close button or outside click
                                // isConfirm is undefined
                            }
                        })


                        //});
                    }
                });
                //});
            } else {
                console.log("return un-updated ")
                resolve(customerLocationInfo);

            }

            //}//end if

            //return customerLocationInfo;

        });

    }

}































    /*
        private nearByCallerInterfaces: Array<NearByCallerInterface> = new Array<NearByCallerInterface>();
    
        public registerNearByCaller(nearByCallerInterface: NearByCallerInterface): void {
            this.nearByCallerInterfaces.push(nearByCallerInterface);
            console.log("this.nearByCallerInterfaces.length=" + this.nearByCallerInterfaces.length);
        }
    */

    //private customerLocationItemChecked: CustomerLocationInfo;
    //private radius: number;



    /*
         readGeoLocationToCurrentLocation = function(): Promise<any> {
            return new Promise((resolve, reject) => {
                /*
                console.log("navigator.geolocation="+navigator.geolocation);
                if (navigator.geolocation) {
                    reject("ERROR:BROWSER DOES NOT SUPPORT");
                }
                */
    /*
    setTimeout(() => {
        reject("ERROR:TIMEOUT");
    }, 30000);
    * /

    geolocation.getCurrentPosition(function (err, position) {
        if (err) {
            console.log("XXXXXXXXXXXXXXXXXXXX" + JSON.stringify(err));
            reject("ERROR:geolocation.getCurrentPosition(...)");
            return;
        }
        /*
        if (position === 'undefined') {
            reject("ERROR:geolocation.getCurrentPosition(...):position==null")
        } else { * /
        //console.log(position)
        let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
        customerLocationInfos[0].latitude = position.coords.latitude;
        customerLocationInfos[0].longitude = position.coords.longitude;
        
        customerLocationInfos[0].timestamp = new Date().getTime();
        console.log("new record =" + new Date(customerLocationInfos[0].timestamp).toLocaleString());
        //items[0].radius = 100000000;
        //console.log("SharingDataServiceProvider.readGeoLocationToCurrentLocation() >>> customerLocationInfos[0].latitude=" + customerLocationInfos[0].latitude + "::::customerLocationInfos[0].longitude" + customerLocationInfos[0].longitude);
        localStorage.setItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS, JSON.stringify(customerLocationInfos));
        //this.customerLocationInfos = <Array<CustomerLocationInfo>> JSON.parse(localStorage.getItem(CurrentLocationServiceProvider.CUSTOMER_LOCATION_INFOS));
        resolve("SUCCESS:READ_GEO_LOCATION_DONE");
        //}
    });

})
}
*/
    /*
    private readGeoLocationToCurrentLocation(): Promise<any> {
      return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(function (err, position) {
          if (err) {
            reject(err);
          }
          console.log(position)
          let items = JSON.parse(localStorage.getItem("CustomerLocations"));
          items[0].latitude = position.coords.latitude;
          items[0].longitude = position.coords.longitude;
          //items[0].radius = 100000000;
          localStorage.setItem("CustomerLocations", JSON.stringify(items));
  
          resolve("OK");
        });
  
      })
    }
    */
    /*
    
        public async refreshCurrentCustomerLocation(): Promise<any> {
            if (this.customerLocationItemChecked.id === 0) {
                await this.readGeoLocationToCurrentLocation();
            }
    
            this.customerLocationItemChecked.radius = this.radius;
            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            //let items = JSON.parse(localStorage.getItem("CustomerLocations"));
            //if (this.customerLocationItemChecked == null) {
            //  this.setCustomerLocationItemChecked(items[0]);
            //}
    
            //this.loadNearByAvailableItems();
    
        }
    
    
    
    
    
        //private customerLocationItemChecked: CustomerLocationInfo;
        public setCustomerLocationItemChecked(customerLocationItemChecked: CustomerLocationInfo): void {
            console.log("setCustomerLocationItemChecked(customerLocationItemChecked : any)" + JSON.stringify(customerLocationItemChecked));
            this.customerLocationItemChecked = customerLocationItemChecked;
            localStorage.setItem("CustomerLocationItemChecked", JSON.stringify(this.customerLocationItemChecked));
        }
        /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        public getCustomerLocationItemChecked(): CustomerLocationInfo {
          //console.log("getCustomerLocationItemChecked()");
          return this.customerLocationItemChecked;
        }
       * /
        public get currentCustomerLocationItem(): CustomerLocationInfo {
            return this.customerLocationItemChecked;
        }
    
        //private radius: number = 10;
        public setRadius(radius: number): void {
            console.log("radius=" + radius);
            this.radius = radius;
            localStorage.setItem("Radius", this.radius.toString());
        }
        public getRadius(): number {
            return this.radius;
        }
    
    */

/*
export interface NearByCallerInterface {
    handleNearByServiceUpdating(value: any): void;
}
*/