import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import * as _ from "lodash";

import { MatSnackBar } from '@angular/material';

import { CookieService } from '../../lib/service/cookie.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
    public productWishlist = [];

    constructor(
      private router: Router,
      public snackBar: MatSnackBar,
      private cookie: CookieService
    ){}

    ngOnInit() {
        this.productWishlist = this.cookie['arrWishList'];
    }

    // On Select Remove
    onSelectRemove(e){
        let getIndex = this.productWishlist.indexOf(Number(e.wishlist));
        this.productWishlist.splice(getIndex, 1);
        this.cookie.addCookie('wishlist', JSON.stringify(this.productWishlist));
        this.openSnackBar(e.productName, 'Deleted from wishlist');
    }

    // Snack Bar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
    }

}
