"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var login_component_1 = require("./login.component");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var auth_service_1 = require("../auth.service");
var rest_service_1 = require("../rest.service");
var testing_2 = require("@angular/router/testing");
require("hammerjs");
var message_service_1 = require("../message.service");
describe('LoginComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [login_component_1.LoginComponent],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                testing_2.RouterTestingModule
            ],
            providers: [auth_service_1.AuthService, rest_service_1.RestService, message_service_1.MessageService]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(login_component_1.LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should not be enabled initially', function () {
        expect(component.loginEnabled).toBeFalsy();
    });
    it('should should be enabled after entring user/pass', function () {
        component.username = 'amin';
        component.password = 'test123';
        component.onChange();
        expect(component.loginEnabled).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/login/login.component.spec.js.map