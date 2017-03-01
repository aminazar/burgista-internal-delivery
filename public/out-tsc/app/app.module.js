"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var login_component_1 = require('./login/login.component');
var navbar_component_1 = require('./navbar/navbar.component');
var home_component_1 = require('./home/home.component');
var auth_service_1 = require("./auth.service");
var rest_service_1 = require("./rest.service");
var logged_in_guard_1 = require("./login/logged-in.guard");
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
require('hammerjs');
var unit_form_component_1 = require('./unit-form/unit-form.component');
var sub_form_component_1 = require('./unit-form/sub-form.component');
var flex_layout_1 = require("@angular/flex-layout");
var rrule_component_1 = require('./rrule/rrule.component');
var monthday_component_1 = require('./rrule/monthday.component');
var product_form_component_1 = require("./product-form/product-form.component");
var product_sub_form_component_1 = require("./product-form/product-sub-form.component");
var counting_rule_component_1 = require('./counting-rule/counting-rule.component');
var message_service_1 = require("./message.service");
var focus_directive_1 = require('./focus.directive');
var override_form_component_1 = require('./override-form/override-form.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                navbar_component_1.NavbarComponent,
                home_component_1.HomeComponent,
                unit_form_component_1.UnitFormComponent,
                sub_form_component_1.SubFormComponent,
                rrule_component_1.RRuleComponent,
                monthday_component_1.MonthdayComponent,
                product_form_component_1.ProductFormComponent,
                product_sub_form_component_1.ProductSubFormComponent,
                counting_rule_component_1.CountingRuleComponent,
                focus_directive_1.FocusDirective,
                override_form_component_1.OverrideFormComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                flex_layout_1.FlexLayoutModule,
                forms_1.ReactiveFormsModule,
                router_1.RouterModule.forRoot([
                    { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
                    { path: 'login', component: login_component_1.LoginComponent },
                    { path: 'units', component: unit_form_component_1.UnitFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                    { path: 'products', component: product_form_component_1.ProductFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                    { path: 'override', component: override_form_component_1.OverrideFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                ]),
            ],
            providers: [auth_service_1.AuthService, rest_service_1.RestService, logged_in_guard_1.LoggedInGuard, message_service_1.MessageService],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/app.module.js.map