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
var WindowRef_1 = require("./WindowRef");
var message_service_1 = require("./message.service");
var moment = require("moment");
var PrintService = (function () {
    function PrintService(messageService, winRef) {
        this.messageService = messageService;
        this.winRef = winRef;
        this._unitSupplier = '';
        this._unitConsumer = '';
        this._isOverallPrint = false;
        this._receivers = [];
        this._deliveryModels = {};
        this._showWarningMessage = true;
        this.currentDate = new Date();
        this._window = winRef.nativeWindow;
    }
    PrintService.prototype.getItems = function () {
        if (this._isOverallPrint)
            return this.overallItems();
        else
            return this.eachUnitItems();
    };
    PrintService.prototype.eachUnitItems = function () {
        var result = [];
        var counter = 0;
        for (var _i = 0, _a = this._deliveryModels[this._unitConsumer]._deliveries; _i < _a.length; _i++) {
            var item = _a[_i];
            counter++;
            var obj = {};
            obj['rowNum'] = counter;
            obj['productCode'] = item.productCode;
            obj['productName'] = item.productName;
            obj['realDelivery'] = item.realDelivery;
            obj['currentStock'] = item.stock;
            obj['stockAfterDelivery'] = item.realDelivery + item.stock;
            obj['stockSurplusDeficit'] = item.realDelivery + item.stock - item.max;
            result.push(obj);
        }
        console.log('Counter:' + counter);
        console.log('Result:' + result);
        return result;
    };
    PrintService.prototype.overallItems = function () {
        var result = [];
        var counter = 0;
        var _loop_1 = function (item) {
            counter++;
            var obj = {};
            obj['rowNum'] = counter;
            obj['productCode'] = item.productCode;
            obj['productName'] = item.productName;
            var totalDelivery = 0;
            var totalStockSurplusDeficit = 0;
            for (var _i = 0, _a = this_1._receivers; _i < _a.length; _i++) {
                var rcvName = _a[_i];
                var tempProduct = this_1._deliveryModels[rcvName]._deliveries.find(function (el) {
                    return el.productCode.toLowerCase() === item.productCode.toLowerCase();
                });
                if (tempProduct === undefined)
                    obj[rcvName] = '-';
                else {
                    obj[rcvName] = tempProduct.realDelivery;
                    totalDelivery += tempProduct.realDelivery;
                    totalStockSurplusDeficit += (tempProduct.realDelivery - tempProduct.minDelivery);
                }
            }
            obj['totalDelivery'] = totalDelivery;
            obj['totalStockSurplusDeficit'] = totalStockSurplusDeficit;
            result.push(obj);
        };
        var this_1 = this;
        for (var _i = 0, _a = this._deliveryModels['All']._deliveries; _i < _a.length; _i++) {
            var item = _a[_i];
            _loop_1(item);
        }
        return result;
    };
    PrintService.prototype.printData = function () {
        var printContents = '';
        var dateFormatted = moment(this.currentDate).format('ddd D MMM YYYY');
        var header = "<table width=\"100%\">\n                  <tr>\n                  <td width=\"70%\" style=\"float: left; text-align: left; vertical-align: top\"><label class=\"title\">Burgista Bros - " + this._unitSupplier + "</label></td>\n                  <td width=\"30%\" style=\"float: right; text-align: right; vertical-align: top\"><label class=\"title\">" + dateFormatted + "</label></td>\n                  </tr>\n                  <tr>\n                  <td style=\"float: left; text-align: left\"><label class=\"subtitle\">" + this._unitConsumer + " Delivery Note</label></td>\n                  </tr>\n                  </table>";
        var contentTable = '';
        if (this._isOverallPrint) {
            contentTable = "<table class=\"table\">\n                      <thead>\n                      <tr>\n                      <td>#</td>\n                      <td>Product Code</td>\n                      <td>Product Name</td>\n                      <td>Total Delivery</td>";
            for (var _i = 0, _a = this._receivers; _i < _a.length; _i++) {
                var rcvName = _a[_i];
                contentTable += '<td>' + rcvName + '</td>';
            }
            contentTable += '<td>Total Stock surplus/deficit</td>'
                + '</tr>'
                + '</thead>'
                + '<tbody>';
        }
        else {
            contentTable = '<table class="table">'
                + '<thead>'
                + '<tr>'
                + '<td>#</td>'
                + '<td>Product Code</td>'
                + '<td>Product Name</td>'
                + '<td>Real Delivery</td>'
                + '<td>Current Stock</td>'
                + '<td>Stock After Delivery</td>'
                + '<td>Stock surplus/deficit</td>'
                + '</tr>'
                + '</thead>'
                + '<tbody>';
        }
        var innerContentTable = '';
        if (this._isOverallPrint) {
            for (var _b = 0, _c = this.getItems(); _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.rowNum % 2 == 1) {
                    innerContentTable += '<tr>'
                        + '<td>' + item.rowNum + '</td>'
                        + '<td>' + item.productCode + '</td>'
                        + '<td>' + item.productName + '</td>'
                        + '<td>' + item.totalDelivery + '</td>';
                    for (var _d = 0, _e = this._receivers; _d < _e.length; _d++) {
                        var rcvName = _e[_d];
                        innerContentTable += '<td>' + item[rcvName] + '</td>';
                    }
                    innerContentTable += '<td>' + item.totalStockSurplusDeficit + '</td>'
                        + '</tr>';
                }
                else {
                    innerContentTable += '<tr>'
                        + '<td class="highlight">' + item.rowNum + '</td>'
                        + '<td class="highlight">' + item.productCode + '</td>'
                        + '<td class="highlight">' + item.productName + '</td>'
                        + '<td class="highlight">' + item.totalDelivery + '</td>';
                    for (var _f = 0, _g = this._receivers; _f < _g.length; _f++) {
                        var rcvName = _g[_f];
                        innerContentTable += '<td class="highlight">' + item[rcvName] + '</td>';
                    }
                    innerContentTable += '<td class="highlight">' + item.totalStockSurplusDeficit + '</td>'
                        + '</tr>';
                }
            }
        }
        else {
            for (var _h = 0, _j = this.getItems(); _h < _j.length; _h++) {
                var item = _j[_h];
                if (item.rowNum % 2 == 1) {
                    innerContentTable += "<tr>\n                                <td>" + item.rowNum + "</td>\n                                <td>" + item.productCode + "</td>\n                                <td>" + item.productName + "</td>\n                                <td>" + item.realDelivery + "</td>\n                                <td>" + (item.currentStock === null ? 'N/A' : item.currentStock) + "</td>\n                                <td>" + (item.currentStock === null ? 'N/A' : item.stockAfterDelivery) + "</td>\n                                <td>" + (item.currentStock === null ? 'N/A' : item.stockSurplusDeficit) + "</td>\n                                </tr>";
                }
                else {
                    innerContentTable += "<tr>\n                                <td class=\"highlight\">" + item.rowNum + "</td>\n                                <td class=\"highlight\">" + item.productCode + "</td>\n                                <td class=\"highlight\">" + item.productName + "</td>\n                                <td class=\"highlight\">" + item.realDelivery + "</td>\n                                <td class=\"highlight\">" + (item.currentStock === null ? 'N/A' : item.currentStock) + "</td>\n                                <td class=\"highlight\">" + (item.currentStock === null ? 'N/A' : item.stockAfterDelivery) + "</td>\n                                <td class=\"highlight\">" + (item.currentStock === null ? 'N/A' : item.stockSurplusDeficit) + "</td>\n                                </tr>";
                }
            }
        }
        contentTable += innerContentTable
            + '</tbody>'
            + '</table>';
        printContents += '<div>' + header + '</div>';
        printContents += '<div>' + contentTable + '</div>';
        var popup = this._window.open('', '_blank', 'width=1000,height=600,scrollbars=no,menubar=no,toolbar=no,'
            + 'location=no,status=no,titlebar=no');
        if (!popup) {
            this.messageService.warn('Print pop-up is blocked by browser. Enable pop-ups from this page.');
        }
        else {
            popup.window.focus();
            popup.document.write('<!DOCTYPE><html><head>'
                + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"  media="screen, print" />'
                + '<style type="text/css" media="print, screen">'
                + '@page{margin: 2mm;  /* this affects the margin in the printer settings */} html{color: black;margin: 5px;  /* this affects the margin on the html before sending to printer */} body{margin: 2mm 5mm 2mm 5mm; /* margin you want for the content */-webkit-print-color-adjust: exact;} .title{font-size: 2em;font-weight: normal;}.subtitle{font-size: 2em;font-weight: bold;}.highlight{background-color: #adadad !important;}.normal{background-color: white !important;}.table .highlight{background-color: #adadad !important;}'
                + '</style>'
                + '</head><body onload="window.print()"><div class="container">'
                + printContents + '</div></body></html>');
            popup.document.close();
        }
    };
    PrintService.prototype.getMonthName = function (monthNo) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNo + 1];
    };
    return PrintService;
}());
PrintService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [message_service_1.MessageService, WindowRef_1.WindowRef])
], PrintService);
exports.PrintService = PrintService;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/print.service.js.map