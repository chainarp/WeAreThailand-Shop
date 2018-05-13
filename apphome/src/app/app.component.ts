import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
// Custom Icons (Aud)
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


//var geolocation = require('geolocation')

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

    constructor(
        private router: Router,
        private meta: Meta,
        private titleService: Title,
        private slimLoadingBarService: SlimLoadingBarService,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        this.matIconRegistry.addSvgIcon(
            "icon-home", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-home.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "icon-menu", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-menu.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "icon-chef", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-chef.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "icon-pin", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-pin.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "icon-food", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-food.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "icon-order", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/icon-order.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "spoon-knife", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/spoon-knife.svg")
        );
    }

    mainclass: boolean;
    ngOnInit() {
        this.slimLoadingBarService.start();
        document.getElementById("loader").style.display = 'none';

        this.router.events.subscribe(evt => {
            this.mainclass = false;
            window.scrollTo(0, 0);
            this.slimLoadingBarService.complete();
        });

        this.meta.addTag({ name: 'keyword', content: 'Angushop, angular, eccommerce, template, Material Design' });
        this.meta.addTag({ name: 'description', content: 'Angushop - Angular 4 Shop Template Material Design' });
        this.meta.addTag({ name: 'robots', content: 'index, follow' });
    }
}
