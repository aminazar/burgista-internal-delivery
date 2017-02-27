"use strict";
var testing_1 = require('@angular/core/testing');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var rxjs_1 = require("rxjs");
var sub_form_component_1 = require('./sub-form.component');
var unit_model_1 = require("./unit.model");
var unit_1 = require('./unit');
var actionEnum_1 = require("./actionEnum");
describe('SubFormComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [sub_form_component_1.SubFormComponent],
            imports: [forms_1.FormsModule, material_1.MaterialModule.forRoot()]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(sub_form_component_1.SubFormComponent);
        component = fixture.componentInstance;
    });
    it('should create', function () {
        component.isAdd = true;
        var actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        component.actionIsSuccess = actionIsSuccess;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
    it('should equal to given unit model', testing_1.fakeAsync(function () {
        var unit = new unit_1.Unit();
        unit.id = 0;
        unit.name = 'center branch';
        unit.username = 'john';
        unit.password = '';
        unit.is_branch = true;
        var unitModel = new unit_model_1.UnitModel(unit);
        component.unitModel = unitModel;
        var actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        component.actionIsSuccess = actionIsSuccess;
        component.isAdd = false;
        fixture.detectChanges();
        var de = fixture.debugElement.query(platform_browser_1.By.css('.name'));
        var el = de.nativeElement;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        testing_1.tick();
        expect(el.value).toContain('center branch');
        de = fixture.debugElement.query(platform_browser_1.By.css('.username'));
        el = de.nativeElement;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        testing_1.tick();
        expect(el.value).toContain('john');
        de = fixture.debugElement.query(platform_browser_1.By.css('.password'));
        el = de.nativeElement;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        testing_1.tick();
        expect(el.value).toBe('');
    }));
    it('should be enabled after change name/username/password', testing_1.fakeAsync(function () {
        var unit = new unit_1.Unit();
        unit.id = 0;
        unit.name = 'ali';
        unit.username = 'ahmadi';
        unit.password = '';
        unit.is_branch = true;
        var unitModel = new unit_model_1.UnitModel(unit);
        component.unitModel = unitModel;
        component.isAdd = false;
        var actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        component.actionIsSuccess = actionIsSuccess;
        fixture.detectChanges();
        var de = fixture.debugElement.query(platform_browser_1.By.css('.name'));
        var el = de.nativeElement;
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        testing_1.tick();
        expect(el.value).toContain('ali');
        el.value = 'mahdi';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        testing_1.tick();
        actionIsSuccess.next(true);
        de.triggerEventHandler('keyup', null);
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.updateBtn')).nativeElement.disabled).toBe(false);
    }));
    it('should trigger event to delete specific unitModel', function () {
        var unit = new unit_1.Unit();
        unit.id = 1;
        unit.name = 'Baker Street';
        unit.username = 'John';
        unit.password = '';
        unit.is_branch = true;
        var actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        component.isAdd = false;
        component.unitModel = new unit_model_1.UnitModel(unit);
        component.actionIsSuccess = actionIsSuccess;
        fixture.detectChanges();
        var rcvId = 0;
        component.action.subscribe(function (value) { return rcvId = value.data.id; });
        var de = fixture.debugElement.query(platform_browser_1.By.css('.deleteBtn'));
        de.triggerEventHandler('click', actionEnum_1.ActionEnum.delete);
        expect(rcvId).toBe(1);
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/unit-form/sub-form.component.spec.js.map