import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { Product } from '../../service/data/product';
import { productService } from '../../service/product.service';

@Component({
    selector: 'lightbox',
    templateUrl: './lightbox.component.html',
    styleUrls: ['./lightbox.component.scss'],
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
export class LightboxComponent {
    public product : Product;
    public loadingState : boolean = true;
    public index : number;

    @Input() isShow : boolean = true;
    @Input() selectProduct : number;
    @Input() arrayProduct = [];

    @Output() close = new EventEmitter;
    @Output() show = new EventEmitter;

    @ViewChild('contentwrap') content: ElementRef;

    constructor(
        private mainService: productService
    ){}

    public state: string = 'active';

    // Close zoom
    closeZoom(){
        this.close.emit();
        this.state = 'inactive';
        document.getElementsByTagName("html")[0].style.overflowY = 'auto';        
    }

    // Toggle Lightbox
    ngOnChanges(){
        this.state = this.isShow ? 'active' : 'inactive';
        if(this.state == 'active'){
            this.fetch(this.selectProduct);
            let val = this.selectProduct.toString();
            this.index = this.arrayProduct.indexOf(val);
        }
    }

    ngAfterViewInit(){
        this.content.nativeElement.style.height = window.innerHeight + 'px';        
    }

    // On Resize
    @HostListener('window:resize', ['$event']) onResize(event) { 
        this.content.nativeElement.style.height = window.innerHeight + 'px';                
    }

    // Fetch Data
    fetch(id){
        this.mainService.getIdProduct(id).subscribe(data => {
            this.product = data;
            this.loadingState = false;
            document.getElementsByTagName("html")[0].style.overflowY = 'hidden';
        });
    }

    // Prev
    prev(){
        if(this.index != 0){
            --this.index;
        }
        this.product = null;
        this.loadingState = true;
        let idNext = this.arrayProduct[this.index];
        this.fetch(Number(idNext));
    }

    // Next
    next(){
        if(this.index < (this.arrayProduct.length - 1)){
            ++this.index;
        }
        this.product = null;
        this.loadingState = true;
        let idPrev = this.arrayProduct[this.index];
        this.fetch(Number(idPrev));
    }
}
