import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { productService } from '../../lib/service/product.service';
//import { Category } from '../../lib/service/data/category';
import { SellerGroupInfo } from '../../lib/service/data/seller-group-info';
import { Size } from '../../lib/service/data/size';
import { Color } from '../../lib/service/data/color';
import { Product } from '../../lib/service/data/product';

import { RESTClientService } from '../../services/restclient/restclient.service';
import { SharingDataServiceProvider } from '../../services/sharing-data-service/sharing-data.service';
import { CustomerLocationServiceProvider } from '../customer-location/customer-location-service/customer-location-service';

import swal from 'sweetalert2';


@Component({
    selector: 'app-product2',
    templateUrl: './product2.component.html',
    styleUrls: ['./product2.component.scss']
})
export class Product2Component implements OnInit {
    public search: string = null;
    public price: number;
    public page: number;
    public category: string;
    public radius: number;
    public sizes: any;
    public color: string;
    public valueSearch: string = '';
    private objectNavigation = {};
    public currentPage: number = 1;
    private navigateRoute = 'shop/product2';

    constructor(
        //private router: Router,
        //private activeRoute: ActivatedRoute,
        //private productService: productService
        private router: Router,
        private activeRoute: ActivatedRoute,
        private productService: productService,
        private restlientService: RESTClientService,
        private sharingDataServiceProvider: SharingDataServiceProvider,
        private customerLocationServiceProvider: CustomerLocationServiceProvider
    ) {
        this.activeRoute.queryParams.subscribe(params => {
            this.search = _.lowerCase(params["search"]);
            this.price = Number(params["price"]);
            this.category = _.lowerCase(params["category"]);
            this.color = params["color"];

            // Pagination
            if (!isNaN(params["page"])) {
                this.currentPage = Number(params["page"]);
            } else {
                this.currentPage = 1;
            }

            if (params["size"] != undefined) {
                this.sizes = params["size"].split('-').map(function (item) {
                    return parseInt(item, 10);
                });

                // Init Size
                _.merge(this.arraySize, this.sizes);
            } else {
                this.sizes = null;
            }

            if (!_.isEmpty(params)) {
                // Merge Object on init
                _.merge(this.objectNavigation, params);

                // Value Search
                if (this.search != undefined) {
                    this.valueSearch = this.search;
                }

                // Value Price
                if (!isNaN(this.price)) {
                    this.priceToggle = true;
                }
            }
        });
    }

    ngOnInit() {
        // Fetch init
        this.fetchCategory();
        this.fetchSize();
        this.fetchColor();

        // Check Category
        if (this.chekCategory == '') {
            this.allCategory = true;
        }
    }

    ngAfterViewInit() {
        //swal('Sorry !', ">> No NearBy Available Items Found <<", "error");
        swal({
            title: 'ท่านกำลังสั่งซื้ออาหาร',
            text: 'โดยให้ส่งไปยัง >> '+this.customerLocationServiceProvider.currentCustomerLocationInfo.title,
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
    // Color
    public colors: Color[] = [];
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

    // Price
    public priceToggle: boolean = false;
    onChangeprice(e) {
        this.priceToggle = true;
        let navPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['price'] = e.value;
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], navPrice);
    }
    refreshPrice() {
        this.priceToggle = false;
        this.price = 550;
        let clearPrice: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        delete this.objectNavigation['price'];
        delete this.objectNavigation['page'];
        this.router.navigate([this.navigateRoute], clearPrice);
    }

    // Category
    public categories: SellerGroupInfo[] = [];
    public allCategory: boolean;
    private selectedCategory: SellerGroupInfo;
    private chekCategory: string = _.lowerCase(this.activeRoute.queryParams['_value'].category);

    fetchCategory() {
        console.log("XXXXXX XXXXXXX XXXX XXXXXXXX XXXXXXXX XXXXXX XXXX XXXXXX");
        this.restlientService.findAll("/sellerGroups").then((value) => {
            console.log("value=" + JSON.stringify(value));
            this.categories = value;
            this.initCategory(value);
        }).catch((error) => {

        });
        /*
        this.productService.getCategory().subscribe(data => {
            this.categories = data,
            this.initCategory(data)
        });
        */
    }
    initCategory(obj: SellerGroupInfo[]) {
        if (this.chekCategory !== undefined) {
            this.selectedCategory = _.find(obj, (o) => {
                //return o.categoryName == this.chekCategory
                return o.title == this.chekCategory;
            });
        }
    }
    selectCategory(catagory: SellerGroupInfo) {
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
        }, 500);
    }

    // Size Product
    public sizeProduct: Size[] = []
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

    // On Page Change
    onPageChange(e) {
        let navSize: NavigationExtras = {
            queryParams: this.objectNavigation
        };
        this.objectNavigation['page'] = e;
        this.router.navigate([this.navigateRoute], navSize);
    }

}
