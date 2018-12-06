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
var rest_service_1 = require("../rest.service");
var delivery_model_1 = require("./delivery.model");
var delivery_1 = require("./delivery");
var forms_1 = require("@angular/forms");
var message_service_1 = require("../message.service");
var product_1 = require("../product-form/product");
var material_1 = require("@angular/material");
var print_viewer_component_1 = require("../print-viewer/print-viewer.component");
var print_service_1 = require("../print.service");
var moment = require("moment");
var rxjs_1 = require("rxjs");
var DeliveryFormComponent = (function () {
    function DeliveryFormComponent(authService, restService, msgService, dialog, printService) {
        this.authService = authService;
        this.restService = restService;
        this.msgService = msgService;
        this.dialog = dialog;
        this.printService = printService;
        this.dataIsReady = false;
        this.isWaiting = {};
        this.receiverName = 'All';
        this.isToday = true;
        this.selectedIndex = 0;
        this.receivers = [];
        this.receiversSumDeliveries = {};
        this.receiversDeliveryModels = {};
        this.productName_Code = {};
        this.productsList = {};
    }
    DeliveryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.overallDeliveryModel === null || this.overallDeliveryModel === undefined)
            this.overallDeliveryModel = new delivery_model_1.DeliveryModel('All');
        this.overallDeliveryModel._shouldDisabled = true;
        this.unitName = this.authService.unitName;
        this.isKitchen = this.authService.isKitchen;
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.restService.get('date').subscribe(function (d) {
            _this.currentDate = new Date(d);
            _this.selectedDate = new Date(d);
        }, function (err) {
            console.error(err);
        });
        this.receiversDeliveryModels = { All: this.overallDeliveryModel };
        var tempAllDelivery = new delivery_1.Delivery();
        tempAllDelivery.realDelivery = 0;
        tempAllDelivery.min = 0;
        tempAllDelivery.max = 0;
        tempAllDelivery.minDelivery = 0;
        tempAllDelivery.maxDelivery = 0;
        tempAllDelivery.stock = 0;
        this.receiversSumDeliveries = { All: tempAllDelivery };
        this.receivers = [];
        this.restService.get('unit?isBranch=true&isKitchen=' + this.isKitchen).subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                var obj = {
                    id: item.uid,
                    name: item.name,
                    warn: 'no'
                };
                _this.receivers.push(obj);
                _this.isWaiting[obj.name] = false;
            }
            _this.getDeliveryData();
        }, function (err) {
            console.log(err.message);
        });
        this.productNameCodeCtrl = new forms_1.FormControl();
        this.filteredNameCode = this.productNameCodeCtrl.valueChanges
            .map(function (name_code) { return _this.filterProducts(name_code); });
        this.productNameCodeCtrl.valueChanges.subscribe(function (data) {
            var tempNameObj = _this.productName_Code[_this.receiverName].find(function (el) {
                return el.toLowerCase() === data.toLowerCase();
            });
            if (tempNameObj !== undefined && tempNameObj !== null) {
                var p_code_1 = tempNameObj.substr(0, tempNameObj.indexOf('-') - 1);
                var p_name = tempNameObj.substr(tempNameObj.indexOf('-') + 2);
                var tempDelivery = new delivery_1.Delivery();
                tempDelivery.id = null;
                tempDelivery.productCode = p_code_1;
                tempDelivery.productName = p_name;
                var foundProduct = _this.productsList[_this.receiverName].find(function (el) { return el.code.toLowerCase() === p_code_1.toLowerCase(); });
                tempDelivery.min = foundProduct.minQty;
                tempDelivery.max = foundProduct.maxQty;
                tempDelivery.realDelivery = null;
                tempDelivery.stock = 0;
                tempDelivery.minDelivery = (tempDelivery.min - tempDelivery.stock) < 0 ? 0 : (tempDelivery.min - tempDelivery.stock);
                tempDelivery.maxDelivery = tempDelivery.max - tempDelivery.stock;
                tempDelivery.stockDate = moment(tempDelivery.stockDate).format('dd MMM YY');
                _this.receiversDeliveryModels[_this.receiverName].add(tempDelivery);
                _this.calSumRow(_this.receiverName, tempDelivery, 'add');
                _this.calSumRow('All', tempDelivery, 'add');
                _this.productName_Code[_this.receiverName] = _this.productName_Code[_this.receiverName].filter(function (el) {
                    return el.toLowerCase() !== tempNameObj.toLowerCase();
                });
                if (_this.overallDeliveryModel.getByCode(tempDelivery.productCode) === undefined) {
                    _this.overallDeliveryModel.add(tempDelivery);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'min', 0);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'max', 0);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'realDelivery', 0);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'minDelivery', 0);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'maxDelivery', 0);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'stock', 0);
                }
                else {
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'min', tempDelivery.min);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'max', tempDelivery.max);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'realDelivery', tempDelivery.realDelivery);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'minDelivery', tempDelivery.minDelivery);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'maxDelivery', tempDelivery.maxDelivery);
                    _this.updateOverallDelivery(tempDelivery.productCode, tempDelivery, 'add', 'stock', tempDelivery.stock);
                }
                _this.receiversDeliveryModels[_this.receiverName]._isSubmitted = false;
            }
        }, function (err) {
            console.log(err.message);
        });
    };
    DeliveryFormComponent.prototype.dateChanged = function () {
        if (this.selectedDate.getFullYear() !== this.currentDate.getFullYear())
            this.isToday = false;
        else if (this.selectedDate.getMonth() !== this.currentDate.getMonth())
            this.isToday = false;
        else if (this.selectedDate.getDate() !== this.currentDate.getDate())
            this.isToday = false;
        else
            this.isToday = true;
        this.overallDeliveryModel.clear();
        this.getDeliveryData();
    };
    DeliveryFormComponent.prototype.removeDeliveryItem = function (item) {
        var _this = this;
        if (this.selectedIndex === 0) {
            console.log("Error. Cannot remove added items from 'All' tab");
        }
        else {
            this.updateOverallDelivery(item.productCode, item, 'sub', 'realDelivery', item.realDelivery);
            this.updateOverallDelivery(item.productCode, item, 'sub', 'minDelivery', item.minDelivery);
            this.updateOverallDelivery(item.productCode, item, 'sub', 'maxDelivery', item.maxDelivery);
            this.updateOverallDelivery(item.productCode, item, 'sub', 'stock', item.stock);
            this.updateOverallDelivery(item.productCode, item, 'sub', 'min', item.min);
            this.updateOverallDelivery(item.productCode, item, 'sub', 'max', item.max);
            this.receiversDeliveryModels[this.receiverName].deleteByCode(item.productCode);
            var ids = [];
            var minDelivery = 0;
            var maxDelivery = 0;
            var stock = 0;
            for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
                var rcv_1 = _a[_i];
                var tempItem = this.receiversDeliveryModels[rcv_1.name]._deliveries.find(function (el) { return el.productCode.toLowerCase() === item.productCode.toLowerCase(); });
                if (tempItem !== undefined) {
                    ids.push(tempItem.id);
                    minDelivery += tempItem.minDelivery;
                    maxDelivery += tempItem.maxDelivery;
                    stock += tempItem.stock;
                }
            }
            var nullId = ids.find(function (el) { return el === null; });
            if (nullId === undefined) {
                var matchItem = this.overallDeliveryModel._deliveries.find(function (el) { return el.productCode.toLowerCase() === item.productCode.toLowerCase(); });
                if (matchItem !== undefined) {
                    matchItem.minDelivery = minDelivery;
                    matchItem.maxDelivery = maxDelivery;
                    matchItem.stock = stock;
                }
            }
            var rcv = this.receivers.find(function (el) { return el.name.toLowerCase() === _this.receiverName.toLowerCase(); });
            if (this.receiversDeliveryModels[this.receiverName]._deliveries.find(function (el) { return el.id === null; }) === undefined) {
                if (this.receiversDeliveryModels[this.receiverName]._deliveries.find(function (el) { return el.stock === null; }) === undefined)
                    rcv.warn = 'no';
                else
                    rcv.warn = 'count';
            }
            else
                rcv.warn = 'unknown';
            this.calSumRow(this.receiverName, item, 'sub');
            if (this.overallDeliveryModel._deliveries.length > 0) {
                this.receiversSumDeliveries['All'].realDelivery = this.overallDeliveryModel._deliveries
                    .map(function (el) { return el.realDelivery; })
                    .reduce(function (a, b) { return a + b; });
                this.receiversSumDeliveries['All'].min = this.overallDeliveryModel._deliveries
                    .map(function (el) { return el.min; })
                    .reduce(function (a, b) { return a + b; });
                this.receiversSumDeliveries['All'].max = this.overallDeliveryModel._deliveries
                    .map(function (el) { return el.max; })
                    .reduce(function (a, b) { return a + b; });
                if (this.overallDeliveryModel._deliveries.find(function (el) { return el.stock === null; }) === undefined) {
                    this.receiversSumDeliveries['All'].minDelivery = this.overallDeliveryModel._deliveries
                        .map(function (el) { return el.minDelivery; })
                        .reduce(function (a, b) { return a + b; });
                    this.receiversSumDeliveries['All'].maxDelivery = this.overallDeliveryModel._deliveries
                        .map(function (el) { return el.maxDelivery; })
                        .reduce(function (a, b) { return a + b; });
                    this.receiversSumDeliveries['All'].stock = this.overallDeliveryModel._deliveries
                        .map(function (el) { return el.stock; })
                        .reduce(function (a, b) { return a + b; });
                }
            }
            this.productName_Code[this.receiverName].push(item.productCode + ' - ' + item.productName);
            this.receiversDeliveryModels[this.receiverName]._isSubmitted = false;
        }
    };
    DeliveryFormComponent.prototype.filterProducts = function (val) {
        return val ? this.productName_Code[this.receiverName].filter(function (p) { return new RegExp(val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi').test(p); }) : this.productName_Code[this.receiverName];
    };
    DeliveryFormComponent.prototype.checkRealDeliveryValue = function (event, deliveryItem) {
        var value = (event.srcElement.value === '') ? 0 : parseInt(event.srcElement.value);
        if (value < 0) {
            event.srcElement.value = 0;
            deliveryItem.realDelivery = 0;
            return;
        }
        if (value < deliveryItem.minDelivery)
            this.msgService.warn("The 'Real Delivery' value is less than 'Min' value");
        else if (value > deliveryItem.maxDelivery)
            this.msgService.warn("The 'Real Delivery' value is greater than 'Max Delivery' value");
        this.updateOverallDelivery(deliveryItem.productCode, deliveryItem, 'add', 'realDelivery', (value - deliveryItem.realDelivery));
        this.receiversSumDeliveries[this.receiverName].realDelivery += (value - deliveryItem.realDelivery);
        this.receiversSumDeliveries['All'].realDelivery += (value - deliveryItem.realDelivery);
        deliveryItem.realDelivery = value;
        this.receiversDeliveryModels[this.receiverName]._isSubmitted = false;
    };
    DeliveryFormComponent.prototype.tabChanged = function () {
        if (this.selectedIndex === 0)
            this.receiverName = 'All';
        else
            this.receiverName = this.receivers[this.selectedIndex - 1].name;
    };
    DeliveryFormComponent.prototype.updateOverallDelivery = function (code, delivery, action, whichItem, changedValue) {
        switch (whichItem) {
            case 'min':
                this.overallDeliveryModel.updateDeliveryProperty(action, code, 'min', changedValue);
                break;
            case 'max':
                this.overallDeliveryModel.updateDeliveryProperty(action, code, 'max', changedValue);
                break;
            case 'realDelivery':
                this.overallDeliveryModel.updateDeliveryProperty(action, code, 'realDelivery', changedValue);
                break;
            case 'minDelivery':
                {
                    if (delivery.stock === null || delivery.id === null)
                        changedValue = null;
                    this.overallDeliveryModel.updateDeliveryProperty(action, code, 'minDelivery', changedValue);
                }
                break;
            case 'maxDelivery':
                {
                    if (delivery.stock === null || delivery.id === null)
                        changedValue = null;
                    this.overallDeliveryModel.updateDeliveryProperty(action, code, 'maxDelivery', changedValue);
                }
                break;
            case 'stock':
                {
                    if (delivery.stock === null || delivery.id === null)
                        changedValue = null;
                    this.overallDeliveryModel.updateDeliveryProperty(action, code, 'stock', changedValue);
                }
                break;
        }
        if (this.overallDeliveryModel.getByCode(code).min === 0 && this.overallDeliveryModel.getByCode(code).max === 0)
            this.overallDeliveryModel.deleteByCode(code);
        this.overallDeliveryModel._deliveries.sort(function (a, b) {
            if (a.productName.toLowerCase() > b.productName.toLowerCase())
                return 1;
            else if (a.productName.toLowerCase() < b.productName.toLowerCase())
                return -1;
            else {
                if (a.productCode.toLowerCase() > b.productCode.toLowerCase())
                    return 1;
                else if (a.productCode.toLowerCase() < a.productCode.toLowerCase())
                    return -1;
                else
                    return 0;
            }
        });
    };
    DeliveryFormComponent.prototype.countToday = function (stockDate) {
        if (stockDate === null)
            return false;
        if (moment(stockDate).format('YYMMDD') !== moment(this.currentDate).format('YYMMDD'))
            return false;
        else
            return true;
    };
    DeliveryFormComponent.prototype.printDelivery = function (deliveryModel) {
        if (deliveryModel._unitName === 'All') {
            for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
                var rcv = _a[_i];
                if (!this.receiversDeliveryModels[rcv.name]._isSubmitted) {
                    this.msgService.warn(rcv.name + ' data is not submitted');
                    return;
                }
            }
            this.sendForPrint(deliveryModel, true);
        }
        else {
            if (deliveryModel._isSubmitted) {
                deliveryModel._shouldDisabled = true;
                this.sendForPrint(deliveryModel, false);
            }
            else
                this.msgService.warn('You should first submit the list');
        }
    };
    DeliveryFormComponent.prototype.submitDelivery = function (deliveryModel) {
        var _this = this;
        var _loop_1 = function (delItem) {
            if (delItem.realDelivery === null) {
                this_1.msgService.warn("Delivery data are submitted, but delivery value of '" + delItem.productName + "' was blank.");
                return { value: void 0 };
            }
            else if (delItem.realDelivery === 0) {
                this_1.msgService.warn("Delivery data are submitted, but delivery value of '" + delItem.productName + "' was zero");
            }
            deliveryModel._isSubmitted = true;
            if (delItem.id === null) {
                var branchId = this_1.receivers.find(function (el) { return el.name.toLowerCase() === _this.receiverName.toLowerCase(); }).id;
                var productId = this_1.productsList[this_1.receiverName].find(function (el) { return el.code.toLowerCase() === delItem.productCode.toLowerCase(); }).id;
                this_1.restService.insert('delivery/' + branchId, delivery_model_1.DeliveryModel.toAnyObject(delItem, delItem.isPrinted, productId)).subscribe(function (data) {
                    delItem.state = 'added';
                    delItem.id = data;
                    _this.msgService.message('Delivery data are submitted');
                }, function (err) {
                    deliveryModel._isSubmitted = false;
                    console.log(err.message);
                    _this.msgService.error(err);
                });
            }
            else {
                this_1.restService.update('delivery', delItem.id, delivery_model_1.DeliveryModel.toAnyObject(delItem, delItem.isPrinted, null)).subscribe(function (data) {
                    console.log('Update this item successfully');
                }, function (err) {
                    deliveryModel._isSubmitted = false;
                    console.log(err.message);
                    _this.msgService.error(err);
                });
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = deliveryModel._deliveries; _i < _a.length; _i++) {
            var delItem = _a[_i];
            var state_1 = _loop_1(delItem);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    DeliveryFormComponent.prototype.sendForPrint = function (deliveryModel, isAllTab) {
        var _this = this;
        this.printService._isOverallPrint = isAllTab;
        this.printService._unitSupplier = this.unitName;
        this.printService._unitConsumer = (isAllTab) ? 'Aggregated' : this.receiverName;
        this.printService._receivers = this.receivers.map(function (rcv) { return rcv.name; });
        this.printService._deliveryModels = this.receiversDeliveryModels;
        this.printService._deliveryModels['All'] = this.overallDeliveryModel;
        this.printService._showWarningMessage = !this.receiversDeliveryModels[this.receiverName]._isPrinted;
        this.printService.currentDate = this.currentDate;
        var dialogRef = this.dialog.open(print_viewer_component_1.PrintViewerComponent, {
            height: '600px',
            width: '1200px'
        });
        dialogRef.afterClosed().subscribe(function (data) {
            if (data === 'print') {
                if (!isAllTab) {
                    var doneAllItems_1 = new rxjs_1.BehaviorSubject(false);
                    var noFailure_1 = true;
                    var counter_1 = 0;
                    var _loop_2 = function (item) {
                        item.isPrinted = true;
                        _this.restService.update('delivery', item.id, delivery_model_1.DeliveryModel.toAnyObject(item, item.isPrinted, null)).subscribe(function (data) {
                            deliveryModel._isPrinted = deliveryModel._deliveries.map(function (d) { return d.isPrinted; }).reduce(function (a, b) { return a && b; });
                            counter_1++;
                            if (counter_1 >= deliveryModel._deliveries.length)
                                doneAllItems_1.next(true);
                        }, function (err) {
                            item.isPrinted = false;
                            deliveryModel._isPrinted = false;
                            noFailure_1 = false;
                            counter_1++;
                            if (counter_1 >= deliveryModel._deliveries.length)
                                doneAllItems_1.next(true);
                        });
                    };
                    for (var _i = 0, _a = deliveryModel._deliveries; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _loop_2(item);
                    }
                    doneAllItems_1.subscribe(function (data) {
                        if (data && noFailure_1) {
                            _this.checkOverallPrintDisability();
                            _this.printService.printData();
                        }
                    });
                }
                else {
                    _this.printService.printData();
                }
            }
        }, function (err) { return console.log(err.message); });
    };
    DeliveryFormComponent.prototype.checkOverallPrintDisability = function () {
        var overallCanPrinted = true;
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var rcv = _a[_i];
            if (!this.receiversDeliveryModels[rcv.name]._isPrinted && this.receiversDeliveryModels[rcv.name]._deliveries.length > 0)
                overallCanPrinted = false;
        }
        this.overallDeliveryModel._shouldDisabled = !overallCanPrinted;
    };
    DeliveryFormComponent.prototype.getDeliveryData = function () {
        var _this = this;
        var dateParam = moment(this.selectedDate).format('YYYYMMDD');
        var _loop_3 = function (rcv) {
            rcv.warn = 'no';
            this_2.isWaiting[rcv.name] = true;
            this_2.waiting();
            this_2.restService.get('delivery/' + dateParam + '/' + rcv.id).subscribe(function (data) {
                _this.isWaiting[rcv.name] = false;
                _this.waiting();
                _this.productsList[rcv.name] = [];
                _this.receiversDeliveryModels[rcv.name] = new delivery_model_1.DeliveryModel(rcv.name);
                _this.receiversSumDeliveries[rcv.name] = new delivery_1.Delivery();
                _this.receiversSumDeliveries[rcv.name].min = 0;
                _this.receiversSumDeliveries[rcv.name].max = 0;
                _this.receiversSumDeliveries[rcv.name].minDelivery = 0;
                _this.receiversSumDeliveries[rcv.name].maxDelivery = 0;
                _this.receiversSumDeliveries[rcv.name].realDelivery = 0;
                _this.receiversSumDeliveries[rcv.name].stock = 0;
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var item = data_2[_i];
                    if (item.id === null) {
                        var tempProduct = new product_1.Product();
                        tempProduct.id = item.productId;
                        tempProduct.code = item.productCode;
                        tempProduct.name = item.productName;
                        tempProduct.minQty = item.min;
                        tempProduct.maxQty = item.max;
                        if (_this.productsList[rcv.name] === undefined)
                            _this.productsList[rcv.name] = [];
                        _this.productsList[rcv.name].push(tempProduct);
                        if (_this.productName_Code[rcv.name] === undefined)
                            _this.productName_Code[rcv.name] = [];
                        _this.productName_Code[rcv.name].push(item.productCode + ' - ' + item.productName);
                    }
                    else {
                        if (item.stock === null || (typeof item.stock !== 'number'))
                            rcv.warn = 'count';
                        var tempDelivery = new delivery_1.Delivery();
                        tempDelivery.id = item.id;
                        tempDelivery.productCode = item.productCode;
                        tempDelivery.productName = item.productName;
                        if (item.stock === null && item.realDelivery === null)
                            tempDelivery.realDelivery = null;
                        else if (item.realDelivery === null)
                            tempDelivery.realDelivery = (item.max - item.stock) < 0 ? 0 : (item.max - item.stock);
                        else
                            tempDelivery.realDelivery = item.realDelivery;
                        tempDelivery.minDelivery = (item.min - item.stock) < 0 ? 0 : (item.min - item.stock);
                        tempDelivery.maxDelivery = item.max - item.stock >= 0 ? item.max - item.stock : 0;
                        tempDelivery.min = item.min;
                        tempDelivery.max = item.max;
                        tempDelivery.stock = item.stock;
                        tempDelivery.isPrinted = item.isPrinted;
                        if (item.stockDate === null)
                            tempDelivery.stockDate = null;
                        else
                            tempDelivery.stockDate = moment(item.stockDate).format('DD MMM YY');
                        tempDelivery.state = 'exist';
                        _this.receiversDeliveryModels[rcv.name].add(tempDelivery);
                        _this.calSumRow(rcv.name, tempDelivery, 'add');
                        _this.calSumRow('All', tempDelivery, 'add');
                        if (_this.overallDeliveryModel.getByCode(item.productCode) === undefined) {
                            _this.overallDeliveryModel.add(tempDelivery);
                        }
                        else {
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'min', tempDelivery.min);
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'max', tempDelivery.max);
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'realDelivery', tempDelivery.realDelivery);
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'minDelivery', tempDelivery.minDelivery);
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'maxDelivery', tempDelivery.maxDelivery);
                            _this.updateOverallDelivery(item.productCode, tempDelivery, 'add', 'stock', tempDelivery.stock);
                        }
                    }
                }
                if (_this.receiversDeliveryModels[rcv.name]._deliveries.length > 0)
                    _this.receiversDeliveryModels[rcv.name]._isPrinted = _this.receiversDeliveryModels[rcv.name]._deliveries.map(function (d) { return d.isPrinted; })
                        .reduce(function (a, b) { return a && b; });
                else {
                    _this.receiversDeliveryModels[rcv.name]._isSubmitted = true;
                }
                if (_this.receiversDeliveryModels[rcv.name]._isPrinted)
                    _this.receiversDeliveryModels[rcv.name]._isSubmitted = true;
                _this.receiversDeliveryModels[rcv.name]._deliveries.sort(function (a, b) {
                    if (!_this.countToday(a.stockDate) && _this.countToday(b.stockDate))
                        return -1;
                    else if (_this.countToday(a.stockDate) && !_this.countToday(b.stockDate))
                        return 1;
                    if (a.productName.toLowerCase() > b.productName.toLowerCase())
                        return 1;
                    else if (a.productName.toLowerCase() < b.productName.toLowerCase())
                        return -1;
                    else {
                        if (a.productCode.toLowerCase() > b.productCode.toLowerCase())
                            return 1;
                        else if (a.productCode.toLowerCase() < a.productCode.toLowerCase())
                            return -1;
                        else
                            return 0;
                    }
                });
            }, function (err) {
                _this.isWaiting[rcv.name] = false;
                _this.waiting();
                console.log(err.message);
            });
        };
        var this_2 = this;
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var rcv = _a[_i];
            _loop_3(rcv);
        }
    };
    DeliveryFormComponent.prototype.showProductList = function () {
        this.productNameCodeCtrl.setValue('');
    };
    DeliveryFormComponent.prototype.clearInput = function ($event) {
        setTimeout(function () {
            $event.target.value = '';
        }, 50);
    };
    DeliveryFormComponent.prototype.calSumRow = function (rcvName, delivery, operation) {
        if (operation === 'add') {
            if ((delivery.stock === null || delivery.id === null)) {
                if (rcvName !== 'All') {
                    var rcv = this.receivers.find(function (el) { return el.name.toLowerCase() === rcvName.toLowerCase(); });
                    if (rcv.warn === 'no')
                        rcv.warn = 'unknown';
                }
                else {
                    this.receiversSumDeliveries['All'].minDelivery = null;
                    this.receiversSumDeliveries['All'].maxDelivery = null;
                    this.receiversSumDeliveries['All'].stock = null;
                }
            }
            this.receiversSumDeliveries[rcvName].min += delivery.min;
            this.receiversSumDeliveries[rcvName].max += delivery.max;
            if (this.receiversSumDeliveries[rcvName].minDelivery !== null)
                this.receiversSumDeliveries[rcvName].minDelivery += delivery.minDelivery;
            if (this.receiversSumDeliveries[rcvName].maxDelivery !== null)
                this.receiversSumDeliveries[rcvName].maxDelivery += delivery.maxDelivery;
            this.receiversSumDeliveries[rcvName].realDelivery += delivery.realDelivery;
            if (this.receiversSumDeliveries[rcvName].stock !== null)
                this.receiversSumDeliveries[rcvName].stock += delivery.stock;
        }
        else {
            this.receiversSumDeliveries[rcvName].min -= delivery.min;
            this.receiversSumDeliveries[rcvName].max -= delivery.max;
            this.receiversSumDeliveries[rcvName].minDelivery -= delivery.minDelivery;
            this.receiversSumDeliveries[rcvName].maxDelivery -= delivery.maxDelivery;
            this.receiversSumDeliveries[rcvName].realDelivery -= delivery.realDelivery;
            this.receiversSumDeliveries[rcvName].stock -= (delivery.stock === null) ? 0 : delivery.stock;
        }
    };
    DeliveryFormComponent.prototype.waiting = function () {
        var wait = false;
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var rcv = _a[_i];
            wait = wait || this.isWaiting[rcv.name];
        }
        this.dataIsReady = !wait;
    };
    return DeliveryFormComponent;
}());
DeliveryFormComponent = __decorate([
    core_1.Component({
        selector: 'app-delivery-form',
        templateUrl: './delivery-form.component.html',
        styleUrls: ['./delivery-form.component.css'],
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
    __metadata("design:paramtypes", [auth_service_1.AuthService, rest_service_1.RestService, message_service_1.MessageService, material_1.MdDialog, print_service_1.PrintService])
], DeliveryFormComponent);
exports.DeliveryFormComponent = DeliveryFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/delivery-form/delivery-form.component.js.map