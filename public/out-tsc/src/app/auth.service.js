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
var Subject_1 = require("rxjs/Subject");
var rest_service_1 = require("./rest.service");
var router_1 = require("@angular/router");
var message_service_1 = require("./message.service");
var AuthService = (function () {
    function AuthService(restService, router, messageService) {
        var _this = this;
        this.restService = restService;
        this.router = router;
        this.messageService = messageService;
        this.authStream = new Subject_1.Subject();
        this.user = '';
        this.userType = '';
        this.unitName = '';
        this.auth$ = this.authStream.asObservable();
        this.originBeforeLogin = '/';
        this.restService.call('validUser')
            .subscribe(function (res) {
            _this.afterLogin(res);
            _this.messageService.message("You are already logged in as " + _this.user + ".");
        }, function (err) {
            if (core_1.isDevMode())
                console.log(err);
            _this.authStream.next(false);
            _this.router.navigate(['login']);
        });
    }
    AuthService.prototype.logIn = function (username, password) {
        var _this = this;
        this.restService.update('login', null, { username: username, password: password })
            .subscribe(function (res) {
            _this.afterLogin(res);
            _this.messageService.message(_this.user + " logged in.");
        }, function (err) {
            _this.authStream.next(false);
            _this.messageService.error(err);
            if (core_1.isDevMode())
                console.log(err);
        });
    };
    AuthService.prototype.afterLogin = function (res) {
        var data = res.json();
        this.user = data.user;
        this.unitName = data.name;
        this.userType = data.userType;
        this.isKitchen = data.isKitchen;
        this.unit_id = data.uid;
        this.authStream.next(true);
        var url = this.originBeforeLogin;
        if (url !== null && url !== '/') {
            if (this.userType === 'branch') {
                if (url.indexOf('inventory') !== -1 || url.indexOf('override') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['inventory']);
            }
            else if (this.userType === 'prep') {
                if (url.indexOf('delivery') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['delivery']);
            }
            else if (this.userType === 'admin') {
                if (url.indexOf('units') !== -1 || url.indexOf('products') !== -1 || url.indexOf('override') !== -1 || url.indexOf('reports') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['']);
            }
        }
        else {
            if (this.userType === 'branch')
                this.router.navigate(['inventory']);
            else if (this.userType === 'prep')
                this.router.navigate(['delivery']);
            else
                this.router.navigate(['/']);
        }
    };
    AuthService.prototype.logOff = function () {
        var _this = this;
        this.restService.call('logout')
            .subscribe(function () {
            _this.messageService.message(_this.user + " logged out.");
            _this.user = '';
            _this.userType = '';
            _this.unitName = '';
            _this.authStream.next(false);
            _this.router.navigate(['login']);
        }, function (err) {
            _this.messageService.error(err);
            if (core_1.isDevMode())
                console.log(err);
        });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [rest_service_1.RestService, router_1.Router, message_service_1.MessageService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/auth.service.js.map