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
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/http");
var MessageService = (function () {
    function MessageService() {
        this.errStream = new rxjs_1.Subject();
        this.err$ = this.errStream.asObservable();
        this.msgStream = new rxjs_1.Subject();
        this.msg$ = this.msgStream.asObservable();
        this.warningStream = new rxjs_1.Subject();
        this.warn$ = this.warningStream.asObservable();
    }
    MessageService.prototype.error = function (err) {
        this.errStream.next(this.changeToUnderstandableMessage(err));
    };
    MessageService.prototype.message = function (msg) {
        this.msgStream.next(msg);
    };
    MessageService.prototype.warn = function (msg) {
        this.warningStream.next(msg);
    };
    MessageService.prototype.changeToUnderstandableMessage = function (msg) {
        var data = msg._body;
        var resOptions = new http_1.ResponseOptions();
        var res = new http_1.Response(resOptions);
        if (data.indexOf('foreign key constraint') !== -1 && data.indexOf('unit') !== -1) {
            res.statusText = 'Can not delete this unit because there are some products related to it';
            return res;
        }
        else if (data.indexOf('duplicate key value') !== -1) {
            res.statusText = 'One of the data is already exist';
            return res;
        }
        else if (data.indexOf('null value') !== -1 && data.indexOf('not-null constraint') !== -1) {
            res.statusText = 'The fields can not have null value';
            return res;
        }
        else
            return msg;
    };
    MessageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/message.service.js.map