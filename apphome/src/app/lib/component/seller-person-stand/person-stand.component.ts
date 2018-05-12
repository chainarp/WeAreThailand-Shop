import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import * as _ from "lodash";


//import { productService } from '../../service/product.service';

//import { AvailableItemsService } from '../available-items.service';
import { AvailableItemInfo, SellerInfo, ProductItemInfo } from '../../../services/app-data-model/app-data-model';
import { SharingDataServiceProvider, NearByCallerInterface } from '../../../services/sharing-data-service/sharing-data.service'
import { CustomerLocationServiceProvider } from '../../../product/customer-location/customer-location-service/customer-location-service';

import swal from 'sweetalert2';

@Component({
    selector: 'person-stand',
    templateUrl: './person-stand.component.html',
    styleUrls: ['./person-stand.component.scss'],
    animations: [
        trigger('fade', [
            state('shown', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('hidden => show', animate('.5s')),
            transition('show => hidden', animate('.1s'))
        ]),
        trigger('visibility', [
            state('shown', style({
                transform: 'scale(1)',
                opacity: 1
            })),
            state('hidden', style({
                transform: 'scale(0)',
                opacity: 0
            })),
            transition('hidden => shown', animate('.2s')),
            transition('shown => hidden', animate('.1s'))
        ])
    ]
})
export class PersonStandComponent implements OnInit, NearByCallerInterface {
    // Property

    /*
    private products : Product[] = [];
    private productUpdated;
    private selectProduct = Product;
    private limit: number;
    private togglezoom: boolean = false;
    private getId: number;
    private loadingState: boolean = true;
    private productState: boolean = false;
    private blurproduct: boolean = false;
    */
    public productUpdated;
    public isDataLoadingDone: boolean = false; //to open shut
    private isShelfBlur: boolean = false;//to force this shelf get blur

    private availableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
    //private filteredAvailableItems : Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
    private selectedAvailableItem: AvailableItemInfo;
    public zoomSeller: AvailableItemInfo;


    private limit: number;
    public togglezoom: boolean = false;
    public togglelist: boolean = false;
    private getId: number;

    //private loadingState: boolean = true; //for progress-spinner





    @ViewChild('row') row: ElementRef;
    /*  
        <app-shelf 
        [setlimit]="8" 
        [paginate]="false"
        [showBtnClose]="false"
        (detail)="detailProduct($event)"
    ></app-shelf>
    */
    // Input
    @Input() setlimit: number;
    @Input() showBtnClose: boolean = false;
    @Input() paginate: boolean = false;
    @Input() filter: any;//AvailableItemInfo;
    @Input() column: string = 'l3 s6';
    @Input() currentPage: number = 1;

    // Out Put
    @Output() detail = new EventEmitter;
    @Output() pageChange = new EventEmitter;
    @Output() onRemove = new EventEmitter;

    constructor(
        //private mainService: productService,
        private router: Router,
        //private availableItemsService: AvailableItemsService,
        private sharingDataServiceProvider:SharingDataServiceProvider,
        private customerLocationServiceProvider: CustomerLocationServiceProvider
    ) {

    }
    //public customerLocationItemChecked : any ;
    // Lifecycle
    ngOnInit() {
        //this.fetch();
        //this.availableItems = new Array<AvailableItemInfo>();
        //this.loadAvailableItem();
        this.sharingDataServiceProvider.registerNearByCaller(this);
        //this.customerLocationItemChecked = this.customerLocationServiceProvider.currentCustomerLocationInfo;
        //console.log("ItemShelfComponent.customerLocationItemChecked="+JSON.stringify(this.customerLocationItemChecked));
        this.sharingDataServiceProvider.reloadNearByNoBreakingDownAvailableItems(this.customerLocationServiceProvider.currentCustomerLocationInfo).then((value) => {
            //this.nearBySellersCount = value.varNearBySellersCount;
            //this.nearBySellers = value.varNearBySellers;
            //this.nearByProductItems = value.varNearByProductItems;

            if (this.availableItems.length == 0) {
                this.notifyNoNearByAvailableItemsFound();
            }
        }).catch((reason) => {

        });
    }

    public handleNearByServiceUpdating(value: any): void {
        this.availableItems = value;
        this.limitProduct(this.availableItems);
        this.isDataLoadingDone = true;
    }

    public notifyNoNearByAvailableItemsFound(): void {
        swal('Sorry !', ">> No Nearby Chef Found <<", "error");
    }

    ngAfterViewInit() {
        this.updateProduct();
    }

    ngOnChanges() {
        this.updateProduct();
    }

    @HostListener('window:load', ['$event']) onLoad(event) {
        this.updateProduct();
    }

    //updateProduct(){}

    // Update product filtered & on init
    updateProduct() {
        this.productUpdated = [];
        setTimeout(() => {
            if (this.row !== undefined) {
                let children = this.row.nativeElement.children;
                for (let i = 0; i < children.length; i++) {
                    if (this.productUpdated.indexOf(children[i].id) !== -1) {
                        return false;
                    }
                    this.productUpdated.push(children[i].id);
                }
            }
        }, 1000);
    }


    // Fetching
    /*
    public loadAvailableItem(): void {
        //this.availableItemsService.loadAvailableItems().then((data) => {
        this.sharingDataServiceProvider.getLoadedNearByAvailableItems().then((data) => {
            this.availableItems = data;
            this.limitProduct(this.availableItems);
            setTimeout(() => {
                this.isDataLoadingDone = true;
            }, 500);
        }).catch((error) => {

        });
    }
    */
    /*
    fetch(){
        this.mainService.getProduct().subscribe(data => {
            this.products = data;
            this.limitProduct(data);
            
            setTimeout(() =>{
                this.loadingState = false;
                this.productState = true;
            }, 500)
        });
    }
    */
    // Set Limit    
    limitProduct(availableItems) {
        if (this.setlimit === undefined) {
            this.limit = availableItems.length;
        } else {
            this.limit = this.setlimit;
        }
    }

    // Hover Product
    onHover(product) {
        this.selectedAvailableItem = product;
    }

    // Zoom Image
    public showZoomSeller(availableItem: AvailableItemInfo): void {
        console.log("PersonStandComponent.viewProduct(AvailableItemInfo)...\n" + JSON.stringify(availableItem));
        this.togglezoom = true;
        this.zoomSeller = availableItem;
        //this.getId = id;
        this.isShelfBlur = true;
    }

    public showItemsList(availableItem: AvailableItemInfo): void {
        this.togglelist = true;
        this.zoomSeller = availableItem;
        this.isShelfBlur = true;
    }

    public closeItemsList() {
        this.togglelist = false;
        //this.getId = null;
        this.isShelfBlur = false;
    }

    public gotoDetail(availableItem: AvailableItemInfo): void {
        console.log("gotoDetail(availableItem)....");
        this.sharingDataServiceProvider.setSharingData(availableItem);
        this.router.navigate(['/shop/itemdetail']);
        //this.router.navigate(['/shop/p', availableItem]);
    }
    // Close Zoom
    closeZoom() {
        this.togglezoom = false;
        this.getId = null;
        this.isShelfBlur = false;
    }

    // Page Change
    onPageChange(e) {
        window.scrollTo(0, 0);
        this.updateProduct();
        this.pageChange.emit(e);
    }

    // buton close on click
    selectClose(e) {
        this.onRemove.emit(e);
        this.updateProduct();
    }

    // Detail Product
    detailProduct(product) {
        this.detail.emit(product);
    }

    public getProductItemsTitleComman(availableItem : AvailableItemInfo) : string {
        let productItemsTitleComman : string = "";
        if(availableItem!=null&&availableItem.productItems!=null&&availableItem.productItems.length>0){
            for(let i=0;i<availableItem.productItems.length;i++){
                productItemsTitleComman = productItemsTitleComman + availableItem.productItems[i].title + ",";
            }
            if(productItemsTitleComman.length>0){
                productItemsTitleComman = productItemsTitleComman.substr(0,productItemsTitleComman.length-1);
            }
            return productItemsTitleComman;
        }else{
            return "?";
        }
    }
}

