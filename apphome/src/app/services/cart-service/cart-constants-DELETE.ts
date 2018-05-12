
export class ShoppingCartConstants {

    public static SHOPPING_CART: string = "ShoppingCart";

    public static productItem: any = /* productItems (Master Data) */
    {
        productItemKey: String, /* from productItems.$Key (firebase) */
        productGroupKey: String, /* from productGroups.$Key */
        sellerKey: String, /* from Sellers.$Key */
        title: String,
        description: String,
        shortDesc: String,
        extraOptions: [], /*{"name":"","value":"","currency:""}*/
        image: String,
        itemPrices: [],/*{"name": "","value":"","specialPrice":""}*/
        offer: Boolean,
        offerPercent: Number,
        rating: String

    }
    public static sellingCondition: any =  /* sellingCondictions (Transaction Data) */
    {
        sellingConditionKey: String,
        productItemKey: String,
        sellerKey: String,
        openShopTime: Date,
        closeShopTime: Date,
        deliveryTimePreriod: [] /* {"start":Date,"end":Date} */

    }
    private selectedSellerProductItem: any =  {
        sellerKey: String, /* Key1.1, Key2.1 */
        sellerCode: String,
        sellerTitle: String,
        sellerImage: String,
        sellerLocationLatLng: {},
        sellerDistance: Number,
        customerKey: String,
        customerName: String,
        customerMobiePhone:String,
        customerLocationTitle: String,
        customerLocationLatLng: String, /* Key1.2, Key2.2 */
        selectedDeliveryTimePreroid: {}, /* Key1.3, Key2.3 */
        totalCostForGoods : Number,
        deliveryServiceProvider : String,
        totalCostForDelivery : Number,
        paymentMethod : String,
        totalCostForPaymentMethod : Number,
        paymentMethodName : String,
        paymentMethodDescription : String,
        isCheckingOutReady : Boolean,
        grandTotalCostInvoice : Number,
        selectedProductItems: [],
        /* {
            productItemId: String,
            productItemTitle: String,
            productItemImage: String,
            selectedExtraOptions: [], / *{"name":"","value":""} * /
            selectedItemPrice: {}, / *{"name": "","value":"","specialPrice":""}* /
            requiredQuantity: Number
        } */
    }

    public getBlankSelectedSellerProductItem() : any {
        return Object.assign({}, this.selectedSellerProductItem);
    }

    /*
    public s : any = {
        "sellerId":"",
        "customerLatLng":"",
        "selectedDeliveryTimePreroid":{},
        "productItemId":"",
        "selectedExtraOptions":[],
        "selectedItemPrice":{}
    }
    */

    private selectedProductItem: any = {
        productItemKey: String,
        sellerKey: String,
        customerLatLng: String,
        selectedDeliveryTimePreroid: {},
        productItemTitle: String,
        productItemImage: String,
        selectedExtraOptions: [], /*{"name":"","value":""} */
        selectedExtraOptionsComma: String,
        selectedItemPrice: {}, /*{"name": "","value":"","specialPrice":""} */
        calculatedTotalPrice: {}, 
        requiredQuantity: Number
    }

    public getBlankSelectedProductItem() : any {
        return Object.assign({}, this.selectedProductItem);
    }

    /*
    public cart = {
        itemId: String,
        extraOptions: [],
        price: {
            name: "",
            value: Number,
            currency: ''
        },
        title: '',
        thumb: String,
        itemQunatity: this.count
    };
    */
   
    public shoppingCart: any[]; /* array of selectedProductItem */
    

    constructor() {
        console.log("ShoppingCartConstants.constructor()");
    }
}