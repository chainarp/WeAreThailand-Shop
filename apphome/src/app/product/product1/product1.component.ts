import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { productService } from '../../lib/service/product.service';
//import { Category } from '../../lib/service/data/category';
import { CategoryInfo } from '../../lib/service/data/category-info';
import { Size } from '../../lib/service/data/size';
import { Color } from '../../lib/service/data/color';
import { Product } from '../../lib/service/data/product';

import { RESTClientService } from '../../services/restclient/restclient.service';
import { SharingDataServiceProvider } from '../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationServiceProvider } from '../customer-location/customer-location-service/customer-location-service';

import swal from 'sweetalert2';


@Component({
    selector: 'app-main',
    templateUrl: './product1.component.html',
    styleUrls: ['./product1.component.scss']
})
export class product1Component implements OnInit {
    public search: string;
    //public price: number;
    public page: number;
    public category: string;
    //public sizes: any;
    //public color: string;
    public valueSearch: string = '';
    private objectNavigation = {};
    public currentPage: number = 1;
    private navigateRoute = 'shop/product1';

    //private customerLocationItemChecked: any;
    public radius: number = -1;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private productService: productService,
        private restlientService: RESTClientService,
        private sharingDataServiceProvider: SharingDataServiceProvider,
        private customerLocationServiceProvider: CustomerLocationServiceProvider
    ) {
        //this.customerLocationItemChecked = sharingDataServiceProvider.getCustomerLocationItemChecked();

        this.activeRoute.queryParams.subscribe(params => {
            this.search = _.lowerCase(params["search"]);
            //this.price = Number(params["price"]);
            this.category = _.lowerCase(params["category"]);
            //this.color = params["color"];

            if (params["radius"] != undefined) {
                this.radius = parseInt(_.lowerCase(params["radius"]));
            }

            // Pagination
            if (!isNaN(params["page"])) {
                this.currentPage = Number(params["page"]);
            } else {
                this.currentPage = 1;
            }
            /*
            if(params["size"] != undefined){
                this.sizes = params["size"].split('-').map(function(item) {
                    return parseInt(item, 10);
                });

                // Init Size
                _.merge(this.arraySize, this.sizes);
            }else{
                this.sizes = null;
            }
            */
            if (!_.isEmpty(params)) {
                // Merge Object on init
                _.merge(this.objectNavigation, params);

                // Value Search
                if (this.search != undefined) {
                    this.valueSearch = this.search;
                }
                /*
                // Value Price
                if(!isNaN(this.price)){
                    this.priceToggle = true;
                }
                */
            }
        });
    }

    ngOnInit() {
        // Fetch init
        this.fetchCategory();
        //this.fetchSize();
        //this.fetchColor();

        // Check Category
        if (this.checkedCategory == '') {
            this.allCategory = true;
        }
    }

    ngAfterViewInit() {
        //swal('Sorry !', ">> No NearBy Available Items Found <<", "error");
        swal({
            title: 'ท่านกำลังสั่งซื้ออาหาร',
            text: 'โดยให้ส่งไปยัง >>> '+this.customerLocationServiceProvider.currentCustomerLocationInfo.title,
            timer: 2000,
            footer: '<a href="/#/shop/customerlocation  ">แก้ไข สถานที่จัดส่ง</a>',
            onOpen: () => {
              swal.showLoading()
            }
          }).then((result) => {
              /*
            if (
              // Read more about handling dismissals
              result.dismiss === swal.DismissReason.timer
            ) {
              console.log('I was closed by the timer')
            } */
          })
    }
    /*
    // Color
    private colors: Color[] = [];
    private selectedColor: Color;
    fetchColor() {
        this.productService.getColor().subscribe(data => {
            this.colors = data,
                this.initColor(data)
        });
    }
    initColor(obj: Color[]) {
        if (this.color !== undefined) {
            this.selectedColor = _.find(obj, (o) => {
                return o.nameColor == this.color
            });
        }
    }
    selectColor(val) {
        if (this.selectedColor == val) {
            this.selectedColor = null;
            let clearColor: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            delete this.objectNavigation['color'];
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], clearColor);
        } else {
            this.selectedColor = val;
            let navColor: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            this.objectNavigation['color'] = val.nameColor;
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], navColor);
        }
    }
    */
    // Price radius
    /*
    private priceToggle: boolean = false;
    onChangeprice(e){
        this.priceToggle = true;
        let navPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['price'] = e.value;
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navPrice);
    }
    
    refreshPrice(){
        this.priceToggle = false;
        this.price = 550;
        let clearPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['price'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearPrice);
    }
    */

    //radius
    public radiusToggle: boolean = false;
    onChangeRadius(event) {
        this.radiusToggle = true;
        let navRadius: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['radius'] = event.value;
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navRadius);
    }

    refreshRadius() {
        this.radiusToggle = false;
        this.radius = 55;
        let clearRadius: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['radius'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearRadius);
    }

    // Category
    public categories: CategoryInfo[] = [];
    public allCategory: boolean;
    private selectedCategory: CategoryInfo;
    private checkedCategory: string = _.lowerCase(this.activeRoute.queryParams['_value'].category);

    fetchCategory() {
        console.log("XXXXXX XXXXXXX XXXX XXXXXXXX XXXXXXXX XXXXXX XXXX XXXXXX");
        this.restlientService.findAll("/categories").then((value) => {
            console.log("value=" + JSON.stringify(value));
            this.categories = value;
            this.initCategory(value);
        }).catch((error) => {

        });
    }
    /*
    fetchCategory(){
        this.productService.getCategory().subscribe(data => {
            this.categories = data,
            this.initCategory(data)
        });
    }
    */
    initCategory(obj: CategoryInfo[]) {
        if (this.checkedCategory !== undefined && this.checkedCategory != null) {
            this.selectedCategory = _.find(obj, (o) => {
                return o.title == this.checkedCategory
            });
        }
    }
    selectCategory(catagory: CategoryInfo) {
        this.selectedCategory = catagory;
        this.allCategory = false;
        let navCategory: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['category'] = _.kebabCase(catagory.title);
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navCategory);
    }
    resetCategory() {
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
    onSearch(e) {
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee="+e.target.value);
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            let navSearch: NavigationExtras = {
                queryParams: this.objectNavigation
            };

            if (e.target.value.length !== 0) {
                this.objectNavigation['search'] = _.kebabCase(e.target.value);
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            } else {
                delete this.objectNavigation['search'];
                delete this.objectNavigation['page'];
                this.router.navigate([this.navigateRoute], navSearch);
            }
        }, 50);
        
    }

    // Size Product
    /*
    private sizeProduct: Size[] = []
    fetchSize() {
        this.productService.getSize().subscribe(data => {
            this.sizeProduct = data,
                this.initSize()
        });
    }
    initSize() {
        for (let i = 0; i < this.sizeProduct.length; i++) {
            let checkSize = _.find(this.sizes, (e) => {
                return this.sizeProduct[i].size == e
            });
            if (checkSize != undefined) {
                this.sizeProduct[i].check = true;
            }
        }
    }
    arraySize = [];
    selectSize(size, check) {
        if (check == false) {
            this.arraySize.push(size);
        } else {
            let index = this.arraySize.indexOf(size);
            this.arraySize.splice(index, 1);
        }

        if (this.arraySize.length != 0) {
            let navSize: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            this.objectNavigation['size'] = _.kebabCase(JSON.stringify(this.arraySize));
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], navSize);
        } else {
            let clearSize: NavigationExtras = {
                queryParams: this.objectNavigation
            };
            delete this.objectNavigation['size'];
            delete this.objectNavigation['page'];
            this.router.navigate([this.navigateRoute], clearSize);
        }
    }
    */

    // On Page Change
    onPageChange(e) {
        let navSize: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['page'] = e;
        this.router.navigate([this.navigateRoute], navSize);
    }
}
