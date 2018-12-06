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
var auth_service_1 = require("../auth.service");
var router_1 = require("@angular/router");
var NavbarComponent = (function () {
    function NavbarComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.navLinks = [];
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.auth$.subscribe(function (auth) {
            _this.auth = auth;
            _this.user = _this.authService.user;
            _this.isAdmin = auth && _this.authService.userType === 'admin';
            _this.isBranch = auth && _this.authService.userType === 'branch';
            _this.isPrep = auth && _this.authService.userType === 'prep';
            if (_this.isAdmin) {
                _this.navLinks.push({ label: 'Units', link: 'units' });
                _this.navLinks.push({ label: 'Products', link: 'products' });
            }
        });
    };
    NavbarComponent.prototype.logout = function () {
        this.authService.logOff();
    };
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    core_1.Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, router_1.Router])
], NavbarComponent);
exports.NavbarComponent = NavbarComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/navbar/navbar.component.js.map