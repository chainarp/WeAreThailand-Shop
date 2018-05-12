import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

    constructor(
        private meta: Meta,
        private titleService: Title,
    ) { }
    ngOnInit() {
        this.meta.addTag({ name: 'keyword', content: 'Angushop - Angular Shop Templatet' });
        this.meta.addTag({ name: 'description', content: 'Angushop - Not Found Shop Template' });
        this.meta.addTag({ name: 'robots', content: 'index, follow' });
    }
}
