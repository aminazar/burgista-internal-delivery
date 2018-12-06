"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var monthday_component_1 = require("./monthday.component");
var platform_browser_2 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
describe('MonthdayComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [monthday_component_1.MonthdayComponent],
            imports: [
                platform_browser_2.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
            ],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(monthday_component_1.MonthdayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should compose 31 toggle buttons', testing_1.async(function () {
        var de = fixture.debugElement.queryAllNodes(platform_browser_1.By.css('div'));
        var toggleList = de.filter(function (r) { return r.nativeElement.className.indexOf('button-toggle') !== -1; });
        expect(toggleList.length).toBe(31);
        expect(toggleList.map(function (r) { return r.nativeElement.innerHTML; }).indexOf('11')).not.toBe(-1);
    }));
    it('should have 31 toggle buttons as checkboxes', testing_1.fakeAsync(function () {
        var de = fixture.debugElement.queryAllNodes(platform_browser_1.By.css('input'));
        var toggleList = de.filter(function (r) { return r.nativeElement.type === 'checkbox'; });
        expect(toggleList.length).toBe(31);
    }));
    it('should change multiple days on multiple clicks', testing_1.fakeAsync(function () {
        var de = fixture.debugElement.queryAllNodes(platform_browser_1.By.css('input'));
        var toggleList = de.filter(function (r) { return r.nativeElement.type === 'checkbox'; });
        toggleList[1].nativeElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        testing_1.tick();
        expect(component.days).toContain(2);
        toggleList[2].nativeElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        testing_1.tick();
        expect(component.days.length).toBe(2);
        expect(component.days).toContain(3);
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rrule/monthday.component.spec.js.map