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
var forms_1 = require("@angular/forms");
var product_model_1 = require("./product.model");
var actionEnum_1 = require("../unit-form/actionEnum");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
var ProductFormComponent = (function () {
    function ProductFormComponent(restService, messageService, elementRef) {
        this.restService = restService;
        this.messageService = messageService;
        this.elementRef = elementRef;
        this.isAdding = new rxjs_1.BehaviorSubject(false);
        this.actionIsSuccess = new rxjs_1.BehaviorSubject(false);
        this.productModels = [];
        this.isFiltered = false;
        this.productName_Code = [];
        this.productNames = [];
        this.productCodes = [];
        this.selectedIndex = 0;
        this.nameChose = false;
        this.codeChose = false;
    }
    ProductFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.restService.get('product').subscribe(function (data) {
            _this.productModels = [];
            var _loop_1 = function (productObj) {
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
            _this.refreshProductsDropDown();
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrlName = new forms_1.FormControl();
        this.productModelCtrlCode = new forms_1.FormControl();
        this.filteredName = this.productModelCtrlName.valueChanges
            .startWith(null)
            .map(function (name) { return _this.filterProducts(name, 'name'); });
        this.filteredCode = this.productModelCtrlCode.valueChanges
            .startWith(null)
            .map(function (code) { return _this.filterProducts(code, 'code'); });
        var oneItemInList = false;
        this.filteredName.subscribe(function (data) {
            if (data.length === 1) {
                if (!oneItemInList) {
                    _this.codeChose = false;
                    _this.nameChose = false;
                }
                _this.isFiltered = false;
                _this.filteredProductModel = _this.getProduct(data, 'name');
                _this.nameChose = true;
                oneItemInList = true;
                if (!_this.codeChose)
                    _this.productModelCtrlCode.setValue(_this.filteredProductModel._product.code);
                _this.isFiltered = true;
            }
            else {
                _this.nameChose = false;
                _this.isFiltered = false;
                oneItemInList = false;
            }
        }, function (err) {
            console.log(err.message);
        });
        this.filteredCode.subscribe(function (data) {
            if (data.length === 1) {
                if (!oneItemInList) {
                    _this.codeChose = false;
                    _this.nameChose = false;
                }
                _this.isFiltered = false;
                _this.filteredProductModel = _this.getProduct(data, 'code');
                console.log(_this.filteredProductModel);
                _this.codeChose = true;
                oneItemInList = true;
                if (!_this.nameChose)
                    _this.productModelCtrlName.setValue(_this.filteredProductModel._product.name);
                _this.isFiltered = true;
            }
            else {
                _this.codeChose = false;
                _this.isFiltered = false;
                oneItemInList = false;
            }
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrlName.valueChanges.subscribe(function (data) {
            if (!oneItemInList) {
                var fullMatch = _this.productModels.find(function (el) {
                    return (el._product.name.toLowerCase() == _this.productModelCtrlName.value.toLowerCase());
                });
                if (fullMatch !== null && fullMatch !== undefined) {
                    _this.isFiltered = false;
                    _this.filteredProductModel = fullMatch;
                    _this.nameChose = true;
                    if (!_this.codeChose)
                        _this.productModelCtrlCode.setValue(_this.filteredProductModel._product.code);
                    _this.isFiltered = true;
                }
                else {
                    _this.isFiltered = false;
                    _this.nameChose = false;
                }
            }
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrlCode.valueChanges.subscribe(function (data) {
            if (!oneItemInList) {
                var fullMatch = _this.productModels.find(function (el) {
                    return (el._product.code.toLowerCase() == _this.productModelCtrlCode.value.toLowerCase());
                });
                if (fullMatch !== null && fullMatch !== undefined) {
                    _this.isFiltered = false;
                    _this.filteredProductModel = fullMatch;
                    _this.codeChose = true;
                    if (!_this.nameChose)
                        _this.productModelCtrlName.setValue(_this.filteredProductModel._product.name);
                    _this.isFiltered = true;
                }
                else {
                    _this.isFiltered = false;
                    _this.codeChose = false;
                }
            }
        }, function (err) {
            console.log(err.message);
        });
    };
    ProductFormComponent.prototype.refreshProductsDropDown = function () {
        var _this = this;
        this.productName_Code = [];
        this.productNames.forEach(function (el) { return _this.productName_Code.push(el); });
        this.productCodes.forEach(function (el) { return _this.productName_Code.push(el); });
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
            _this.refreshProductsDropDown();
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
            _this.refreshProductsDropDown();
            _this.isFiltered = false;
            _this.filteredProductModel = null;
            _this.productModelCtrlName.setValue('');
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
            _this.refreshProductsDropDown();
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
    ProductFormComponent.prototype.filterProducts = function (val, filterKind) {
        var res = [];
        if (filterKind === 'name') {
            res = val ? this.productNames.filter(function (p) { return new RegExp(val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi').test(p); }) : this.productNames;
            if (res.length > 0) {
                this.filteredCode.source = this.getProductCode(res);
            }
        }
        else if (filterKind === 'code') {
            res = val ? this.productCodes.filter(function (p) { return new RegExp(val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi').test(p); }) : this.productCodes;
            if (res.length > 0) {
                this.filteredName.source = this.getProductName(res);
            }
        }
        return res;
    };
    ProductFormComponent.prototype.getProductName = function (list) {
        var _this = this;
        var result = [];
        list.forEach(function (el) {
            result.push(_this.productModels.find(function (pm) { return pm._product.code == el; })._product.name);
        });
        return result;
    };
    ProductFormComponent.prototype.getProductCode = function (list) {
        var _this = this;
        var result = [];
        list.forEach(function (el) {
            result.push(_this.productModels.find(function (pm) { return pm._product.name == el; })._product.code);
        });
        return result;
    };
    ProductFormComponent.prototype.getProduct = function (nameCode, selectorKind) {
        var tempProductModel;
        if (selectorKind === 'name')
            tempProductModel = this.productModels[this.productName_Code.findIndex(function (nc) { return nameCode[0] === nc; })];
        else if (selectorKind === 'code')
            tempProductModel = this.productModels[this.productName_Code.findIndex(function (nc) { return nameCode[0] === nc; }) - this.productNames.length];
        return tempProductModel;
    };
    ProductFormComponent.prototype.showProductList = function ($event, filterKind) {
        if (filterKind === 'name') {
            if (this.productModelCtrlName.value === null) {
                this.productModelCtrlName.setValue('');
            }
            else {
                $event.target.select();
            }
        }
        else if (filterKind === 'code') {
            if (this.productModelCtrlCode.value === null) {
                this.productModelCtrlCode.setValue('');
            }
            else {
                $event.target.select();
            }
        }
    };
    return ProductFormComponent;
}());
__decorate([
    core_1.ViewChild('autoNameInput'),
    __metadata("design:type", Object)
], ProductFormComponent.prototype, "autoNameInput", void 0);
ProductFormComponent = __decorate([
    core_1.Component({
        selector: 'app-product-form',
        templateUrl: './product-form.component.html',
        styleUrls: ['./product-form.component.css']
    }),
    __metadata("design:paramtypes", [rest_service_1.RestService, message_service_1.MessageService, core_1.ElementRef])
], ProductFormComponent);
exports.ProductFormComponent = ProductFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/product-form/product-form.component.js.map