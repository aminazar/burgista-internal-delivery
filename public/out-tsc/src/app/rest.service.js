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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var message_service_1 = require("./message.service");
var RestService = (function () {
    function RestService(http, messageService) {
        this.http = http;
        this.messageService = messageService;
    }
    RestService.prototype.call = function (table) {
        var _this = this;
        this.messageService.block();
        return this.http.get('/api/' + table)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.insert = function (table, values) {
        var _this = this;
        this.messageService.block();
        return this.http.put('/api/' + table, values)
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.get = function (table) {
        var _this = this;
        this.messageService.block();
        return this.call(table)
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    ;
    RestService.prototype.getWithParams = function (table, values) {
        var _this = this;
        this.messageService.block();
        var params = new http_1.URLSearchParams();
        for (var key in values)
            if (values.hasOwnProperty(key))
                params.set(key, values[key]);
        return this.http.get('/api/' + table, { search: params })
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.delete = function (table, id) {
        var _this = this;
        this.messageService.block();
        return this.http.delete('/api/' + table + '/' + id)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.update = function (table, id, values) {
        var _this = this;
        this.messageService.block();
        return this.http.post('/api/' + table + (id ? '/' + id : ''), values)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    return RestService;
}());
RestService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
], RestService);
exports.RestService = RestService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rest.service.js.map