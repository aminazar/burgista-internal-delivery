"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var login_component_1 = require("./login/login.component");
var navbar_component_1 = require("./navbar/navbar.component");
var home_component_1 = require("./home/home.component");
var auth_service_1 = require("./auth.service");
var rest_service_1 = require("./rest.service");
var logged_in_guard_1 = require("./login/logged-in.guard");
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var angular2_material_datepicker_1 = require("angular2-material-datepicker");
require("hammerjs");
var unit_form_component_1 = require("./unit-form/unit-form.component");
var sub_form_component_1 = require("./unit-form/sub-form.component");
var flex_layout_1 = require("@angular/flex-layout");
var rrule_component_1 = require("./rrule/rrule.component");
var monthday_component_1 = require("./rrule/monthday.component");
var product_form_component_1 = require("./product-form/product-form.component");
var product_sub_form_component_1 = require("./product-form/product-sub-form.component");
var counting_rule_component_1 = require("./counting-rule/counting-rule.component");
var message_service_1 = require("./message.service");
var focus_directive_1 = require("./focus.directive");
var override_form_component_1 = require("./override-form/override-form.component");
var inventory_form_component_1 = require("./inventory-form/inventory-form.component");
var delivery_form_component_1 = require("./delivery-form/delivery-form.component");
var print_viewer_component_1 = require("./print-viewer/print-viewer.component");
var print_service_1 = require("./print.service");
var WindowRef_1 = require("./WindowRef");
var reports_component_1 = require("./reports/reports.component");
var primeng_1 = require("primeng/primeng");
var animations_1 = require("@angular/platform-browser/animations");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
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
            inventory_form_component_1.InventoryFormComponent,
            delivery_form_component_1.DeliveryFormComponent,
            print_viewer_component_1.PrintViewerComponent,
            reports_component_1.ReportsComponent,
        ],
        entryComponents: [
            print_viewer_component_1.PrintViewerComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            primeng_1.BlockUIModule,
            material_1.MaterialModule.forRoot(),
            flex_layout_1.FlexLayoutModule,
            forms_1.ReactiveFormsModule,
            angular2_material_datepicker_1.DatepickerModule,
            router_1.RouterModule.forRoot([
                { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
                { path: 'login', component: login_component_1.LoginComponent },
                { path: 'units', component: unit_form_component_1.UnitFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'products', component: product_form_component_1.ProductFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'override', component: override_form_component_1.OverrideFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'inventory', component: inventory_form_component_1.InventoryFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'delivery', component: delivery_form_component_1.DeliveryFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'reports', component: reports_component_1.ReportsComponent, canActivate: [logged_in_guard_1.LoggedInGuard] }
            ]),
        ],
        providers: [auth_service_1.AuthService, rest_service_1.RestService, logged_in_guard_1.LoggedInGuard, message_service_1.MessageService, print_service_1.PrintService, WindowRef_1.WindowRef],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/app.module.js.map