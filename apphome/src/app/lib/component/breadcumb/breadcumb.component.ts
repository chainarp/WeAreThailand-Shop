import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";

import { Product } from '../../service/data/product';
import { productService } from '../../service/product.service';

@Component({
  selector: 'breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit {
    public segments: any = [];
    private segementLength: number;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private productService: productService
    ){
        this.router.events.subscribe(evt => {
            this.createMap();
        });
    }

    ngOnInit() {
        this.createMap();
    }

    createMap(){
        this.segments = this.activeRoute.snapshot['_urlSegment'].segments;
        this.segementLength = this.segments.length - 1;
        let activeValue = this.activeRoute.url['_value'][0].path;

        for(let i=0; i<this.segments.length; i++){
            this.segments[i].path = _.lowerCase(this.segments[i].path);
            if(this.segments[i].path == 'p'){
                this.segments.splice(i,1);
            }
        }

        if(activeValue == "shop"){
            setTimeout(() => {
                if(!_.isEmpty(this.segments[1])){
                    let productName = this.segments[1].path;
                    this.productService.getSlugProduct(productName).subscribe(product => {
                        if(product != undefined){
                            this.segments[1].path = product.productName;
                        }
                    });
                }
            });
        }
    }
}
