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
var forms_1 = require("@angular/forms");
var rest_service_1 = require("../rest.service");
var auth_service_1 = require("../auth.service");
var product_model_1 = require("../product-form/product.model");
var actionEnum_1 = require("../unit-form/actionEnum");
var message_service_1 = require("../message.service");
var OverrideFormComponent = (function () {
    function OverrideFormComponent(restService, authService, messageService) {
        this.restService = restService;
        this.authService = authService;
        this.messageService = messageService;
        this.isAdmin = false;
        this.productModels = [];
        this.isFiltered = false;
        this.productName_Code = [];
        this.productNames = [];
        this.productCodes = [];
        this.branchList = [];
        this.addIsDisable = false;
        this.updateIsDisable = false;
        this.deleteIsDisable = false;
        this.selectedIndex = 0;
        this.hasCountingRuleError = false;
        this.ae = actionEnum_1.ActionEnum;
    }
    OverrideFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAdmin = (this.authService.userType === 'admin') ? true : false;
        if (this.isAdmin) {
            this.restService.get('unit?isBranch=true').subscribe(function (data) {
                _this.branchList = [];
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var branch = data_1[_i];
                    var tempObj = {
                        id: branch.uid,
                        name: branch.name
                    };
                    _this.branchList.push(tempObj);
                }
                _this.loadBranchProducts();
            }, function (err) {
                console.log(err.message);
            });
        }
        else {
            this.restService.get('override').subscribe(function (data) {
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
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var productObj = data_2[_i];
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
        }
        this.checkDisabilityStatus();
        this.productModelCtrl = new forms_1.FormControl();
        this.filteredNameCode = this.productModelCtrl.valueChanges
            .startWith(null)
            .map(function (name_code) { return _this.filterProducts(name_code); });
        var oneItemInList = false;
        this.filteredNameCode.subscribe(function (data) {
            if (data.length === 1) {
                if (_this.filteredProductModel == null)
                    _this.filteredProductModel = new product_model_1.ProductModel(_this.getProduct(data));
                else
                    _this.filteredProductModel.setProduct(_this.getProduct(data));
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
                    if (_this.filteredProductModel == null)
                        _this.filteredProductModel = new product_model_1.ProductModel(fullMatch._product);
                    else
                        _this.filteredProductModel.setProduct(fullMatch._product);
                    _this.isFiltered = true;
                }
                else
                    _this.isFiltered = false;
            }
        }, function (err) {
            console.log(err.message);
        });
    };
    OverrideFormComponent.prototype.doClickedAction = function (type) {
        if (!this.isFiltered || this.filteredProductModel === null) {
            this.messageService.message('You should first choose product to override');
            return;
        }
        this.setWaiting(type, true);
        switch (type) {
            case actionEnum_1.ActionEnum.add:
                this.add_updateOverride(true);
                break;
            case actionEnum_1.ActionEnum.update:
                this.add_updateOverride(false);
                break;
            case actionEnum_1.ActionEnum.delete:
                this.deleteOverride();
                break;
        }
    };
    OverrideFormComponent.prototype.add_updateOverride = function (isAdd) {
        var _this = this;
        var restUrl = '';
        if (this.isAdmin) {
            restUrl = '?uid=' + this.branchList[this.selectedIndex].id;
        }
        var tempProductModel = this.productModels.filter(function (pm) {
            return pm._product.id === _this.filteredProductModel._product.id;
        });
        if (tempProductModel[0] === null) {
            console.log('Cannot match id!!!');
            this.messageService.message('Unexpected error has occurred. Please reload your page');
            return;
        }
        this.restService.update('override', this.filteredProductModel._product.id + restUrl, product_model_1.ProductModel.toAnyObjectOverride(tempProductModel[0].getDifferentValues(this.filteredProductModel._product))).subscribe(function (data) {
            _this.filteredProductModel._product.isOverridden = true;
            tempProductModel[0].setProduct(_this.filteredProductModel._product);
            (isAdd) ? _this.setWaiting(actionEnum_1.ActionEnum.add, false) : _this.setWaiting(actionEnum_1.ActionEnum.update, false);
            _this.checkDisabilityStatus();
        }, function (err) {
            console.log(err.message);
            _this.checkDisabilityStatus();
        });
    };
    OverrideFormComponent.prototype.deleteOverride = function () {
        var _this = this;
        var restUrl = '';
        if (this.isAdmin) {
            restUrl = '?uid=' + this.branchList[this.selectedIndex].id;
        }
        var tempProductModel = this.productModels.filter(function (pm) {
            return pm._product.id === _this.filteredProductModel._product.id;
        });
        if (tempProductModel[0] === null) {
            console.log('Cannot match id!!!');
            this.messageService.message('Unexpected error has occurred. Please reload your page');
            return;
        }
        this.restService.delete('override', this.filteredProductModel._product.id + restUrl).subscribe(function (data) {
            _this.filteredProductModel._product.isOverridden = false;
            tempProductModel[0].setProduct(product_model_1.ProductModel.fromAnyObject(data.json()));
            _this.filteredProductModel.setProduct(product_model_1.ProductModel.fromAnyObject(data.json()));
            _this.setWaiting(actionEnum_1.ActionEnum.delete, false);
            _this.checkDisabilityStatus();
        }, function (err) {
            console.log(err.message);
            _this.checkDisabilityStatus();
        });
    };
    OverrideFormComponent.prototype.checkDisabilityStatus = function () {
        this.addIsDisable = (this.isFiltered) ? this.shouldAddBtnDisable() : true;
        this.updateIsDisable = (this.isFiltered) ? this.shouldUpdateBtnDisable() : true;
        this.deleteIsDisable = (this.isFiltered) ? this.shouldDeleteBtnDisable() : true;
    };
    OverrideFormComponent.prototype.shouldAddBtnDisable = function () {
        var _this = this;
        if (this.filteredProductModel.waiting.getValue().adding || this.hasCountingRuleError)
            return true;
        var tempProductModel = this.productModels.filter(function (pm) {
            return pm._product.id === _this.filteredProductModel._product.id;
        });
        if (tempProductModel[0] === null) {
            console.log('Id changed!!!');
            return true;
        }
        if (!tempProductModel[0].isDifferent(this.filteredProductModel._product))
            return true;
        return false;
    };
    OverrideFormComponent.prototype.shouldUpdateBtnDisable = function () {
        var _this = this;
        if (this.filteredProductModel.waiting.getValue().updating || this.hasCountingRuleError)
            return true;
        var tempProductModel = this.productModels.filter(function (pm) {
            return pm._product.id === _this.filteredProductModel._product.id;
        });
        if (tempProductModel[0] === null) {
            console.log('Id changed!!!');
            return true;
        }
        if (!tempProductModel[0].isDifferent(this.filteredProductModel._product))
            return true;
        return false;
    };
    OverrideFormComponent.prototype.shouldDeleteBtnDisable = function () {
        if (this.filteredProductModel.waiting.getValue().deleting || this.hasCountingRuleError)
            return true;
        return false;
    };
    OverrideFormComponent.prototype.changedTab = function () {
        this.filteredProductModel = null;
        this.isFiltered = false;
        this.loadBranchProducts();
    };
    OverrideFormComponent.prototype.loadBranchProducts = function () {
        var _this = this;
        if (this.isAdmin) {
            this.restService.get('override?uid=' + this.branchList[this.selectedIndex].id).subscribe(function (data) {
                _this.productModels = [];
                var _loop_2 = function(productObj) {
                    var tempProduct = product_model_1.ProductModel.fromAnyObject(productObj);
                    var tempProductModel = new product_model_1.ProductModel(tempProduct);
                    _this.productModels.push(tempProductModel);
                    if (!_this.productNames.find(function (n) { return n === tempProduct.name; }))
                        _this.productNames.push(tempProduct.name);
                    if (!_this.productCodes.find(function (c) { return c === tempProduct.code; }))
                        _this.productCodes.push(tempProduct.code);
                };
                for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                    var productObj = data_3[_i];
                    _loop_2(productObj);
                }
                _this.productNames.sort();
                _this.productCodes.sort();
                _this.productName_Code = [];
                _this.productName_Code = _this.productName_Code.concat(_this.productNames);
                _this.productName_Code = _this.productName_Code.concat(_this.productCodes);
            }, function (err) {
                console.log(err.message);
            });
        }
    };
    OverrideFormComponent.prototype.countingRuleErrorHandler = function (message) {
        if (message) {
            this.messageService.warn(message);
            this.hasCountingRuleError = true;
        }
        else
            this.hasCountingRuleError = false;
        this.checkDisabilityStatus();
    };
    OverrideFormComponent.prototype.setWaiting = function (type, isWaiting) {
        var tempWaitingObj = {
            adding: false,
            updating: false,
            deleting: false
        };
        switch (type) {
            case actionEnum_1.ActionEnum.add:
                tempWaitingObj.adding = isWaiting;
                break;
            case actionEnum_1.ActionEnum.update:
                tempWaitingObj.updating = isWaiting;
                break;
            case actionEnum_1.ActionEnum.delete:
                tempWaitingObj.deleting = isWaiting;
                break;
        }
        this.filteredProductModel.waiting.next(tempWaitingObj);
    };
    OverrideFormComponent.prototype.filterProducts = function (val) {
        return val ? this.productName_Code.filter(function (p) { return new RegExp(val, 'gi').test(p); }) : this.productName_Code;
    };
    OverrideFormComponent.prototype.getProduct = function (nameCode) {
        var tempProductModel = null;
        tempProductModel = this.productModels.find(function (p) {
            return p._product.name.toLowerCase() == nameCode[0].toLowerCase();
        });
        if (tempProductModel !== null && tempProductModel !== undefined)
            return tempProductModel._product;
        return this.productModels.find(function (p) {
            return p._product.code.toLowerCase() == nameCode[0].toLowerCase();
        })._product;
    };
    OverrideFormComponent = __decorate([
        core_1.Component({
            selector: 'app-override-form',
            templateUrl: './override-form.component.html',
            styleUrls: ['./override-form.component.css']
        }), 
        __metadata('design:paramtypes', [rest_service_1.RestService, auth_service_1.AuthService, message_service_1.MessageService])
    ], OverrideFormComponent);
    return OverrideFormComponent;
}());
exports.OverrideFormComponent = OverrideFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/override-form/override-form.component.js.map