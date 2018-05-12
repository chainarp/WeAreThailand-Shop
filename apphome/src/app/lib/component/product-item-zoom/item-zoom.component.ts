import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { Product } from '../../service/data/product';
import { productService } from '../../service/product.service';
import { AvailableItemInfo, SellerInfo, ProductItemInfo } from '../../../services/app-data-model/app-data-model';
import { AvailableItemsService } from '../available-items.service';

@Component({
    selector: 'itemzoom',
    templateUrl: './item-zoom.component.html',
    styleUrls: ['./item-zoom.component.scss'],
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
export class ItemZoomComponent {

    //private productItem: ProductItemInfo;
    //private isDataLoadingDone: boolean = true;

    public product : Product;
    public loadingState : boolean = false;
    public maxProductItemImageLength: number = -1;
    public currentProductItemImageIndex: number = -1;
    public currentProductItemImage: string;

    //@Input() productItem: ProductItemInfo;
    @Input() isShow: boolean = true;
    @Input() selectProduct: AvailableItemInfo;
    //@Input() selectProduct: number;
    @Input() arrayProduct = [];

    @Output() close = new EventEmitter;
    @Output() show = new EventEmitter;

    @ViewChild('contentwrap') content: ElementRef;

    constructor(
        //private mainService: productService
        private availableItemsService: AvailableItemsService
    ) {
        console.log("ItemZoomComponent.constructor()...");
    }

    public state: string = 'active';

    // Close zoom
    closeZoom() {
        console.log("ItemZoomComponent.closeZoom()...");
        this.close.emit();
        this.state = 'inactive';
        document.getElementsByTagName("html")[0].style.overflowY = 'auto';
    }

    // Toggle Lightbox
    ngOnChanges() {
        console.log("ItemZoomComponent.ngOnChanges()...");
        if (this.selectProduct != null) {
            //console.log("this.selectProduct..." + JSON.stringify(this.selectProduct));
            //console.log("this.isShow=" + this.isShow);
        }
        this.state = this.isShow ? 'active' : 'inactive';
        if (this.state == 'active') {
            //this.fetch(this.selectProduct);
            this.currentProductItemImageIndex = 0;
            this.maxProductItemImageLength = this.selectProduct.productItem.images.length;
            this.currentProductItemImage = this.selectProduct.productItem.images[this.currentProductItemImageIndex];
            //let val = this.selectProduct.toString();
            //this.index = this.arrayProduct.indexOf(val);
            console.log("this.currentProductItemImage=" + this.currentProductItemImage);
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

    // Fetch Data
    //fetch(id) {
    //this.availableItemsService.loadAvailableItems
    /*
    this.mainService.getIdProduct(id).subscribe(data => {
        this.product = data;
        this.loadingState = false;
        document.getElementsByTagName("html")[0].style.overflowY = 'hidden';
    });
    */
    //}



    // Prev
    public prev(): void {
        if (this.currentProductItemImageIndex != 0) {
            this.currentProductItemImageIndex--;
        }

        this.currentProductItemImage = this.selectProduct.productItem.images[this.currentProductItemImageIndex];

        //if (this.index != 0) {
        //    --this.index;
        //}
        //this.productItem = null;
        //this.isDataLoadingDone = true;
        //let idNext = this.arrayProduct[this.index];
        //this.fetch(Number(idNext));
    }

    // Next
    public next(): void {
        if (this.currentProductItemImageIndex < (this.maxProductItemImageLength - 1)) {
            this.currentProductItemImageIndex++;
        }

        this.currentProductItemImage = this.selectProduct.productItem.images[this.currentProductItemImageIndex];
        /*
        if (this.index < (this.arrayProduct.length - 1)) {
            ++this.index;
        }
        //this.productItem = null;
        this.isDataLoadingDone = true;
        let idPrev = this.arrayProduct[this.index];
        this.fetch(Number(idPrev));
        */
    }

    /*
        // Prev
        prev() {
            if (this.index != 0) {
                --this.index;
            }
            this.product = null;
            this.loadingState = true;
            let idNext = this.arrayProduct[this.index];
            this.fetch(Number(idNext));
        }
    
        // Next
        next() {
            if (this.index < (this.arrayProduct.length - 1)) {
                ++this.index;
            }
            this.product = null;
            this.loadingState = true;
            let idPrev = this.arrayProduct[this.index];
            this.fetch(Number(idPrev));
        }
    */
}
