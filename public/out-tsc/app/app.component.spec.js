"use strict";
var testing_1 = require('@angular/core/testing');
var app_component_1 = require('./app.component');
var navbar_component_1 = require("./navbar/navbar.component");
var home_component_1 = require("./home/home.component");
var router_1 = require("@angular/router");
var testing_2 = require("@angular/router/testing");
var login_component_1 = require("./login/login.component");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var http_1 = require("@angular/http");
var auth_service_1 = require("./auth.service");
var rest_service_1 = require("./rest.service");
var logged_in_guard_1 = require("./login/logged-in.guard");
var message_service_1 = require("./message.service");
var counting_rule_component_1 = require("./counting-rule/counting-rule.component");
var override_form_component_1 = require("./override-form/override-form.component");
var product_form_component_1 = require("./product-form/product-form.component");
var product_sub_form_component_1 = require("./product-form/product-sub-form.component");
var unit_form_component_1 = require("./unit-form/unit-form.component");
var sub_form_component_1 = require("./unit-form/sub-form.component");
var rrule_component_1 = require("./rrule/rrule.component");
var monthday_component_1 = require("./rrule/monthday.component");
var testing_3 = require("@angular/http/testing");
describe('App: Burgista Internal Delivery', function () {
    var app;
    var fixture;
    var mockBackend, restService, authService, router;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                app_component_1.AppComponent,
                navbar_component_1.NavbarComponent,
                home_component_1.HomeComponent,
                login_component_1.LoginComponent,
                counting_rule_component_1.CountingRuleComponent,
                override_form_component_1.OverrideFormComponent,
                product_form_component_1.ProductFormComponent,
                product_sub_form_component_1.ProductSubFormComponent,
                unit_form_component_1.UnitFormComponent,
                sub_form_component_1.SubFormComponent,
                rrule_component_1.RRuleComponent,
                monthday_component_1.MonthdayComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                testing_2.RouterTestingModule.withRoutes([
                    { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
                    { path: 'login', component: login_component_1.LoginComponent }
                ]),
                forms_1.ReactiveFormsModule,
            ],
            providers: [
                rest_service_1.RestService,
                auth_service_1.AuthService,
                testing_3.MockBackend,
                http_1.BaseRequestOptions,
                message_service_1.MessageService,
                logged_in_guard_1.LoggedInGuard,
                {
                    provide: http_1.Http,
                    deps: [testing_3.MockBackend, http_1.BaseRequestOptions],
                    useFactory: function (backend, defaultOptions) {
                        return new http_1.Http(backend, defaultOptions);
                    }
                },
            ]
        })
            .compileComponents();
        mockBackend = testing_1.getTestBed().get(testing_3.MockBackend);
        restService = testing_1.getTestBed().get(rest_service_1.RestService);
        authService = testing_1.getTestBed().get(auth_service_1.AuthService);
        router = testing_1.getTestBed().get(router_1.Router);
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });
    it('should create the app', function () {
        expect(app).toBeTruthy();
    });
    it("should have as title 'app works!'", function () {
        expect(app.title).toEqual('app works!');
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/app.component.spec.js.map