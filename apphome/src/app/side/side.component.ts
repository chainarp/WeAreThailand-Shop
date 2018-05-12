import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from '../lib/service/cookie.service';

//import { SharingDataServiceProvider } from '../services/sharing-data-service/sharing-data.service';
//import { CustomerLocationInfo } from '../services/app-data-model/app-data-model';
import { CartServiceProvider } from '../services/cart-service/cart-service-provider';


@Component({
    selector: 'app-side',
    templateUrl: './side.component.html',
    styleUrls: ['./side.component.scss'],
    animations: [
        trigger('slideUp', [
            state('void', style({
                height: '*'
            })),
            transition('void => *', [
                animate(500, keyframes([
                    style({ opacity: 0, offset: 0, height: 0 }),
                    style({ opacity: 0.2, offset: 0.2, height: '*' }),
                    style({ opacity: 1, offset: 1.0, height: 'auto' })
                ]))
            ]),
            transition('* => void', [
                animate(200, keyframes([
                    style({ opacity: 1, offset: 0, height: 'auto' }),
                    style({ opacity: 0.2, offset: 0.2, height: '*' }),
                    style({ opacity: 0, offset: 1.0, height: 0 })
                ]))
            ])
        ])
    ],
    providers: [CookieService]
})
export class SideComponent implements OnInit {
    private selectedMenu: any = null;

    public wrapbrand: any;
    public wishlistLenth: any;
    //public cartServiceProvider : any;
    // Menus
    public menus = [
        {
            label: 'ผู้ใช้งาน',
            link: null,
            children: [
                {
                    label: 'เข้าใช้งานระบบ',
                    link: '/login'
                }
                ,
                {
                    label: 'แก้ไขข้อมูลผู้ใช้',
                    link: '/editUser'
                }
            ]
        },
        /*
        {
            label: 'Shop',
            link: null,
            children: [
                {
                    label: 'Product',
                    link: '/shop/product1'
                }
                // ,
                // {
                //     label: 'Product 2',
                //     link: '/shop/product2'
                // },
                // {
                //     label: 'Product 3',
                //     link: '/shop/product3'
                // },
                // {
                //     label: 'Product 4',
                //     link: '/shop/product4'
                // },
                // {
                //     label: 'Product 5',
                //     link: '/shop/product5'
                // }
            ]
        },
        */
        // {
        //     label: 'Elements', 
        //     link: null,
        //     children: [
        //         {
        //             label: 'Products',
        //             link: '/element/product'
        //         },
        //         {
        //             label: 'Form Controls',
        //             link: '/element/form'
        //         },
        //         {
        //             label: 'Layout',
        //             link: '/element/layout'
        //         },
        //         {
        //             label: 'Button, Indicators & Icons',
        //             link: '/element/button'
        //         },
        //         {
        //             label: 'Grid Columns',
        //             link: '/element/grid'
        //         },
        //         {
        //             label: 'Helper',
        //             link: '/element/helper'
        //         },
        //         {
        //             label: 'Typography',
        //             link: '/element/typography'
        //         }
        //     ]
        // },
        // {
        //     label: 'Pages', 
        //     link: null,
        //     children: [
        //         {
        //             label: 'Shop Cart',
        //             link: '/shop/cart'
        //         },
        //         {
        //             label: 'Shop Shipping',
        //             link: '/shop/shipping'
        //         },
        //         {
        //             label: 'Shop Receipt',
        //             link: '/shop/receipt'
        //         },
        //         {
        //             label: '404',
        //             link: '/404'
        //         }
        //     ]
        // },
        // {
        //     label: 'Contact Us', 
        //     link: '/contact'
        // }
    ];

    private cartLength: number;
    public wishlistLength: number;
    private comapreLength: number;

    @ViewChild('navmenu') nav: ElementRef;

    constructor(
        private router: Router,
        private cookie: CookieService,
        public cartServiceProvider: CartServiceProvider,
    ) {
        setInterval(() => {
            this.cookie.updateCookie();
            this.cookie.initCookie();
            this.cartLength = this.cookie['productsOrder'].length;
            this.wishlistLength = this.cookie['arrWishList'].length;
            this.comapreLength = this.cookie['arrCompare'].length;
        }, 1000);
    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            this.activebar = false;
        });
    }

    ngAfterViewInit() {
        this.nav.nativeElement.style.height = window.innerHeight + 'px';
    }

    // Event Listener
    @HostListener('window:resize', ['$event']) onResize(event) {
        this.nav.nativeElement.style.height = window.innerHeight + 'px';
    }

    // On Select Menu
    selectMenu(menu) {
        if (menu == this.selectedMenu) {
            this.selectedMenu = null;
        } else {
            this.selectedMenu = menu;
        }
    }

    activebar = false;
    @Output() toggle = new EventEmitter();

    // Toggle Bar
    toggleBar() {
        this.toggle.emit();
        this.activebar = !this.activebar;
    }
}
