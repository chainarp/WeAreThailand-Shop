import { 
    Component, 
    ElementRef, 
    HostListener, 
    HostBinding,
    OnInit, 
    Directive, 
    Input
} from '@angular/core';
import * as _ from "lodash";

@Directive({
    selector: '[homeslide]'
})
export class HomeslideDirective implements OnInit {
    @Input() position: any;
    @Input() initialized: boolean;

    constructor(
        private el: ElementRef
    ){}

    ngOnInit(){
        this.initSlider(); 
    }
    
    ngOnChanges(){
        if(this.initialized == true){
            setTimeout(()=>{
                this.initSlider();  
            }); 
        }
        this.el.nativeElement.firstElementChild.style.transform = "translateX("+ this.position +"px)"; 
    }

    // Window On Resize
    @HostListener('window:resize', ['$event']) onResize(event) { 
        setTimeout(()=>{
            this.initSlider();  
        });
        this.el.nativeElement.firstElementChild.style.transform = "translateX(0px)"; 
    }

    // Initail Height Fullscreen and width column
    initSlider(){
        let height = window.innerHeight;
        let childELement = this.el.nativeElement.firstElementChild.children;        
        let arrayWidth = [];
        let totalWidth = 0;
        let parentWidth = this.el.nativeElement.offsetWidth;

        for(let i=0; i<childELement.length; i++){
            var setWidth = parentWidth * 0.25;
            if(i == 0){
                setWidth = parentWidth * 0.50;
            }
            
            childELement[i].style.width = setWidth + 'px';
            childELement[i].firstElementChild.style.height = height + 'px';  
            arrayWidth.push(setWidth);
        }  

        // Subtotal
        totalWidth = _.reduce(arrayWidth, function(sum, n) {
            return sum + n;
        }, 0);
        this.el.nativeElement.firstElementChild.style.width = totalWidth + 'px';
    }
};
