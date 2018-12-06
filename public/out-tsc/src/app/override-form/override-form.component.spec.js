"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var override_form_component_1 = require("./override-form.component");
var counting_rule_component_1 = require("../counting-rule/counting-rule.component");
var rrule_component_1 = require("../rrule/rrule.component");
var monthday_component_1 = require("../rrule/monthday.component");
var message_service_1 = require("../message.service");
var rest_service_1 = require("../rest.service");
var auth_service_1 = require("../auth.service");
var PromiseObservable_1 = require("rxjs/observable/PromiseObservable");
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
describe('OverrideFormComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                override_form_component_1.OverrideFormComponent,
                counting_rule_component_1.CountingRuleComponent,
                rrule_component_1.RRuleComponent,
                monthday_component_1.MonthdayComponent,
            ],
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                platform_browser_1.BrowserModule,
                material_1.MaterialModule.forRoot(),
            ],
            providers: [
                message_service_1.MessageService,
                rest_service_1.RestService,
                { provide: router_1.Router, useClass: RouterStub },
                { provide: auth_service_1.AuthService, useClass: AuthServiceStub },
            ]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(override_form_component_1.OverrideFormComponent);
        component = fixture.componentInstance;
        var restService = fixture.debugElement.injector.get(rest_service_1.RestService);
        var branchSpy = spyOn(restService, 'get').and.callFake(function (api) {
            if (api === 'unit?isBranch=true') {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    { id: 4, name: 'Baker Street' },
                    { id: 5, name: 'Piccadilly' },
                    { id: 6, name: 'Shepherd’s Bush' }
                ]));
            }
            else if (api === 'override') {
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
            }
            else {
                return PromiseObservable_1.PromiseObservable.create(Promise.resolve([
                    {
                        pid: 1,
                        prep_unit_id: 2,
                        code: 'ks01',
                        name: 'Ketchup Sauce',
                        size: 10,
                        measuring_unit: 'Kg',
                        default_max: 20,
                        default_min: 10,
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
                        default_mon_multiple: 3,
                        default_tue_multiple: 1,
                        default_wed_multiple: 1,
                        default_thu_multiple: 1,
                        default_fri_multiple: 1,
                        default_sat_multiple: 2,
                        default_sun_multiple: 1,
                        default_usage_multiple: 5,
                    }
                ]));
            }
        });
        component.authService.userType = 'admin';
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it("should admin override a product for 'Baker Street' branch", testing_1.fakeAsync(function () {
        component.selectedIndex = 0;
        component.ngOnInit();
        testing_1.tick();
        fixture.detectChanges();
        var productName = fixture.debugElement.query(platform_browser_1.By.css('.pnc')).nativeElement;
        productName.value = component.productName_Code[0];
        productName.dispatchEvent(new Event('input'));
        testing_1.tick();
        fixture.detectChanges();
        expect(component.isFiltered).toBe(true, 'is not filtered');
        expect(component.branchList.length).toBe(3);
        expect(component.isAdmin).toBe(true);
        expect(component.productName_Code.length).toBe(4);
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/override-form/override-form.component.spec.js.map