"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var RestService = (function () {
    function RestService(http) {
        this.http = http;
    }
    RestService.prototype.call = function (table) {
        return this.http.get('/api/' + table);
    };
    RestService.prototype.insert = function (table, values) {
        return this.http.put('/api/' + table, values).map(function (data) { return data.json(); });
    };
    RestService.prototype.get = function (table) {
        return this.call(table).map(function (data) { return data.json(); });
    };
    ;
    RestService.prototype.getWithParams = function (table, values) {
        var params = new http_1.URLSearchParams();
        for (var key in values)
            if (values.hasOwnProperty(key))
                params.set(key, values[key]);
        return this.http.get('/api/' + table, { search: params }).map(function (data) { return data.json(); });
    };
    RestService.prototype.delete = function (table, id) {
        return this.http.delete('/api/' + table + '/' + id);
    };
    RestService.prototype.update = function (table, id, values) {
        return this.http.post('/api/' + table + (id ? '/' + id : ''), values);
    };
    RestService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], RestService);
    return RestService;
}());
exports.RestService = RestService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/rest.service.js.map