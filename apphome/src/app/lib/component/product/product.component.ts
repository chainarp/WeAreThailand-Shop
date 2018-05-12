import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import * as _ from "lodash";

import { Product } from '../../service/data/product';
import { productService } from '../../service/product.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    animations:[
        trigger('fade', [
            state('shown' , style({ opacity: 1 })), 
            state('hidden', style({ opacity: 0 })),
            transition('hidden => show', animate('.5s')),
            transition('show => hidden', animate('.1s'))
        ]),
        trigger('visibility', [
            state('shown' , style({ 
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
export class ProductComponent implements OnInit {
    // Property
    private products : Product[] = [];
    public productUpdated;
    private selectProduct = Product;
    private limit: number;
    public togglezoom: boolean = false;
    public getId: number;
    public loadingState: boolean = true;
    public productState: boolean = false;
    private blurproduct: boolean = false;

    @ViewChild('row') row: ElementRef;    
    
    // Input
    @Input() setlimit: number;
    @Input() showBtnClose: boolean = false;
    @Input() paginate: boolean = false;
    @Input() filter: Product;
    @Input() column: string = 'l3 s6';
    @Input() currentPage: number = 1;

    // Out Put
    @Output() detail = new EventEmitter;
    @Output() pageChange = new EventEmitter;
    @Output() onRemove = new EventEmitter;
    
    constructor(
        private mainService: productService
    ){}

    // Lifecycle
    ngOnInit() {
        this.fetch();
    }

    ngAfterViewInit(){
        this.updateProduct();      
    }

    ngOnChanges(){
        this.updateProduct();
    }

    @HostListener('window:load', ['$event']) onLoad(event) { 
        this.updateProduct();
    }

    // Update product filtered & on init
    updateProduct(){
        
        this.productUpdated = [];
        setTimeout(() => {
            if(this.row !== undefined){
                let children = this.row.nativeElement.children;
                for(let i=0; i<children.length; i++){
                    if(this.productUpdated.indexOf(children[i].id) !== -1){
                        return false;
                    }
                    console.log(children[i].id)
                    this.productUpdated.push(children[i].id);
                }
            }
        }, 1000);
        
    }

    // Fetching
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

    // Set Limit    
    limitProduct(product){
        if(this.setlimit === undefined){
            this.limit = product.length;
        }else{
            this.limit = this.setlimit;
        }
    }

    // Hover Product
    onHover(product){
        this.selectProduct = product;
    }

    // Zoom Image
    viewProduct(id){
        this.togglezoom = true;
        this.getId = id;
        this.blurproduct = true;
    }

    // Close Zoom
    closeZoom(){
        this.togglezoom = false;
        this.getId = null;
        this.blurproduct = false;
    }

    // Page Change
    onPageChange(e){
        window.scrollTo(0,0);
        this.updateProduct();
        this.pageChange.emit(e);
    }

    // buton close on click
    selectClose(e){
        this.onRemove.emit(e);
        this.updateProduct();        
    }

    // Detail Product
    detailProduct(product){
        this.detail.emit(product);
    }
    
}
