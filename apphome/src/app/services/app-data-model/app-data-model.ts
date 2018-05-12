// VERSION 28/03/2018
export class UserInfo {
    public key: string;
    public email: string;
    public createdAt: string;
    public createdBy: string;
    public updatedAt: string;
    public updatedBy: string;
    public isActive: boolean;
    public isDeleted: boolean;
    public name: string;
    public emailVerificationCode: string;
    public email_isActive: string;
    public isEmailVerified: boolean;
    public mobilePhoneNo: string;
    public isPhoneNoVerified: boolean;
    public password: string = "";
    public userRolesString: string;
    public userRoles: Array<string> = new Array<string>();

    public lastLoginAt: string;
    public lastLoginBy: string; //channel of user logging in


    public static USER_ROLE_SELLER: string = "SELLER";
    public static USER_ROLE_CUSTOMER: string = "CUSTOMER";
    public static USER_ROLE_CUSTOMER_SERVICE: string = "CUSTOMER_SERVICE";
    public static USER_ROLE_ADMINISTATOR: string = "ADMINISTATOR";

}

export class CustomerLocationInfo { //"id": "0.00000000000000000", "title": "CURRENT_LOCATION", "detail1": "", "detail2": "", "latitude": 13.74349185255942, "longitude": 100.49879542518465, "icon": "pin", "checked": true }
    public id: number;
    public title: string;
    public location: string;
    public messageToDriver: string;
    public receiverPhone: string;
    public latitude: number; //13.74349185255942, 
    public longitude: number; //100.49879542518465, 
    public timestamp: number;
    public radius: number = -1; //
    public icon: string = "pin_drop";
    public isCurrent: boolean = false;
}

export class AvailableItemInfo {

    /*
    public key: string;
    public sellerKey: string;
    public productItemKey: string;
    public availableType: string;
    public unavailableDates: Array<string> = new Array<string>();
    public availableDates: Array<string> = new Array<string>();  /* {"month":"Jan","date":[2,3,4,5]} * /
    public availableTimes: Array<string> = new Array<string>();
    public capacityPerDay: number = 0;
    */
    public static OPEN: string = "open";
    public static CLOSED: string = "closed";
    public key: string = "";

    public sellerKey: string = "";
    public seller: SellerInfo;
    public sellerKey_status: string = "";
    public distance: number = -1;


    //public availableDateTimeRanges: Array<any> = new Array<any>();
    public productItemKey: string = "";
    public productItem: ProductItemInfo;

    public productItems: Array<ProductItemInfo>;

    constructor() { }
}

export class SellerInfo {

    public static NUMBER_OF_SELLER_IMAGE: number = 2;
    public key: string;
    public userKey: string;
    //public personKey:string;
    public code: string;
    public title: string;
    public slogan: string;
    public portfolio: string;
    public sellerGroup: string;
    public location: string;
    public latlng: string;
    public nearby: string;
    public rating: number;
    public images: Array<string> = new Array<string>();
    constructor() { }
}

export class ProductItemInfo {
    public static NUMBER_OF_PRODUCT_ITEM_IMAGE_MIN: number = 3;
    public static NUMBER_OF_PRODUCT_ITEM_IMAGE_MAX: number = 6;
    public key: string;
    public title: string;
    public sellerKey: string;
    public seller: any;
    public productGroupKey: string;
    public productGroup: any;
    public description: string;
    public shortDesc: string;
    public extraOptions: Array<any> = new Array<any>();
    public itemPrices: Array<any> = new Array<any>();
    public offerPercentage: number = 0;  //should be moved to Shop
    public isSpecialOffered: boolean = false; //should be moved to Shop
    public rating: number = 0;
    public images: Array<string> = new Array<string>();
    public availableDateTimeRanges: Array<any> = new Array<any>();
    public capabliltyPerHour: number;
    public orderBeforeDays: number;

    public selectedExtraOptions: Array<any>; //[{"name":"","value":""},{"name":"","value":""}]
    public selectedItemPrice: any = {};//{ "name": "", "specialPrice": "", "value": "" };
    public requiredQuantity: number = -1;
    public totalPricePerSet: number = -1;
    constructor() { }
    /*
    public static NUMBER_OF_SELLER_IMAGE: number = 2;
    public key: string;
    public userId: string;
    public code: string;
    public title: string;
    public location: string;
    public latlng: string;

    public portfolio: string;
    public productGroup: string;
    public rating: number;
    public images: Array<string> = new Array<string>();
    */

}

export class ShoppingCart {
    public static SHOPPING_CART: string = "ShoppingCart5";
    /*
    private cartElementArray: Array<CartElement> = new Array<CartElement>();
    public get cartElements(): Array<CartElement> {
        if(this.cartElementArray==null){
            this.cartElementArray = new Array<CartElement>();
        }
        return this.cartElementArray;
    }
    */
    public cartElements: Array<CartElement> = new Array<CartElement>();
    public createdAt: string;

    public userKey: string;
    public userName: string;
    public userEmail: string;
    public userMobilePhone: string;

    public customerKey: string;
    public customerName: string;
    public customerEmail: string;
    public customerMobilePhone: string;
    public customerLocationTitle: string;
    public customerLocationLatLng: any;  // {"latitude":13.650389144718167,"longitude":100.47855645418167}
    public customerLocationLocation: string;
    public customerLocationMessageToDriver: string;


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
}

export class CartElement {
    public sellerKey: string;
    public sellerCode: string;
    public sellerTitle: string;
    public sellerImage: string;
    public sellerLocationLatLng: any; // {"latitude":13.650389144718167,"longitude":100.47855645418167}
    public sellerDistance: number;

    public customerKey: string;
    public customerEmail: string;
    public customerName: string;
    public customerMobilePhone: string;
    public customerLocationTitle: string;
    public customerLocationLatLng: { "latitude": number, "longitude": number };  // {"latitude":13.650389144718167,"longitude":100.47855645418167}
    public customerLocationLocation: any;
    public customerLocationMessageToDriver: any;

    public selectedDeliveryTimePreroid: any;


    public promotionPackageKey: string;
    public promotionVoucher: string;


    public selectedProductItems: Array<SelectedProductItemElement>;
    public costOfGoods: number;
    public goodsDiscountAmount: number = 0;
    public goodsDiscountPercent: number = 0;
    public totalCostOfGoods: number = 0;


    public deliveryServiceProvider: string;
    public costOfDelivery: number;
    public deliveryDiscountAmount: number = 0;
    public deliveryDiscountPercent: number = 0;
    public totalCostOfDelivery: number = 0;

    public paymentMethod: string;
    //ไม่น่าจะต้องเกี่ยวกับ Payment ใน level ของ CartElement น่าจะไปอยู่ในระดับของ Grand
    /*
    public costOfPaymentMethod: number = 0;
    public paymentMethodDiscountAmount: number = 0;
    public paymentMethodDiscountPercent: number = 0;
    public totalCostOfPaymentMethod: number = 0;
    */

    public costOfCartElement : number = 0;  // =  costOfGoods + costOfDelivery 
    public cartElementDiscountAmount: number = 0; //
    public cartElementDiscountPercent: number = 0;
    public totalCostOfCartElement: number = 0; // = costOfCartElement + cartElementDiscountAmount

    //public totalCostOfGoods: number;
}
export class SelectedDeliveryTimePreroidElement {
    public selectedDateRequired: any; //{"RangeId":0,"Date":{"dateString":"16 มี.ค. 18 (ศุกร์)","dateUTC":"2018-03-15T17:00:00.000Z"}
    public selectedTimeRangeRequired: string;
}
/*
export class SelectedProductItemElement {
    public productItemKey: string;
    public productItemTitle: string;
    public productItemImage: string;
    public sellerKey: string;
    public selectedDeliveryTimePreroid: SelectedDeliveryTimePreroidElement;
    public selectedExtraOptions: Array<any>;
    public selectedExtraOptionsComma: string;
    public selectedItemPrice: any; //{"name":"","value":-1}
    public calculatedTotalPrice: any;
    public requiredQuantity: number;
    public totalPricePerSet: number;
    public totalAmount: number;
}
*/
export class SelectedProductItemElement {
    public sellerKey: string;
    public sellerTitle: string;
    public sellerCode: string;
    public sellerImage: string;
    public sellerLocationLatLng: any; //{ "latitude": "", "longitude": "" }
    public sellerDistance: number;

    public customerEmail: string;
    public customerName: string;
    public customerMobilePhoneNo: string;

    public customerLocationTitle: string;
    public customerLocationLocation: string;
    public customerLocationMessageToDriver: string;
    public customerLocationLatLng: { "latitude": number, "longitude": number }

    public selectedDeliveryTimePreroid: SelectedDeliveryTimePreroidElement; //{ "startDate": "", "endDate": "" }
    public productItemKey: string;
    public productItemTitle: string;
    public productItemImage: string;
    public selectedExtraOptions: Array<any>;
    public selectedExtraOptionsComma: string;
    public selectedItemPrice: {}; //{ "name": "", "specialPrice": "", "value": "" }
    public calculatedTotalPrice: any;
    public requiredQuantity: number = -1;
    public totalPricePerSet: number = -1;
    public totalAmount: number;
}

/*

export class ProductionOrderInfo {
    public key: string;
    public orderId: string;
    public orderCurrentStatus: string;
    public orderStatusLog: Array<{ "timestamp": number, "orderStatus": string }>;
    public createdAt: string;
    public purchaseOrderKey: string;
    public sellerKey: string;
    public selectedDeliveryTime: SelectedDeliveryTimePreroidElement;

    public sellerKey_selectedDeliveryTime: string;
    public sellerKey_orderStatus: string;
    public selectedProductItem: ProductItemInfo;
}

*/

export class ProductionOrderInfo {
    public static mainStatuses: Array<{ en: string, th: string }> = [{ en: "CheckingStarted", th: "เริ่มตรวจสอบแล้ว" }, { en: "ProcessStarted", th: "เริ่มดำเนินการแล้ว" }, { en: "AllPartyConfirmed", th: "ทุกฝ่ายยืนยันแล้ว" }, { en: "ProcessDone", th: "ขบวนการจบแล้ว" }, { en: "FinalChecked", th: "ตรวจสอบจบแล้ว" }, { en: "Cancelled", th: "ยกเลิกแล้ว" }];
    public static orderStatuses: Array<{ en: string, th: string }> = [{ en: "HavingNewOrder", th: "มีคำสั่งใหม่" }, { en: "OrderReceived", th: "รับคำสั่งแล้ว" }, { en: "OrderConfirmed", th: "ยืนยันรับงานแล้ว" }, /* { en: "OrderFinished", th: "พร้อมส่งแล้ว" }, */ { en: "Exported", th: "จัดส่งออกเรียบร้อย" }];
    public static paymentStatuses: Array<{ en: string, th: string }> = [{ en: "Invoiced", th: "แจ้งหนี้แล้ว" }, { en: "Paid", th: "จ่ายแล้ว" }];
    public static deliveryStatuses: Array<{ en: string, th: string }> = [{ en: "QuotationPlaced", th: "เสนอราคาแล้ว" }, { en: "OrderPlaced", th: "ส่งคำสั่งแล้ว" }, { en: "OrderConfirmed", th: "ยืนยันรับงาน" },  { en: "OnTheWay", th: "ระหว่างจัดส่ง" },  { en: "Delivered", th: "จัดส่งเรียบร้อย" },  { en: "Cancelled", th: "ยกเลิกจัดส่ง" }];

    public static cancelOrderStatuses: Array<{ en: string, th: string }> = [{ en: "CancelRequested", th: "ขอยกเลิกแล้ว" }, { en: "Cancelled", th: "ยกเลิกแล้ว" }];
    public static cancelPaymentStatuses: Array<{ en: string, th: string }> = [{ en: "CancelRequested", th: "ขอยกเลิกแล้ว" }, { en: "Cancelled", th: "ยกเลิกแล้ว" }, { en: "refunded", th: "จ่ายคืนแล้ว" }];
    public static cancelDeliveryStatuses: Array<{ en: string, th: string }> = [{ en: "CancelRequested", th: "ขอยกเลิกแล้ว" }, { en: "Cancelled", th: "ยกเลิกแล้ว" }];


    public sellerKey_mainStatus: string;
    public sellerKey_selectedDeliveryUTCDate: string;

    public key: string;
    public orderId: string;
    public purchaseOrderKey: string;

    public createdAt: string;
    public updatedAt: string;

    public customerKey: string;
    public customerName: string;
    public customerEmail: string;
    public customerMobilePhone: string;
    public customerLocationLatLng: { latitude: number, longitude: number };
    public customerLocationLocation: string;
    public customerLocationMessageToDriver: string;

    public paymentMethod: string;
    public deliveryServiceProvider: string;

    public sellerKey: string;
    public seller: SellerInfo;
    public sellerUser: UserInfo;

    public sellerName: string;
    public selectedDeliveryDateTime: SelectedDeliveryTimePreroidElement;
    public selectedDeliveryTimeStamp: number;
    public sellerLocationLatLng: { latitude: number, longitude: number };

    public totalCostOfGoods: number;
    public totalCostOfDelivery: number;
    public totalCostOfCartElement: number;

    public goodsDiscountAmount: number;// = cartElement.goodsDiscountAmount;
    public deliveryDiscountAmount: number;// = cartElement.deliveryDiscountAmount;
    public cartElementDiscountAmount: number;// = cartElement.cartElementDiscountAmount;

    public allAboutOrderStatus: AllAboutOrderStatus = new AllAboutOrderStatus();

    public deliveryServiceProviderRequests : Array<DeliveryServiceProviderRequest>;
    public deliveryServiceProviderResponses : Array<DeliveryServiceProviderResponse>;
    
    public selectedProductItems: Array<SelectedProductItemElement> = new Array<SelectedProductItemElement>();


}

export class DeliveryServiceProviderRequest {
    requestId : number;
    requestName : string;
    createdAt:string;
    environmentInfo: any;
    argument: any;
    deliveryServiceProvider : string;
}

export class DeliveryServiceProviderResponse {
    responseId : number;
    responseName : string;
    createdAt : string;
    refRequestId : number;
    isSuccessResponse : boolean;
    responseData : any;
    deliveryServiceProvider : string;

}

export class PromotionInfo {
    public key: string;
    public title: string;
    public promoType: string; //discount from cost of goods,cost of delivery, cost of total
    public promoFunction: string;
    public promoVouchers: Array<{ voucherCode: string, startDate: string, endDate: string, limitUsingTime: number, usedTimeCountDown: number }>;

}

export class AllAboutOrderStatus {


    mainCurrentStatus: string;
    mainDisplayStatus: string;
    mainStatusLogs: Array<{ "timestamp": number, "status": "main", "value": string }> = new Array<{ "timestamp": number, "status": "main", "value": string }>();

    orderCurrentStatus: string;
    orderDisplayStatus: string;
    orderStatusLogs: Array<{ "timestamp": number, "status": "order", "value": string }> = new Array<{ "timestamp": number, "status": "order", "value": string }>();

    paymentCurrentStatus: string;
    paymentDisplayStatus: string;
    paymentStatusLogs: Array<{ "timestamp": number, "status": "payment", "value": string }> = new Array<{ "timestamp": number, "status": "payment", "value": string }>();

    deliveryCurrentStatus: string;
    deliveryDisplayStatus: string;
    deliveryStatusLogs: Array<{ "timestamp": number, "status": "delivery", "value": string }> = new Array<{ "timestamp": number, "status": "delivery", "value": string }>();



}