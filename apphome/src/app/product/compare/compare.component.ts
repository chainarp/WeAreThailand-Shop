import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { productService } from '../../lib/service/product.service';
import { CookieService } from '../../lib/service/cookie.service';
import * as _ from "lodash";
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-compare',
    templateUrl: './compare.component.html',
    styleUrls: ['./compare.component.scss'],
    providers: [productService]
})
export class CompareComponent implements OnInit {
    public productState: boolean = true;
    public loadingState: boolean = false;
    private startSlice: number;
    private endSlice: number;
    private totalProduct: Number;
    private disablePrev: boolean = true;
    private disableNext: boolean;
    private productView: number = 0;
    private products = [];
    private productCompare = [];    
    
    @ViewChild('table') table:ElementRef;
    @ViewChild('wraptable') wraptable:ElementRef;
    @ViewChild('loading') loading:ElementRef;        
    
    constructor(
        private productService: productService,
        private cookie: CookieService,
        public snackBar: MatSnackBar,
    ) {}

    ngOnInit(){
        this.productCompare = this.cookie['arrCompare'];        
        this.setSlice(); 
        this.fetchProduct();        
    }

    ngAfterViewInit(){
        // this.loading.nativeElement.style.height = (window.innerHeight * 0.5) + 'px';  
        this.setWidthColumn();     
    }

    // Fetch
    fetchProduct(){
        this.productService.getProduct().subscribe(product =>{
            _.map(this.cookie['arrCompare'], (x, i)=>{
                let findProduct = _.find(product, (c)=>{
                    return c['index'] == x;
                });
                this.products.push(findProduct);
            });
            this.totalProduct = this.products.length;

            if(this.totalProduct <= this.endSlice){
                this.disableNext = true;
            }
        });
    }

    // On Select Remove
    onSelectRemove(e){
        let getIndex = this.productCompare.indexOf(e['index']);
        this.productCompare.splice(getIndex, 1);
        this.products.splice(getIndex, 1);
        this.cookie.addCookie('compare', JSON.stringify(this.productCompare));
        this.openSnackBar(e.productName, 'Deleted from compare');
        this.totalProduct = this.products.length;

        setTimeout(()=>{
            this.setSlice();             
            this.setWidthColumn(); 
            if(this.totalProduct <= this.endSlice){
                this.disableNext = true;
                this.disablePrev = true;
            }
        }, 500);
    }

    // Snack Bar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
    }

    // Event Listener
    @HostListener('window:resize', ['$event']) onResize(event) { 
        this.setSlice();
        this.setWidthColumn();
        if(this.totalProduct <= this.endSlice){
            this.disableNext = true;
            this.disablePrev = true;
        }
    }

    // Setting Slice
    setSlice(){
        let width = window.innerWidth;
        if(width > 1023){
            this.startSlice = 0;
            this.endSlice = 3;
        }else if(width < 1023 && width > 483){
            this.startSlice = 0;
            this.endSlice = 2;
        }else if(width < 483){
            this.startSlice = 0;
            this.endSlice = 1;
        }

        this.disablePrev = true;
        this.disableNext = false;
    }

    // Set Width
    setWidthColumn(){
        let width = window.innerWidth;
        let showproduct;
        let infoWidth;
        if(width > 1023){
            showproduct = 3;
            infoWidth = 200;
        }else if(width < 1023 && width > 483){
            showproduct = 2;
            infoWidth = 200;
        }else if(width < 483){
            showproduct = 1;
            infoWidth = 130;
        }
        let firstElement = this.table.nativeElement.firstElementChild;
        let columns = firstElement.children[1].children;
        let wrapWidth = (this.wraptable.nativeElement.clientWidth - infoWidth) / showproduct;

        setTimeout(()=>{
            for(let i=0; i<columns.length; i++){
                firstElement.children[1].children[i].children[0].style.width = wrapWidth + 'px';
            }

            for(let i=0; i<firstElement.children[0].children.length; i++){
                firstElement.children[0].children[i].style.maxWidth = wrapWidth + 'px';
            }

            this.productView = showproduct;
            if(this.products.length <= this.productView){
                this.productView = this.products.length;
            }    
        }, 100);
    }

    // Previous View
    prevView(){
        if(this.startSlice != 0){
            this.startSlice = this.startSlice - 1;
            this.endSlice = this.endSlice - 1;
            this.disablePrev = false;
            if(this.startSlice == 0){
                this.disablePrev = true;
            }
        }
        this.disableNext = false;
        this.setWidthColumn();
    }

    // Next View
    nextView(){
        if(this.endSlice != this.totalProduct){
            this.startSlice = this.startSlice + 1;
            this.endSlice = this.endSlice + 1;
            this.disableNext = false;

            if(this.endSlice == this.totalProduct){
              this.disableNext = true;
            }
        }
        this.disablePrev = false;
        this.setWidthColumn();
    }

}
