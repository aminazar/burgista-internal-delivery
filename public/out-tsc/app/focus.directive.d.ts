import { ElementRef, Renderer, AfterViewInit } from '@angular/core';
export declare class FocusDirective implements AfterViewInit {
    private _el;
    private renderer;
    constructor(_el: ElementRef, renderer: Renderer);
    ngAfterViewInit(): void;
}
