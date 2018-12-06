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
        this.block$ = new rxjs_1.Subject();
    }
    MessageService.prototype.block = function (bl) {
        if (bl === void 0) { bl = true; }
        this.block$.next(bl);
    };
    MessageService.prototype.error = function (err) {
        err = this.changeToUnderstandableMessage(err);
        var ro = new http_1.ResponseOptions();
        var errMsg = '';
        try {
            if (err.json().Message)
                errMsg = err.json().Message;
            else if (typeof err.json().Message === "object")
                errMsg = '';
        }
        catch (e) {
            errMsg = err.text();
        }
        ro.body = errMsg;
        var newErr = new http_1.Response(ro);
        newErr.statusText = err.statusText;
        newErr.status = err.status;
        this.errStream.next(newErr);
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
        if (data.indexOf('foreign key constraint') !== -1) {
            resOptions.body = 'Can not delete this item because other data items depend on it.';
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else if (data.indexOf('duplicate key value') !== -1) {
            var n = 'constraint "';
            var constraint = data.substring(data.indexOf(n) + n.length, data.indexOf('_key"')).replace(/\_/g, ' ');
            resOptions.body = "Can not add this item because same \"" + constraint + "\" already exists.";
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else if (data.indexOf('null value') !== -1 && data.indexOf('not-null constraint') !== -1) {
            var n = 'in column "';
            var constraint = data.substring(data.indexOf(n) + n.length, data.indexOf('" violates')).replace(/\_/g, ' ');
            resOptions.body = "The \"" + constraint + "\" field cannot be blank.";
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else
            return msg;
    };
    return MessageService;
}());
MessageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/message.service.js.map