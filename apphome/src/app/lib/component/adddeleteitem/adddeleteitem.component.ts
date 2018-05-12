import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { CustomerLocationInfo } from '../../../services/app-data-model/app-data-model';//'/app-data-model/app-data-model';

//import { Product } from '../../service/data/product';
//import { productService } from '../../service/product.service';

@Component({
    selector: 'adddeleteitem', 
    templateUrl: './adddeleteitem.component.html',
    styleUrls: ['./adddeleteitem.component.scss'],
})
export class AddDeleteItemComponent {
    public static zeroRadioCheckedId: any = '0';//'0.00000000000000000';
    public currentRowId: any;
    public radioCheckedId: any;

    //rangeValue: any = 10;
    //private radioCheckedItem: any;

    @Input('items') items: Array<CustomerLocationInfo>;
    @Input('checkedItem') checkedItem: any;
    @Input('rangeValue') rangeValue: any;

    @Output('radioCheckedIdChangeEvent') radioCheckedIdChangeEventEmitter = new EventEmitter();
    @Output('addItemPressEvent') addItemPressEventEmitter = new EventEmitter();
    @Output('removeCheckedItemPressEvent') removeCheckedItemPressEventEmitter = new EventEmitter();

    @Output('rangeChangeEvent') rangeChangeEventEmitter = new EventEmitter();
    @Output('gotoHomeEvent') gotoHomeEventEmitter = new EventEmitter();
    /*
    items = [
      {
        id: AdddeleteitemComponent.zeroRadioCheckedId, title: 'CURRENT_LOCATION', icon: 'pin', checked: true
      },
      {
        id: '111', title: 'Home 1', icon: 'book', checked: 'false'
      },
      {
        id: '222', title: 'Home 2', icon: 'book', checked: 'false'
      },
    ];
    */
    constructor() {
        console.log('AdddeleteitemComponent.constructor()');
        //this.text = 'Hello World';
    }
    ngAfterViewInit() {
        console.log('AdddeleteitemComponent.ngAfterViewInit()');
        this.currentRowId = this.checkedItem.id;
        this.radioCheckedId = this.checkedItem.id;//AdddeleteitemComponent.zeroRadioCheckedId;
        this.radioCheckedIdChangeEventEmitter.emit(this.checkedItem);
    }

    radioclick(item, rowId, radioCheckedId) {
        console.log(item + "::" + rowId + "::" + radioCheckedId);
        this.currentRowId = rowId;
        this.radioCheckedId = radioCheckedId;
        this.checkedItem = item;
        this.radioCheckedIdChangeEventEmitter.emit(this.checkedItem);

    }

    addItem() {
        console.log('AdddeleteitemComponent.addItem()');
        this.addItemPressEventEmitter.emit(this.items);
        //let randomNumber: number = Math.random();
        //this.items.push({ id: '' + randomNumber, title: 'Thing ' + (this.items.length + 1), detail1: '', detail2: '', latlng: '', icon: 'book', checked: false });
    }


    removeCheckedItem() {
        console.log('AdddeleteitemComponent.removeCheckedItem() items.length=' + this.items.length + ' :: currentRowId=' + this.currentRowId);

        if (this.currentRowId > 0) {
            this.checkedItem = this.items[0];
            this.radioCheckedId = this.checkedItem.id;
            this.radioCheckedIdChangeEventEmitter.emit(this.checkedItem);
            this.items.splice(this.currentRowId, 1);
            this.currentRowId = 0;
        }

        this.removeCheckedItemPressEventEmitter.emit(this.items);

    }

    rangeValueChange() {
        //console.log("radius="+this.radius);
        this.rangeChangeEventEmitter.emit(this.rangeValue);
    }

    refreshRadius(){
        
    }

    public gotoHomePage() {
        this.gotoHomeEventEmitter.emit();
    }
}
