"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var product_form_component_1 = require("./product-form.component");
var product_sub_form_component_1 = require("./product-sub-form.component");
var counting_rule_component_1 = require("../counting-rule/counting-rule.component");
var rrule_component_1 = require("../rrule/rrule.component");
var monthday_component_1 = require("../rrule/monthday.component");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
var product_1 = require("./product");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
var actionEnum_1 = require("../unit-form/actionEnum");
describe('ProductFormComponent', function () {
    var component;
    var fixture;
    var restService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                product_form_component_1.ProductFormComponent,
                product_sub_form_component_1.ProductSubFormComponent,
                counting_rule_component_1.CountingRuleComponent,
                rrule_component_1.RRuleComponent,
                monthday_component_1.MonthdayComponent
            ],
            imports: [
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                platform_browser_1.BrowserModule,
                material_1.MaterialModule.forRoot()
            ],
            providers: [
                rest_service_1.RestService,
                message_service_1.MessageService,
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(product_form_component_1.ProductFormComponent);
        component = fixture.componentInstance;
        restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var spy = spyOn(restService, 'get').and.callFake(function (api) {
            if (api === 'product')
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    {
                        pid: 1,
                        prep_unit_id: 2,
                        code: 'ks01',
                        name: 'Ketchup Sauce',
                        size: 10,
                        measuring_unit: 'Kg',
                        default_max: 2,
                        default_min: 1,
                        default_date_rule: 'FREQ=WEEKLY;DTSTART=20170222T075136Z;INTERVAL=1;BYDAY=WE',
                        default_mon_multiple: 1,
                        default_tue_multiple: 1,
                        default_wed_multiple: 1,
                        default_thu_multiple: 1,
                        default_fri_multiple: 1,
                        default_sat_multiple: 1,
                        default_sun_multiple: 1,
                        default_usage_multiple: 1,
                    },
                    {
                        pid: 2,
                        prep_unit_id: 3,
                        code: 'fo01',
                        name: 'Frying oil',
                        size: 20,
                        measuring_unit: 'Litre',
                        default_max: 2,
                        default_min: 1,
                        default_date_rule: 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1',
                        default_mon_multiple: 1,
                        default_tue_multiple: 1,
                        default_wed_multiple: 1,
                        default_thu_multiple: 1,
                        default_fri_multiple: 1,
                        default_sat_multiple: 2,
                        default_sun_multiple: 1,
                        default_usage_multiple: 2,
                    }
                ]));
            else if (api === 'unit?isBranch=false')
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    { id: 2, name: 'Prep Kitchen' },
                    { id: 3, name: 'Main Depot' }
                ]));
        });
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should fetch all products and set some lists', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        expect(component.productModels.length).toBe(2);
        expect(component.productNames).toContain('Frying oil');
        expect(component.productCodes).toContain('ks01');
        expect(component.productName_Code[0]).toBe('Frying oil');
        expect(component.productName_Code[3]).toBe('ks01');
    }));
    it('should add a product to productModels', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var product = new product_1.Product();
        product.id = 2;
        product.name = 'testProduct';
        product.code = 'tp01';
        product.size = 10;
        product.measuringUnit = 'g';
        product.prep_unit_id = 3;
        product.minQty = 1;
        product.maxQty = 2;
        product.coefficients = {
            Monday: 2,
            Tuesday: 2,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 2,
            Usage: 2
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var value = {
            type: actionEnum_1.ActionEnum.add,
            data: product
        };
        var restSpy = spyOn(restService, 'insert').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve(5)));
        component.doClickedAction(value);
        testing_1.tick();
        fixture.detectChanges();
        expect(component.productModels.length).toBe(3);
        expect(component.productModels.filter(function (p) { return p._product.id === 5; })[0]._product.name).toBe('testProduct');
        expect(component.productCodes).toContain('tp01');
        expect(component.productNames).toContain('testProduct');
        expect(component.productName_Code).toContain('tp01');
        expect(component.productName_Code).toContain('testProduct');
    }));
    it('should set a proper productModel based on autoComplete', testing_1.fakeAsync(function () {
        component.selectedIndex = 1;
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var productName = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        productName.value = component.productName_Code[0];
        productName.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(component.isFiltered).toBe(true);
        expect(component.filteredProductModel._product.code).toBe('fo01');
    }));
    it('should update product size and coefficients Saturday', testing_1.fakeAsync(function () {
        component.selectedIndex = 1;
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var productName = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        productName.value = component.productName_Code[0];
        productName.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var product = new product_1.Product();
        product.id = 2;
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 10;
        product.measuringUnit = 'Litre';
        product.prep_unit_id = 3;
        product.minQty = 1;
        product.maxQty = 2;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 2
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var value = {
            type: actionEnum_1.ActionEnum.update,
            data: product
        };
        var restSpy = spyOn(restService, 'update').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve()));
        component.doClickedAction(value);
        testing_1.tick();
        fixture.detectChanges();
        expect(component.productModels.filter(function (p) { return p._product.code === 'fo01'; })[0]._product.size).toBe(10);
        expect(component.productModels.filter(function (p) { return p._product.code === 'fo01'; })[0]._product.coefficients.Saturday).toBe(1);
    }));
    it('should update product name and productName list', testing_1.fakeAsync(function () {
        component.selectedIndex = 1;
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var productName = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        productName.value = component.productName_Code[0];
        productName.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var product = new product_1.Product();
        product.id = 2;
        product.name = 'Frying oil_01';
        product.code = 'fo11';
        product.size = 20;
        product.measuringUnit = 'Litre';
        product.prep_unit_id = 3;
        product.minQty = 1;
        product.maxQty = 2;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 2,
            Sunday: 1,
            Usage: 2
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var value = {
            type: actionEnum_1.ActionEnum.update,
            data: product
        };
        var restSpy = spyOn(restService, 'update').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve()));
        component.doClickedAction(value);
        testing_1.tick();
        fixture.detectChanges();
        expect(component.productModels.filter(function (p) { return p._product.code === 'fo01'; }).length).toBe(0);
        expect(component.productModels.filter(function (p) { return p._product.code === 'fo11'; })[0]._product.name).toBe('Frying oil_01');
        expect(component.productNames).not.toContain('Frying oil');
        expect(component.productCodes).not.toContain('fo01');
        expect(component.productName_Code).toContain('fo11');
        expect(component.productName_Code).toContain('Frying oil_01');
    }));
    it('should delete a product from productModels list', testing_1.fakeAsync(function () {
        component.selectedIndex = 1;
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var productName = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        productName.value = component.productName_Code[0];
        productName.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var product = new product_1.Product();
        product.id = 2;
        product.name = 'Frying oil';
        product.code = 'fo01';
        product.size = 20;
        product.measuringUnit = 'Litre';
        product.prep_unit_id = 3;
        product.minQty = 1;
        product.maxQty = 2;
        product.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 2,
            Sunday: 1,
            Usage: 2
        };
        product.countingRecursion = 'FREQ=DAILY;DTSTART=20170222T075434Z;INTERVAL=1';
        var value = {
            type: actionEnum_1.ActionEnum.delete,
            data: product
        };
        var restSpy = spyOn(restService, 'delete').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve()));
        component.doClickedAction(value);
        testing_1.tick();
        fixture.detectChanges();
        expect(component.productModels.filter(function (p) { return p._product.code === 'fo01'; }).length).toBe(0);
        expect(component.productNames).not.toContain('Frying oil');
        expect(component.productCodes).not.toContain('fo01');
        expect(component.productModels.length).toBe(1);
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/product-form/product-form.component.spec.js.map