import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardProdut implements OnInit {
    private orderbyprice: boolean = false;
    private orderbyname: boolean = false;
    
    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute
    ){}

    ngOnInit(){}
}
