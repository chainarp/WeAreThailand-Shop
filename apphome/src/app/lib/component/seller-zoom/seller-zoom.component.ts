import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

//import { Product } from '../../service/data/product';
//import { productService } from '../../service/product.service';
import { AvailableItemInfo, SellerInfo, ProductItemInfo } from '../../../services/app-data-model/app-data-model';
//import { AvailableItemsService } from '../available-items.service';

@Component({
    selector: 'sellerzoom',
    templateUrl: './seller-zoom.component.html',
    styleUrls: ['./seller-zoom.component.scss'],
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
export class SellerZoomComponent {

    //private productItem: ProductItemInfo;
    //private isDataLoadingDone: boolean = true;

    //public product : Product;
    public loadingState: boolean = false;
    public maxSellerImageLength: number = -1;
    public currentSellerImageIndex: number = -1;
    public currentSellerImage: string;

    //@Input() productItem: ProductItemInfo;
    @Input() isShow: boolean = true;
    @Input() selectSeller: AvailableItemInfo;
    //@Input() selectProduct: number;
    @Input() arrayProduct = [];

    @Output() close = new EventEmitter;
    @Output() show = new EventEmitter;

    @ViewChild('contentwrap') content: ElementRef;

    constructor(
        //private mainService: productService
        //private availableItemsService: AvailableItemsService
    ) {
        console.log("SellerZoomComponent.constructor()...");
    }

    public state: string = 'active';

    // Close zoom
    closeZoom() {
        console.log("SellerZoomComponent.closeZoom()...");
        this.close.emit();
        this.state = 'inactive';
        document.getElementsByTagName("html")[0].style.overflowY = 'auto';
    }

    // Toggle Lightbox
    ngOnChanges() {
        console.log("SellerZoomComponent.ngOnChanges()...");
        if (this.selectSeller != null) {
            //console.log("this.selectProduct..." + JSON.stringify(this.selectSeller));
            //console.log("this.isShow=" + this.isShow);
        }
        this.state = this.isShow ? 'active' : 'inactive';
        if (this.state == 'active') {
            //this.fetch(this.selectProduct);
            this.currentSellerImageIndex = 0;
            this.maxSellerImageLength = this.selectSeller.seller.images.length;
            this.currentSellerImage = this.selectSeller.seller.images[this.currentSellerImageIndex];
            //let val = this.selectProduct.toString();
            //this.index = this.arrayProduct.indexOf(val);
            console.log("this.currentSellerImage=" + this.currentSellerImage);
        }
    }

    ngAfterViewInit() {
        console.log("SellerZoomComponent.ngAfterViewInit()...");
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
        if (this.currentSellerImageIndex != 0) {
            this.currentSellerImageIndex--;
        }

        this.currentSellerImage = this.selectSeller.seller.images[this.currentSellerImageIndex];

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
        if (this.currentSellerImageIndex < (this.maxSellerImageLength - 1)) {
            this.currentSellerImageIndex++;
        }

        this.currentSellerImage = this.selectSeller.seller.images[this.currentSellerImageIndex];
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
