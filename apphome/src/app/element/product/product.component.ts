import { Component } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

@Component({
    selector: 'product-element',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductElement {
    private objectNavigation = {};

    constructor(
        private router: Router
    ){}

    // Detail Product
    detailProduct(e){
        let product = _.kebabCase(e.slug);
        this.router.navigate(['shop/p/' + product]);
    }
}
