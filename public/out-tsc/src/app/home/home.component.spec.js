"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var home_component_1 = require("./home.component");
var testing_2 = require("@angular/router/testing");
describe('HomeComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [home_component_1.HomeComponent],
            imports: [router_1.RouterModule],
            providers: [router_1.RouterOutletMap, testing_2.RouterTestingModule]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(home_component_1.HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/home/home.component.spec.js.map