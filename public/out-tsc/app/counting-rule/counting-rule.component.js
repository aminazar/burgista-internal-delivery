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
var CountingRuleComponent = (function () {
    function CountingRuleComponent() {
        this.coefficientsChange = new core_1.EventEmitter();
        this.minQtyChange = new core_1.EventEmitter();
        this.maxQtyChange = new core_1.EventEmitter();
        this.recursionRuleChange = new core_1.EventEmitter();
        this.hasError = new core_1.EventEmitter();
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Usage'];
        this.errorMessage = {};
    }
    Object.defineProperty(CountingRuleComponent.prototype, "minQty", {
        get: function () {
            return this._mq;
        },
        set: function (val) {
            this._mq = val;
            if (val === null)
                this.ngOnInit();
        },
        enumerable: true,
        configurable: true
    });
    CountingRuleComponent.prototype.ngOnInit = function () {
        this.minChange();
        this.maxChange();
        if (!this.recursionRule)
            this.addRRuleValidation('add a period');
    };
    CountingRuleComponent.prototype.coeffChange = function () {
        this.coefficientsChange.emit(this.coefficients);
        var i = 0;
        for (var day in this.coefficients) {
            i++;
            if (!this.coefficients[day]) {
                this.sendError(day + " coefficient should be a non-zero number", 10 + i);
            }
            else {
                this.sendError('', 10 + i);
            }
        }
    };
    CountingRuleComponent.prototype.minChange = function () {
        this.minQtyChange.emit(this.minQty);
        if (!this.minQty) {
            this.sendError('The Min Qty should not be blank', 0);
        }
        else
            this.sendError('', 0);
        this.checkMinMax();
    };
    CountingRuleComponent.prototype.maxChange = function () {
        this.maxQtyChange.emit(this.maxQty);
        if (!this.maxQty) {
            this.sendError('The Max Qty should not be blank', 1);
        }
        else
            this.sendError('', 1);
        this.checkMinMax();
    };
    CountingRuleComponent.prototype.recurChange = function (event) {
        this.recursionRuleChange.emit(event);
    };
    CountingRuleComponent.prototype.addRRuleValidation = function (event) {
        this.RRuleValidation = event;
        if (event)
            this.sendError("Recursion rule warning: " + this.RRuleValidation, 2);
        else
            this.sendError('', 2);
    };
    CountingRuleComponent.prototype.checkMinMax = function () {
        if (this.minQty > this.maxQty) {
            this.sendError('The Min Qty should be less than or equal to Max Qty', 3);
        }
        else
            this.sendError('', 3);
    };
    CountingRuleComponent.prototype.sendError = function (msg, index) {
        this.errorMessage[index] = msg;
        if (msg)
            this.hasError.emit(msg);
        else {
            for (var key in this.errorMessage)
                if (this.errorMessage[key])
                    msg = this.errorMessage[key];
            this.hasError.emit(msg);
        }
        this.showMessage = msg;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "coefficients", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], CountingRuleComponent.prototype, "minQty", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "maxQty", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "recursionRule", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "coefficientsChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "minQtyChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "maxQtyChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "recursionRuleChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CountingRuleComponent.prototype, "hasError", void 0);
    CountingRuleComponent = __decorate([
        core_1.Component({
            selector: 'app-counting-rule',
            templateUrl: './counting-rule.component.html',
            styleUrls: ['./counting-rule.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], CountingRuleComponent);
    return CountingRuleComponent;
}());
exports.CountingRuleComponent = CountingRuleComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/counting-rule/counting-rule.component.js.map