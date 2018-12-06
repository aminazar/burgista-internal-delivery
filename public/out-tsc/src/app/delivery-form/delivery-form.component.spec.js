"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var material_1 = require("@angular/material");
var angular2_material_datepicker_1 = require("angular2-material-datepicker");
var moment = require("moment");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
var platform_browser_1 = require("@angular/platform-browser");
var flex_layout_1 = require("@angular/flex-layout");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var delivery_form_component_1 = require("./delivery-form.component");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
var auth_service_1 = require("../auth.service");
var print_service_1 = require("../print.service");
var common_1 = require("@angular/common");
var RouterStub = (function () {
    function RouterStub() {
    }
    RouterStub.prototype.navigateByUrl = function (url) {
        return url;
    };
    RouterStub.prototype.navigate = function (url) {
        return url;
    };
    return RouterStub;
}());
var AuthServiceStub = (function () {
    function AuthServiceStub() {
    }
    return AuthServiceStub;
}());
var PrintServiceStub = (function () {
    function PrintServiceStub() {
    }
    PrintServiceStub.prototype.printData = function () {
        return 'done';
    };
    return PrintServiceStub;
}());
fdescribe('DeliveryFormComponent', function () {
    var component;
    var fixture;
    var restService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                delivery_form_component_1.DeliveryFormComponent
            ],
            imports: [
                material_1.MaterialModule.forRoot(),
                angular2_material_datepicker_1.DatepickerModule,
                forms_1.FormsModule,
                common_1.CommonModule,
                flex_layout_1.FlexLayoutModule,
                forms_1.ReactiveFormsModule
            ],
            providers: [
                message_service_1.MessageService,
                rest_service_1.RestService,
                { provide: auth_service_1.AuthService, useClass: AuthServiceStub },
                { provide: router_1.Router, useClass: RouterStub },
                { provide: print_service_1.PrintService, useClass: PrintServiceStub }
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(delivery_form_component_1.DeliveryFormComponent);
        component = fixture.componentInstance;
        var date = moment(new Date).format('YYYYMMDD');
        restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var unitSpy = spyOn(restService, 'get').and.callFake(function (api) {
            if (api === 'unit?isBranch=true') {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    { name: 'Baker Street', uid: 4 },
                    { name: 'Piccadilly', uid: 5 },
                    { name: 'Shepherd’s Bush', uid: 6 }
                ]));
            }
            else if (api === 'delivery/' + date + '/4') {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    {
                        id: null,
                        productId: 2,
                        productCode: 'fo01',
                        productName: 'Frying Oil',
                        min: 2,
                        max: 4,
                        realDelivery: null,
                        stock: null,
                        stockDate: null
                    },
                    {
                        id: 1,
                        productId: 3,
                        productCode: 'ks130',
                        productName: 'Ketchup Sauce',
                        min: 10,
                        max: 12,
                        realDelivery: 3,
                        stock: 10,
                        stockDate: Date.toString()
                    },
                    {
                        id: 2,
                        productId: 4,
                        productCode: 'm41',
                        productName: 'Meat',
                        min: 5,
                        max: 6,
                        realDelivery: null,
                        stock: 6,
                        stockDate: Date.toString()
                    }
                ]));
            }
            else if (api === 'delivery/' + date + '/5') {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    {
                        id: 3,
                        productId: 6,
                        productCode: 'oo4',
                        productName: 'Olive Oil',
                        min: 1,
                        max: 2,
                        realDelivery: null,
                        stock: null,
                        stockDate: null
                    }
                ]));
            }
            else if (api === 'delivery/' + date + '/6') {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([]));
            }
        });
        fixture.detectChanges();
    });
    it('should create', testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.receivers.length).toBe(3);
        expect(component.receiverName).toBe('All');
    }));
    it("should show autoComplete element for 'Baker Street' branch", testing_1.fakeAsync(function () {
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        component.selectedIndex = 1;
        component.tabChanged();
        var autoDebugElement = fixture.debugElement.query(platform_browser_1.By.css('.pnc'));
        expect(component.productsList['Baker Street'].length).toBe(1);
        expect(component.isToday).toBe(true);
        expect(component.receiversDeliveryModels['Baker Street']._shouldDisabled).toBe(false);
        expect(component.overallDeliveryModel._isPrinted).toBe(false);
        expect(autoDebugElement).not.toBe(null);
        expect(component.selectedIndex).toBe(1);
        expect(component.receiverName).toBe('Baker Street');
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/delivery-form/delivery-form.component.spec.js.map