import { Injectable } from '@angular/core';

import { Client } from 'node-rest-client';
//var Client = require('node-rest-client').Client;
import * as _ from "lodash";

@Injectable()
export class RESTClientService {

    public client = new Client();
    //private restClientInfo : RESTClientInfo = new RESTClientInfo();
    constructor() {
        console.log("RESTClientService.constructor()...started");
        this.registerMethods();
    }

    private registerMethods(): void {
        console.log("RESTClientService.registerMethods()...");
        RESTClientInfo.initialize();
        RESTClientInfo.clientMethodInfos.forEach((clientMethodInfo) => {
            //console.log("clientMethodInfo.methodName=" + clientMethodInfo.methodName + "::" + clientMethodInfo.apiEndPoint);
            this.client.registerMethod(clientMethodInfo.methodName, clientMethodInfo.apiEndPoint, clientMethodInfo.httpMethod);
        });

    }

    private getLlmQuotation(deliverytimestart: string, sellerLocationLatLng: any, customerLocationLatLng: any, paymentMethod: string): Promise<any> {
        let data: any = {};
        data["deliverytimestart"] = deliverytimestart;
        data["sellerLocationLatLng"] = sellerLocationLatLng.latitude + "," + sellerLocationLatLng.longitude;
        data["customerLocationLatLng"] = customerLocationLatLng.latitude + "," + customerLocationLatLng.longitude;
        data["paymentMethod"] = paymentMethod;

        console.log("getLlmQuotation=" + JSON.stringify(data));
        return new Promise((resolve, reject) => {
            let lalamoveArgs: any = {
                headers: { "Content-Type": "application/json" },
                data: data//{ "deliverytimestart": "February 20, 2018 11:13:00", "sellerLocationLatLng": "" + sellerLocationLatLng.latitude + "," + sellerLocationLatLng.longitude + "", "customerLocationLatLng": "" + customerLocationLatLng.latitude + "," + customerLocationLatLng.latitude + "", "paymentMethod": "" }
            };
            //console.log("args=" + JSON.stringify(lalamoveArgs));

            this.client.methods.getLlmQuotation(lalamoveArgs, function (data, response) {
                resolve(data);
                //});
            });
        });
    }

    private getSktQuotation(deliverytimestart: string, sellerLocationLatLng: any, customerLocationLatLng: any, paymentMethod: string): Promise<any> {
        let data: any = {};
        data["deliverytimestart"] = deliverytimestart;
        data["sellerLocationLatLng"] = sellerLocationLatLng.latitude + "," + sellerLocationLatLng.longitude;
        data["customerLocationLatLng"] = customerLocationLatLng.latitude + "," + customerLocationLatLng.longitude;
        data["paymentMethod"] = paymentMethod;

        console.log("getSktQuotation=" + JSON.stringify(data));
        return new Promise((resolve, reject) => {
            let skootarArgs: any = {
                headers: { "Content-Type": "application/json" },
                data: data//{ "deliverytimestart": "February 20, 2018 11:13:00", "sellerLocationLatLng": ""+sellerLocationLatLng.latitude+","+sellerLocationLatLng.longitude+"", "customerLocationLatLng": ""+customerLocationLatLng.latitude+","+customerLocationLatLng.latitude+"", "paymentMethod": "" }
            };
            //console.log("args=" + JSON.stringify(skootarArgs));
            this.client.methods.getSktQuotation(skootarArgs, function (data, response) {
                resolve(data);
            });
        });
    }

    public async getDeliveryQuotation(deliverytimestart: string, sellerLocationLatLng: any, customerLocationLatLng: any, paymentMethod: string): Promise<any> {
        //
        let lalamoveResult: any = {};
        let skootarResult: any = {};

        lalamoveResult = await this.getLlmQuotation(deliverytimestart, sellerLocationLatLng, customerLocationLatLng, paymentMethod);
        skootarResult = await this.getSktQuotation(deliverytimestart, sellerLocationLatLng, customerLocationLatLng, paymentMethod);

        console.log("JSON.stringify(skootarResult)" + JSON.stringify(skootarResult));
        console.log("JSON.stringify(lalamoveResult)" + JSON.stringify(lalamoveResult));


        return new Promise((resolve, reject) => {
            resolve({ "deliveryServiceProvider": "Lalamove", "totalCostForDelivery": Number(lalamoveResult.totalFee) });
            /* block นี้เอานะครับ แต่ยังไม่เปิดเพราะยังไม่ได้เติมเงิน Skootar เลย 

            if (JSON.stringify(skootarResult) != "{}" && JSON.stringify(lalamoveResult) != "{}") {
                if (skootarResult.netPrice <= Number(lalamoveResult.totalFee == null ? "999999" : lalamoveResult.totalFee)) {
                    resolve({ "deliveryServiceProvider": "Skootar", "totalCostForDelivery": skootarResult.netPrice });
                } else {
                    resolve({ "deliveryServiceProvider": "Lalamove", "totalCostForDelivery": Number(lalamoveResult.totalFee) });
                }
            }
            
            */
            /*
            while (JSON.stringify(skootarResult) == "{}" || JSON.stringify(lalamoveResult) == "{}") {
                console.log("while (1 == 1) {");
                setTimeout(() => {
                    console.log("JSON.stringify(skootarResult)"+JSON.stringify(skootarResult));
                    console.log("JSON.stringify(lalamoveResult)"+JSON.stringify(lalamoveResult));

                    if (JSON.stringify(skootarResult) != "{}" && JSON.stringify(lalamoveResult) != "{}") {
                        if (skootarResult.netPrice <= Number(lalamoveResult.totalFee)) {
                            resolve({ "deliveryServiceProvider": "Skootar", "totalCostForDelivery": skootarResult.netPrice });
                        } else {
                            resolve({ "deliveryServiceProvider": "Lalamove", "totalCostForDelivery": Number(lalamoveResult.totalFee) });
                        }
                    }
                }, 200000);
            }
            */
        });
    }

    public save(collectionPath: string, document: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: { "collectionPath": collectionPath, "document": document }
            };
            console.log("args=" + JSON.stringify(args));
            this.client.methods.save(args, function (data, response) {
                resolve(data);
            });
        });
    }

    public findAll(collectionPath: string): Promise<any> {
        console.log("findAll::collectionPath=" + collectionPath);
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: { "collectionPath": collectionPath }
            };
            console.log("args=" + JSON.stringify(args));
            this.client.methods.findAll(args, function (data, response) {
                resolve(data);
            });
        }).catch((error) => {

        });
    }

    public findByKey(collectionPath: string, key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: { "collectionPath": collectionPath, "key": key }
            };
            this.client.methods.findByKey(args, function (data, response) {
                resolve(data);
            });
        }).catch((error) => {

        });
    }

    public findByChild(collectionPath: string, childPath: string, childValue: any): Promise<any> {
        console.log("findByChild::collectionPath=" + collectionPath);
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: { "collectionPath": collectionPath, "childPath": childPath, "childValue": childValue }
            };
            this.client.methods.findByChild(args, function (data, response) {
                resolve(data);
            });
        }).catch((error) => {

        });
    }

    //{ "functionInfo": {"classPathFileName":"./availableItems.service","className":"AvailableItemService","functionName":"findAllAvailableItems","functionArgument":{}} }
    public findByFunction(functionInfo: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: functionInfo
            }
            this.client.methods.findByFunction(args, ((data, response) => {
                resolve(data);
            }));
        });
    }


    public callAFunction(functionInfo:any) : Promise<any> {
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: functionInfo
            }
            this.client.methods.callAFunction(args, ((data, response) => {
                resolve(data);
            }));
        });
    }

    public createProductionOrder(productionOrderInfo:any) : Promise<any> {
        console.log("createProductionOrder");
        return new Promise((resolve, reject) => {
            let args: any = {
                headers: { "Content-Type": "application/json" },
                data: productionOrderInfo
            }
            this.client.methods.createProdOrder(args, ((data, response) => {
                resolve(data);
            }));
        });
    }
    /*
    private doRegisterMethod(methodInfo:any) : void {
        switch(methodInfo.httpMethod){
            case "POST" : {
                this.client.registerMethods(methodInfo,)
                break;
            }
            case "GET" : {
                break;
            }
            case "PUT" : {
                break;
            }
            case "DELETE" : {
                break;
            }
            case "HEAD" : {
                break;
            }
            case "OPTIONS" : {
                break;
            }
            case "CONNECT" : {
                break;
            }
            
            default : {
                break;
            }
        }
 
        
    }   */
}

export class RESTClientInfo {

    public static HTTP_REMOTE_HOST_PORT: string =  "https://api.wechefthailand.com";//"http://localhost:4300";// "https://api.wechefthailand.com";//"https://api.appserve.biz";//"http://localhost:4300"; //"https://api.appserve.biz"; // "http://localhost:4300"; // "https://api.appserve.biz"; //
    //public static HTTPS_REMOTE_HOST_PORT: string = "http://35.198.220.183";

    public static REST_API_ENDPOINT_REF: string = "/api";

    private static REF = RESTClientInfo.HTTP_REMOTE_HOST_PORT + RESTClientInfo.REST_API_ENDPOINT_REF;

    public static clientMethodInfos: Array<any> = new Array<any>();

    public static initialize() {

        RESTClientInfo.clientMethodInfos.push({ "methodName": "save", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/save", "httpMethod": "POST" });

        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAll", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/findAll", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findByKey", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/findByKey", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findByChild", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/findByChild", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findByFunction", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/findByFunction", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "callAFunction", "apiEndPoint": "" + RESTClientInfo.REF + "/generic/callAFunction", "httpMethod": "POST" });
   

        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAvailableItemByKey", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem//findAvailableItemByKey", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAvailableItemsBySellerKey", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem/findAvailableItemsBySellerKey", "httpMethod": "POST" });


        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAllAvailableItems", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem/findAllAvailableItems", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAvailableItemByKey", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem//findAvailableItemByKey", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findAvailableItemsBySellerKey", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem/findAvailableItemsBySellerKey", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "findNearByAvailableItems", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem/findNearByAvailableItems", "httpMethod": "POST" });

        RESTClientInfo.clientMethodInfos.push({ "methodName": "deleteAvailableItem", "apiEndPoint": "" + RESTClientInfo.REF + "/availableItem/deleteAvailableItem", "httpMethod": "DELETE" });

        RESTClientInfo.clientMethodInfos.push({ "methodName": "getLlmQuotation", "apiEndPoint": "" + RESTClientInfo.REF + "/lalamove/getQuotation", "httpMethod": "POST" });
        RESTClientInfo.clientMethodInfos.push({ "methodName": "getSktQuotation", "apiEndPoint": "" + RESTClientInfo.REF + "/skootar/getQuotation", "httpMethod": "POST" });
    
   
        RESTClientInfo.clientMethodInfos.push({ "methodName": "createProdOrder", "apiEndPoint": "" + RESTClientInfo.REF + "/prodOrder/createProductionOrder", "httpMethod": "POST" });
    
    }

    constructor() {
        //RESTClientInfo.initialize();
    }

    /*
    key: string;
    file: File;
    fileName: string;
    fileSize: number;
    //imageUrl: string;
    progress: number = 0;
    createdAt: Date = new Date();
    createdBy: string;
    //updatedAt: Date = new Date();
    //updatedBy: string;

    fileOrderIndex: number;
    fileDownloadURL: string;
    storagePath: string;
    //storageFileName: string = UUID.UUID();
    */

}
