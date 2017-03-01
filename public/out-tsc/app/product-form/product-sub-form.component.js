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
var product_1 = require("./product");
var product_model_1 = require("./product.model");
var actionEnum_1 = require("../unit-form/actionEnum");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
var ProductSubFormComponent = (function () {
    function ProductSubFormComponent(restService, messageService) {
        this.restService = restService;
        this.messageService = messageService;
        this.isAdd = true;
        this.action = new core_1.EventEmitter();
        this.hasCountingRuleError = false;
        this.countingRuleError = '';
        this.formTitle = '';
        this.ae = actionEnum_1.ActionEnum;
        this.addIsDisable = false;
        this.updateIsDisable = false;
        this.deleteIsDisable = false;
        this.measuringUnits = ['Kg', 'gr', 'L', 'lb', 'oz', 'fl oz', 'mL', 'units', 'packs', 'dozens', 'barrels'];
        this.prepUnits = [];
    }
    Object.defineProperty(ProductSubFormComponent.prototype, "productModel", {
        get: function () {
            return this.tempProductModel;
        },
        set: function (val) {
            this.tempProductModel = val;
            this.ngOnInit();
        },
        enumerable: true,
        configurable: true
    });
    ProductSubFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.product = new product_1.Product();
        this.restService.get('unit?isBranch=false').subscribe(function (data) {
            _this.prepUnits = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var unit = data_1[_i];
                var tempObj = {
                    id: unit.uid,
                    name: unit.name
                };
                _this.prepUnits.push(tempObj);
            }
        }, function (err) {
            console.log(err);
        });
        this.actionIsSuccess.subscribe(function (data) {
            if (data === true) {
                if (_this.isAdd === true) {
                    _this.product.id = -1;
                    _this.product.name = '';
                    _this.product.code = '';
                    _this.product.size = null;
                    _this.product.measuringUnit = null;
                    _this.product.prep_unit_id = null;
                    _this.product.minQty = null;
                    _this.product.maxQty = null;
                    for (var day in _this.product.coefficients) {
                        _this.product.coefficients[day] = 1;
                    }
                    _this.product.countingRecursion = '';
                }
                _this.disabilityStatus();
            }
        }, function (err) {
            console.log(err.message);
        });
        if (this.isAdd) {
            this.isAdding.subscribe(function (data) {
                _this._isAdding = data;
                _this.disabilityStatus();
            }, function (err) {
                console.log(err.message);
            });
            this.formTitle = 'New Product';
            this.product.id = -1;
            this.product.name = '';
            this.product.code = '';
            this.product.size = null;
            this.product.measuringUnit = null;
            this.product.prep_unit_id = null;
            this.product.countingRecursion = '';
            this.product.minQty = null;
            this.product.maxQty = null;
            for (var day in this.product.coefficients) {
                this.product.coefficients[day] = 1;
            }
        }
        else {
            this.productModel.waiting.subscribe(function (data) {
                _this._isUpdating = data.updating;
                _this._isDeleting = data.deleting;
                _this.disabilityStatus();
            }, function (err) {
                console.log(err.message);
            });
            this.product.id = this.tempProductModel._product.id;
            this.product.name = this.tempProductModel._product.name;
            this.product.code = this.tempProductModel._product.code;
            this.product.size = this.tempProductModel._product.size;
            this.product.measuringUnit = this.tempProductModel._product.measuringUnit;
            this.product.prep_unit_id = this.tempProductModel._product.prep_unit_id;
            this.product.maxQty = this.tempProductModel._product.maxQty;
            this.product.minQty = this.tempProductModel._product.minQty;
            for (var day in this.tempProductModel._product.coefficients) {
                this.product.coefficients[day] = this.tempProductModel._product.coefficients[day];
            }
            this.product.countingRecursion = this.tempProductModel._product.countingRecursion;
            this.formTitle = this.product.name;
        }
        this.disabilityStatus();
    };
    ProductSubFormComponent.prototype.actionEmitter = function (clickType) {
        var value = {
            type: clickType,
            data: this.product
        };
        this.action.emit(value);
    };
    ProductSubFormComponent.prototype.disabilityStatus = function () {
        if (this.isAdd)
            this.addIsDisable = this.shouldDisableAddBtn();
        else {
            this.deleteIsDisable = this.shouldDisableDeleteBtn();
            this.updateIsDisable = this.shouldDisableUpdateBtn();
        }
    };
    ProductSubFormComponent.prototype.isCorrectFormData = function () {
        for (var day in this.product.coefficients) {
            if (this.product.coefficients[day] < 0)
                this.product.coefficients[day] = 1;
            if (this.product.coefficients[day] > 99999)
                this.product.coefficients[day] = 99999;
            if (this.product.coefficients[day] === 0 || this.product.coefficients[day] === null)
                return false;
        }
        if (this.product.size < 0)
            this.product.size = 1;
        if (this.product.size > 99999)
            this.product.size = 99999;
        if (this.product.name !== ''
            && this.product.code !== ''
            && this.product.size !== null && this.product.size !== 0
            && this.product.measuringUnit !== null
            && this.product.prep_unit_id !== null
            && !this.hasCountingRuleError)
            return true;
        else
            return false;
    };
    ProductSubFormComponent.prototype.shouldDisableAddBtn = function () {
        if (this._isAdding === true)
            return true;
        else
            return !this.isCorrectFormData();
    };
    ProductSubFormComponent.prototype.shouldDisableUpdateBtn = function () {
        if (this._isUpdating === true)
            return true;
        else {
            if (this.productModel.isDifferent(this.product) === true)
                return !this.isCorrectFormData();
            else
                return true;
        }
    };
    ProductSubFormComponent.prototype.shouldDisableDeleteBtn = function () {
        if (this._isDeleting === true)
            return true;
        else
            return false;
    };
    ProductSubFormComponent.prototype.countingRuleErrorHandler = function (message) {
        if (message) {
            this.messageService.warn(message);
            this.hasCountingRuleError = true;
        }
        else
            this.hasCountingRuleError = false;
        this.disabilityStatus();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ProductSubFormComponent.prototype, "isAdd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', rxjs_1.Observable)
    ], ProductSubFormComponent.prototype, "isAdding", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', rxjs_1.Observable)
    ], ProductSubFormComponent.prototype, "actionIsSuccess", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', product_model_1.ProductModel), 
        __metadata('design:paramtypes', [product_model_1.ProductModel])
    ], ProductSubFormComponent.prototype, "productModel", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ProductSubFormComponent.prototype, "action", void 0);
    ProductSubFormComponent = __decorate([
        core_1.Component({
            selector: 'app-product-sub-form',
            templateUrl: './product-sub-form.component.html',
            styleUrls: ['./product-sub-form.component.css']
        }), 
        __metadata('design:paramtypes', [rest_service_1.RestService, message_service_1.MessageService])
    ], ProductSubFormComponent);
    return ProductSubFormComponent;
}());
exports.ProductSubFormComponent = ProductSubFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/product-form/product-sub-form.component.js.map