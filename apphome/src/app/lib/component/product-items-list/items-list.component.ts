import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { Product } from '../../service/data/product';
import { productService } from '../../service/product.service';
import { AvailableItemInfo, SellerInfo, ProductItemInfo } from '../../../services/app-data-model/app-data-model';
import { AvailableItemsService } from '../available-items.service';

import { SharingDataServiceProvider } from '../../../services/sharing-data-service/sharing-data.service'

@Component({
    selector: 'itemslist',
    templateUrl: './items-list.component.html',
    styleUrls: ['./items-list.component.scss'],
    animations: [
        trigger('focusPanel', [
            state('inactive', style({
                transform: 'scale(0)',
                opacity: 0
            })),
            state('active', style({
                transform: 'scale(1)',
                opacity: 1
            })),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ]),
    ]
})
export class ItemsListComponent {

    //private productItem: ProductItemInfo;
    //private isDataLoadingDone: boolean = true;

    //public product : Product;
    public loadingState: boolean = false;
    public maxProductItemImageLength: number = -1;
    public currentProductItemImageIndex: number = -1;
    public currentProductItemImage: string;

    //@Input() productItem: ProductItemInfo;
    @Input() isShow: boolean = true;
    @Input() selectedAvailableItem: AvailableItemInfo;
    public selectedAndTransformedAvailableItems: Array<AvailableItemInfo> = new Array<AvailableItemInfo>();
    //@Input() selectProduct: number;
    @Input() arrayProduct = [];

    @Output() close = new EventEmitter;
    @Output() show = new EventEmitter;

    @ViewChild('contentwrap') content: ElementRef;

    constructor(
        //private mainService: productService
        //private availableItemsService: AvailableItemsService
        private router: Router,
        private sharingDataServiceProvider:SharingDataServiceProvider
    ) {
        console.log("ItemsListComponent.constructor()...");
    }

    private transformAvailableItem(): void {
        this.selectedAndTransformedAvailableItems = new Array<AvailableItemInfo>();
        if (this.selectedAvailableItem != null) {
            //throw new Error('ItemsListComponent.transformAvailableItem()...\nthis.selectedAvailableItem == null');;

            Array.from((<any>this.selectedAvailableItem).productItems).forEach((subelement, j) => {
                let availableItem: AvailableItemInfo = Object.assign({}, <AvailableItemInfo>this.selectedAvailableItem);

                availableItem.productItems = null;
                availableItem.productItemKey = (<ProductItemInfo>subelement).key;
                availableItem.productItem = <ProductItemInfo>subelement;
                availableItem.key = availableItem.key + ":" + availableItem.productItemKey;
                this.selectedAndTransformedAvailableItems.push(availableItem);
                //console.log(">>>>>>>>>>" + i + "." + j + ") >> " + JSON.stringify(availableItem));
            });
        }
    }

    public currentTransformedAvailableItemIndex: number = -1;
    public maxTransformedAvailableItemLength: number = -1;
    public currentTransformedAvailableItem: AvailableItemInfo = null;

    public goNextTransformedAvailableItem(): void {
        if (this.currentTransformedAvailableItemIndex < this.maxTransformedAvailableItemLength - 1) {
            this.currentTransformedAvailableItemIndex++;
        }
        this.currentTransformedAvailableItem = this.selectedAndTransformedAvailableItems[this.currentTransformedAvailableItemIndex];
        this.currentAvailableItemProductItemImage = this.currentTransformedAvailableItem.productItem.images[0];
    }

    public goPrevTransfromedAvailableItem(): void {
        if (this.currentTransformedAvailableItemIndex > 0) {
            this.currentTransformedAvailableItemIndex--;
        }
        this.currentTransformedAvailableItem = this.selectedAndTransformedAvailableItems[this.currentTransformedAvailableItemIndex];
        this.currentAvailableItemProductItemImage = this.currentTransformedAvailableItem.productItem.images[0];
    }

    public state: string = 'active';

    // Close zoom
    public closeList() : void {
        console.log("ItemsListComponent.closeList()...");
        this.currentTransformedAvailableItem = null;
        this.close.emit();
        this.state = 'inactive';
        document.getElementsByTagName("html")[0].style.overflowY = 'auto';
    }

    // Toggle Lightbox
    ngOnChanges() {
        console.log("ItemsListComponent.ngOnChanges()...");
        /*
        if (this.selectProduct != null) {
            //console.log("this.selectProduct..." + JSON.stringify(this.selectProduct));
            console.log("this.isShow=" + this.isShow);
        }
        this.state = this.isShow ? 'active' : 'inactive';
        if (this.state == 'active') {
            //this.fetch(this.selectProduct);
            this.currentProductItemImageIndex = 0;
            this.maxProductItemImageLength = this.selectProduct.productItems[0].images.length;
            this.currentProductItemImage = this.selectProduct.productItems[0].images[this.currentProductItemImageIndex];
            //let val = this.selectProduct.toString();
            //this.index = this.arrayProduct.indexOf(val);
            console.log("this.currentProductItemImage=" + this.currentProductItemImage);
        }
        */
        
        if (this.selectedAvailableItem != null) {
            this.transformAvailableItem();
            //console.log("this.selectProduct..." + JSON.stringify(this.selectedAvailableItem));
            //console.log("this.isShow=" + this.isShow);
        }
        this.state = this.isShow ? 'active' : 'inactive';
        if (this.state == 'active') {
            //this.fetch(this.selectProduct);
            this.currentTransformedAvailableItemIndex = 0;
            this.maxTransformedAvailableItemLength = this.selectedAndTransformedAvailableItems.length;
            this.currentTransformedAvailableItem = this.selectedAndTransformedAvailableItems[this.currentTransformedAvailableItemIndex];
            //let val = this.selectProduct.toString();
            //this.index = this.arrayProduct.indexOf(val);
            this.currentAvailableItemProductItemImage = this.currentTransformedAvailableItem.productItem.images[0];
            console.log("this.currentTransformedAvailableItem=" + this.currentTransformedAvailableItem);
        }
    }

    ngAfterViewInit() {
        console.log("ItemZoomComponent.ngAfterViewInit()...");
        this.content.nativeElement.style.height = window.innerHeight + 'px';
    }

    // On Resize
    @HostListener('window:resize', ['$event']) onResize(event) {
        this.content.nativeElement.style.height = window.innerHeight + 'px';
    }

    public currentAvailableItemProductItemImage : string;
    selectImage(image:string) {
        this.currentAvailableItemProductItemImage = image;
        //this.selectedImage = gallery;
        //this.productImage = gallery.images;
    }

    public gotoDetail(availableItem: AvailableItemInfo): void {
        console.log("gotoDetail(availableItem)....");
        this.sharingDataServiceProvider.setSharingData(availableItem);
        this.router.navigate(['/shop/itemdetail']);
        //this.router.navigate(['/shop/p', availableItem]);
    }
}
