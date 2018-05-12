import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../lib/service/cookie.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

    constructor(
      private router: Router,
      private cookie: CookieService      
    ){}

    ngOnInit() {
        /*
        if(this.cookie['payed'] == ''){
            this.router.navigate(['/shop/shipping']);
        }else{
            this.cookie.addCookie('payed', '');            
        }
        */
    }

}
