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
var forms_1 = require("@angular/forms");
var product_model_1 = require("./product.model");
var actionEnum_1 = require("../unit-form/actionEnum");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
var ProductFormComponent = (function () {
    function ProductFormComponent(restService, messageService) {
        this.restService = restService;
        this.messageService = messageService;
        this.isAdding = new rxjs_1.BehaviorSubject(false);
        this.actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        this.productModels = [];
        this.isFiltered = false;
        this.productName_Code = [];
        this.productNames = [];
        this.productCodes = [];
        this.selectedIndex = 0;
    }
    ProductFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.restService.get('product').subscribe(function (data) {
            _this.productModels = [];
            var _loop_1 = function(productObj) {
                var tempProduct = product_model_1.ProductModel.fromAnyObject(productObj);
                var tempProductModel = new product_model_1.ProductModel(tempProduct);
                _this.productModels.push(tempProductModel);
                if (!_this.productNames.find(function (n) { return n === tempProduct.name; }))
                    _this.productNames.push(tempProduct.name);
                if (!_this.productCodes.find(function (c) { return c === tempProduct.code; }))
                    _this.productCodes.push(tempProduct.code);
            };
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var productObj = data_1[_i];
                _loop_1(productObj);
            }
            _this.productNames.sort();
            _this.productCodes.sort();
            _this.productName_Code = [];
            _this.productName_Code = _this.productName_Code.concat(_this.productNames);
            _this.productName_Code = _this.productName_Code.concat(_this.productCodes);
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrl = new forms_1.FormControl();
        this.filteredNameCode = this.productModelCtrl.valueChanges
            .startWith(null)
            .map(function (name_code) { return _this.filterProducts(name_code); });
        var oneItemInList = false;
        this.filteredNameCode.subscribe(function (data) {
            if (data.length === 1) {
                _this.isFiltered = false;
                _this.filteredProductModel = _this.getProduct(data);
                _this.isFiltered = true;
                oneItemInList = true;
            }
            else {
                _this.isFiltered = false;
                oneItemInList = false;
            }
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrl.valueChanges.subscribe(function (data) {
            if (!oneItemInList) {
                var fullMatch = _this.productModels.find(function (el) {
                    return (el._product.name.toLowerCase() == _this.productModelCtrl.value.toLowerCase())
                        || (el._product.code.toLowerCase() == _this.productModelCtrl.value.toLowerCase());
                });
                if (fullMatch !== null && fullMatch !== undefined) {
                    _this.isFiltered = false;
                    _this.filteredProductModel = fullMatch;
                    _this.isFiltered = true;
                }
                else
                    _this.isFiltered = false;
            }
        }, function (err) {
            console.log(err.message);
        });
    };
    ProductFormComponent.prototype.doClickedAction = function (value) {
        var clickType = value.type;
        var clickData = value.data;
        this.disableEnable(clickData.id, clickType, true);
        switch (clickType) {
            case actionEnum_1.ActionEnum.add:
                this.addProduct(clickData);
                break;
            case actionEnum_1.ActionEnum.delete:
                this.deleteProduct(clickData.id);
                break;
            case actionEnum_1.ActionEnum.update:
                this.updateProduct(clickData.id, clickData);
                break;
        }
    };
    ProductFormComponent.prototype.addProduct = function (product) {
        var _this = this;
        var foundByName = this.productModels.find(function (el) {
            return el._product.name.toLowerCase() === product.name.toLowerCase();
        });
        if (foundByName !== null && foundByName !== undefined) {
            this.messageService.warn("The '" + foundByName._product.name + "' name is already exist.");
            this.disableEnable(product.id, actionEnum_1.ActionEnum.add, false);
            return;
        }
        var foundByCode = this.productModels.find(function (el) {
            return el._product.code.toLowerCase() === product.code.toLowerCase();
        });
        if (foundByCode !== null && foundByCode !== undefined) {
            this.messageService.warn("The '" + foundByCode._product.code + "' code is already exist.");
            this.disableEnable(product.id, actionEnum_1.ActionEnum.add, false);
            return;
        }
        var name = product.name;
        this.restService.insert('product', product_model_1.ProductModel.toAnyObject(product)).subscribe(function (data) {
            product.id = data;
            var tempProductModel = new product_model_1.ProductModel(product);
            _this.actionIsSuccess.next(true);
            _this.productModels.push(tempProductModel);
            _this.productNames.push(tempProductModel._product.name);
            _this.productCodes.push(tempProductModel._product.code);
            _this.productNames.sort();
            _this.productCodes.sort();
            _this.productName_Code = [];
            _this.productName_Code = _this.productName_Code.concat(_this.productNames);
            _this.productName_Code = _this.productName_Code.concat(_this.productCodes);
            _this.disableEnable(product.id, actionEnum_1.ActionEnum.add, false);
            _this.actionIsSuccess.next(false);
            _this.messageService.message("'" + name + "' is added to products.");
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(product.id, actionEnum_1.ActionEnum.add, false);
        });
    };
    ProductFormComponent.prototype.deleteProduct = function (productId) {
        var _this = this;
        this.restService.delete('product', productId).subscribe(function (data) {
            var deletedProductModel = _this.productModels.filter(function (element) {
                return element._product.id === productId;
            });
            _this.productModels = _this.productModels.filter(function (elemenet) {
                return elemenet._product.id !== productId;
            });
            _this.productNames = _this.productNames.filter(function (el) {
                return el !== deletedProductModel[0]._product.name;
            });
            _this.productCodes = _this.productCodes.filter(function (el) {
                return el !== deletedProductModel[0]._product.code;
            });
            _this.productName_Code = [];
            _this.productName_Code = _this.productName_Code.concat(_this.productNames);
            _this.productName_Code = _this.productName_Code.concat(_this.productCodes);
            _this.isFiltered = false;
            _this.filteredProductModel = null;
            _this.productModelCtrl.setValue('');
            _this.messageService.message("Product is deleted.");
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(productId, actionEnum_1.ActionEnum.delete, false);
        });
    };
    ProductFormComponent.prototype.updateProduct = function (productId, product) {
        var _this = this;
        var foundByName = this.productModels.find(function (el) {
            return el._product.name.toLowerCase() === product.name.toLowerCase();
        });
        if ((foundByName !== null && foundByName !== undefined) && product.name !== this.filteredProductModel._product.name) {
            this.messageService.warn("The '" + foundByName._product.name + "' name is already exist.");
            this.disableEnable(productId, actionEnum_1.ActionEnum.update, false);
            return;
        }
        var foundByCode = this.productModels.find(function (el) {
            return el._product.code.toLowerCase() === product.code.toLowerCase();
        });
        if ((foundByCode !== null && foundByCode !== undefined) && product.code !== this.filteredProductModel._product.code) {
            this.messageService.warn("The '" + foundByCode._product.code + "' code is already exist.");
            this.disableEnable(productId, actionEnum_1.ActionEnum.update, false);
            return;
        }
        var index = this.productModels.findIndex(function (element) {
            return element._product.id == productId;
        });
        var lastCode = this.productModels[index]._product.code;
        var lastName = this.productModels[index]._product.name;
        this.restService.update('product', productId, product_model_1.ProductModel.toAnyObject(this.productModels[index].getDifferentValues(product))).subscribe(function (data) {
            _this.actionIsSuccess.next(true);
            _this.productModels[index].setProduct(product);
            var tempNameIndex = _this.productNames.findIndex(function (el) { return el === lastName; });
            _this.productNames[tempNameIndex] = product.name;
            var tempCodeIndex = _this.productCodes.findIndex(function (el) { return el === lastCode; });
            _this.productCodes[tempCodeIndex] = product.code;
            _this.productName_Code = [];
            _this.productNames.sort();
            _this.productCodes.sort();
            _this.productName_Code = _this.productName_Code.concat(_this.productNames);
            _this.productName_Code = _this.productName_Code.concat(_this.productCodes);
            _this.disableEnable(productId, actionEnum_1.ActionEnum.update, false);
            _this.messageService.message("'" + name + "' is updated in products.");
            _this.actionIsSuccess.next(false);
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(productId, actionEnum_1.ActionEnum.update, false);
        });
    };
    ProductFormComponent.prototype.disableEnable = function (productId, btnType, isDisable) {
        var tempProductModel = this.productModels.find(function (element) {
            return element._product.id == productId;
        });
        var tempWaitingObj = tempProductModel ? tempProductModel.waiting.getValue() : null;
        switch (btnType) {
            case actionEnum_1.ActionEnum.update:
                tempWaitingObj.updating = isDisable;
                break;
            case actionEnum_1.ActionEnum.delete:
                tempWaitingObj.deleting = isDisable;
                break;
            case actionEnum_1.ActionEnum.add:
                this.isAdding.next(isDisable);
                break;
        }
        if (tempProductModel)
            tempProductModel.waiting.next(tempWaitingObj);
    };
    ProductFormComponent.prototype.filterProducts = function (val) {
        return val ? this.productName_Code.filter(function (p) { return new RegExp(val, 'gi').test(p); }) : this.productName_Code;
    };
    ProductFormComponent.prototype.getProduct = function (nameCode) {
        var tempProductModel;
        tempProductModel = this.productModels.find(function (p) {
            return p._product.name.toLowerCase() == nameCode[0].toLowerCase();
        });
        if (tempProductModel !== null && tempProductModel !== undefined)
            return tempProductModel;
        return this.productModels.find(function (p) {
            return p._product.code.toLowerCase() == nameCode[0].toLowerCase();
        });
    };
    __decorate([
        core_1.ViewChild('autoNameCode'), 
        __metadata('design:type', Object)
    ], ProductFormComponent.prototype, "autoNameCode", void 0);
    ProductFormComponent = __decorate([
        core_1.Component({
            selector: 'app-product-form',
            templateUrl: './product-form.component.html',
            styleUrls: ['./product-form.component.css']
        }), 
        __metadata('design:paramtypes', [rest_service_1.RestService, message_service_1.MessageService])
    ], ProductFormComponent);
    return ProductFormComponent;
}());
exports.ProductFormComponent = ProductFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/product-form/product-form.component.js.map