import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as _ from "lodash";

import { RESTClientService } from '../../services/restclient/restclient.service'
import { AvailableItemInfo, ProductItemInfo } from '../../services/app-data-model/app-data-model';

// Object Type
/*
import { Product } from './data/product';
import { Logo } from './data/logo';
import { Category } from './data/category';
import { Size } from './data/size';
import { Color } from './data/color';
*/
@Injectable()
export class AvailableItemsService {
    //private base: string = './assets/json/';
    //private restClientService: RESTClientService = new RESTClientService();
    constructor(private restClientService: RESTClientService) {
    }


    public loadAvailableItems(): Promise<any> {
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

    public findAvailableItem(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            //this.restClientService.findByKey
        });
    }
}




