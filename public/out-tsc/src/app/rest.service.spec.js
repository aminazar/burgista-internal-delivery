"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var rest_service_1 = require("./rest.service");
var testing_2 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
describe('Service: REST', function () {
    var mockBackend, restService;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                rest_service_1.RestService,
                testing_2.MockBackend,
                http_1.BaseRequestOptions,
                {
                    provide: http_1.Http,
                    deps: [testing_2.MockBackend, http_1.BaseRequestOptions],
                    useFactory: function (backend, defaultOptions) {
                        return new http_1.Http(backend, defaultOptions);
                    }
                }
            ],
            imports: [
                forms_1.FormsModule,
                http_1.HttpModule
            ],
        });
        testing_1.TestBed.compileComponents();
        mockBackend = testing_1.getTestBed().get(testing_2.MockBackend);
        restService = testing_1.getTestBed().get(rest_service_1.RestService);
    }));
    it('should be injected', testing_1.inject([rest_service_1.RestService], function (service) {
        expect(service).toBeTruthy();
    }));
    it("should get data from backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data');
            expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                body: "[{\"a\":1},{\"b\":\"2\"}]",
            })));
        });
        restService.get('data').subscribe(function (data) {
            expect(data.length).toBe(2);
            expect(data[0].a).toBeDefined();
            expect(data[1].b).toBe('2');
            expect(data[0].a).toBe(1);
        });
    }));
    it("should get data with URL queries from backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data?a=1&b=xyz');
            expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                body: "[{\"a\":1},{\"b\":\"2\"}]",
            })));
        });
        restService.getWithParams('data', { a: 1, b: 'xyz' }).subscribe(function (data) {
            expect(data.length).toBe(2);
            expect(data[0].a).toBeDefined();
            expect(data[1].b).toBe('2');
            expect(data[0].a).toBe(1);
        });
    }));
    it("should put data into backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data');
            expect(connection.request.method).toBe(http_1.RequestMethod.Put);
            var body = connection.request.text();
            expect(JSON.parse(body).a).toBe(1);
            expect(JSON.parse(body).b).toBe("2");
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                body: "4",
            })));
        });
        restService.insert('data', { a: 1, b: '2' }).subscribe(function (data) {
            expect(data).toBe(4);
        });
    }));
    it("should handle insert errors from backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data');
            var body = connection.request.text();
            expect(connection.request.method).toBe(http_1.RequestMethod.Put);
            expect(JSON.parse(body).a).toBe(1);
            expect(JSON.parse(body).b).toBe("2");
            var err = new Error("only admin is allowed to do this");
            connection.mockError(err);
        });
        restService.insert('data', { a: 1, b: '2' }).subscribe(function (data) {
            fail("should not be here");
        }, function (err) {
            expect(err.message).toBe("only admin is allowed to do this");
        });
    }));
    it("should delete data from backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data/2');
            expect(connection.request.method).toBe(http_1.RequestMethod.Delete);
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                status: 200,
            })));
        });
        restService.delete('data', 2).subscribe(function (res) {
            expect(res.status).toBe(200);
        });
    }));
    it("should update data of backend", testing_1.async(function () {
        mockBackend.connections.subscribe(function (connection) {
            expect(connection.request.url).toBe('/api/data/3');
            expect(connection.request.method).toBe(http_1.RequestMethod.Post);
            var body = connection.request.text();
            expect(JSON.parse(body).a).toBe(1);
            expect(JSON.parse(body).b).toBe("2");
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                status: 200,
            })));
        });
        restService.update('data', 3, { a: 1, b: "2" }).subscribe(function (res) {
            expect(res.status).toBe(200);
        });
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rest.service.spec.js.map