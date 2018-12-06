"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var navbar_component_1 = require("./navbar.component");
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var testing_2 = require("@angular/router/testing");
var auth_service_1 = require("../auth.service");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
describe('NavbarComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [navbar_component_1.NavbarComponent],
            imports: [router_1.RouterModule,
                platform_browser_1.BrowserModule,
                material_1.MaterialModule.forRoot(),
                testing_2.RouterTestingModule,
            ],
            providers: [router_1.RouterOutletMap, auth_service_1.AuthService, rest_service_1.RestService, message_service_1.MessageService]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(navbar_component_1.NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/navbar/navbar.component.spec.js.map