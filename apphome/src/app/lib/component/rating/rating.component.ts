import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
    public rates = [];

    @Input() value:number;

    constructor() { }

    ngOnInit() {}

    ngAfterContentInit(){
        this.rates = [];

        for(let i=0; i<5; i++){
            let obj = {
                index: 1,
                class: null
            };

            if(i < this.value){
                obj.class = 'full';
            }
            this.rates.push(obj);
        }
    }
}
