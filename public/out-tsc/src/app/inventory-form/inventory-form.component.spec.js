"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var angular2_material_datepicker_1 = require("angular2-material-datepicker");
var inventory_form_component_1 = require("./inventory-form.component");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var rest_service_1 = require("../rest.service");
var auth_service_1 = require("../auth.service");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
var testing_2 = require("@angular/router/testing");
var home_component_1 = require("../home/home.component");
var login_component_1 = require("../login/login.component");
var http_1 = require("@angular/http");
var message_service_1 = require("../message.service");
var platform_browser_1 = require("@angular/platform-browser");
var inventory_1 = require("./inventory");
describe('InventoryFormComponent', function () {
    var component;
    var fixture;
    var restService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                inventory_form_component_1.InventoryFormComponent,
                home_component_1.HomeComponent,
                login_component_1.LoginComponent
            ],
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular2_material_datepicker_1.DatepickerModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                testing_2.RouterTestingModule.withRoutes([
                    { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
                    { path: 'login', component: login_component_1.LoginComponent }
                ]),
            ],
            providers: [
                rest_service_1.RestService,
                auth_service_1.AuthService,
                message_service_1.MessageService,
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(inventory_form_component_1.InventoryFormComponent);
        component = fixture.componentInstance;
        restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var authService = fixture.debugElement.injector.get(auth_service_1.AuthService);
        var currentDate = new Date();
        var restSpy = spyOn(restService, 'get').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve([
            { bsddid: null, counting_date: null, pid: 28, product_code: 'fo01', product_name: 'Frying Oil', last_count: null, product_count: null },
            { bsddid: null, counting_date: null, pid: 30, product_code: 'ks01', product_name: 'Ketchup Sauce', last_count: null, product_count: null },
            { bsddid: 1, counting_date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()), pid: 32, product_code: 'tm91', product_name: 'Tomato', last_count: new Date(), product_count: null },
            { bsddid: 2, counting_date: new Date(), pid: 2, product_code: 'ff19', product_name: 'French Fries', last_count: new Date(), product_count: 2 },
        ])));
        var restInsertSpy = spyOn(restService, 'insert').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve(3)));
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should initialize some list in component', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        expect(component.inventoryModel._inventories.length).toBe(2);
        expect(component.products.length).toBe(2);
        expect(component.productName_Code.length).toBe(2);
    }));
    it('should display only one product with red color', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var red_unopenedElement = fixture.debugElement.queryAll(platform_browser_1.By.css('input'))[1].nativeElement;
        var black_unopenedElement = fixture.debugElement.queryAll(platform_browser_1.By.css('input'))[2].nativeElement;
        expect(red_unopenedElement.className).toContain('warnColoring');
        expect(black_unopenedElement.className).toContain('normalColoring');
    }));
    it('should not display remove button beside two element', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var removeDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.fa-times'));
        expect(removeDebugElement).toBe(null);
    }));
    it('should add a product when its name is on autoComplete field', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var autoCompleteNativeElement = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        expect(component.inventoryModel._inventories.length).toBe(2);
        expect(component.productName_Code.length).toBe(2);
        autoCompleteNativeElement.value = 'fo01 - Frying Oil';
        autoCompleteNativeElement.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(component.inventoryModel._inventories.length).toBe(3);
        expect(component.productName_Code.length).toBe(1);
    }));
    it('should submit button be disabled when unopened pack has correct not value', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var unopenedElement = fixture.debugElement.queryAll(platform_browser_1.By.css('input'))[1].nativeElement;
        var first_submitButtonElement = fixture.debugElement.queryAll(platform_browser_1.By.css('button'))[0].nativeElement;
        var second_submitButtonElement = fixture.debugElement.queryAll(platform_browser_1.By.css('button'))[1].nativeElement;
        expect(first_submitButtonElement.disabled).toBe(true);
        expect(second_submitButtonElement.disabled).toBe(false);
        unopenedElement.value = 2;
        unopenedElement.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(first_submitButtonElement.disabled).toBe(false);
    }));
    it('should submit a product', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var submitButtonDebugElement = fixture.debugElement.queryAll(platform_browser_1.By.css('button'))[1];
        var inventoryItem = new inventory_1.Inventory();
        inventoryItem.id = 2;
        inventoryItem.unopenedPack = 3;
        expect(component.inventoryModel._inventories.length).toBe(2);
        var restUpdateSpy = spyOn(restService, 'update').and.returnValue(PromiseObservable_1.PromiseObservable.create(Promise.resolve(2)));
        testing_1.tick();
        submitButtonDebugElement.triggerEventHandler('click', inventoryItem);
        testing_1.tick(1000);
        fixture.detectChanges();
        expect(component.inventoryModel._inventories.length).toBe(1);
    }));
    it('should remove a product', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var autoCompleteNativeElement = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        autoCompleteNativeElement.value = 'fo01 - Frying Oil';
        autoCompleteNativeElement.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var removeButtonDebugElement = fixture.debugElement.queryAll(platform_browser_1.By.css('button'))[2];
        expect(component.inventoryModel._inventories.length).toBe(3);
        var inventoryItem = new inventory_1.Inventory();
        inventoryItem.id = null;
        inventoryItem.productCode = 'fo01';
        removeButtonDebugElement.triggerEventHandler('click', inventoryItem);
        testing_1.tick(1000);
        fixture.detectChanges();
        expect(component.inventoryModel._inventories.length).toBe(2);
        expect(component.inventoryModel._inventories.map(function (inv) { return inv.productCode; })).not.toContain('fo01');
    }));
    it('should not display any button in page', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var dateInputElement = fixture.debugElement.queryAll(platform_browser_1.By.css('input'))[0].nativeElement;
        var currentDate = new Date();
        dateInputElement.value = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
        dateInputElement.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        var anyButtonElement = fixture.debugElement.queryAll(platform_browser_1.By.css('button'));
        var autoCompleteElement = fixture.debugElement.query(platform_browser_1.By.css('.pnc'));
        expect(component.inventoryModel._inventories.length).toBe(2);
        expect(anyButtonElement).toBe(null);
        expect(autoCompleteElement).toBe(null);
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/inventory-form/inventory-form.component.spec.js.map