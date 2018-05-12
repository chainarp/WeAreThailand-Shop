import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { productService } from '../../lib/service/product.service';
import { Category } from '../../lib/service/data/category';
import { Product } from '../../lib/service/data/product';

@Component({
  selector: 'app-product3',
  templateUrl: './product3.component.html',
  styleUrls: ['./product3.component.scss']
})
export class Product3Component implements OnInit {
    public search: string = null;
    public page: number;
    public category: string;
    public valueSearch: string = '';
    private objectNavigation = {};
    public currentPage: number = 1;
    private navigateRoute = 'shop/product3';

    public color : any;
    public price : any;
    public sizes : any;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private productService: productService
    ){
        this.activeRoute.queryParams.subscribe(params => {
            this.search = _.lowerCase(params["search"]);
            this.category = _.lowerCase(params["category"]);

            // Pagination
            if(!isNaN(params["page"])){
                this.currentPage = Number(params["page"]);
            }else{
                this.currentPage = 1;
            }

            if(!_.isEmpty(params)){
                // Merge Object on init
                _.merge(this.objectNavigation, params);

                // Value Search
                if(this.search != undefined){
                    this.valueSearch = this.search;
                }
            }
        });
    }
    
    ngOnInit(){
        // Fetch init
        this.fetchCategory();
        
        // Check Category
        if(this.chekCategory == ''){
            this.allCategory = true;
        }
    }

    // Category
    public categories: Category[] = [];
    public allCategory: boolean;
    private selectedCategory: Category;
    private chekCategory: string = _.lowerCase(this.activeRoute.queryParams['_value'].category);

    fetchCategory(){
        this.productService.getCategory().subscribe(data => {
            this.categories = data,
            this.initCategory(data)
        });
    }
    initCategory(obj: Category[]){
        if(this.chekCategory !== undefined){
            this.selectedCategory = _.find(obj, (o) => { 
                return o.categoryName == this.chekCategory 
            });
        }
    }
    selectCategory(e){
        this.selectedCategory =  e;
        this.allCategory = false;
        let navCategory: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['category'] = _.kebabCase(e.categoryName);
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navCategory);
    }
    resetCategory(){
        this.selectedCategory = null;
        this.allCategory = true;
        let clearCategory: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['category'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearCategory);
    }

    // Search Product
    private timeout: any;
    onSearch(e){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            let navSearch: NavigationExtras = {
                queryParams: this.objectNavigation
            };

            if(e.target.value.length !== 0){
                this.objectNavigation['search'] = _.kebabCase(e.target.value);
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            }else{
                delete this.objectNavigation['search'];
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            }
        }, 500);
    }

    // On Page Change
    onPageChange(e){
        let navSize: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['page'] = e;
        this.router.navigate([this.navigateRoute], navSize);
    }
}
