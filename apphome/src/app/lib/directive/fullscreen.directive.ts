import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[fullheight]'
})
export class FullscreenDirective implements OnInit {
    constructor(
        private el: ElementRef
    ){}

    ngOnInit(){
      this.initHeightStyle(); 
    }

    // Window On Resize
    @HostListener('window:resize', ['$event']) onResize(event) {
        this.initHeightStyle();     
    }

    initHeightStyle(){
        var height = window.innerHeight;
        this.el.nativeElement.style.height = height + 'px';    
    }
}
