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
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../auth.service");
var rest_service_1 = require("../rest.service");
var inventory_model_1 = require("./inventory.model");
var inventory_1 = require("./inventory");
var timers_1 = require("timers");
var product_1 = require("../product-form/product");
var moment = require("moment");
var InventoryFormComponent = (function () {
    function InventoryFormComponent(authService, restService) {
        this.authService = authService;
        this.restService = restService;
        this.unitName = '';
        this.isSameDates = true;
        this.submitShouldDisabled = true;
        this.products = [];
        this.productName_Code = [];
        this.waiting = false;
    }
    InventoryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.unitName = this.authService.unitName;
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.restService.get('date').subscribe(function (d) {
            _this.currentDate = new Date(d);
            _this.selectedDate = new Date(d);
        }, function (err) { return console.error(err); });
        if (this.inventoryModel === null || this.inventoryModel === undefined) {
            this.inventoryModel = new inventory_model_1.InventoryModel(this.unitName);
        }
        this.getInventoryData();
        this.productNameCodeCtrl = new forms_1.FormControl();
        this.filteredNameCode = this.productNameCodeCtrl.valueChanges
            .startWith(null)
            .map(function (name_code) { return _this.filterProducts(name_code); });
        this.productNameCodeCtrl.valueChanges.subscribe(function (data) {
            var tempNameObj = _this.productName_Code.find(function (el) {
                return el.toLowerCase() === data.toLowerCase();
            });
            if (tempNameObj !== undefined && tempNameObj !== null) {
                var tempInventoryItem_1 = new inventory_1.Inventory();
                tempInventoryItem_1.id = null;
                tempInventoryItem_1.unopenedPack = (_this.unopenedPack.nativeElement.value !== undefined && _this.unopenedPack.nativeElement.value !== null && _this.unopenedPack.nativeElement.value !== '') ? _this.unopenedPack.nativeElement.value : 0;
                tempInventoryItem_1.productCode = data.substr(0, data.indexOf('-') - 1);
                tempInventoryItem_1.productName = data.substr(data.indexOf('-') + 2);
                tempInventoryItem_1.productId = _this.products.find(function (el) { return el.code === tempInventoryItem_1.productCode; }).id;
                tempInventoryItem_1.lastCount = new Date(_this.currentDate.getFullYear(), _this.currentDate.getMonth(), _this.currentDate.getDate());
                tempInventoryItem_1.state = 'exist';
                tempInventoryItem_1.shouldIncluded = false;
                _this.inventoryModel.add(tempInventoryItem_1);
                _this.unopenedPack.nativeElement.value = null;
                _this.autoNameCode.nativeElement.value = null;
                _this.productName_Code = _this.productName_Code.filter(function (el) {
                    return el.toLowerCase() !== data.toLowerCase();
                });
            }
        }, function (err) {
            console.log(err.message);
        });
        this.compareDates();
    };
    InventoryFormComponent.prototype.filterProducts = function (val) {
        return val ? this.productName_Code.filter(function (p) { return new RegExp(val, 'gi').test(p); }) : this.productName_Code;
    };
    InventoryFormComponent.prototype.submitInventoryItem = function (inventoryItem) {
        var _this = this;
        if (inventoryItem.id === null) {
            this.restService.insert('stock', inventory_model_1.InventoryModel.toAnyObject(inventoryItem)).subscribe(function (data) {
                inventoryItem.state = 'sent';
                timers_1.setTimeout(function () {
                    _this.inventoryModel._inventories = _this.inventoryModel._inventories.filter(function (el) {
                        return el.productCode !== inventoryItem.productCode;
                    });
                }, 500);
            }, function (err) {
                console.log(err.message);
            });
        }
        else {
            this.restService.update('stock', inventoryItem.id, inventory_model_1.InventoryModel.toAnyObject(inventoryItem)).subscribe(function (data) {
                inventoryItem.state = 'sent';
                timers_1.setTimeout(function () {
                    _this.inventoryModel._inventories = _this.inventoryModel._inventories.filter(function (el) {
                        return el.productCode !== inventoryItem.productCode;
                    });
                }, 500);
            }, function (err) {
                console.log(err.message);
            });
        }
    };
    InventoryFormComponent.prototype.submitInventories = function () {
        var _this = this;
        var newItems = [];
        var oldItems = [];
        for (var _i = 0, _a = this.inventoryModel._inventories; _i < _a.length; _i++) {
            var invItem = _a[_i];
            if (invItem.id === null) {
                newItems.push(inventory_model_1.InventoryModel.toAnyObject(invItem));
            }
            else {
                oldItems.push(inventory_model_1.InventoryModel.toAnyObject(invItem));
            }
        }
        var sendData = {
            'insert': newItems,
            'update': oldItems
        };
        this.waiting = true;
        this.restService.insert('stock/batch', sendData).subscribe(function (data) {
            timers_1.setTimeout(function () {
                _this.inventoryModel._inventories = [];
                _this.waiting = false;
            }, 500);
        }, function (err) {
            _this.waiting = false;
            console.log(err);
        });
    };
    InventoryFormComponent.prototype.removeInventoryItem = function (inventoryItem) {
        var _this = this;
        inventoryItem.state = 'delete';
        timers_1.setTimeout(function () {
            _this.inventoryModel._inventories = _this.inventoryModel._inventories.filter(function (el) {
                return el.productName !== inventoryItem.productName;
            });
            _this.productName_Code.push(inventoryItem.productCode + ' - ' + inventoryItem.productName);
        }, 1000);
    };
    InventoryFormComponent.prototype.disableInventoryItem = function (inventoryItem) {
        if (inventoryItem.unopenedPack === null || inventoryItem.unopenedPack < 0)
            return true;
        return false;
    };
    InventoryFormComponent.prototype.dateChanged = function () {
        this.compareDates();
        this.inventoryModel.clear();
        this.productName_Code = [];
        this.getInventoryData();
    };
    InventoryFormComponent.prototype.compareDates = function () {
        if (this.currentDate.getDate() !== this.selectedDate.getDate())
            this.isSameDates = false;
        else if (this.currentDate.getMonth() !== this.selectedDate.getMonth())
            this.isSameDates = false;
        else if (this.currentDate.getFullYear() !== this.selectedDate.getFullYear())
            this.isSameDates = false;
        else
            this.isSameDates = true;
    };
    InventoryFormComponent.prototype.isCountingDatePast = function (countingDate) {
        var tempDate = new Date(countingDate);
        if (this.currentDate.getFullYear() > tempDate.getFullYear())
            return true;
        else if (this.currentDate.getMonth() > tempDate.getMonth())
            return true;
        else if (this.currentDate.getDate() > tempDate.getDate())
            return true;
        else
            return false;
    };
    InventoryFormComponent.prototype.getInventoryData = function () {
        var _this = this;
        var dateParam = moment(this.selectedDate).format('YYYYMMDD');
        this.restService.get('stock/' + dateParam).subscribe(function (data) {
            _this.inventoryModel.clear();
            _this.products = [];
            _this.productName_Code = data.filter(function (el) { return el.bsddid === null; }).sort(function (a, b) {
                if (a.product_name.toLowerCase() > b.product_name.toLowerCase())
                    return 1;
                else if (a.product_name.toLowerCase() < b.product_name.toLowerCase())
                    return -1;
                else {
                    if (a.product_code.toLowerCase() > b.product_code.toLowerCase())
                        return 1;
                    else if (a.product_code.toLowerCase() < b.product_code.toLowerCase())
                        return -1;
                    else
                        return 0;
                }
            }).map(function (r) { return r.product_code + " - " + r.product_name; });
            _this.restService.get('override?uid=' + _this.authService.unit_id).subscribe(function (products) {
                var nameCodeCouples = products.map(function (product) { return product.code + " - " + product.name; });
                _this.productName_Code = _this.productName_Code.filter(function (item) {
                    return nameCodeCouples.includes(item);
                });
            }, function (error) {
                console.log(error.message);
            });
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                _this.checkDisability(item);
                if (item.bsddid === null) {
                    var tempProduct = new product_1.Product();
                    tempProduct.id = item.pid;
                    tempProduct.code = item.product_code;
                    tempProduct.name = item.product_name;
                    _this.products.push(tempProduct);
                }
                else {
                    if (item.counting_date === null) {
                        console.log('Error in data fetched from server');
                    }
                    else {
                        var tempInventory = new inventory_1.Inventory();
                        tempInventory.id = item.bsddid;
                        tempInventory.productId = item.pid;
                        tempInventory.productCode = item.product_code;
                        tempInventory.productName = item.product_name;
                        tempInventory.unopenedPack = item.product_count;
                        if (item.last_count === null)
                            tempInventory.lastCount = null;
                        else {
                            var lastCount = moment(item.last_count).format('YYYY-MM-DD');
                            if (lastCount === 'Invalid date')
                                tempInventory.lastCount = _this.currentDate;
                            else
                                tempInventory.lastCount = new Date(lastCount);
                        }
                        tempInventory.shouldCountToday = !_this.isCountingDatePast(item.counting_date);
                        tempInventory.shouldIncluded = true;
                        tempInventory.state = 'exist';
                        _this.inventoryModel.add(tempInventory);
                    }
                }
            }
            _this.inventoryModel._inventories.sort(function (a, b) {
                if ((!a.shouldCountToday && a.shouldIncluded) && !(!b.shouldCountToday && b.shouldIncluded))
                    return -1;
                else if (!(!a.shouldCountToday && a.shouldIncluded) && (!b.shouldCountToday && b.shouldIncluded))
                    return 1;
                else if (a.productName.toLowerCase() > b.productName.toLowerCase())
                    return 1;
                else if (a.productName.toLowerCase() < b.productName.toLowerCase())
                    return -1;
                else {
                    if (a.productCode.toLowerCase() > b.productCode.toLowerCase())
                        return 1;
                    else if (a.productCode.toLowerCase() < b.productCode.toLowerCase())
                        return -1;
                    else
                        return 0;
                }
            });
        }, function (err) {
            console.log(err.message);
        });
    };
    InventoryFormComponent.prototype.checkDisability = function (item) {
        if (item.unopenedPack < 0)
            item.unopenedPack = 0;
        var noValue = false;
        for (var _i = 0, _a = this.inventoryModel._inventories; _i < _a.length; _i++) {
            var invItem = _a[_i];
            if (this.disableInventoryItem(invItem)) {
                noValue = true;
                break;
            }
        }
        this.submitShouldDisabled = noValue;
    };
    InventoryFormComponent.prototype.showProductList = function () {
        this.productNameCodeCtrl.setValue('');
    };
    return InventoryFormComponent;
}());
__decorate([
    core_1.ViewChild('unopenedPack'),
    __metadata("design:type", Object)
], InventoryFormComponent.prototype, "unopenedPack", void 0);
__decorate([
    core_1.ViewChild('autoNameCode'),
    __metadata("design:type", Object)
], InventoryFormComponent.prototype, "autoNameCode", void 0);
InventoryFormComponent = __decorate([
    core_1.Component({
        selector: 'app-inventory-form',
        templateUrl: './inventory-form.component.html',
        styleUrls: ['./inventory-form.component.css'],
        animations: [
            core_1.trigger('itemState', [
                core_1.state('exist', core_1.style({ opacity: 1, transform: 'translateX(0) scale(1)' })),
                core_1.state('delete', core_1.style({ opacity: 0, display: 'none', transform: 'translateX(0) scale(1)' })),
                core_1.state('sent', core_1.style({ opacity: 0, display: 'none', transform: 'translateX(0) scale(1)' })),
                core_1.transition('exist => delete', [
                    core_1.animate('1s ease-out', core_1.style({
                        opacity: 0,
                        transform: 'translateX(-100%) scale(1)'
                    }))
                ]),
                core_1.transition('exist => sent', [
                    core_1.animate('0.5s ease-out', core_1.style({
                        opacity: 0,
                        transform: 'translateX(0) scale(0.5)'
                    }))
                ])
            ])
        ],
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, rest_service_1.RestService])
], InventoryFormComponent);
exports.InventoryFormComponent = InventoryFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/inventory-form/inventory-form.component.js.map