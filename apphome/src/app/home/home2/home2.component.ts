import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { productService } from '../../lib/service/product.service';
import { Category } from '../../lib/service/data/category';

@Component({
    selector: 'my-app',
    templateUrl: './home2.component.html',
    styleUrls: ['./home2.component.scss'],
})
export class Home2Component implements OnInit {
    private position: number = 0;
    private widthRow: number;
    private widthCol: number;
    private categories: Category[] = [];
    private init: boolean = false;
    public homeState: boolean = false;
    public loadingState: boolean = true;
    private navigateRoute = 'shop/product1';

    @ViewChild('row') row:ElementRef;

    constructor(
        private router: Router,
        private productService: productService
    ){}

    ngOnInit() {}

    ngAfterViewInit(){
        this.fetchCategory();
    }

    // Event Listener
    @HostListener('window:resize', ['$event']) onResize(event) { 
        this.position = 0;

        setTimeout(()=>{
            this.widthCol = this.row.nativeElement.firstElementChild.offsetWidth - 1;            
            this.widthRow = (this.row.nativeElement.offsetWidth - this.widthCol) * -1; 
        }, 1000);
    }

    // Fetching Categori
    fetchCategory(){
        this.productService.getCategory().subscribe(data => {
            this.categories = data;

            this.loadingState = false;
            this.homeState = true;

            setTimeout(()=>{
                this.init = true;
                this.widthCol = this.row.nativeElement.firstElementChild.offsetWidth;            
                this.widthRow = (this.row.nativeElement.offsetWidth - this.widthCol) * -1;        
            }, 100);

        });
    }

    // Previous Slider
    prevSlide(){ 
        this.position = this.position + this.widthCol;
        this.widthRow = (this.row.nativeElement.offsetWidth - this.widthCol) * -1;      
    }

    // Next Slider
    nextSlide(){  
        this.position = this.position - this.widthCol;
        this.widthRow = ((this.row.nativeElement.offsetWidth - (this.widthCol + this.widthCol)) - 5) * -1;  
    }

    // Select Category
    selectCategory(e){
        let navCategory: NavigationExtras = {
            queryParams: {
                category: _.kebabCase(e)
            }
        };
        this.router.navigate([this.navigateRoute], navCategory);
    }
}
