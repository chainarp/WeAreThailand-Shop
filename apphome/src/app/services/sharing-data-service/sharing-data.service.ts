import { Injectable } from '@angular/core';
import { RESTClientService } from '../restclient/restclient.service';
import { UserInfo, CustomerLocationInfo, AvailableItemInfo, SellerInfo, ProductItemInfo } from '../app-data-model/app-data-model';
import * as geolocation from 'geolocation';
import * as _ from 'lodash';




/*
  Generated class for the SharingDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharingDataServiceProvider {

  constructor(private restClientService: RESTClientService) {
    console.log('SharingDataServiceProvider.constructor()...starting');
    this.initialAppData();
    //console.log('SharingDataServiceProvider.constructor()...started this.customerLocationItemChecked=' + JSON.stringify(this.customerLocationItemChecked));
  }

  private initialAppData(): void {
    this.initialLocalStorage();
  }

  private initialLocalStorage(): void {
    this.initialCustomerLocation();
  }

  private initialCustomerLocation(): void {
    //this.checkPermission();
    //<<<<<<<<<<<<<<<<<<  this.initialCustomerLocationLocalStorage();
    ///// >>>> this.refreshCurrentCustomerLocation();
  }
  /*<<<<<<<<<<<<<<<<<<<<<<<<<<
  private initialCustomerLocationLocalStorage(): void {
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
  
    * /

    let customersLocations: Array<CustomerLocationInfo> =
      [{ "id": 0, "title": "CURRENT_LOCATION", "location": "SEE_MAP", "messageToDriver": "SEE_PO", "receiverPhone": "BUYER_PHONE", "latitude": 13.74349185255942, "longitude": 100.49879542518465, timestamp: new Date().getDate(), "radius": 100, "icon": "my_location", isCurrent: false }]

    let isForceToSetNewValue: boolean = false;

    //ถ้ายังไม่มี CustomerLocations ฝัง add เข้าไปใหม่เลย
    if (localStorage.getItem("CustomerLocations") == null || isForceToSetNewValue) {
      localStorage.setItem('CustomerLocations', JSON.stringify(customersLocations));
    }
    //ตอนนี้มั่นใจแล้ว ว่ามี CustomerLocations ฝั่งไว้แล้ว ดังนั้น UPDATE CURRENT LOCATION ใหม่ตามที่อยู่ใหม่แล้วก็ฝังเก็บไว้ที่เดิม
    //await this.readGeoLocationToCurrentLocation();

    //หาตัวที่ Checked ที่ฝังไว้ ถ้ามีดูว่ามี Id == 0 หรือเปล่า ถ้าใช่ UPDATE LOCATION ใหม่ไปด้วย ถ้าไม่ใช่ไม่ต้อง
    //ถ้าไม่มี ให้เอา index == 0 ลงไปเป็น default
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
  }
  */
  private readGeoLocationToCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition(function (err, position) {
        if (err) {
          reject(err);
        }
        console.log(position)
        let customerLocationInfos: Array<CustomerLocationInfo> = JSON.parse(localStorage.getItem("CustomerLocations"));
        customerLocationInfos[0].latitude = position.coords.latitude;
        customerLocationInfos[0].longitude = position.coords.longitude;
        //items[0].radius = 100000000;
        console.log("SharingDataServiceProvider.readGeoLocationToCurrentLocation() >>> customerLocationInfos[0].latitude=" + customerLocationInfos[0].latitude + "::::customerLocationInfos[0].longitude" + customerLocationInfos[0].longitude);
        localStorage.setItem("CustomerLocations", JSON.stringify(customerLocationInfos));

        resolve("OK");
      });

    })
  }
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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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

    this.loadNearByAvailableItems();

  }
*/
/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  private customerLocationItemChecked: CustomerLocationInfo;
  public setCustomerLocationItemChecked(customerLocationItemChecked: CustomerLocationInfo): void {
    console.log("setCustomerLocationItemChecked(customerLocationItemChecked : any)" + JSON.stringify(customerLocationItemChecked));
    this.customerLocationItemChecked = customerLocationItemChecked;
    localStorage.setItem("CustomerLocationItemChecked", JSON.stringify(this.customerLocationItemChecked));
  }
*/
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/* <<<<<<<<<<<<<<<<<<<<<<<<<<
  private getCustomerLocationItemChecked(): CustomerLocationInfo {
    //console.log("getCustomerLocationItemChecked()");
    return this.customerLocationItemChecked;
  }

  private get currentCustomerLocationItem(): CustomerLocationInfo {
    return this.customerLocationItemChecked;
  }

  */
  /* <<<<<<<<<<<<<<<<<<
  private radius: number = 10;
  public setRadius(radius: number): void {
    console.log("radius=" + radius);
    this.radius = radius;
    localStorage.setItem("Radius", this.radius.toString());
  }
  public getRadius(): number {
    return this.radius;
  }
  */
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //public nearBySellers: Array<any> = new Array<any>();
  //public allSellers: Array<any> = new Array<any>();

  /*
  public loadNearBySellers2(): void {
    this.loadAllSellers();
  }alertalert
  */

  private nearByCallerInterfaces: Array<NearByCallerInterface> = new Array<NearByCallerInterface>();

  public registerNearByCaller(nearByCallerInterface: NearByCallerInterface): void {
    this.nearByCallerInterfaces.push(nearByCallerInterface);
    console.log("this.nearByCallerInterfaces.length=" + this.nearByCallerInterfaces.length);
  }

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  public async reloadNearByAvailableItems(customerLocationInfo:CustomerLocationInfo): Promise<any> {
    //this.customerLocationItemChecked = customerLocationInfo
    //await this.refreshCurrentCustomerLocation();
    return new Promise((resolve, reject) => {
      this.loadNearByAvailableItems(customerLocationInfo).then((value) => {
        this.nearByCallerInterfaces.forEach((nearByCallerInterface) => {
          nearByCallerInterface.handleNearByServiceUpdating(value);
        });
        resolve(value);
      }).catch((error) => {
        reject("reloadNearBySellers::" + error);
      });
    });
  }
  

  private loadNearByAvailableItems(customerLocationInfo:CustomerLocationInfo): Promise<any> {
    //console.log(" XXX loadNearByAvailableItems().customerLocationItemChecked = " + JSON.stringify(this.customerLocationItemChecked));
    let nearByAvailableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
    return new Promise((resolve, reject) => {
      let functionInfo: any = {
        "functionInfo": {
          "classPathFileName": "./availableItems.service",
          "className": "AvailableItemService",
          "functionName": "findNearByAvailableItems", //"findAllAvailableItems",
          "functionArgument": customerLocationInfo//this.customerLocationItemChecked
        }
      };
      this.restClientService.findByFunction(functionInfo).then((value) => {
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>  value=" + JSON.stringify(value));
        //let availableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
        Array.from(value).forEach((element, i) => {
          //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> " + JSON.stringify(element));
          if ((<any>element).productItems == null) {
            (<any>element).productItems = new Array<any>();
          }
          Array.from((<any>element).productItems).forEach((subelement, j) => {
            let availableItem: AvailableItemInfo = Object.assign({}, <AvailableItemInfo>element);

            availableItem.productItems = null;
            availableItem.productItemKey = (<ProductItemInfo>subelement).key;
            availableItem.productItem = <ProductItemInfo>subelement;
            availableItem.key = availableItem.key + ":" + availableItem.productItemKey;
            nearByAvailableItems.push(availableItem);
            //console.log(">>>>>>>>>>" + i + "." + j + ") >> " + JSON.stringify(availableItem));
          });
        });
        resolve(nearByAvailableItems);
      }).catch((error) => {
        reject(error);
      });
    });
  }
// <<<<<<<<<<<<<<<<<<<<<<<<
  public async reloadNearByNoBreakingDownAvailableItems(customerLocationInfo:CustomerLocationInfo): Promise<any> {
    //await this.refreshCurrentCustomerLocation();
    return new Promise((resolve, reject) => {
      this.loadNearByNoBreakingDownAvailableItems(customerLocationInfo).then((value) => {
        this.nearByCallerInterfaces.forEach((nearByCallerInterface) => {
          nearByCallerInterface.handleNearByServiceUpdating(value);
        });
        resolve(value);
      }).catch((error) => {
        reject("reloadNearBySellers::" + error);
      });
    });
  }

  private loadNearByNoBreakingDownAvailableItems(customerLocationInfo:CustomerLocationInfo): Promise<any> {
    //console.log(" XXX loadNearByAvailableItems().customerLocationItemChecked = " + JSON.stringify(this.customerLocationItemChecked));
    let nearByNoBreakingDownAvailableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
    return new Promise((resolve, reject) => {
      let functionInfo: any = {
        "functionInfo": {
          "classPathFileName": "./availableItems.service",
          "className": "AvailableItemService",
          "functionName": "findNearByAvailableItems", //"findAllAvailableItems",
          "functionArgument": customerLocationInfo
        }
      };
      this.restClientService.findByFunction(functionInfo).then((value) => {
        console.log("value=" + JSON.stringify(value));
        //let availableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
        Array.from(value).forEach((element, i) => {
          //console.log(JSON.stringify(element));
          if ((<any>element).productItems == null) {
            (<any>element).productItems = new Array<any>();
          }
          /*
          Array.from((<any>element).productItems).forEach((subelement, j) => {
            let availableItem: AvailableItemInfo = Object.assign({}, <AvailableItemInfo>element);

            availableItem.productItems = null;
            availableItem.productItemKey = (<ProductItemInfo>subelement).key;
            availableItem.productItem = <ProductItemInfo>subelement;
            availableItem.key = availableItem.key + ":" + availableItem.productItemKey;
            nearByAvailableItems.push(availableItem);
            //console.log(">>>>>>>>>>" + i + "." + j + ") >> " + JSON.stringify(availableItem));
          });
          */
          nearByNoBreakingDownAvailableItems.push(<AvailableItemInfo>element);
        });
        resolve(nearByNoBreakingDownAvailableItems);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public loadAllAvailableItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      let functionInfo: any = {
        "functionInfo": {
          "classPathFileName": "./availableItems.service",
          "className": "AvailableItemService",
          "functionName": "findAllAvailableItems",
          "functionArgument": {}
        }
      };
      this.restClientService.findByFunction(functionInfo).then((value) => {
        let availableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
        Array.from(value).forEach((element, i) => {
          //console.log(JSON.stringify(element));
          if ((<any>element).productItems == null) {
            (<any>element).productItems = new Array<any>();
          }
          Array.from((<any>element).productItems).forEach((subelement, j) => {
            let availableItem: AvailableItemInfo = Object.assign({}, <AvailableItemInfo>element);

            availableItem.productItems = null;
            availableItem.productItemKey = (<ProductItemInfo>subelement).key;
            availableItem.productItem = <ProductItemInfo>subelement;
            availableItem.key = availableItem.key + ":" + availableItem.productItemKey;
            availableItems.push(availableItem);
            //console.log(">>>>>>>>>>"+i+"."+j+") >> "+JSON.stringify(availableItem));
          });
        });
        resolve(availableItems);
      }).catch((error) => {
        reject(error);
      });
    });
  }


  ///////////////////// GET SET DATA /////////////////////////
  private user: UserInfo;
  public get currentUser(): UserInfo {
    return this.user;
  }

  public setCurrentUser(user: UserInfo) {
    if (user == null) {
      throw Error("SharingDataServiceProvider.setCurrentUser(UserInfo)...user == null");
    }
    this.user = user;
    /*
    this.angularFireDatabase.list('/sellers', {
      query: {
        orderByChild: 'userKey',
        equalTo: user.key
      }
    }).subscribe((res) => {
      //console.log("categories" + JSON.stringify(res));
      //console.log("sellers" + JSON.stringify(res));
      this.sellers = res;

      this.sellers.forEach((seller) => {
        this.angularFireDatabase.object("/users/" + seller.userKey).subscribe((res) => {
          seller.user = res;
        });

      });
      console.log("SharingDataServiceProvider.setCurrentUser(UserInfo)...sellers.length=" + this.sellers.length);
    });
    */
  }


  private environments: any[] = [{ "title": "Development" }, { "title": "Testing" }, { "title": "Production" }];
  public getEnvironment(): any {
    return this.environments[0];
  }


  private sharingData: any;
  public setSharingData(sharingData: any): void {
    this.sharingData = sharingData;
  }
  public getSharingData(): any {
    let sharingData: any;
    sharingData = this.sharingData;
    this.sharingData = null;
    return sharingData;
  }



  private currentTabIndexes: any[] = new Array<any>();
  public setCurrentTabIndex(currentTabIndex: any): void {
    console.log("setCurrentTabIndex(any)...this.currentTabIndexes BEFORE =" + JSON.stringify(this.currentTabIndexes));
    let isFound: boolean = false;
    for (let i = 0; i < this.currentTabIndexes.length; i++) {
      console.log("this.currentTabIndexes[i].tabsName=" + this.currentTabIndexes[i].tabsName + "::currentTabIndex.tabsName=" + currentTabIndex.tabsName);
      if (this.currentTabIndexes[i].tabsName == currentTabIndex.tabsName) {
        isFound = true;
        this.currentTabIndexes[i].index = currentTabIndex.index;
        break;
      }

    }
    if (!isFound) {
      console.log("!isFound=" + this.currentTabIndexes.length);
      this.currentTabIndexes.push(currentTabIndex);
    }
    console.log("setCurrentTabIndex(any)...this.currentTabIndexes AFTER =" + JSON.stringify(this.currentTabIndexes));
  }
  public getCurrentTabIndex(tabsName: string): number {
    console.log("getCurrentTabIndex(string)...this.currentTabIndexes BEFORE =" + JSON.stringify(this.currentTabIndexes));
    let currentTabIndex: any = this.currentTabIndexes.find(currentTabIndex => {
      return currentTabIndex.tabsName == tabsName;
    });
    if (currentTabIndex == null) {
      currentTabIndex = { "tabsName": tabsName, "index": 0 };
      this.setCurrentTabIndex(currentTabIndex);
    }
    console.log("getCurrentTabIndex(string)...this.currentTabIndexes AFTER =" + JSON.stringify(this.currentTabIndexes));

    return currentTabIndex.index;
  }
}


export interface NearByCallerInterface {
  handleNearByServiceUpdating(value: any): void;
}