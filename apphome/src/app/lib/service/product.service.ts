import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as _ from "lodash";

// Object Type
import { Product } from './data/product';
import { Logo } from './data/logo';
import { Category } from './data/category';
import { Size } from './data/size';
import { Color } from './data/color';

@Injectable()
export class productService {
    private base: string = './assets/json/';

    constructor(private http:Http){}

    // Get Products 
    getProduct(): Observable<Product[]>{
        return this.http.get(this.base + 'product.json').map((res:Response) => res.json());
    }

    // Get Product By Id
    getIdProduct(id: number): Observable<Product>{
        return this.getProduct().map(products => products.find(product => product.id === id));
    }

    // Get Product By Slug
    getSlugProduct(slug: string): Observable<Product>{
        return this.getProduct().map(products => products.find(product => product.slug === slug));
    }

    // Get Logo
    getLogo(): Observable<Logo[]>{
      return this.http.get(this.base + 'logo.json').map((res:Response)=> res.json());
    }

    // Get Category
    getCategory(): Observable<Category[]>{
      return this.http.get(this.base + 'category.json').map((res:Response)=> res.json());
    }

    // Get Size
    getSize(): Observable<Size[]>{
        return this.http.get(this.base + 'size.json').map((res:Response)=> res.json());
    }

    // Get Color
    getColor(): Observable<Color[]>{
        return this.http.get(this.base + 'color.json').map((res:Response)=> res.json());
    }
}
