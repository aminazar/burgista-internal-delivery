"use strict";
var testing_1 = require('@angular/core/testing');
var platform_browser_1 = require('@angular/platform-browser');
var product_sub_form_component_1 = require('./product-sub-form.component');
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var counting_rule_component_1 = require("../counting-rule/counting-rule.component");
var rrule_component_1 = require("../rrule/rrule.component");
var monthday_component_1 = require("../rrule/monthday.component");
var rest_service_1 = require("../rest.service");
var product_1 = require("./product");
var rxjs_1 = require("rxjs");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
var product_model_1 = require("./product.model");
var actionEnum_1 = require("../unit-form/actionEnum");
describe('ProductSubFormComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                product_sub_form_component_1.ProductSubFormComponent,
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
                rest_service_1.RestService,
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(product_sub_form_component_1.ProductSubFormComponent);
        component = fixture.componentInstance;
        var restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var spy = spyOn(restService, 'get').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve([
            { id: 2, name: 'Prep Kitchen' },
            { id: 3, name: 'Main Depot' }
        ])));
        var actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        component.actionIsSuccess = actionIsSuccess;
        component.isAdd = true;
        var isAdding = new rxjs_1.BehaviorSubject(false);
        component.isAdding = isAdding;
        fixture.detectChanges();
    });
    it('should create', function () {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
    it('should add button be disabled/enabled', function () {
        var product = new product_1.Product();
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Kg';
        product.prep_unit_id = 2;
        product.minQty = 2;
        product.maxQty = 3;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        component.product = product;
        var nameDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.name'));
        var nameField = nameDebugElement.nativeElement;
        component.disabilityStatus();
        var addBtn = fixture.debugElement.query(platform_browser_1.By.css('.addBtn')).nativeElement;
        fixture.detectChanges();
        expect(addBtn.disabled).toBe(false);
        nameField.value = '';
        nameField.dispatchEvent(new Event('input'));
        nameDebugElement.triggerEventHandler('keyup', null);
        fixture.detectChanges();
        expect(addBtn.disabled).toBe(true);
    });
    it('should add a product', function () {
        var product = new product_1.Product();
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Kg';
        product.prep_unit_id = 2;
        product.minQty = 2;
        product.maxQty = 3;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        component.product = product;
        component.disabilityStatus();
        var addBtnDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.addBtn'));
        var addBtn = addBtnDebugElement.nativeElement;
        fixture.detectChanges();
        expect(addBtn.disabled).toBe(false);
        var rcvData;
        component.action.subscribe(function (data) { return rcvData = data; });
        addBtnDebugElement.triggerEventHandler('click', actionEnum_1.ActionEnum.add);
        fixture.detectChanges();
        expect(rcvData.type).toBe(actionEnum_1.ActionEnum.add);
        expect(rcvData.data.name).toBe('Frying oil');
    });
    it('should show a product', testing_1.fakeAsync(function () {
        component.isAdd = false;
        var product = new product_1.Product();
        product.id = 1;
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Kg';
        product.prep_unit_id = 2;
        product.minQty = 2;
        product.maxQty = 3;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var productModel = new product_model_1.ProductModel(product);
        component.productModel = productModel;
        component.ngOnInit();
        fixture.detectChanges();
        var nameField = fixture.debugElement.query(platform_browser_1.By.css('.name')).nativeElement;
        var prepUnitIdField = fixture.debugElement.queryAll(platform_browser_1.By.css('input'))[3].nativeElement;
        nameField.dispatchEvent(new Event('input'));
        prepUnitIdField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(nameField.value).toBe('Frying oil');
        expect(parseInt(prepUnitIdField.value)).toBe(2);
    }));
    it('should disabled/enabled update and delete buttons', testing_1.fakeAsync(function () {
        component.isAdd = false;
        var product = new product_1.Product();
        product.id = 1;
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Kg';
        product.prep_unit_id = 2;
        product.minQty = 2;
        product.maxQty = 3;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var productModel = new product_model_1.ProductModel(product);
        component.productModel = productModel;
        component.ngOnInit();
        component.disabilityStatus();
        fixture.detectChanges();
        var updateBtnDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.updateBtn'));
        var updateBtn = updateBtnDebugElement.nativeElement;
        var deleteBtnDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.deleteBtn'));
        var deleteBtn = deleteBtnDebugElement.nativeElement;
        expect(updateBtn.disabled).toBe(true);
        expect(deleteBtn.disabled).toBe(false);
        var nameDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.name'));
        var nameField = nameDebugElement.nativeElement;
        nameField.value = 'Frying oil_1';
        nameField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        nameDebugElement.triggerEventHandler('keyup', null);
        fixture.detectChanges();
        expect(updateBtn.disabled).toBe(false);
        expect(deleteBtn.disabled).toBe(false);
        nameField.value = 'Frying oil';
        nameField.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        nameDebugElement.triggerEventHandler('keyup', null);
        fixture.detectChanges();
        expect(updateBtn.disabled).toBe(true);
        expect(deleteBtn.disabled).toBe(false);
    }));
    it('should update/delete a product', function () {
        component.isAdd = false;
        var product = new product_1.Product();
        product.id = 1;
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Kg';
        product.prep_unit_id = 2;
        product.minQty = 2;
        product.maxQty = 3;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var productModel = new product_model_1.ProductModel(product);
        component.productModel = productModel;
        component.ngOnInit();
        component.disabilityStatus();
        fixture.detectChanges();
        var updateBtnDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.updateBtn'));
        var deleteBtnDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.deleteBtn'));
        var rcvData;
        component.action.subscribe(function (data) { return rcvData = data; });
        updateBtnDebugElement.triggerEventHandler('click', actionEnum_1.ActionEnum.update);
        expect(rcvData.type).toBe(actionEnum_1.ActionEnum.update);
        expect(rcvData.data.code).toBe('fo01');
        deleteBtnDebugElement.triggerEventHandler('click', actionEnum_1.ActionEnum.delete);
        expect(rcvData.type).toBe(actionEnum_1.ActionEnum.delete);
        expect(rcvData.data.id).toBe(1);
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/product-form/product-sub-form.component.spec.js.map