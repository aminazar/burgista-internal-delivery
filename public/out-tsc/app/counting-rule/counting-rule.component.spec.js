"use strict";
var testing_1 = require('@angular/core/testing');
var forms_1 = require("@angular/forms");
var counting_rule_component_1 = require('./counting-rule.component');
var message_service_1 = require("../message.service");
var material_1 = require("@angular/material");
var rrule_component_1 = require("../rrule/rrule.component");
var monthday_component_1 = require("../rrule/monthday.component");
var platform_browser_1 = require("@angular/platform-browser");
describe('CountingRuleComponent', function () {
    var component;
    var fixture;
    var rruleStr = '';
    var maxQty = 0;
    var minQty = 0;
    var coefficients = {
        Monday: 1,
        Tuesday: 1,
        Wednesday: 1,
        Thursday: 1,
        Friday: 1,
        Saturday: 1,
        Sunday: 1,
        Usage: 1,
    };
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                counting_rule_component_1.CountingRuleComponent,
                rrule_component_1.RRuleComponent,
                monthday_component_1.MonthdayComponent
            ],
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                material_1.MaterialModule.forRoot()
            ],
            providers: [
                message_service_1.MessageService
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(counting_rule_component_1.CountingRuleComponent);
        component = fixture.componentInstance;
        component.recursionRule = rruleStr;
        component.maxQty = maxQty;
        component.minQty = minQty;
        component.coefficients = coefficients;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should update minQty value on change (Two way binding)', testing_1.fakeAsync(function () {
        var minQtyField = fixture.debugElement.query(platform_browser_1.By.css('.minQty')).nativeElement;
        expect(component.minQty).toBe(0);
        minQtyField.value = '12';
        minQtyField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(component.minQty).toBe(12);
    }));
    it('should raise an error message', testing_1.fakeAsync(function () {
        var minQtyField = fixture.debugElement.query(platform_browser_1.By.css('.minQty')).nativeElement;
        var maxQtyDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.maxQty'));
        var maxQtyField = maxQtyDebugElement.nativeElement;
        minQtyField.value = '12';
        minQtyField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        maxQtyField.value = '10';
        maxQtyField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var errorData;
        component.hasError.subscribe(function (data) { return errorData = data; });
        maxQtyDebugElement.triggerEventHandler('keyup', null);
        testing_1.tick();
        fixture.detectChanges();
        expect(component.minQty).toBe(12);
        expect(component.maxQty).toBe(10);
        expect(errorData.hasError).toBe(true);
        expect(errorData.message).toBe('The minQty should be less than maxQty');
    }));
    it('should replace 0 instead of negative value in minQty', testing_1.fakeAsync(function () {
        var minQtyDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.minQty'));
        var minQtyField = minQtyDebugElement.nativeElement;
        minQtyField.value = -1;
        minQtyField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        minQtyDebugElement.triggerEventHandler('keyup', null);
        testing_1.tick();
        fixture.detectChanges();
        minQtyField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        minQtyDebugElement.triggerEventHandler('keyup', null);
        testing_1.tick();
        fixture.detectChanges();
        expect(parseInt(minQtyField.value)).toBe(0);
        expect(component.minQty).toBe(0);
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/counting-rule/counting-rule.component.spec.js.map