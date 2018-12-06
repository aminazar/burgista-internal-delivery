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
var rest_service_1 = require("../rest.service");
var fileSaver = require('file-saver/FileSaver.min.js');
var message_service_1 = require("../message.service");
var unit_model_1 = require("../unit-form/unit.model");
var unit_1 = require("../unit-form/unit");
var moment = require("moment");
var ReportsComponent = (function () {
    function ReportsComponent(restService, messageService) {
        this.restService = restService;
        this.messageService = messageService;
        this.productModels = [];
        this.unitModels = [];
        this.branches = [];
        this.branchIdForProductReport = 0;
        this.branchIdForDeliveryReport = 0;
        this.deliveryReportBtnDisabled = true;
        this.inventoryReportBtnDisabled = true;
    }
    ReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.restService.get('unit?isBranch=true').subscribe(function (data) {
            _this.unitModels = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var unitData = data_1[_i];
                var unit = new unit_1.Unit();
                unit.id = unitData.uid;
                unit.name = unitData.name;
                unit.username = unitData.username;
                unit.password = '';
                unit.is_branch = unitData.is_branch;
                unit.is_kitchen = unitData.is_kitchen;
                var unitModel = new unit_model_1.UnitModel(unit);
                _this.unitModels.push(unitModel);
            }
            _this.branches = _this.unitModels.map(function (unit) {
                return unit._unit;
            });
            _this.branchesWithoutAllOption = _this.branches.map(function (item) {
                return item;
            });
            var u = new unit_1.Unit();
            u.id = 0;
            u.name = 'All';
            _this.branches.push(u);
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode()) {
                console.log(error);
            }
        });
    };
    ReportsComponent.prototype.loadDataForProductsReport = function () {
        var _this = this;
        var today = moment().format('YYYY-MM-DD');
        if (this.branchIdForProductReport === 0) {
            this.restService.get('reports/all_products/').subscribe(function (data) {
                _this.downloadCSV(_this.convertAllProductsToCSV(data), 'all-products-' + today + '.csv');
            }, function (err) {
                console.log(err.message);
            });
        }
        else {
            this.restService.get('reports/products/' + this.branchIdForProductReport).subscribe(function (data) {
                var branch = _this.branches.find(function (unit) {
                    return unit.id === _this.branchIdForProductReport;
                });
                var filename = branch.name + '-products-' + today + '.csv';
                _this.downloadCSV(_this.convertBranchProductsToCSV(data, branch), filename);
            }, function (err) {
                console.error(err.message);
            });
        }
    };
    ReportsComponent.prototype.prepareInventoryCountingReport = function () {
        var _this = this;
        if (!this.branchIdForInventoryReport) {
            this.messageService.message('Please select a branch');
            return;
        }
        this.restService.get('reports/inventory_counting/' + this.branchIdForInventoryReport).subscribe(function (data) {
            var branch = _this.branches.find(function (unit) {
                return unit.id === _this.branchIdForInventoryReport;
            });
            var today = moment().format('YYYY-MM-DD');
            var filename = branch.name + '-inventory-counting-report-' + today + '.csv';
            _this.downloadCSV(_this.wrapInventoryCountingReportResults(data), filename);
        }, function (error) {
            console.log(error);
        });
    };
    ReportsComponent.prototype.wrapInventoryCountingReportResults = function (rows) {
        var keys = ['Product Name', 'Product Code', 'Last Counted', 'Inventory Count', 'Next Count Date',
            'Estimate Stock Availability', 'Branch Name'];
        var data = rows.map(function (r) {
            return {
                'Product Name': r.product_name,
                'Product Code': r.product_code,
                'Branch Name': r.branch_name,
                'Last Counted': moment(r.last_counted).format('ddd DD MMM YYYY'),
                'Inventory Count': r.product_count,
                'Next Count Date': moment(r.next_count_date).format('ddd DD MMM YYYY'),
                'Estimate Stock Availability': r.estimate
            };
        });
        return this.convertToCSV(keys, data);
    };
    ReportsComponent.prototype.checkDisabilityStatus = function () {
        if (this.startDate && this.endDate) {
            this.deliveryReportBtnDisabled = false;
        }
        else {
            this.deliveryReportBtnDisabled = true;
        }
        if (this.branchIdForInventoryReport) {
            this.inventoryReportBtnDisabled = false;
        }
        else {
            this.inventoryReportBtnDisabled = true;
        }
    };
    ReportsComponent.prototype.prepareDeliveryReport = function () {
        var _this = this;
        if (!this.startDate || !this.endDate) {
            this.messageService.message('Please select a date range');
            return;
        }
        var startDateObj = moment(this.startDate);
        var endDateObj = moment(this.endDate);
        if (startDateObj.isAfter(endDateObj)) {
            this.messageService.warn('Selected date range is not valid');
            return;
        }
        var start_date = startDateObj.format('YYYY-MM-DD');
        var end_date = endDateObj.format('YYYY-MM-DD');
        var url;
        if (this.branchIdForDeliveryReport === 0) {
            url = 'reports/delivery/' + start_date + '/' + end_date;
        }
        else {
            url = 'reports/branch_delivery/' + this.branchIdForDeliveryReport + '/' + start_date + '/' + end_date;
        }
        this.restService.get(url).subscribe(function (data) {
            _this.downloadCSV(_this.wrapDeliveryReportResults(data), 'delivery-report-' + start_date + '-' + end_date + '.csv');
        }, function (error) {
            console.log(error);
        });
    };
    ReportsComponent.prototype.wrapDeliveryReportResults = function (rows) {
        var keys = ['Product Name', 'Product Code', 'Delivered To', 'Date', 'Quantity', 'Product Price', 'Subtotal'];
        var data = rows.map(function (r) {
            return {
                'Product Name': r.product_name,
                'Product Code': r.product_code,
                'Delivered To': r.branch_name,
                'Date': moment(r.counting_date).format('YYYY-MM-DD'),
                'Quantity': r.real_delivery,
                'Product Price': r.product_price ? '£' + r.product_price : '',
                'Subtotal': r.subtotal ? '£' + r.subtotal : 0,
            };
        });
        var total = rows.reduce(function (sum, r) {
            return sum + (r.subtotal ? parseFloat(r.subtotal) : 0);
        }, 0);
        data.push({
            'Product Name': 'Total',
            'Subtotal': '£' + total.toFixed(2)
        });
        return this.convertToCSV(keys, data);
    };
    ReportsComponent.prototype.convertBranchProductsToCSV = function (products, branch) {
        products = products.filter(function (product) {
            return product.prep_unit_is_kitchen === branch.is_kitchen;
        });
        var keys = ['Product Id', 'Name', 'Code', 'Size', 'Measuring Unit', 'Price', 'Preparing Unit Name', 'Min Quantity', 'Max Quantity',
            'Usage', 'Is Overridden', 'Monday Coef.', 'Tuesday Coef.', 'Wednesday Coef.', 'Thursday Coef.', 'Friday Coef.', 'Friday Coef.',
            'Saturday Coef.', 'Sunday Coef.', 'Inventory Counting Recursion'];
        var data = products.map(function (p) {
            return {
                'Product Id': p.pid,
                'Name': p.name,
                'Code': p.code,
                'Size': p.size,
                'Measuring Unit': p.measuring_unit,
                'Price': p.price ? '£' + p.price.substring(1) : '',
                'Preparing Unit Name': p.prep_unit_name,
                'Min Quantity': p.default_min,
                'Max Quantity': p.default_max,
                'Is Overridden': typeof p.isOverridden !== 'undefined' ? p.isOverridden : false,
                'Inventory Counting Recursion': p.recursion,
                'Usage': p.default_usage,
                'Monday Coef.': p.default_mon_multiple,
                'Tuesday Coef.': p.default_tue_multiple,
                'Wednesday Coef.': p.default_wed_multiple,
                'Thursday Coef.': p.default_thu_multiple,
                'Friday Coef.': p.default_fri_multiple,
                'Saturday Coef.': p.default_sat_multiple,
                'Sunday Coef.': p.default_sun_multiple,
            };
        });
        return this.convertToCSV(keys, data);
    };
    ReportsComponent.prototype.convertAllProductsToCSV = function (products) {
        var keys = ['Product Id', 'Name', 'Code', 'Size', 'Measuring Unit', 'Price', 'Preparing Unit Name', 'Min Quantity', 'Max Quantity',
            'Usage', 'Monday Coef.', 'Tuesday Coef.', 'Wednesday Coef.', 'Thursday Coef.', 'Friday Coef.', 'Friday Coef.',
            'Saturday Coef.', 'Sunday Coef.', 'Inventory Counting Recursion'];
        var data = products.map(function (p) {
            return {
                'Product Id': p.pid,
                'Name': p.name,
                'Code': p.code,
                'Size': p.size,
                'Measuring Unit': p.measuring_unit,
                'Price': p.price ? '£' + p.price.substring(1) : '',
                'Preparing Unit Name': p.prep_unit_name,
                'Min Quantity': p.default_min,
                'Max Quantity': p.default_max,
                'Usage': p.default_usage,
                'Monday Coef.': p.default_mon_multiple,
                'Tuesday Coef.': p.default_tue_multiple,
                'Wednesday Coef.': p.default_wed_multiple,
                'Thursday Coef.': p.default_thu_multiple,
                'Friday Coef.': p.default_fri_multiple,
                'Saturday Coef.': p.default_sat_multiple,
                'Sunday Coef.': p.default_sun_multiple,
                'Inventory Counting Recursion': p.recursion.replace(/,/g, ' - ')
            };
        });
        return this.convertToCSV(keys, data);
    };
    ReportsComponent.prototype.convertToCSV = function (keys, data) {
        var result, ctr, columnDelimiter, lineDelimiter;
        columnDelimiter = ',';
        lineDelimiter = '\n';
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) {
                    result += columnDelimiter;
                }
                result += typeof item[key] !== 'undefined' ? item[key] : '';
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    };
    ReportsComponent.prototype.downloadCSV = function (data, filename) {
        if (typeof data === 'undefined') {
            console.error('no data set for creating file');
            return;
        }
        var blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
        fileSaver.saveAs(blob, filename);
    };
    return ReportsComponent;
}());
ReportsComponent = __decorate([
    core_1.Component({
        selector: 'app-reports',
        templateUrl: './reports.component.html',
        styleUrls: ['./reports.component.css']
    }),
    __metadata("design:paramtypes", [rest_service_1.RestService, message_service_1.MessageService])
], ReportsComponent);
exports.ReportsComponent = ReportsComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/reports/reports.component.js.map