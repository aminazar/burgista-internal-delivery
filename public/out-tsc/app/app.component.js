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
var logged_in_guard_1 = require("./login/logged-in.guard");
var message_service_1 = require("./message.service");
var material_1 = require("@angular/material");
var AppComponent = (function () {
    function AppComponent(loggedInGuard, messageService, snackBar) {
        this.loggedInGuard = loggedInGuard;
        this.messageService = messageService;
        this.snackBar = snackBar;
        this.title = 'app works!';
        this.showError = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.messageService.err$.subscribe(function (err) {
            _this.showError = true;
            var errMsg = '';
            try {
                errMsg = err.json();
                if (errMsg.Message)
                    errMsg = errMsg.Message;
            }
            catch (e) {
                errMsg = err.text();
            }
            _this.error = err.statusText + ": " + errMsg;
        });
        this.messageService.msg$.subscribe(function (msg) {
            _this.showError = false;
            _this.snackBar.open(msg, 'x', { duration: 3000, extraClasses: ['snackBar'] });
        });
        this.messageService.warn$.subscribe(function (msg) {
            _this.snackBar.open(msg, 'x', { duration: 3000, extraClasses: ['warnBar'] });
        });
    };
    AppComponent.prototype.closeError = function () {
        this.showError = false;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [logged_in_guard_1.LoggedInGuard, message_service_1.MessageService, material_1.MdSnackBar])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/app.component.js.map