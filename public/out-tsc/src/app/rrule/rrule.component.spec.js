"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var rrule_component_1 = require("./rrule.component");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var testing_2 = require("@angular/router/testing");
var monthday_component_1 = require("./monthday.component");
describe('RruleComponent', function () {
    var component;
    var fixture;
    var rruleStr = '';
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [rrule_component_1.RRuleComponent, monthday_component_1.MonthdayComponent],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                testing_2.RouterTestingModule,
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(rrule_component_1.RRuleComponent);
        component = fixture.componentInstance;
        component.RRuleStr = rruleStr;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rrule/rrule.component.spec.js.map