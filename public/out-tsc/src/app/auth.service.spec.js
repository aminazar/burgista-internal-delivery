"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var rest_service_1 = require("./rest.service");
var testing_2 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("./auth.service");
var material_1 = require("@angular/material");
var home_component_1 = require("./home/home.component");
var router_1 = require("@angular/router");
var message_service_1 = require("./message.service");
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
;
describe('Service: Auth', function () {
    var mockBackend, restService, authService, router;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                rest_service_1.RestService,
                auth_service_1.AuthService,
                testing_2.MockBackend,
                http_1.BaseRequestOptions,
                message_service_1.MessageService,
                { provide: router_1.Router, useClass: RouterStub },
                {
                    provide: http_1.Http,
                    deps: [testing_2.MockBackend, http_1.BaseRequestOptions],
                    useFactory: function (backend, defaultOptions) {
                        return new http_1.Http(backend, defaultOptions);
                    }
                }
            ],
            declarations: [home_component_1.HomeComponent],
            imports: [
                forms_1.FormsModule,
                http_1.HttpModule,
                material_1.MaterialModule.forRoot(),
                router_1.RouterModule,
            ],
        });
        testing_1.TestBed.compileComponents();
        mockBackend = testing_1.getTestBed().get(testing_2.MockBackend);
        restService = testing_1.getTestBed().get(rest_service_1.RestService);
        authService = testing_1.getTestBed().get(auth_service_1.AuthService);
        router = testing_1.getTestBed().get(router_1.Router);
    }));
    it('should be injected', testing_1.inject([auth_service_1.AuthService], function (service) {
        expect(service).toBeTruthy();
    }));
    it("should call login with HTTP", testing_1.async(function () {
        var spy = spyOn(router, 'navigate');
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/login');
            expect(connection.request.method).toBe(http_1.RequestMethod.Post);
            var body = JSON.parse(connection.request.text());
            expect(body.username).toBe('testUser');
            expect(body.password).toBe('testPwd');
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                status: 200,
                body: "{\"user\":\"testUser\",\"userType\":\"branch\"}"
            })));
        });
        authService.auth$.subscribe(function (auth) {
            expect(auth).toBeTruthy();
            expect(authService.user).toBe("testUser");
            expect(authService.userType).toBe("branch");
        });
        authService.logIn('testUser', 'testPwd');
    }));
    it("should not login where HTTP responds with error", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            connection.mockError(new Error("Invalid Password"));
        });
        authService.auth$.subscribe(function (auth) { return expect(auth).toBeFalsy(); });
        authService.logIn('testUser', 'testPwd');
    }));
    it("should do login/logout", testing_1.async(function () {
        var i = 0;
        mockBackend.connections.subscribe(function (connection) {
            if (i++) {
                expect(connection.request.url).toBe('/api/logout');
                expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            }
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                status: 200,
                body: "{\"user\":\"testUser\",\"userType\":\"branch\"}"
            })));
        });
        authService.auth$.subscribe(function (auth) { return i === 2 ? expect(auth).toBeFalsy() : expect(auth).toBeTruthy(); });
        authService.logIn('testUser', 'testPwd');
        authService.logOff();
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/auth.service.spec.js.map