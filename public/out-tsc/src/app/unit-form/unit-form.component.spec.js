"use strict";
var testing_1 = require('@angular/core/testing');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
var unit_form_component_1 = require('./unit-form.component');
var sub_form_component_1 = require("./sub-form.component");
var rest_service_1 = require("../rest.service");
var unit_1 = require("./unit");
var unit_model_1 = require("./unit.model");
var actionEnum_1 = require("./actionEnum");
var message_service_1 = require("../message.service");
describe('UnitFormComponent', function () {
    var component;
    var fixture;
    var tempUnitModels = [];
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                unit_form_component_1.UnitFormComponent,
                sub_form_component_1.SubFormComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                material_1.MaterialModule.forRoot(),
            ],
            providers: [
                message_service_1.MessageService,
                rest_service_1.RestService
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(unit_form_component_1.UnitFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should show the origin title', function () {
        var de = fixture.debugElement.query(platform_browser_1.By.css('md-card-title'));
        var el = de.nativeElement;
        expect(el.textContent).toContain('Branches and Preparation Units');
    });
    it('should sort a unitModels list', function () {
        var first_unit = new unit_1.Unit();
        first_unit.id = 1;
        first_unit.name = 'Piccadilly';
        first_unit.username = 'Jack';
        first_unit.password = '';
        first_unit.is_branch = true;
        tempUnitModels.push(new unit_model_1.UnitModel(first_unit));
        var second_unit = new unit_1.Unit();
        second_unit.id = 2;
        second_unit.name = 'Shepherd’s Bush';
        second_unit.username = 'Joe';
        second_unit.password = '';
        second_unit.is_branch = true;
        tempUnitModels.push(new unit_model_1.UnitModel(second_unit));
        var third_unit = new unit_1.Unit();
        third_unit.id = 3;
        third_unit.name = 'Baker Street';
        third_unit.username = 'John';
        third_unit.password = '';
        third_unit.is_branch = true;
        tempUnitModels.push(new unit_model_1.UnitModel(third_unit));
        var first_prep = new unit_1.Unit();
        first_prep.id = 4;
        first_prep.name = 'main prep';
        first_prep.username = 'Johny';
        first_prep.password = '';
        first_prep.is_branch = false;
        tempUnitModels.push(new unit_model_1.UnitModel(first_prep));
        component.unitModels = tempUnitModels;
        component.sortUnitModelList();
        fixture.detectChanges();
        expect(component.unitModels[0]._unit.name).toContain('main prep');
        expect(component.unitModels[1]._unit.name).toContain('Baker Street');
        expect(component.unitModels[2]._unit.name).toContain('Piccadilly');
        expect(component.unitModels[3]._unit.name).toContain('Shepherd’s Bush');
    });
    it('should delete a unitModel from unitModel list', testing_1.fakeAsync(function () {
        component.unitModels = tempUnitModels;
        fixture.detectChanges();
        var tempValueObj = {
            type: actionEnum_1.ActionEnum.delete,
            data: tempUnitModels[1]._unit
        };
        fixture.detectChanges();
        var restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var spy = spyOn(restService, 'delete').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve()));
        expect(component.unitModels.length).toBe(4);
        component.doClickedAction(tempValueObj);
        testing_1.tick();
        expect(spy.calls.any()).toBe(true);
        expect(component.unitModels.length).toBe(3);
    }));
    it('should add a unitModel to unitModel list', testing_1.fakeAsync(function () {
        var unit = new unit_1.Unit();
        unit.id = -1;
        unit.name = 'No Name';
        unit.username = 'No Username';
        unit.password = '123';
        unit.is_branch = false;
        var tempValueObj = {
            type: actionEnum_1.ActionEnum.add,
            data: unit
        };
        component.unitModels = tempUnitModels;
        expect(component.unitModels.length).toBe(4);
        var restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var spy = spyOn(restService, 'insert').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve(5)));
        component.doClickedAction(tempValueObj);
        testing_1.tick();
        expect(spy.calls.any()).toBe(true);
        fixture.detectChanges();
        expect(component.unitModels[0]._unit.password).toBe('');
        expect(component.unitModels.length).toBe(5);
    }));
    it('should update an existing unitModel in unitModel list', testing_1.fakeAsync(function () {
        component.unitModels = tempUnitModels;
        component.sortUnitModelList();
        expect(component.unitModels[2]._unit.name).toBe('Baker Street');
        var restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var spy = spyOn(restService, 'update').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve()));
        component.unitModels[2]._unit.name = 'Another name';
        var tempValueObj = {
            type: actionEnum_1.ActionEnum.update,
            data: component.unitModels[2]._unit
        };
        component.doClickedAction(tempValueObj);
        testing_1.tick();
        expect(spy.calls.any()).toBe(true);
        expect(component.unitModels[2]._unit.password).toBe('');
        expect(component.unitModels[2]._unit.name).toBe('Another name');
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/unit-form/unit-form.component.spec.js.map