webpackJsonp([0,3],{

/***/ 1083:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(477);


/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Product = (function () {
    function Product() {
        this.countingRecursion = '';
        this.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        this.isOverridden = false;
    }
    return Product;
}());
exports.Product = Product;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/product.js.map

/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Unit = (function () {
    function Unit() {
    }
    return Unit;
}());
exports.Unit = Unit;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/unit.js.map

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var WindowRef_1 = __webpack_require__(272);
var message_service_1 = __webpack_require__(35);
var moment = __webpack_require__(2);
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
        this.uid = null;
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
        for (var _i = 0, _a = this._deliveryModels[this._unitConsumer].deliveries; _i < _a.length; _i++) {
            var item = _a[_i];
            var obj = {};
            if (this.uid && item.uid !== this.uid) {
                console.warn('delivery print leakage!', item);
            }
            else {
                obj['productCode'] = item.productCode;
                obj['productName'] = item.productName;
                obj['realDelivery'] = item.realDelivery;
                obj['currentStock'] = item.stock;
                obj['stockAfterDelivery'] = item.realDelivery + item.stock;
                obj['minDelivery'] = item.minDelivery;
                obj['daysToNext'] = item.untilNextCountingDay;
                result.push(obj);
            }
        }
        return result;
    };
    PrintService.prototype.overallItems = function () {
        var result = [];
        var _loop_1 = function (item) {
            var obj = {};
            obj['productCode'] = item.productCode;
            obj['productName'] = item.productName;
            var totalDelivery = 0;
            var totalStockSurplusDeficit = 0;
            var totalMinDelivery = 0;
            for (var _i = 0, _a = this_1._receivers; _i < _a.length; _i++) {
                var rcvName = _a[_i];
                var tempProduct = this_1._deliveryModels[rcvName].deliveries.find(function (el) {
                    return el.productCode.toLowerCase() === item.productCode.toLowerCase();
                });
                if (tempProduct === undefined)
                    obj[rcvName] = '-';
                else {
                    obj[rcvName] = tempProduct.realDelivery;
                    totalDelivery += tempProduct.realDelivery;
                    totalMinDelivery += tempProduct.minDelivery;
                    totalStockSurplusDeficit += (tempProduct.realDelivery - tempProduct.minDelivery);
                }
            }
            obj['totalDelivery'] = totalDelivery;
            obj['totalMinDelivery'] = totalMinDelivery;
            result.push(obj);
        };
        var this_1 = this;
        for (var _i = 0, _a = this._deliveryModels['All'].deliveries; _i < _a.length; _i++) {
            var item = _a[_i];
            _loop_1(item);
        }
        return result;
    };
    PrintService.prototype.printData = function () {
        var printContents = '';
        var dateFormatted = moment(this.currentDate).format('ddd D MMM YYYY');
        var header = "<table width=\"100%\">\n                  <tr>\n                  <td width=\"70%\" style=\"float: left; text-align: left; vertical-align: top\"><label class=\"title\">Siirgista Bros - " + this._unitSupplier + "</label></td>\n                  <td width=\"30%\" style=\"float: right; text-align: right; vertical-align: top\"><label class=\"title\">" + dateFormatted + "</label></td>\n                  </tr>\n                  <tr>\n                  <td style=\"float: left; text-align: left\"><label class=\"subtitle\">" + this._unitConsumer + " Delivery Note</label></td>\n                  </tr>\n                  </table>";
        var contentTable = '';
        if (this._isOverallPrint) {
            contentTable = "<table class=\"table\">\n                      <thead>\n                      <tr>\n                      <th>#</th>\n                      <th>Product Code</th>\n                      <th>Product Name</th>\n                      <th>Total Delivery</th>\n                      <th>Total Min Delivery</th>";
            for (var _i = 0, _a = this._receivers; _i < _a.length; _i++) {
                var rcvName = _a[_i];
                contentTable += '<th>' + rcvName + '</th>';
            }
            contentTable += "\n        </tr>\n        </thead>\n        <tbody class=\"data\">";
        }
        else {
            contentTable = "<table class=\"table\">\n        <thead>\n        <tr>\n        <th>#</th>\n        <th>Product Code</th>\n        <th>Product Name</th>\n        <th>Real Delivery</th>\n        <th>Current Stock</th>\n        <th>Stock After Delivery</th>\n        <th>Min Delivery</th>\n        <th>Days to Next Count</th>\n        </tr>\n        </thead>\n        <tbody class=\"data\">";
        }
        var innerContentTable = '';
        var rowNum = 0;
        if (this._isOverallPrint) {
            for (var _b = 0, _c = this.getItems(); _b < _c.length; _b++) {
                var item = _c[_b];
                rowNum++;
                var cl = rowNum % 2 ? '' : ' class="highlight"';
                innerContentTable += "\n<tr>\n  <td" + cl + ">" + rowNum + "</td>\n  <td" + cl + ">" + item.productCode + "</td>\n  <td" + cl + " style=\"min-width: 250px\">" + item.productName + "</td>\n  <td" + cl + ">" + item.totalDelivery + "</td>\n  <td" + cl + ">" + item.totalMinDelivery + "</td>";
                for (var _d = 0, _e = this._receivers; _d < _e.length; _d++) {
                    var rcvName = _e[_d];
                    innerContentTable += "\n  <td" + cl + ">" + item[rcvName] + "</td>";
                }
                innerContentTable += "\n</tr>";
            }
        }
        else {
            for (var _f = 0, _g = this.getItems(); _f < _g.length; _f++) {
                var item = _g[_f];
                rowNum++;
                var cl = rowNum % 2 ? '' : ' class="highlight"';
                innerContentTable += "\n<tr>\n  <td" + cl + ">" + rowNum + "</td>\n  <td" + cl + ">" + item.productCode + "</td>\n  <td" + cl + " style=\"min-width: 250px\">" + item.productName + "</td>\n  <td" + cl + ">" + item.realDelivery + "</td>\n  <td" + cl + ">" + (item.currentStock === null ? 'N/A' : item.currentStock) + "</td>\n  <td" + cl + ">" + (item.currentStock === null ? 'N/A' : item.stockAfterDelivery) + "</td>\n  <td" + cl + ">" + (item.minDelivery === null ? 'N/A' : item.minDelivery) + "</td>\n  <td" + cl + ">" + (!item.daysToNext ? 'N/A' : item.daysToNext) + "</td>\n</tr>";
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
                + '@page{margin: 2mm;  /* this affects the margin in the printer settings */} html{color: black;margin: 5px;  /* this affects the margin on the html before sending to printer */} body{margin: 2mm 5mm 2mm 5mm; /* margin you want for the content */-webkit-print-color-adjust: exact;} .title{font-size: 1.5em;font-weight: normal;}.subtitle{font-size: 2em}.highlight{background-color: #eeeeee !important;}.normal{background-color: white !important;}.table .highlight{background-color: #eeeeee !important;}table{font-size:75%}td{padding:2px !important;}.data td{border:1px solid #adadad !important;}'
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
    __metadata("design:paramtypes", [typeof (_a = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _a || Object, typeof (_b = typeof WindowRef_1.WindowRef !== "undefined" && WindowRef_1.WindowRef) === "function" && _b || Object])
], PrintService);
exports.PrintService = PrintService;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/print.service.js.map

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = __webpack_require__(114);
var rxjs_1 = __webpack_require__(60);
var rrule_1 = __webpack_require__(95);
var rrulePureString = function (str) {
    var options = rrule_1.RRule.fromString(str).options;
    options.dtstart = new Date('2018-01-01');
    return rrule_1.RRule.optionsToString(options).replace(/\nRRULE:/g, ';').split(';').filter(function (r) { return !['HOUR', 'MINUTE', 'SECOND'].map(function (s) { return r.startsWith('BY' + s); }).reduce(function (x, y) { return x || y; }, false); }).sort().join(';');
};
var ProductModel = (function () {
    function ProductModel(product) {
        this.waiting = new rxjs_1.BehaviorSubject({
            adding: false,
            updating: false,
            deleting: false
        });
        this._product = new product_1.Product();
        this._product.isOverridden = product.isOverridden;
        this._product.id = product.id;
        this._product.name = product.name;
        this._product.price = product.price;
        this._product.code = product.code;
        this._product.size = product.size;
        this._product.measuringUnit = product.measuringUnit;
        this._product.prep_unit_id = product.prep_unit_id;
        this._product.minQty = product.minQty;
        this._product.maxQty = product.maxQty;
        this._product.price = product.price;
        for (var day in product.coefficients)
            this._product.coefficients[day] = product.coefficients[day];
        this._product.countingRecursion = product.countingRecursion;
    }
    ProductModel.prototype.isDifferent = function (product) {
        var isDiff = false;
        var isNull = false;
        for (var prop in product)
            if (prop !== 'price') {
                if (prop === 'coefficients') {
                    for (var day in product.coefficients) {
                        if (product.coefficients[day] === null)
                            isNull = true;
                        if (+this._product.coefficients[day] !== +product.coefficients[day])
                            isDiff = true;
                    }
                }
                else {
                    if (product[prop] === null)
                        isNull = true;
                    if (prop === 'countingRecursion' && rrulePureString(this._product[prop]) !== rrulePureString(product[prop]))
                        isDiff = true;
                    if (prop !== 'countingRecursion' && this._product[prop] !== product[prop])
                        isDiff = true;
                }
            }
        return (isDiff && !isNull);
    };
    ProductModel.prototype.getDifferentValues = function (product) {
        var diffValue = {};
        for (var prop in product) {
            if (prop === 'coefficients') {
                for (var day in product.coefficients) {
                    if (this._product.coefficients[day] !== product.coefficients[day]) {
                        if (!diffValue['coefficients'])
                            diffValue['coefficients'] = {};
                        diffValue['coefficients'][day] = product.coefficients[day];
                    }
                }
            }
            else if (this._product[prop] !== product[prop])
                diffValue[prop] = product[prop];
        }
        return diffValue;
    };
    ProductModel.prototype.setProduct = function (product) {
        if (this._product == null) {
            this._product = new product_1.Product();
        }
        this._product.isOverridden = product.isOverridden;
        this._product.id = product.id;
        this._product.name = product.name;
        this._product.code = product.code;
        this._product.size = product.size;
        this._product.measuringUnit = product.measuringUnit;
        this._product.prep_unit_id = product.prep_unit_id;
        this._product.minQty = product.minQty;
        this._product.maxQty = product.maxQty;
        this._product.price = product.price;
        for (var day in product.coefficients)
            this._product.coefficients[day] = product.coefficients[day];
        this._product.countingRecursion = product.countingRecursion;
    };
    ProductModel.toAnyObject = function (product) {
        var resObj = {};
        for (var prop in product) {
            switch (prop) {
                case 'id':
                    resObj['pid'] = product.id;
                    break;
                case 'name':
                    resObj['name'] = product.name;
                    break;
                case 'code':
                    resObj['code'] = product.code;
                    break;
                case 'size':
                    resObj['size'] = product.size;
                    break;
                case 'measuringUnit':
                    resObj['measuring_unit'] = product.measuringUnit;
                    break;
                case 'prep_unit_id':
                    resObj['prep_unit_id'] = product.prep_unit_id;
                    break;
                case 'minQty':
                    resObj['default_min'] = product.minQty;
                    break;
                case 'maxQty':
                    resObj['default_max'] = product.maxQty;
                    break;
                case 'price':
                    resObj['price'] = product.price;
                    break;
                case 'countingRecursion':
                    resObj['default_date_rule'] = product.countingRecursion;
                    break;
                case 'coefficients':
                    {
                        for (var day in product.coefficients) {
                            switch (day) {
                                case 'Monday':
                                    resObj['default_mon_multiple'] = product.coefficients.Monday;
                                    break;
                                case 'Tuesday':
                                    resObj['default_tue_multiple'] = product.coefficients.Tuesday;
                                    break;
                                case 'Wednesday':
                                    resObj['default_wed_multiple'] = product.coefficients.Wednesday;
                                    break;
                                case 'Thursday':
                                    resObj['default_thu_multiple'] = product.coefficients.Thursday;
                                    break;
                                case 'Friday':
                                    resObj['default_fri_multiple'] = product.coefficients.Friday;
                                    break;
                                case 'Saturday':
                                    resObj['default_sat_multiple'] = product.coefficients.Saturday;
                                    break;
                                case 'Sunday':
                                    resObj['default_sun_multiple'] = product.coefficients.Sunday;
                                    break;
                                case 'Usage':
                                    resObj['default_usage'] = product.coefficients.Usage;
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
        return resObj;
    };
    ProductModel.toAnyObjectOverride = function (product) {
        var resObj = {};
        for (var prop in product) {
            switch (prop) {
                case 'id':
                    resObj['pid'] = product.id;
                    break;
                case 'minQty':
                    resObj['min'] = product.minQty;
                    break;
                case 'maxQty':
                    resObj['max'] = product.maxQty;
                    break;
                case 'countingRecursion':
                    resObj['date_rule'] = product.countingRecursion;
                    break;
                case 'coefficients':
                    {
                        for (var day in product.coefficients) {
                            switch (day) {
                                case 'Monday':
                                    resObj['mon_multiple'] = product.coefficients.Monday;
                                    break;
                                case 'Tuesday':
                                    resObj['tue_multiple'] = product.coefficients.Tuesday;
                                    break;
                                case 'Wednesday':
                                    resObj['wed_multiple'] = product.coefficients.Wednesday;
                                    break;
                                case 'Thursday':
                                    resObj['thu_multiple'] = product.coefficients.Thursday;
                                    break;
                                case 'Friday':
                                    resObj['fri_multiple'] = product.coefficients.Friday;
                                    break;
                                case 'Saturday':
                                    resObj['sat_multiple'] = product.coefficients.Saturday;
                                    break;
                                case 'Sunday':
                                    resObj['sun_multiple'] = product.coefficients.Sunday;
                                    break;
                                case 'Usage':
                                    resObj['usage'] = product.coefficients.Usage;
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
        return resObj;
    };
    ProductModel.fromAnyObject = function (object) {
        var tempProduct = new product_1.Product();
        for (var prop in object) {
            switch (prop) {
                case 'isOverridden':
                    tempProduct.isOverridden = true;
                    break;
                case 'pid':
                    tempProduct.id = object[prop];
                    break;
                case 'name':
                    tempProduct.name = object[prop];
                    break;
                case 'code':
                    tempProduct.code = object[prop];
                    break;
                case 'size':
                    tempProduct.size = object[prop];
                    break;
                case 'measuring_unit':
                    tempProduct.measuringUnit = object[prop];
                    break;
                case 'prep_unit_id':
                    tempProduct.prep_unit_id = object[prop];
                    break;
                case 'default_min':
                    tempProduct.minQty = object[prop];
                    break;
                case 'default_max':
                    tempProduct.maxQty = object[prop];
                    break;
                case 'price': {
                    if (object.price) {
                        tempProduct.price = parseFloat(object.price.substring(1));
                    }
                    else {
                        tempProduct.price = null;
                    }
                    break;
                }
                case 'default_date_rule':
                    tempProduct.countingRecursion = object[prop];
                    break;
                case 'default_mon_multiple':
                    tempProduct.coefficients.Monday = object[prop];
                    break;
                case 'default_tue_multiple':
                    tempProduct.coefficients.Tuesday = object[prop];
                    break;
                case 'default_wed_multiple':
                    tempProduct.coefficients.Wednesday = object[prop];
                    break;
                case 'default_thu_multiple':
                    tempProduct.coefficients.Thursday = object[prop];
                    break;
                case 'default_fri_multiple':
                    tempProduct.coefficients.Friday = object[prop];
                    break;
                case 'default_sat_multiple':
                    tempProduct.coefficients.Saturday = object[prop];
                    break;
                case 'default_sun_multiple':
                    tempProduct.coefficients.Sunday = object[prop];
                    break;
                case 'default_usage':
                    tempProduct.coefficients.Usage = object[prop];
                    break;
            }
        }
        return tempProduct;
    };
    return ProductModel;
}());
exports.ProductModel = ProductModel;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/product.model.js.map

/***/ }),

/***/ 198:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 198;


/***/ }),

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
function _window() {
    return window;
}
var WindowRef = (function () {
    function WindowRef() {
    }
    Object.defineProperty(WindowRef.prototype, "nativeWindow", {
        get: function () {
            return _window();
        },
        enumerable: true,
        configurable: true
    });
    return WindowRef;
}());
WindowRef = __decorate([
    core_1.Injectable()
], WindowRef);
exports.WindowRef = WindowRef;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/WindowRef.js.map

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var logged_in_guard_1 = __webpack_require__(277);
var message_service_1 = __webpack_require__(35);
var material_1 = __webpack_require__(79);
var AppComponent = (function () {
    function AppComponent(loggedInGuard, messageService, snackBar) {
        this.loggedInGuard = loggedInGuard;
        this.messageService = messageService;
        this.snackBar = snackBar;
        this.showError = false;
        this.blocked = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.messageService.err$.subscribe(function (err) {
            _this.showError = true;
            _this.error = err.statusText + ": " + err.text();
        });
        this.messageService.msg$.subscribe(function (msg) {
            _this.showError = false;
            _this.snackBar.open(msg, 'x', { duration: 3000, extraClasses: ['snackBar'] });
        });
        this.messageService.warn$.subscribe(function (msg) {
            _this.snackBar.open(msg, 'x', { duration: 3000, extraClasses: ['warnBar'] });
        });
        this.messageService.block$.subscribe(function (bl) {
            _this.blocked = bl;
        });
    };
    AppComponent.prototype.closeError = function () {
        this.showError = false;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        template: __webpack_require__(802),
        styles: [__webpack_require__(714)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof logged_in_guard_1.LoggedInGuard !== "undefined" && logged_in_guard_1.LoggedInGuard) === "function" && _a || Object, typeof (_b = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _b || Object, typeof (_c = typeof material_1.MdSnackBar !== "undefined" && material_1.MdSnackBar) === "function" && _c || Object])
], AppComponent);
exports.AppComponent = AppComponent;
var _a, _b, _c;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/app.component.js.map

/***/ }),

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Delivery = (function () {
    function Delivery() {
        this.realDelivery = 0;
        this.minDelivery = 0;
        this.maxDelivery = 0;
        this.state = 'exist';
        this.isPrinted = false;
        this.oldCount = 0;
    }
    return Delivery;
}());
exports.Delivery = Delivery;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/delivery.js.map

/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var material_1 = __webpack_require__(79);
var WarningViewerComponent = (function () {
    function WarningViewerComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    WarningViewerComponent.prototype.ngOnInit = function () {
    };
    return WarningViewerComponent;
}());
WarningViewerComponent = __decorate([
    core_1.Component({
        selector: 'app-warning-viewer',
        template: __webpack_require__(806),
        styles: [__webpack_require__(718)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof material_1.MdDialogRef !== "undefined" && material_1.MdDialogRef) === "function" && _a || Object])
], WarningViewerComponent);
exports.WarningViewerComponent = WarningViewerComponent;
var _a;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/warning-viewer.component.js.map

/***/ }),

/***/ 276:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Inventory = (function () {
    function Inventory() {
        this.unopenedPack = null;
        this.shouldIncluded = true;
        this.shouldCountToday = true;
        this.is_disabled = false;
    }
    return Inventory;
}());
exports.Inventory = Inventory;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/inventory.js.map

/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(23);
var auth_service_1 = __webpack_require__(66);
var LoggedInGuard = (function () {
    function LoggedInGuard(authService, router) {
        var _this = this;
        this.authService = authService;
        this.router = router;
        this.isLoggedIn = false;
        this.authService.auth$.subscribe(function (val) {
            _this.isLoggedIn = val;
        });
    }
    LoggedInGuard.prototype.canActivate = function (route, state) {
        if (!this.isLoggedIn) {
            this.authService.originBeforeLogin = state.url;
            this.router.navigate(['login']);
        }
        return this.isLoggedIn;
    };
    return LoggedInGuard;
}());
LoggedInGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _b || Object])
], LoggedInGuard);
exports.LoggedInGuard = LoggedInGuard;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/logged-in.guard.js.map

/***/ }),

/***/ 278:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var material_1 = __webpack_require__(79);
var moment = __webpack_require__(2);
var print_service_1 = __webpack_require__(162);
var PrintViewerComponent = (function () {
    function PrintViewerComponent(dialogRef, printService) {
        this.dialogRef = dialogRef;
        this.printService = printService;
        this.unitName_title = '';
        this.unitName_subTitle = '';
        this.isOverallPrint = false;
        this.currentDate = moment().format('D MMMM YYYY');
        this.receivers = [];
        this.itemList = [];
        this.showWarningMessage = true;
    }
    PrintViewerComponent.prototype.ngOnInit = function () {
        this.isOverallPrint = this.printService._isOverallPrint;
        this.receivers = this.printService._receivers;
        this.unitName_title = this.printService._unitSupplier;
        this.unitName_subTitle = this.printService._unitConsumer;
        this.showWarningMessage = this.printService._showWarningMessage;
        this.currentDate = moment(this.printService.currentDate).format('D MMMM YYYY');
        this.itemList = this.printService.getItems();
    };
    return PrintViewerComponent;
}());
PrintViewerComponent = __decorate([
    core_1.Component({
        selector: 'app-print-viewer',
        template: __webpack_require__(811),
        styles: [__webpack_require__(723)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof material_1.MdDialogRef !== "undefined" && material_1.MdDialogRef) === "function" && _a || Object, typeof (_b = typeof print_service_1.PrintService !== "undefined" && print_service_1.PrintService) === "function" && _b || Object])
], PrintViewerComponent);
exports.PrintViewerComponent = PrintViewerComponent;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/print-viewer.component.js.map

/***/ }),

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var unit_1 = __webpack_require__(115);
var UnitModel = (function () {
    function UnitModel(unit) {
        this.waiting = {
            updating: false,
            deleting: false,
            adding: false
        };
        this._unit = new unit_1.Unit();
        this._unit.id = unit.id;
        this._unit.name = unit.name;
        this._unit.username = unit.username;
        this._unit.password = unit.password;
        this._unit.is_branch = unit.is_branch;
        this._unit.is_kitchen = unit.is_kitchen;
    }
    UnitModel.prototype.isDifferent = function (unit) {
        if (unit.password !== '')
            return true;
        else if (unit.name !== this._unit.name)
            return true;
        else if (unit.username !== this._unit.username)
            return true;
        else if (unit.is_branch !== this._unit.is_branch)
            return true;
        else if (unit.is_kitchen !== this._unit.is_kitchen)
            return true;
        else
            return false;
    };
    UnitModel.prototype.getDifferentValues = function (unit) {
        var diffValues = {};
        if (unit.password !== '')
            diffValues['password'] = unit.password;
        if (unit.name !== this._unit.name)
            diffValues['name'] = unit.name;
        if (unit.username !== this._unit.username)
            diffValues['username'] = unit.username;
        if (unit.is_branch !== this._unit.is_branch)
            diffValues['is_branch'] = unit.is_branch;
        if (unit.is_kitchen !== this._unit.is_kitchen)
            diffValues['is_kitchen'] = unit.is_kitchen;
        return diffValues;
    };
    UnitModel.prototype.setUnit = function (unit) {
        this._unit.id = unit.id;
        this._unit.name = unit.name;
        this._unit.username = unit.username;
        this._unit.password = unit.password;
        this._unit.is_branch = unit.is_branch;
        this._unit.is_kitchen = unit.is_kitchen;
    };
    return UnitModel;
}());
exports.UnitModel = UnitModel;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/unit.model.js.map

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rxjs_1 = __webpack_require__(60);
var http_1 = __webpack_require__(85);
var MessageService = (function () {
    function MessageService() {
        this.errStream = new rxjs_1.Subject();
        this.err$ = this.errStream.asObservable();
        this.msgStream = new rxjs_1.Subject();
        this.msg$ = this.msgStream.asObservable();
        this.warningStream = new rxjs_1.Subject();
        this.warn$ = this.warningStream.asObservable();
        this.block$ = new rxjs_1.Subject();
    }
    MessageService.prototype.block = function (bl) {
        if (bl === void 0) { bl = true; }
        this.block$.next(bl);
    };
    MessageService.prototype.error = function (err) {
        err = this.changeToUnderstandableMessage(err);
        var ro = new http_1.ResponseOptions();
        var errMsg = '';
        try {
            if (err.json().Message)
                errMsg = err.json().Message;
            else if (typeof err.json().Message === "object")
                errMsg = '';
        }
        catch (e) {
            errMsg = err.text();
        }
        ro.body = errMsg;
        var newErr = new http_1.Response(ro);
        newErr.statusText = err.statusText;
        newErr.status = err.status;
        this.errStream.next(newErr);
    };
    MessageService.prototype.message = function (msg) {
        this.msgStream.next(msg);
    };
    MessageService.prototype.warn = function (msg) {
        this.warningStream.next(msg);
    };
    MessageService.prototype.changeToUnderstandableMessage = function (msg) {
        var data = msg._body;
        var resOptions = new http_1.ResponseOptions();
        if (data.indexOf('foreign key constraint') !== -1) {
            resOptions.body = 'Can not delete this item because other data items depend on it.';
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else if (data.indexOf('duplicate key value') !== -1) {
            var n = 'constraint "';
            var constraint = data.substring(data.indexOf(n) + n.length, data.indexOf('_key"')).replace(/\_/g, ' ');
            resOptions.body = "Can not add this item because same \"" + constraint + "\" already exists.";
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else if (data.indexOf('null value') !== -1 && data.indexOf('not-null constraint') !== -1) {
            var n = 'in column "';
            var constraint = data.substring(data.indexOf(n) + n.length, data.indexOf('" violates')).replace(/\_/g, ' ');
            resOptions.body = "The \"" + constraint + "\" field cannot be blank.";
            var res = new http_1.Response(resOptions);
            res.statusText = 'Data Integrity Error';
            return res;
        }
        else
            return msg;
    };
    return MessageService;
}());
MessageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/message.service.js.map

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(85);
__webpack_require__(37);
__webpack_require__(188);
var rxjs_1 = __webpack_require__(60);
var message_service_1 = __webpack_require__(35);
var RestService = (function () {
    function RestService(http, messageService) {
        this.http = http;
        this.messageService = messageService;
    }
    RestService.prototype.call = function (table) {
        var _this = this;
        this.messageService.block();
        return this.http.get('/api/' + table)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.insert = function (table, values) {
        var _this = this;
        this.messageService.block();
        return this.http.put('/api/' + table, values)
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return rxjs_1.Observable.throw(err);
            ;
        });
    };
    RestService.prototype.get = function (table) {
        var _this = this;
        this.messageService.block();
        return this.call(table)
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    ;
    RestService.prototype.getWithParams = function (table, values) {
        var _this = this;
        this.messageService.block();
        var params = new http_1.URLSearchParams();
        for (var key in values)
            if (values.hasOwnProperty(key))
                params.set(key, values[key]);
        return this.http.get('/api/' + table, { search: params })
            .map(function (data) {
            _this.messageService.block(false);
            return data.json();
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.delete = function (table, id) {
        var _this = this;
        this.messageService.block();
        return this.http.delete('/api/' + table + '/' + id)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return err;
        });
    };
    RestService.prototype.update = function (table, id, values) {
        var _this = this;
        this.messageService.block();
        return this.http.post('/api/' + table + (id ? '/' + id : ''), values)
            .map(function (data) {
            _this.messageService.block(false);
            return data;
        })
            .catch(function (err) {
            _this.messageService.block(false);
            return rxjs_1.Observable.throw(err);
            ;
        });
    };
    return RestService;
}());
RestService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _b || Object])
], RestService);
exports.RestService = RestService;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/rest.service.js.map

/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(561);
var platform_browser_dynamic_1 = __webpack_require__(536);
var core_1 = __webpack_require__(0);
var environment_1 = __webpack_require__(560);
var _1 = __webpack_require__(547);
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(_1.AppModule);
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/main.js.map

/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = __webpack_require__(30);
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(10);
var http_1 = __webpack_require__(85);
var app_component_1 = __webpack_require__(273);
var login_component_1 = __webpack_require__(550);
var navbar_component_1 = __webpack_require__(551);
var home_component_1 = __webpack_require__(546);
var auth_service_1 = __webpack_require__(66);
var rest_service_1 = __webpack_require__(45);
var logged_in_guard_1 = __webpack_require__(277);
var router_1 = __webpack_require__(23);
var material_1 = __webpack_require__(79);
var angular2_material_datepicker_1 = __webpack_require__(538);
__webpack_require__(732);
var unit_form_component_1 = __webpack_require__(559);
var sub_form_component_1 = __webpack_require__(558);
var flex_layout_1 = __webpack_require__(494);
var rrule_component_1 = __webpack_require__(557);
var monthday_component_1 = __webpack_require__(556);
var product_form_component_1 = __webpack_require__(553);
var product_sub_form_component_1 = __webpack_require__(554);
var counting_rule_component_1 = __webpack_require__(542);
var message_service_1 = __webpack_require__(35);
var focus_directive_1 = __webpack_require__(545);
var override_form_component_1 = __webpack_require__(552);
var inventory_form_component_1 = __webpack_require__(548);
var delivery_form_component_1 = __webpack_require__(543);
var print_viewer_component_1 = __webpack_require__(278);
var print_service_1 = __webpack_require__(162);
var WindowRef_1 = __webpack_require__(272);
var reports_component_1 = __webpack_require__(555);
var primeng_1 = __webpack_require__(800);
var animations_1 = __webpack_require__(537);
var warning_viewer_component_1 = __webpack_require__(275);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            login_component_1.LoginComponent,
            navbar_component_1.NavbarComponent,
            home_component_1.HomeComponent,
            unit_form_component_1.UnitFormComponent,
            sub_form_component_1.SubFormComponent,
            rrule_component_1.RRuleComponent,
            monthday_component_1.MonthdayComponent,
            product_form_component_1.ProductFormComponent,
            product_sub_form_component_1.ProductSubFormComponent,
            counting_rule_component_1.CountingRuleComponent,
            focus_directive_1.FocusDirective,
            override_form_component_1.OverrideFormComponent,
            inventory_form_component_1.InventoryFormComponent,
            delivery_form_component_1.DeliveryFormComponent,
            print_viewer_component_1.PrintViewerComponent,
            reports_component_1.ReportsComponent,
            warning_viewer_component_1.WarningViewerComponent
        ],
        entryComponents: [
            print_viewer_component_1.PrintViewerComponent,
            warning_viewer_component_1.WarningViewerComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            primeng_1.BlockUIModule,
            material_1.MaterialModule.forRoot(),
            flex_layout_1.FlexLayoutModule,
            forms_1.ReactiveFormsModule,
            angular2_material_datepicker_1.DatepickerModule,
            router_1.RouterModule.forRoot([
                { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
                { path: 'login', component: login_component_1.LoginComponent },
                { path: 'units', component: unit_form_component_1.UnitFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'products', component: product_form_component_1.ProductFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'override', component: override_form_component_1.OverrideFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'inventory', component: inventory_form_component_1.InventoryFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'delivery', component: delivery_form_component_1.DeliveryFormComponent, canActivate: [logged_in_guard_1.LoggedInGuard] },
                { path: 'reports', component: reports_component_1.ReportsComponent, canActivate: [logged_in_guard_1.LoggedInGuard] }
            ]),
        ],
        providers: [auth_service_1.AuthService, rest_service_1.RestService, logged_in_guard_1.LoggedInGuard, message_service_1.MessageService, print_service_1.PrintService, WindowRef_1.WindowRef],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/app.module.js.map

/***/ }),

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var CountingRuleComponent = (function () {
    function CountingRuleComponent() {
        this.isOverridden = false;
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
            if (val === -12345678) {
                this._mq = null;
                this.ngOnInit();
            }
            else
                this._mq = val;
        },
        enumerable: true,
        configurable: true
    });
    CountingRuleComponent.prototype.ngOnInit = function () {
    };
    CountingRuleComponent.prototype.coeffChange = function () {
        this.coefficientsChange.emit(this.coefficients);
        var i = 0;
        for (var day in this.coefficients) {
            i++;
            if (this.coefficients[day] < 0)
                this.coefficients[day] = 0;
            if (!this.coefficients[day]) {
                this.sendError(day + " coefficient should be a non-zero number", 10 + i);
            }
            else {
                this.sendError('', 10 + i);
            }
        }
    };
    CountingRuleComponent.prototype.minChange = function () {
        if (this.minQty < 0)
            this.minQty = 0;
        this.minQtyChange.emit(this.minQty);
        this.sendError('', 0);
        this.checkMinMax();
    };
    CountingRuleComponent.prototype.maxChange = function () {
        if (this.maxQty < 0)
            this.maxQty = 0;
        this.maxQtyChange.emit(this.maxQty);
        this.sendError('', 1);
        this.checkMinMax();
    };
    CountingRuleComponent.prototype.recurChange = function (event) {
        this.recursionRuleChange.emit(event.value);
        if (event.error)
            this.sendError("Recursion rule warning: " + event.error, 2);
        else
            this.sendError('', 2);
    };
    CountingRuleComponent.prototype.checkMinMax = function () {
        if (this.minQty !== null && this.maxQty !== null) {
            if (this.minQty > this.maxQty) {
                this.sendError('The Min Qty should be less than or equal to Max Qty', 3);
            }
            else
                this.sendError('', 3);
        }
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
    return CountingRuleComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CountingRuleComponent.prototype, "isOverridden", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "coefficients", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], CountingRuleComponent.prototype, "minQty", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "maxQty", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "recursionRule", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "coefficientsChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "minQtyChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "maxQtyChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "recursionRuleChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CountingRuleComponent.prototype, "hasError", void 0);
CountingRuleComponent = __decorate([
    core_1.Component({
        selector: 'app-counting-rule',
        template: __webpack_require__(803),
        styles: [__webpack_require__(715)]
    }),
    __metadata("design:paramtypes", [])
], CountingRuleComponent);
exports.CountingRuleComponent = CountingRuleComponent;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/counting-rule.component.js.map

/***/ }),

/***/ 543:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var auth_service_1 = __webpack_require__(66);
var rest_service_1 = __webpack_require__(45);
var delivery_model_1 = __webpack_require__(544);
var delivery_1 = __webpack_require__(274);
var forms_1 = __webpack_require__(10);
var message_service_1 = __webpack_require__(35);
var product_1 = __webpack_require__(114);
var material_1 = __webpack_require__(79);
var print_viewer_component_1 = __webpack_require__(278);
var print_service_1 = __webpack_require__(162);
var moment = __webpack_require__(2);
var rxjs_1 = __webpack_require__(60);
var DeliveryFormComponent = (function () {
    function DeliveryFormComponent(authService, restService, msgService, dialog, printService) {
        this.authService = authService;
        this.restService = restService;
        this.msgService = msgService;
        this.dialog = dialog;
        this.printService = printService;
        this.isEnableToInventoryTaking = false;
        this.showZeroDelivery = false;
        this.filteredDeliveries = [];
        this.filteredBranchDeliveries = {};
        this.dataIsReady = false;
        this.isWaiting = {};
        this.receiverName = 'All';
        this.selectedDate = new Date();
        this.currentDate = new Date();
        this.isToday = true;
        this.selectedIndex = 0;
        this.receivers = [];
        this.receiversSumDeliveries = {};
        this.receiversDeliveryModels = {};
        this.productName_Code = {};
        this.productsList = {};
        this.thereIsProactiveItem = false;
        this.buttonDisabled = true;
    }
    DeliveryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.overallDeliveryModel === null || this.overallDeliveryModel === undefined)
            this.overallDeliveryModel = new delivery_model_1.DeliveryModel('All', null, !this.showZeroDelivery);
        this.overallDeliveryModel._shouldDisabled = true;
        this.unitName = this.authService.unitName;
        this.isKitchen = this.authService.isKitchen;
        this.restService.get('date').subscribe(function (d) {
            _this.currentDate = new Date(d);
            _this.currentDateMoment = moment(d).format('YYYY-MM-DD');
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
            _this.checkDate();
            _this.getDeliveryData();
        }, function (err) {
            console.error(err.message);
        });
        this.productNameCodeCtrl = new forms_1.FormControl();
        this.filteredNameCode = this.productNameCodeCtrl.valueChanges
            .map(function (name_code) { return _this.filterProducts(name_code); });
        this.productNameCodeCtrl.valueChanges.subscribe(function (data) {
            var tempNameObj = _this.productName_Code[_this.receiverName].find(function (el) {
                return el.toLowerCase() === data.toLowerCase();
            });
            if (tempNameObj !== undefined && tempNameObj !== null) {
                var p_code_1 = tempNameObj.substr(0, tempNameObj.indexOf(' - '));
                var p_name = tempNameObj.substr(tempNameObj.indexOf(' - ') + 3);
                var tempDelivery = new delivery_1.Delivery();
                tempDelivery.id = null;
                tempDelivery.uid = _this.receiversDeliveryModels[_this.receiverName].uid;
                tempDelivery.productCode = p_code_1;
                tempDelivery.productName = p_name;
                var foundProduct = _this.productsList[_this.receiverName].find(function (el) { return el.code.toLowerCase() === p_code_1.toLowerCase(); });
                tempDelivery.min = foundProduct.minQty;
                tempDelivery.max = foundProduct.maxQty;
                tempDelivery.realDelivery = null;
                tempDelivery.stock = 0;
                tempDelivery.minDelivery = (tempDelivery.min - tempDelivery.stock) < 0 ? 0 : (tempDelivery.min - tempDelivery.stock);
                tempDelivery.maxDelivery = tempDelivery.max - tempDelivery.stock;
                tempDelivery.stockDate = moment(tempDelivery.stockDate).format('DD MMM YY');
                _this.receiversDeliveryModels[_this.receiverName].add(tempDelivery);
                _this.thereIsProactiveItem = !!_this.overallDeliveryModel._deliveries.find(function (r) { return r.id === null; });
                _this.calSumRow(_this.receiverName, tempDelivery, 'add');
                _this.calSumRow('All', tempDelivery, 'add');
                _this.productName_Code[_this.receiverName] = _this.productName_Code[_this.receiverName].filter(function (el) {
                    return el.toLowerCase() !== tempNameObj.toLowerCase();
                });
                if (_this.overallDeliveryModel.getByCode(tempDelivery.productCode) === undefined) {
                    _this.overallDeliveryModel.add(tempDelivery);
                    _this.thereIsProactiveItem = !!_this.overallDeliveryModel._deliveries.find(function (r) { return r.id === null; });
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
                _this.changeFilter();
                _this.receiversDeliveryModels[_this.receiverName]._isSubmitted = false;
            }
        }, function (err) {
            console.error(err.message);
        });
    };
    DeliveryFormComponent.prototype.checkDate = function () {
        var _this = this;
        this.isEnableToInventoryTaking = false;
        var currentDate = moment(this.currentDate).format('YYYY-MM-DD');
        var currentTime = moment(this.currentDate).format('HH:mm:ss');
        var selectedDateMoment = moment(this.selectedDate).format('YYYY-MM-DD HH:mm:ss');
        var clientTime = moment(selectedDateMoment, 'YYYY-MM-DD HH:mm:ss');
        var beforeTime = moment(currentDate + " 00:00:01", 'YYYY-MM-DD HH:mm:ss');
        var afterTime = moment(currentDate + " 09:00:00", 'YYYY-MM-DD HH:mm:ss');
        if (moment(clientTime).isBetween(beforeTime, afterTime)) {
            var date_1 = moment(selectedDateMoment).subtract(1, 'day').format('YYYY-MM-DD');
            this.isEnableToInventoryTaking = true;
            currentTime = moment(date_1).format('HH:mm:ss');
            this.selectedDate = date_1;
            setTimeout(function () {
                _this.selectedDate = new Date(date_1);
            }, 1000);
        }
        if (moment(currentTime).isBetween(moment('01:00:00', 'HH:mm:ss'), moment('09:00:00', 'HH:mm:ss'), null, '[]') &&
            moment(this.selectedDate).format('YYYY-MM-DD') === moment(this.currentDate).subtract(1, 'day').format('YYYY-MM-DD')) {
            this.buttonDisabled = false;
        }
        else {
            this.buttonDisabled = true;
        }
        console.log('buttonDisabled', this.buttonDisabled);
    };
    DeliveryFormComponent.prototype.dateChanged = function (date) {
        this.checkDate();
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
            console.error("Error. Cannot remove added items from 'All' tab");
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
            this.changeFilter();
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
        this.changeFilter();
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
        this.overallDeliveryModel.deliveries.sort(function (a, b) {
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
        if (!moment("" + this.currentDateMoment, 'HH:mm:ss').isBetween(moment('01:00:01', 'HH:mm:ss'), moment('09:00:00', 'HH:mm:ss'), null, '[]')) {
            this.msgService.warn('You are allowed to register your stock after 01:00 am');
        }
        else {
            deliveryModel.afterSubmit();
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
                        console.error(err.message);
                        var errParse = JSON.parse(err['_body']);
                        if (errParse['Message'].includes('01:00')) {
                            _this.msgService.warn(errParse['Message']);
                        }
                        else {
                            _this.msgService.error(err);
                        }
                    });
                }
                else {
                    this_1.restService.update('delivery', delItem.id, delivery_model_1.DeliveryModel.toAnyObject(delItem, delItem.isPrinted, null)).subscribe(function (data) {
                        console.log('Update this item successfully');
                    }, function (err) {
                        deliveryModel._isSubmitted = false;
                        console.error(err.message);
                        var errParse = JSON.parse(err['_body']);
                        if (errParse['Message'].includes('01:00')) {
                            _this.msgService.warn(errParse['Message']);
                        }
                        else {
                            _this.msgService.error(err);
                        }
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = deliveryModel.deliveries; _i < _a.length; _i++) {
                var delItem = _a[_i];
                var state_1 = _loop_1(delItem);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
    };
    DeliveryFormComponent.prototype.sendForPrint = function (deliveryModel, isAllTab) {
        var _this = this;
        this.printService._isOverallPrint = isAllTab;
        this.printService._unitSupplier = this.unitName;
        this.printService.uid = this.receiversDeliveryModels[this.receiverName].uid;
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
                            deliveryModel._isPrinted = deliveryModel.deliveries.map(function (d) { return d.isPrinted; }).reduce(function (a, b) { return a && b; });
                            counter_1++;
                            if (counter_1 >= deliveryModel.deliveries.length)
                                doneAllItems_1.next(true);
                        }, function (err) {
                            item.isPrinted = false;
                            deliveryModel._isPrinted = false;
                            noFailure_1 = false;
                            counter_1++;
                            if (counter_1 >= deliveryModel.deliveries.length)
                                doneAllItems_1.next(true);
                        });
                    };
                    for (var _i = 0, _a = deliveryModel.deliveries; _i < _a.length; _i++) {
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
        }, function (err) { return console.error(err.message); });
    };
    DeliveryFormComponent.prototype.checkOverallPrintDisability = function () {
        var overallCanPrinted = true;
        for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
            var rcv = _a[_i];
            if (!this.receiversDeliveryModels[rcv.name]._isPrinted && this.receiversDeliveryModels[rcv.name].deliveries.length > 0)
                overallCanPrinted = false;
        }
        this.overallDeliveryModel._shouldDisabled = !overallCanPrinted;
    };
    DeliveryFormComponent.prototype.getDeliveryData = function () {
        var _this = this;
        var dateParam = moment(this.selectedDate).format('YYYY-MM-DD HH-mm-ss');
        var _loop_3 = function (rcv) {
            rcv.warn = 'no';
            this_2.isWaiting[rcv.name] = true;
            this_2.waiting();
            this_2.restService.get('delivery/' + dateParam + '/' + rcv.id).subscribe(function (data) {
                _this.isWaiting[rcv.name] = false;
                _this.waiting();
                _this.productsList[rcv.name] = [];
                _this.receiversDeliveryModels[rcv.name] = new delivery_model_1.DeliveryModel(rcv.name, +rcv.id, !_this.showZeroDelivery);
                _this.filteredBranchDeliveries[rcv.name] = [];
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
                        tempDelivery.uid = +item.uid;
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
                        tempDelivery.oldCount = item.oldCount;
                        tempDelivery.state = 'exist';
                        tempDelivery.untilNextCountingDay = item.untilNextCountingDay;
                        _this.receiversDeliveryModels[rcv.name].add(tempDelivery);
                        _this.thereIsProactiveItem = !!_this.overallDeliveryModel.deliveries.find(function (r) { return r.id === null; });
                        _this.calSumRow(rcv.name, tempDelivery, 'add');
                        _this.calSumRow('All', tempDelivery, 'add');
                        if (_this.overallDeliveryModel.getByCode(item.productCode) === undefined) {
                            _this.overallDeliveryModel.add(tempDelivery);
                            _this.thereIsProactiveItem = !!_this.overallDeliveryModel.deliveries.find(function (r) { return r.id === null; });
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
                if (_this.receiversDeliveryModels[rcv.name].deliveries.length > 0)
                    _this.receiversDeliveryModels[rcv.name]._isPrinted = _this.receiversDeliveryModels[rcv.name].deliveries.map(function (d) { return d.isPrinted; })
                        .reduce(function (a, b) { return a && b; });
                else {
                    _this.receiversDeliveryModels[rcv.name]._isSubmitted = true;
                }
                if (_this.receiversDeliveryModels[rcv.name]._isPrinted)
                    _this.receiversDeliveryModels[rcv.name]._isSubmitted = true;
                _this.receiversDeliveryModels[rcv.name].deliveries.sort(function (a, b) {
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
                _this.filteredBranchDeliveries[rcv.name] = _this.receiversDeliveryModels[rcv.name].deliveries;
                _this.filteredDeliveries = _this.overallDeliveryModel.deliveries;
            }, function (err) {
                _this.isWaiting[rcv.name] = false;
                _this.waiting();
                console.error(err.message);
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
    DeliveryFormComponent.prototype.changeFilter = function () {
        this.overallDeliveryModel.filter = !this.showZeroDelivery;
        this.filteredDeliveries = this.overallDeliveryModel.deliveries;
        for (var name in this.receiversDeliveryModels)
            if (this.receiversDeliveryModels.hasOwnProperty(name)) {
                this.receiversDeliveryModels[name].filter = !this.showZeroDelivery;
                this.filteredBranchDeliveries[name] = this.receiversDeliveryModels[name].deliveries;
            }
    };
    return DeliveryFormComponent;
}());
DeliveryFormComponent = __decorate([
    core_1.Component({
        selector: 'app-delivery-form',
        template: __webpack_require__(804),
        styles: [__webpack_require__(716)],
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
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _b || Object, typeof (_c = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _c || Object, typeof (_d = typeof material_1.MdDialog !== "undefined" && material_1.MdDialog) === "function" && _d || Object, typeof (_e = typeof print_service_1.PrintService !== "undefined" && print_service_1.PrintService) === "function" && _e || Object])
], DeliveryFormComponent);
exports.DeliveryFormComponent = DeliveryFormComponent;
var _a, _b, _c, _d, _e;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/delivery-form.component.js.map

/***/ }),

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var delivery_1 = __webpack_require__(274);
var DeliveryModel = (function () {
    function DeliveryModel(unitName, uid, filter) {
        this._deliveries = [];
        this._unitName = '';
        this.uid = null;
        this._shouldDisabled = false;
        this._isSubmitted = false;
        this._isPrinted = false;
        this.filter = false;
        this._unitName = unitName;
        this.uid = uid;
        this.filter = filter;
    }
    Object.defineProperty(DeliveryModel.prototype, "deliveries", {
        get: function () {
            return (this.filter ? this._deliveries.filter(function (r) { return r.realDelivery !== 0; }) : this._deliveries).sort(function (x, y) { return !x.id ? 1 : !y.id ? -1 : x.productName < y.productName ? -1 : x.productName > y.productName ? 1 : 0; });
        },
        enumerable: true,
        configurable: true
    });
    DeliveryModel.prototype.add = function (delivery) {
        if (this.uid && delivery.id && delivery.uid !== this.uid) {
            console.warn('Delivery leakage!\n', { uid: this.uid, delivery: delivery });
        }
        else {
            var tempDelivery = new delivery_1.Delivery();
            for (var prop in delivery) {
                tempDelivery[prop] = delivery[prop];
            }
            this._deliveries.push(tempDelivery);
        }
    };
    DeliveryModel.prototype.get = function (id) {
        return this._deliveries.find(function (el) {
            return el.id === id;
        });
    };
    DeliveryModel.prototype.getByCode = function (code) {
        return this._deliveries.find(function (el) {
            return el.productCode.toLowerCase() === code.toLowerCase();
        });
    };
    DeliveryModel.prototype.deleteByCode = function (code) {
        try {
            this._deliveries = this._deliveries.filter(function (el) {
                return el.productCode.toLowerCase() !== code.toLowerCase();
            });
            return true;
        }
        catch (err) {
            console.log(err.message);
            return false;
        }
    };
    DeliveryModel.prototype.clear = function () {
        this._deliveries = [];
    };
    DeliveryModel.prototype.replaceDeliveryProperty = function (code, whichItem, value) {
        try {
            this._deliveries.find(function (el) {
                return el.productCode.toLowerCase() === code.toLowerCase();
            })[whichItem] = value;
            return true;
        }
        catch (err) {
            console.log(err.message);
            return false;
        }
    };
    DeliveryModel.prototype.updateDeliveryProperty = function (action, code, whichItem, value) {
        try {
            var foundedDelivery = this._deliveries.find(function (el) {
                return el.productCode.toLowerCase() === code.toLowerCase();
            });
            if ((value === null || foundedDelivery[whichItem] === null) && (whichItem !== 'realDelivery' && whichItem !== 'min' && whichItem !== 'max'))
                foundedDelivery[whichItem] = null;
            else {
                switch (action) {
                    case "add":
                        foundedDelivery[whichItem] += value;
                        break;
                    case "sub":
                        foundedDelivery[whichItem] -= value;
                        break;
                }
            }
            return true;
        }
        catch (err) {
            console.log(err.message);
            return false;
        }
    };
    DeliveryModel.toAnyObject = function (delivery, isPrinted, product_id) {
        var resObj = {};
        resObj['real_delivery'] = delivery.realDelivery;
        resObj['is_delivery_finalised'] = isPrinted;
        if (product_id !== null)
            resObj['product_id'] = product_id;
        return resObj;
    };
    DeliveryModel.prototype.afterSubmit = function () {
        this._deliveries.forEach(function (d) {
            if (d.realDelivery === null) {
                d.realDelivery = 0;
            }
        });
    };
    return DeliveryModel;
}());
exports.DeliveryModel = DeliveryModel;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/delivery.model.js.map

/***/ }),

/***/ 545:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var FocusDirective = (function () {
    function FocusDirective(_el, renderer) {
        this._el = _el;
        this.renderer = renderer;
    }
    FocusDirective.prototype.ngAfterViewInit = function () {
    };
    return FocusDirective;
}());
FocusDirective = __decorate([
    core_1.Directive({
        selector: '[focus]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object, typeof (_b = typeof core_1.Renderer2 !== "undefined" && core_1.Renderer2) === "function" && _b || Object])
], FocusDirective);
exports.FocusDirective = FocusDirective;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/focus.directive.js.map

/***/ }),

/***/ 546:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'app-home',
        template: __webpack_require__(805),
        styles: [__webpack_require__(717)]
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/home.component.js.map

/***/ }),

/***/ 547:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(273));
__export(__webpack_require__(541));
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/index.js.map

/***/ }),

/***/ 548:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(10);
var auth_service_1 = __webpack_require__(66);
var rest_service_1 = __webpack_require__(45);
var inventory_model_1 = __webpack_require__(549);
var inventory_1 = __webpack_require__(276);
var timers_1 = __webpack_require__(1078);
var product_1 = __webpack_require__(114);
var moment = __webpack_require__(2);
var material_1 = __webpack_require__(79);
var warning_viewer_component_1 = __webpack_require__(275);
var message_service_1 = __webpack_require__(35);
var InventoryFormComponent = (function () {
    function InventoryFormComponent(authService, restService, dialog, messageService) {
        this.authService = authService;
        this.restService = restService;
        this.dialog = dialog;
        this.messageService = messageService;
        this.isEnableToInventoryTaking = false;
        this.isFinalized = false;
        this.isUpdateModeDisabled = false;
        this.isUpdateMode = false;
        this.noButton = true;
        this.unitName = '';
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.isSameDates = true;
        this.submitShouldDisabled = true;
        this.products = [];
        this.productName_Code = [];
        this.waiting = false;
    }
    InventoryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.unitName = this.authService.unitName;
        this.restService.get('date').subscribe(function (d) {
            _this.currentDate = new Date(d);
            _this.selectedDate = new Date(d);
        }, function (err) { return console.error(err); });
        if (this.inventoryModel === null || this.inventoryModel === undefined) {
            this.inventoryModel = new inventory_model_1.InventoryModel(this.unitName);
        }
        this.checkDate();
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
                tempInventoryItem_1.productCode = data.substr(0, data.indexOf(' '));
                tempInventoryItem_1.productName = data.substr(data.indexOf(' ') + 3);
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
    InventoryFormComponent.prototype.openWarningDialog = function (products) {
        var _this = this;
        var dialogOpen = this.dialog.open(warning_viewer_component_1.WarningViewerComponent, {
            width: '40%',
            data: products
        });
        dialogOpen.afterClosed().subscribe(function (status) {
            if (status) {
                _this.inventoriesSaved();
            }
        });
    };
    InventoryFormComponent.prototype.checkUnopenedPackGreaterThanMaxStock = function () {
        var products = [];
        this.inventoryModel._inventories.forEach(function (product) {
            if (product['unopenedPack'] > product['stockMax']) {
                products.push(product);
            }
        });
        if (products.length) {
            this.openWarningDialog(products);
        }
        else {
            this.inventoriesSaved();
        }
    };
    InventoryFormComponent.prototype.submitInventories = function () {
        this.checkUnopenedPackGreaterThanMaxStock();
    };
    InventoryFormComponent.prototype.inventoriesSaved = function () {
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
                _this.isUpdateMode = true;
                _this.inventoryModel.setDisabled();
                _this.waiting = false;
            }, 500);
        }, function (err) {
            _this.waiting = false;
            var errParse = JSON.parse(err['_body']);
            _this.messageService.warn(errParse['Message']);
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
        this.checkDate();
        this.compareDates();
        this.inventoryModel.clear();
        this.productName_Code = [];
        this.getInventoryData();
    };
    InventoryFormComponent.prototype.compareDates = function () {
        if (this.isEnableToInventoryTaking) {
            this.isSameDates = true;
            return;
        }
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
    InventoryFormComponent.prototype.checkDate = function () {
        var _this = this;
        var selectedDateMoment = moment(this.selectedDate).format('YYYY-MM-DD HH:mm:ss');
        var clientTime = moment(selectedDateMoment, 'YYYY-MM-DD HH:mm:ss');
        var currentDate = moment(this.currentDate).format('YYYY-MM-DD');
        var beforeTime = moment(currentDate + " 00:00:01", 'YYYY-MM-DD HH:mm:ss');
        var afterTime = moment(currentDate + " 01:00:00", 'YYYY-MM-DD HH:mm:ss');
        if (moment(clientTime).isBetween(beforeTime, afterTime)) {
            var date_1 = moment(selectedDateMoment).subtract(1, 'day').format('YYYY-MM-DD');
            this.isEnableToInventoryTaking = true;
            timers_1.setTimeout(function () {
                _this.selectedDate = new Date(date_1);
            }, 1000);
        }
    };
    InventoryFormComponent.prototype.getInventoryData = function () {
        var _this = this;
        console.log('selectedDate', moment(this.selectedDate).format('YYYY-MM-DD HH-mm-ss'));
        var dateParam = moment(this.selectedDate).format('YYYY-MM-DD HH-mm-ss');
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
                        tempInventory.stockMax = item.stockMax;
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
                        tempInventory.is_delivery_finalised = item['is_delivery_finalised'];
                        tempInventory.submission_time = item['submission_time'];
                        tempInventory.delivery_submission_time = item['delivery_submission_time'];
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
            _this.checkInventoryItemsFinalized();
            _this.checkInventoryItemsAlreadySubmitted();
            _this.noButton = _this.inventoryModel._inventories.map(function (r) { return r.shouldIncluded; }).reduce(function (x, y) { return x && y; }, true);
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
    InventoryFormComponent.prototype.disableWhenHaveSubmitDate = function (inventoryItem) {
        if (inventoryItem.submission_time !== null) {
            return true;
        }
        return false;
    };
    InventoryFormComponent.prototype.showProductList = function () {
        this.productNameCodeCtrl.setValue('');
    };
    InventoryFormComponent.prototype.submitDisability = function () {
        return this.submitShouldDisabled || this.waiting;
    };
    InventoryFormComponent.prototype.checkInventoryItemsFinalized = function () {
        var _inventories = this.inventoryModel._inventories;
        this.isFinalized = _inventories.some(function (el) { return el.delivery_submission_time !== null || el.is_delivery_finalised === true; });
    };
    InventoryFormComponent.prototype.checkInventoryItemsAlreadySubmitted = function () {
        var _inventories = this.inventoryModel._inventories;
        this.isUpdateMode = _inventories.some(function (el) { return el.submission_time !== null; });
        if (this.isUpdateMode) {
            this.inventoryModel.setDisabled();
        }
    };
    InventoryFormComponent.prototype.enableEditMode = function () {
        this.isUpdateMode = !this.isUpdateMode;
        this.inventoryModel.removeDisabled();
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
        template: __webpack_require__(807),
        styles: [__webpack_require__(719)],
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
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _b || Object, typeof (_c = typeof material_1.MdDialog !== "undefined" && material_1.MdDialog) === "function" && _c || Object, typeof (_d = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _d || Object])
], InventoryFormComponent);
exports.InventoryFormComponent = InventoryFormComponent;
var _a, _b, _c, _d;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/inventory-form.component.js.map

/***/ }),

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var inventory_1 = __webpack_require__(276);
var InventoryModel = (function () {
    function InventoryModel(unitName) {
        this._inventories = [];
        this._unitName = '';
        this._unitName = unitName;
        this._inventories = [];
    }
    InventoryModel.prototype.clear = function () {
        this._inventories = [];
    };
    InventoryModel.prototype.add = function (item) {
        this._inventories.push(item);
    };
    InventoryModel.prototype.get = function (id) {
        return this._inventories.find(function (el) {
            return el.id === id;
        });
    };
    InventoryModel.prototype.getByCode = function (code) {
        return this._inventories.find(function (el) {
            return el.productCode === code;
        });
    };
    InventoryModel.prototype.delete = function (id) {
        this._inventories = this._inventories.filter(function (el) {
            return el.id !== id;
        });
    };
    InventoryModel.prototype.setDisabled = function () {
        this._inventories.forEach(function (el) {
            el['is_disabled'] = true;
        });
    };
    InventoryModel.prototype.removeDisabled = function () {
        this._inventories.forEach(function (el) {
            el['is_disabled'] = false;
        });
    };
    InventoryModel.toAnyObject = function (inventory) {
        var resObj = {};
        resObj['bsddid'] = inventory.id;
        resObj['product_id'] = inventory.productId;
        resObj['product_count'] = inventory.unopenedPack;
        resObj['product_code'] = inventory.productCode;
        resObj['product_name'] = inventory.productName;
        resObj['last_count'] = inventory.lastCount;
        return resObj;
    };
    InventoryModel.fromAnyObject = function (object) {
        var resInventory = new inventory_1.Inventory();
        for (var prop in object) {
            switch (prop) {
                case 'bsddid':
                    resInventory.id = object[prop];
                    break;
                case 'product_code':
                    resInventory.productCode = object[prop];
                    break;
                case 'product_name':
                    resInventory.productName = object[prop];
                    break;
                case 'product_count':
                    resInventory.unopenedPack = object[prop];
                    break;
                case 'last_count':
                    resInventory.lastCount = object[prop];
                    break;
                case 'pid': resInventory.productId = object[prop];
            }
        }
        return resInventory;
    };
    return InventoryModel;
}());
exports.InventoryModel = InventoryModel;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/inventory.model.js.map

/***/ }),

/***/ 550:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var auth_service_1 = __webpack_require__(66);
var LoginComponent = (function () {
    function LoginComponent(authService) {
        this.authService = authService;
        this.loginEnabled = false;
    }
    LoginComponent.prototype.onChange = function () {
        this.loginEnabled = this.username && this.password;
    };
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.ifEnterLogin = function (e) {
        if (e.keyCode === 13)
            this.userLogin();
    };
    LoginComponent.prototype.userLogin = function () {
        this.authService.logIn(this.username, this.password);
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        template: __webpack_require__(808),
        styles: [__webpack_require__(720)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object])
], LoginComponent);
exports.LoginComponent = LoginComponent;
var _a;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/login.component.js.map

/***/ }),

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var auth_service_1 = __webpack_require__(66);
var router_1 = __webpack_require__(23);
var moment = __webpack_require__(2);
var NavbarComponent = (function () {
    function NavbarComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.navLinks = [];
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        setInterval(function () {
            _this.currentDate = new Date();
        }, 1000);
        this.authService.auth$.subscribe(function (auth) {
            if (auth) {
                if (_this.int)
                    clearInterval(_this.int);
                var endTime_1 = moment().add(1, 'hour');
                _this.int = setInterval(function () { return _this.remainedTime = moment(new Date(endTime_1.diff(moment()))).utc().format('mm:ss'); }, 900);
            }
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
    NavbarComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.int);
    };
    NavbarComponent.prototype.logout = function () {
        clearInterval(this.int);
        this.authService.logOff();
    };
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    core_1.Component({
        selector: 'app-navbar',
        template: __webpack_require__(809),
        styles: [__webpack_require__(721)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _a || Object, typeof (_b = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _b || Object])
], NavbarComponent);
exports.NavbarComponent = NavbarComponent;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/navbar.component.js.map

/***/ }),

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(10);
var rest_service_1 = __webpack_require__(45);
var auth_service_1 = __webpack_require__(66);
var product_model_1 = __webpack_require__(163);
var actionEnum_1 = __webpack_require__(87);
var message_service_1 = __webpack_require__(35);
var OverrideFormComponent = (function () {
    function OverrideFormComponent(restService, authService, messageService, msg) {
        this.restService = restService;
        this.authService = authService;
        this.messageService = messageService;
        this.msg = msg;
        this.is_kitchen = true;
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
        this.selectedProduct = '';
        this.ae = actionEnum_1.ActionEnum;
    }
    OverrideFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isAdmin = (this.authService.userType === 'admin') ? true : false;
        if (this.isAdmin) {
            this.restService.get('unit?isBranch=true').subscribe(function (data) {
                _this.branchData = data.map(function (r) { return { id: r.uid, name: r.name, is_kitchen: r.is_kitchen }; });
                _this.getBranchList();
                _this.loadBranchProducts();
            }, function (err) {
                console.log(err.message);
            });
        }
        else {
            this.restService.get('override?uid=' + this.authService.unit_id).subscribe(function (data) {
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
                _this.refreshDropDown();
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
                if (_this.filteredProductModel == null) {
                    _this.filteredProductModel = new product_model_1.ProductModel(_this.getProduct(data));
                }
                else {
                    _this.filteredProductModel.setProduct(_this.getProduct(data));
                }
                _this.selectedProduct = "[" + _this.filteredProductModel._product.code + "] " + _this.filteredProductModel._product.name;
                _this.isFiltered = true;
                oneItemInList = true;
            }
            else {
                _this.selectedProduct = '';
                _this.isFiltered = false;
                oneItemInList = false;
            }
        }, function (err) {
            console.log(err.message);
        });
        this.productModelCtrl.valueChanges.subscribe(function (data) {
            if (!oneItemInList) {
                var fullMatch = void 0;
                if (_this.productModelCtrl.value) {
                    fullMatch = _this.productModels.find(function (el) {
                        return (el._product.name.toLowerCase() == _this.productModelCtrl.value.toLowerCase())
                            || (el._product.code.toLowerCase() == _this.productModelCtrl.value.toLowerCase());
                    });
                }
                if (fullMatch !== null && fullMatch !== undefined) {
                    if (_this.filteredProductModel == null)
                        _this.filteredProductModel = new product_model_1.ProductModel(fullMatch._product);
                    else
                        _this.filteredProductModel.setProduct(fullMatch._product);
                    _this.selectedProduct = _this.filteredProductModel._product.name;
                    _this.isFiltered = true;
                }
                else {
                    _this.selectedProduct = '';
                    _this.isFiltered = false;
                }
            }
        }, function (err) {
            console.log(err.message);
        });
    };
    OverrideFormComponent.prototype.refreshDropDown = function () {
        var _this = this;
        this.productName_Code = [];
        this.productNames.forEach(function (el, ind) { return _this.productName_Code.push("[" + _this.productCodes[ind] + "] " + el); });
        this.productModelCtrl.reset();
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
            _this.messageService.message("Counting rule for '" + tempProductModel[0]._product.name + "' has been overridden in '" + _this.branchList[_this.selectedIndex].name + "'.");
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
        var _this = this;
        this.filteredProductModel = null;
        this.isFiltered = false;
        var sp = this.selectedProduct;
        this.loadBranchProducts(function () {
            if (sp !== null && sp !== '') {
                _this.selectedProduct = sp;
                _this.productModelCtrl.setValue(_this.selectedProduct);
                _this.productModelCtrl.markAsTouched();
            }
        });
    };
    OverrideFormComponent.prototype.loadBranchProducts = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        if (this.isAdmin) {
            this.restService.get('override?uid=' + this.branchList[this.selectedIndex].id).subscribe(function (data) {
                _this.productModels = [];
                _this.productNames = [];
                _this.productCodes = [];
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var productObj = data_2[_i];
                    var tempProduct = product_model_1.ProductModel.fromAnyObject(productObj);
                    var tempProductModel = new product_model_1.ProductModel(tempProduct);
                    _this.productModels.push(tempProductModel);
                    _this.productNames.push(tempProduct.name);
                    _this.productCodes.push(tempProduct.code);
                }
                _this.refreshDropDown();
                callback();
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
        return val ? this.productName_Code.filter(function (p) { return new RegExp(val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi').test(p); })
            : this.productName_Code;
    };
    OverrideFormComponent.prototype.getProduct = function (nameCode) {
        var tempProductModel;
        tempProductModel = this.productModels[this.productName_Code.findIndex(function (nc) { return nameCode[0] === nc; })];
        return tempProductModel._product;
    };
    OverrideFormComponent.prototype.showProductList = function ($event) {
        if (this.productModelCtrl.value === null)
            this.productModelCtrl.setValue('');
        else {
            $event.target.select();
        }
    };
    OverrideFormComponent.prototype.changeFilter = function () {
        this.selectedProduct = null;
        this.getBranchList();
        this.changedTab();
    };
    OverrideFormComponent.prototype.getBranchList = function () {
        var _this = this;
        this.branchList = this.branchData
            .filter(function (r) { return r.is_kitchen === _this.is_kitchen; })
            .sort(function (x, y) { return x.name < y.name ? -1 : x.name > y.name ? 1 : 0; });
    };
    return OverrideFormComponent;
}());
__decorate([
    core_1.ViewChild('autoNameCode'),
    __metadata("design:type", Object)
], OverrideFormComponent.prototype, "autoNameCode", void 0);
OverrideFormComponent = __decorate([
    core_1.Component({
        selector: 'app-override-form',
        template: __webpack_require__(810),
        styles: [__webpack_require__(722)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _a || Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" && _b || Object, typeof (_c = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _c || Object, typeof (_d = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _d || Object])
], OverrideFormComponent);
exports.OverrideFormComponent = OverrideFormComponent;
var _a, _b, _c, _d;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/override-form.component.js.map

/***/ }),

/***/ 553:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rxjs_1 = __webpack_require__(60);
var forms_1 = __webpack_require__(10);
var product_model_1 = __webpack_require__(163);
var actionEnum_1 = __webpack_require__(87);
var rest_service_1 = __webpack_require__(45);
var message_service_1 = __webpack_require__(35);
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
        template: __webpack_require__(812),
        styles: [__webpack_require__(724)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _a || Object, typeof (_b = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _b || Object, typeof (_c = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _c || Object])
], ProductFormComponent);
exports.ProductFormComponent = ProductFormComponent;
var _a, _b, _c;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/product-form.component.js.map

/***/ }),

/***/ 554:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rxjs_1 = __webpack_require__(60);
var product_1 = __webpack_require__(114);
var product_model_1 = __webpack_require__(163);
var actionEnum_1 = __webpack_require__(87);
var rest_service_1 = __webpack_require__(45);
var message_service_1 = __webpack_require__(35);
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
                    _this.product.minQty = -12345678;
                    _this.product.maxQty = null;
                    _this.product.price = null;
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
            this.product.price = null;
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
            this.product.price = this.tempProductModel._product.price;
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
        if (this._isUpdating === true) {
            return true;
        }
        else {
            if (this.productModel.isDifferent(this.product) === true) {
                return !this.isCorrectFormData();
            }
            else {
                return true;
            }
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
    return ProductSubFormComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ProductSubFormComponent.prototype, "isAdd", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" && _a || Object)
], ProductSubFormComponent.prototype, "isAdding", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_b = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" && _b || Object)
], ProductSubFormComponent.prototype, "actionIsSuccess", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_c = typeof product_model_1.ProductModel !== "undefined" && product_model_1.ProductModel) === "function" && _c || Object),
    __metadata("design:paramtypes", [typeof (_d = typeof product_model_1.ProductModel !== "undefined" && product_model_1.ProductModel) === "function" && _d || Object])
], ProductSubFormComponent.prototype, "productModel", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ProductSubFormComponent.prototype, "action", void 0);
ProductSubFormComponent = __decorate([
    core_1.Component({
        selector: 'app-product-sub-form',
        template: __webpack_require__(813),
        styles: [__webpack_require__(725)]
    }),
    __metadata("design:paramtypes", [typeof (_e = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _e || Object, typeof (_f = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _f || Object])
], ProductSubFormComponent);
exports.ProductSubFormComponent = ProductSubFormComponent;
var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/product-sub-form.component.js.map

/***/ }),

/***/ 555:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rest_service_1 = __webpack_require__(45);
var fileSaver = __webpack_require__(731);
var message_service_1 = __webpack_require__(35);
var unit_model_1 = __webpack_require__(279);
var unit_1 = __webpack_require__(115);
var moment = __webpack_require__(2);
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
        template: __webpack_require__(814),
        styles: [__webpack_require__(726)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _a || Object, typeof (_b = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _b || Object])
], ReportsComponent);
exports.ReportsComponent = ReportsComponent;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/reports.component.js.map

/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var MonthdayComponent = (function () {
    function MonthdayComponent() {
        this._days = [];
        this.daysChange = new core_1.EventEmitter();
        this.calDays = [];
    }
    Object.defineProperty(MonthdayComponent.prototype, "days", {
        get: function () {
            return this._days;
        },
        set: function (val) {
            this._days = val;
        },
        enumerable: true,
        configurable: true
    });
    MonthdayComponent.prototype.ngOnInit = function () {
        for (var i = 0; i < 5; i++) {
            var row = [];
            for (var j = 0; j < 6 || (i === 4 && j < 7); j++) {
                var val = i * 6 + j + 1;
                if (this.reverse)
                    val = 31 - val;
                row.push(val);
            }
            this.calDays.push(row);
        }
    };
    MonthdayComponent.prototype.monthDaysChange = function (event) {
        var val = event.value;
        if (this.reverse)
            val++;
        if (event.source.checked) {
            if (this.days.indexOf(val) === -1) {
                this.days.push(val);
            }
        }
        else {
            if (this.days.indexOf(val) !== -1) {
                this.days.splice(this.days.indexOf(val), 1);
            }
        }
        this.daysChange.emit(this._days);
    };
    return MonthdayComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], MonthdayComponent.prototype, "days", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MonthdayComponent.prototype, "daysChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MonthdayComponent.prototype, "reverse", void 0);
MonthdayComponent = __decorate([
    core_1.Component({
        selector: 'app-monthday',
        template: __webpack_require__(815),
        styles: [__webpack_require__(727)]
    }),
    __metadata("design:paramtypes", [])
], MonthdayComponent);
exports.MonthdayComponent = MonthdayComponent;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/monthday.component.js.map

/***/ }),

/***/ 557:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rrule_1 = __webpack_require__(95);
var moment = __webpack_require__(2);
var RRuleComponent = (function () {
    function RRuleComponent() {
        this.RRuleStrChange = new core_1.EventEmitter();
        this.freqs = ['Daily', 'Weekly', 'Monthly', 'Never'];
        this.freqsConst = [rrule_1.RRule.DAILY, rrule_1.RRule.WEEKLY, rrule_1.RRule.MONTHLY, null];
        this.freqsName = ['day', 'week', 'month'];
        this.weekdays = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
        this.weekdaysConst = [rrule_1.RRule.MO, rrule_1.RRule.TU, rrule_1.RRule.WE, rrule_1.RRule.TH, rrule_1.RRule.FR, rrule_1.RRule.SA, rrule_1.RRule.SU];
        this.weekpos = [1, 2, 3, 4, -1];
        this.weekposName = ['First', 'Second', 'Third', 'Fourth', 'Last'];
        this.byweekday = [];
        this.text = '';
        this.showWeekdays = false;
        this.showMonthOptions = false;
        this.monthlyInputMode = '';
        this.monthDaysOption = [];
        this.monthDaysPast = [];
        this.monthDaysRemained = [];
        this.bymonthday = [];
        this.bysetpos = [];
        this.freq = '';
    }
    Object.defineProperty(RRuleComponent.prototype, "RRuleStr", {
        get: function () {
            return this._rstr;
        },
        set: function (val) {
            if (val === '' || !this._rstr) {
                this._rstr = val;
                this.ngOnInit();
                this.text = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    RRuleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rule = rrule_1.RRule.fromString(this.RRuleStr);
        this.options = this.rule.options;
        this.freq = this.options.freq;
        if (this.options.bysetpos)
            this.bysetpos = this.options.bysetpos;
        if (this.options.bymonthday)
            this.bymonthday = this.options.bymonthday;
        if (this.options.byweekday && (this.options.byweekday).length)
            this.byweekday = (this.options.byweekday).map(function (r) { return _this.weekdaysConst[r]; });
        else if (this.options.byweekday)
            this.byweekday = this.options.byweekday;
        if (this.bysetpos.length > 0)
            this.monthlyInputMode = 'week';
        else if (this.bymonthday.length > 0)
            this.monthlyInputMode = 'month';
        this.calcPastOrRemained();
    };
    RRuleComponent.prototype.onChange = function () {
        try {
            for (var key in this.options)
                if (!this.options[key] || this.options[key].length === 0 || ['bynmonthday', 'bynweeday', 'bynsetpos', 'byhour', 'byminute', 'bysecond'].indexOf(key) !== -1)
                    delete this.options[key];
            if (this.options.freq !== this.freq) {
                this.options.freq = this.freq;
                if (this.options.freq === rrule_1.RRule.DAILY) {
                    delete this.options.byweekday;
                    delete this.options.bysetpos;
                    this.bysetpos = [];
                    this.byweekday = [];
                    delete this.options.bymonthday;
                    this.bymonthday = [];
                    this.monthDaysPast = [];
                    this.monthDaysRemained = [];
                }
                else if (this.options.freq === rrule_1.RRule.WEEKLY) {
                    delete this.options.bysetpos;
                    this.bysetpos = [];
                    delete this.options.bymonthday;
                    this.bymonthday = [];
                    this.monthDaysPast = [];
                    this.monthDaysRemained = [];
                }
                else if (this.options.freq === rrule_1.RRule.MONTHLY) {
                    delete this.options.byweekday;
                    delete this.options.bysetpos;
                    if (this.monthlyInputMode === 'month') {
                        this.bymonthday = [moment().get('D')];
                        this.options.bymonthday = this.bymonthday;
                    }
                    else {
                        delete this.options.bymonthday;
                        this.bymonthday = [];
                    }
                    this.bysetpos = [];
                    this.byweekday = [];
                }
            }
            else
                this.options.freq = this.freq;
            this.options.bymonth = [];
            this.rule = new rrule_1.RRule(this.options);
            this.rule.options.bymonth = [];
            this.calcPastOrRemained();
            this.emitChange();
            this.showMonthOptions = this.options.freq === rrule_1.RRule.MONTHLY;
            this.showWeekdays = this.options.freq === rrule_1.RRule.WEEKLY || (this.options.freq === rrule_1.RRule.MONTHLY && this.monthlyInputMode === 'week');
            if (!this.showWeekdays)
                this.options.byweekday = [];
            this.populateNextOccurrences();
        }
        catch (err) {
            console.log(err);
        }
    };
    RRuleComponent.prototype.calcPastOrRemained = function () {
        this.monthDaysPast = this.bymonthday.filter(function (r) { return r > 0; });
        if (this.monthDaysPast.length && this.monthDaysOption.indexOf('past')) {
            this.monthDaysOption.push('past');
        }
        this.monthDaysRemained = this.bymonthday.filter(function (r) { return r < 0; });
        if (this.monthDaysRemained.length)
            this.monthDaysOption.push('remained');
        this.showMonthDaysPast = this.monthDaysOption.indexOf('past') !== -1;
        this.showMonthDaysRemained = this.monthDaysOption.indexOf('remained') !== -1;
    };
    RRuleComponent.prototype.emitChange = function () {
        this.RRuleStrChange.emit({ value: this.rule.options.freq ? this.rule.toString() : '', error: this.validate() });
    };
    RRuleComponent.prototype.populateNextOccurrences = function () {
        if (this.rule.options.freq) {
            var d = new Date();
            var d2 = moment(d).add(366, 'd').toDate();
            this.text = this.rule.between(d, d2).map(function (r) { return moment(r).format('ddd DD-MMM-YY'); }).splice(0, 10).concat([this.rule.toString()]).join('\n');
        }
        else {
            this.text = '';
        }
    };
    RRuleComponent.prototype.validate = function () {
        var v = '';
        if (this.options.freq === rrule_1.RRule.WEEKLY && !this.byweekday.length) {
            v = 'choose a weekday';
        }
        else if (this.rule.options.freq === rrule_1.RRule.MONTHLY && this.monthlyInputMode === 'week') {
            if (this.bysetpos.length && !this.byweekday.length) {
                v = 'choose weekdays';
            }
            else if (this.options.freq === rrule_1.RRule.MONTHLY && this.byweekday.length && !this.bysetpos.length) {
                v = 'choose week numbers in month';
            }
            else if (!this.byweekday.length && !this.bysetpos.length) {
                v = 'choose week numbers and weekdays';
            }
        }
        else if (this.rule.options.freq === rrule_1.RRule.MONTHLY && this.monthlyInputMode === 'month') {
            if (this.showMonthDaysPast && !this.monthDaysPast.length) {
                v = 'No days past month is chosen';
            }
            else if (this.showMonthDaysRemained && !this.monthDaysRemained.length) {
                v = 'No days from month remainder is chosen';
            }
            else if (!this.showMonthDaysRemained && !this.showMonthDaysPast) {
                v = 'choose a day';
            }
        }
        return v;
    };
    RRuleComponent.prototype.onMonthlyInputModeChange = function (event) {
        this.onChange();
    };
    RRuleComponent.prototype.byweekdayChange = function (event) {
        this.multipleChoice(event, 'byweekday');
        this.options.byweekday = this.byweekday;
        delete this.options.bymonthday;
        this.onChange();
    };
    RRuleComponent.prototype.monthDaysPastOrRemainedChange = function (event) {
        this.multipleChoice(event, 'monthDaysOption');
        if (this.monthDaysOption.indexOf('past') === -1) {
            this.monthDaysPast = [];
            this.bymonthday = this.bymonthday.filter(function (r) { return r < 0; });
        }
        if (this.monthDaysOption.indexOf('remained') === -1) {
            this.monthDaysRemained = [];
            this.bymonthday = this.bymonthday.filter(function (r) { return r > 0; });
        }
        this.options.bymonthday = this.bymonthday;
        this.calcPastOrRemained();
        this.onChange();
    };
    RRuleComponent.prototype.monthDaysRemainedChange = function (event) {
        this.monthDaysRemained = event;
        this.bymonthday = this.bymonthday.filter(function (r) { return r > 0; }).concat(this.monthDaysRemained.map(function (r) { return -r; }));
        if (this.options.bymonthday !== this.bymonthday) {
            this.options.bymonthday = this.bymonthday;
            this.onChange();
        }
    };
    RRuleComponent.prototype.monthDaysPastChange = function (event) {
        this.monthDaysPast = event;
        this.bymonthday = this.bymonthday.filter(function (r) { return r < 0; }).concat(this.monthDaysPast);
        if (this.options.bymonthday !== this.bymonthday) {
            this.options.bymonthday = this.bymonthday;
            this.onChange();
        }
    };
    RRuleComponent.prototype.weekposChange = function (event) {
        this.multipleChoice(event, 'bysetpos');
        this.options.bysetpos = this.bysetpos;
        delete this.options.bymonthday;
        this.onChange();
    };
    RRuleComponent.prototype.multipleChoice = function (event, member) {
        if (event.source.checked) {
            if (this[member].indexOf(event.value) === -1)
                this[member].push(event.value);
        }
        else {
            if (this[member].indexOf(event.value) !== -1)
                this[member].splice(this[member].indexOf(event.value), 1);
        }
    };
    return RRuleComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RRuleComponent.prototype, "RRuleStr", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RRuleComponent.prototype, "RRuleStrChange", void 0);
RRuleComponent = __decorate([
    core_1.Component({
        selector: 'app-rrule',
        template: __webpack_require__(816),
        styles: [__webpack_require__(728)]
    }),
    __metadata("design:paramtypes", [])
], RRuleComponent);
exports.RRuleComponent = RRuleComponent;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/rrule.component.js.map

/***/ }),

/***/ 558:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rxjs_1 = __webpack_require__(60);
var actionEnum_1 = __webpack_require__(87);
var unit_1 = __webpack_require__(115);
var SubFormComponent = (function () {
    function SubFormComponent() {
        this.isAdd = true;
        this.isAdding = false;
        this.action = new core_1.EventEmitter();
        this.unit = new unit_1.Unit();
        this.ae = actionEnum_1.ActionEnum;
        this.formTitle = '';
        this.addIsDisable = true;
        this.updateIsDisable = true;
        this.deleteIsDisable = false;
    }
    SubFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.actionIsSuccess.subscribe(function (data) {
            if (data === true) {
                if (_this.isAdd === true) {
                    _this.unit.id = -1;
                    _this.unit.name = '';
                    _this.unit.username = '';
                    _this.unit.password = '';
                    _this.unit.is_branch = null;
                    _this.unit.is_kitchen = null;
                }
                _this.disabilityStatus();
            }
        }, function (error) {
            console.log(error);
        });
        if (this.isAdd) {
            this.formTitle = 'New Unit';
            this.unit.id = -1;
            this.unit.name = '';
            this.unit.username = '';
            this.unit.password = '';
            this.unit.is_branch = null;
            this.unit.is_kitchen = null;
        }
        else {
            this.unit.id = this.unitModel._unit.id;
            this.unit.name = this.unitModel._unit.name;
            this.unit.username = this.unitModel._unit.username;
            this.unit.is_branch = this.unitModel._unit.is_branch;
            this.unit.is_kitchen = this.unitModel._unit.is_kitchen;
            this.unit.password = '';
            if (this.unit.is_branch)
                this.formTitle = this.unit.name + ' - Branch';
            else
                this.formTitle = this.unit.name + ' - Prep Unit';
        }
    };
    SubFormComponent.prototype.disabilityStatus = function () {
        if (this.isAdd)
            this.addIsDisable = this.shouldDisableAddBtn();
        else {
            this.deleteIsDisable = this.shouldDisableDeleteBtn();
            this.updateIsDisable = this.shouldDisableUpdateBtn();
        }
    };
    SubFormComponent.prototype.actionEmitter = function (clickType) {
        var value = {
            type: clickType,
            data: this.unit
        };
        this.action.emit(value);
    };
    SubFormComponent.prototype.isCorrectFormData = function (isForAdd) {
        if (isForAdd === true && this.unit.password === "")
            return false;
        if (this.unit.name !== "" && this.unit.username !== "" && this.unit.is_branch !== null)
            return true;
        else
            return false;
    };
    SubFormComponent.prototype.shouldDisableAddBtn = function () {
        if (this.isAdding === true)
            return true;
        else
            return !this.isCorrectFormData(true);
    };
    SubFormComponent.prototype.shouldDisableUpdateBtn = function () {
        if (this.unitModel.waiting.updating === true)
            return true;
        else {
            if (this.unitModel.isDifferent(this.unit) === true)
                return !this.isCorrectFormData(false);
            else
                return true;
        }
    };
    SubFormComponent.prototype.shouldDisableDeleteBtn = function () {
        if (this.unitModel.waiting.deleting === true)
            return true;
        else
            return false;
    };
    return SubFormComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SubFormComponent.prototype, "isAdd", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SubFormComponent.prototype, "isAdding", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SubFormComponent.prototype, "unitModel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" && _a || Object)
], SubFormComponent.prototype, "actionIsSuccess", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SubFormComponent.prototype, "action", void 0);
SubFormComponent = __decorate([
    core_1.Component({
        selector: 'app-sub-form',
        template: __webpack_require__(817),
        styles: [__webpack_require__(729)]
    }),
    __metadata("design:paramtypes", [])
], SubFormComponent);
exports.SubFormComponent = SubFormComponent;
var _a;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/sub-form.component.js.map

/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var rxjs_1 = __webpack_require__(60);
var unit_model_1 = __webpack_require__(279);
var actionEnum_1 = __webpack_require__(87);
var unit_1 = __webpack_require__(115);
var rest_service_1 = __webpack_require__(45);
var message_service_1 = __webpack_require__(35);
var UnitFormComponent = (function () {
    function UnitFormComponent(restService, messageService) {
        this.restService = restService;
        this.messageService = messageService;
        this.unitModels = [];
        this.isAdding = false;
        this.actionIsSuccess = new rxjs_1.BehaviorSubject(false);
    }
    UnitFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.restService.get('unit').subscribe(function (data) {
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
            _this.sortUnitModelList();
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
        });
    };
    UnitFormComponent.prototype.doClickedAction = function (value) {
        var clickType = value.type;
        var clickData = value.data;
        this.disableEnable(clickData.id, clickType, true);
        switch (clickType) {
            case actionEnum_1.ActionEnum.add:
                this.addUnit(clickData);
                break;
            case actionEnum_1.ActionEnum.delete:
                this.deleteUnit(clickData.id);
                break;
            case actionEnum_1.ActionEnum.update:
                this.updateUnit(clickData.id, clickData);
                break;
        }
    };
    UnitFormComponent.prototype.addUnit = function (unit) {
        var _this = this;
        var name = unit.name;
        this.restService.insert('unit', unit).subscribe(function (data) {
            unit.id = data;
            unit.password = '';
            var tempUnitModel = new unit_model_1.UnitModel(unit);
            _this.actionIsSuccess.next(true);
            _this.unitModels.push(tempUnitModel);
            _this.sortUnitModelList();
            _this.disableEnable(unit.id, actionEnum_1.ActionEnum.add, false);
            _this.actionIsSuccess.next(false);
            _this.messageService.message("'" + name + "' is added to units as a new " + (unit.is_branch ? 'Branch' : 'Prep Unit'));
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(unit.id, actionEnum_1.ActionEnum.add, false);
        });
    };
    UnitFormComponent.prototype.deleteUnit = function (unitId) {
        var _this = this;
        this.restService.delete('unit', unitId).subscribe(function (data) {
            _this.unitModels = _this.unitModels.filter(function (elemenet) {
                return elemenet._unit.id !== unitId;
            });
            _this.messageService.message('Unit is deleted.');
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(unitId, actionEnum_1.ActionEnum.delete, false);
        });
    };
    UnitFormComponent.prototype.updateUnit = function (unitId, unit) {
        var _this = this;
        var index = this.unitModels.findIndex(function (element) {
            return element._unit.id == unitId;
        });
        this.restService.update('unit', unitId, this.unitModels[index].getDifferentValues(unit)).subscribe(function (data) {
            _this.actionIsSuccess.next(true);
            unit.password = '';
            _this.unitModels[index].setUnit(unit);
            _this.sortUnitModelList();
            _this.disableEnable(unitId, actionEnum_1.ActionEnum.update, false);
            _this.messageService.message(unit.name + " (" + (unit.is_branch ? 'branch' : 'prep unit') + ") is updated.");
            _this.actionIsSuccess.next(false);
        }, function (error) {
            _this.messageService.error(error);
            if (core_1.isDevMode())
                console.log(error);
            _this.disableEnable(unitId, actionEnum_1.ActionEnum.update, false);
        });
    };
    UnitFormComponent.prototype.disableEnable = function (unitId, btnType, isDisable) {
        var tempUnitModel = this.unitModels.find(function (element) {
            return element._unit.id == unitId;
        });
        switch (btnType) {
            case actionEnum_1.ActionEnum.update:
                tempUnitModel.waiting.updating = isDisable;
                break;
            case actionEnum_1.ActionEnum.delete:
                tempUnitModel.waiting.deleting = isDisable;
                break;
            case actionEnum_1.ActionEnum.add:
                this.isAdding = isDisable;
                break;
        }
    };
    UnitFormComponent.prototype.sortUnitModelList = function () {
        this.unitModels.sort(function (a, b) {
            if (a._unit.is_branch === false && b._unit.is_branch === true)
                return -1;
            else if (a._unit.is_branch === true && b._unit.is_branch === false)
                return 1;
            else {
                if (a._unit.name > b._unit.name)
                    return 1;
                else if (a._unit.name < b._unit.name)
                    return -1;
                else
                    return 0;
            }
        });
    };
    return UnitFormComponent;
}());
UnitFormComponent = __decorate([
    core_1.Component({
        selector: 'app-unit-form',
        template: __webpack_require__(818),
        styles: [__webpack_require__(730)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _a || Object, typeof (_b = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _b || Object])
], UnitFormComponent);
exports.UnitFormComponent = UnitFormComponent;
var _a, _b;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/unit-form.component.js.map

/***/ }),

/***/ 560:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false
};
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/environment.js.map

/***/ }),

/***/ 561:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(575);
__webpack_require__(568);
__webpack_require__(564);
__webpack_require__(570);
__webpack_require__(569);
__webpack_require__(567);
__webpack_require__(566);
__webpack_require__(574);
__webpack_require__(563);
__webpack_require__(562);
__webpack_require__(572);
__webpack_require__(565);
__webpack_require__(573);
__webpack_require__(571);
__webpack_require__(576);
__webpack_require__(1082);
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/polyfills.js.map

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__(0);
var Subject_1 = __webpack_require__(11);
var rest_service_1 = __webpack_require__(45);
var router_1 = __webpack_require__(23);
var message_service_1 = __webpack_require__(35);
var AuthService = (function () {
    function AuthService(restService, router, messageService) {
        var _this = this;
        this.restService = restService;
        this.router = router;
        this.messageService = messageService;
        this.authStream = new Subject_1.Subject();
        this.user = '';
        this.userType = '';
        this.unitName = '';
        this.auth$ = this.authStream.asObservable();
        this.originBeforeLogin = '/';
        this.restService.call('validUser')
            .subscribe(function (res) {
            _this.afterLogin(res);
            _this.messageService.message("You are already logged in as " + _this.user + ".");
        }, function (err) {
            if (core_1.isDevMode())
                console.log(err);
            _this.authStream.next(false);
            _this.router.navigate(['login']);
        });
    }
    AuthService.prototype.logIn = function (username, password) {
        var _this = this;
        this.restService.update('login', null, { username: username, password: password })
            .subscribe(function (res) {
            setTimeout(function () { return _this.logOff(); }, 60 * 60 * 1000);
            _this.afterLogin(res);
            _this.messageService.message(_this.user + " logged in.");
        }, function (err) {
            _this.authStream.next(false);
            _this.messageService.error(err);
            if (core_1.isDevMode())
                console.log(err);
        });
    };
    AuthService.prototype.afterLogin = function (res) {
        var data = res.json();
        this.user = data.user;
        this.unitName = data.name;
        this.userType = data.userType;
        this.isKitchen = data.isKitchen;
        this.unit_id = data.uid;
        this.authStream.next(true);
        var url = this.originBeforeLogin;
        if (url !== null && url !== '/') {
            if (this.userType === 'branch') {
                if (url.indexOf('inventory') !== -1 || url.indexOf('override') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['inventory']);
            }
            else if (this.userType === 'prep') {
                if (url.indexOf('delivery') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['delivery']);
            }
            else if (this.userType === 'admin') {
                if (url.indexOf('units') !== -1 || url.indexOf('products') !== -1 || url.indexOf('override') !== -1 || url.indexOf('reports') !== -1)
                    this.router.navigate([url]);
                else
                    this.router.navigate(['']);
            }
        }
        else {
            if (this.userType === 'branch')
                this.router.navigate(['inventory']);
            else if (this.userType === 'prep')
                this.router.navigate(['delivery']);
            else
                this.router.navigate(['/']);
        }
    };
    AuthService.prototype.logOff = function () {
        var _this = this;
        this.restService.call('logout')
            .subscribe(function () {
            _this.messageService.message(_this.user + " logged out.");
            _this.user = '';
            _this.userType = '';
            _this.unitName = '';
            _this.authStream.next(false);
            _this.router.navigate(['login']);
        }, function (err) {
            _this.messageService.error(err);
            if (core_1.isDevMode())
                console.log(err);
        });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof rest_service_1.RestService !== "undefined" && rest_service_1.RestService) === "function" && _a || Object, typeof (_b = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _b || Object, typeof (_c = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" && _c || Object])
], AuthService);
exports.AuthService = AuthService;
var _a, _b, _c;
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/auth.service.js.map

/***/ }),

/***/ 714:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "@media (min-width: 600px) {\r\n  #main {\r\n    padding: 20px;\r\n  }\r\n}\r\n\r\n@media (max-width: 599px) {\r\n  #main {\r\n    padding: 0px;\r\n  }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 715:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".numInput{\r\n  max-width: 100px;\r\n  min-width: 80px;\r\n}\r\n\r\n.errorMessage{\r\n  font-weight: bold;\r\n  color: darkred;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 716:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".notEqualValues{\r\n  background-color: antiquewhite;\r\n}\r\n\r\n.equalValues{\r\n}\r\n\r\n.warnColoring{\r\n  color: darkred;\r\n}\r\n\r\n.zeroColoring {\r\n  color: #ccc !important;\r\n}\r\n.normalColoring{\r\n  color: black;\r\n}\r\n\r\n.waiting{\r\n  margin-top: 60px !important;\r\n  margin-bottom: 60px !important;\r\n  -ms-flex-line-pack: center !important;\r\n      align-content: center !important;\r\n}\r\n\r\n.waitingMessage{\r\n  color: white;\r\n  font-weight: bold;\r\n  text-align: center;\r\n}\r\n.number {\r\n  width:30px;\r\n  vertical-align: middle;\r\n  font-weight: 600;\r\n  color: gray;\r\n  text-align: center;\r\n  background: #f8f8f8 !important;\r\n}\r\n\r\nth {\r\n  vertical-align: middle;\r\n  font-weight: 600;\r\n  color: gray;\r\n  text-align: center;\r\n  background: rgba(240,240,240,.6);\r\n}\r\n\r\ntd {\r\n  vertical-align: middle !important;\r\n  padding: 1px !important;\r\n  font-weight: 300;\r\n  font-size: 100%;\r\n  text-align: center;\r\n  background: rgba(250,250,0,.04);\r\n}\r\n\r\ninput {\r\n  text-align: center;\r\n}\r\n.name {\r\n  text-align: left;\r\n}\r\n.sum {\r\n  font-weight: 600;\r\n  text-align: right;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 717:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 718:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 719:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".warnColoring{\r\n  color: red;\r\n}\r\n\r\n.normalColoring{\r\n  color: black;\r\n}\r\n\r\n.counted {\r\n  background: #6d8b5f85;\r\n}\r\n\r\n.packMoreThanMax {\r\n  background: #e5ff0085;\r\n}\r\n\r\n.clear-background {\r\n  background: rgba(240, 240, 240, 0.6);\r\n}\r\n\r\n.counted td {\r\n  border-color: #faebd6;\r\n}\r\n.number {\r\n  width:30px;\r\n  vertical-align: middle;\r\n  font-weight: 600;\r\n  color: gray;\r\n  text-align: center;\r\n  background: #f8f8f8 !important;\r\n}\r\n\r\nth {\r\n  vertical-align: middle;\r\n  font-weight: 600;\r\n  color: gray;\r\n  text-align: center;\r\n  background: rgba(240,240,240,.6);\r\n}\r\n\r\ntd {\r\n  vertical-align: middle !important;\r\n  padding: 1px !important;\r\n  font-weight: 300;\r\n  font-size: 100%;\r\n  color: black;\r\n  text-align: center;\r\n  background: rgba(240,240,240,.6);\r\n}\r\n.name {\r\n  text-align: left;\r\n}\r\ninput {\r\n  text-align: center;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 720:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 721:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "a.toolbar{\r\n  color: white\r\n}\r\na.toolbar:hover{\r\n  color: brown;\r\n}\r\na.toolbar:visited{\r\n  color:white;\r\n}\r\na.toolbar:active{\r\n  color:antiquewhite;\r\n}\r\na.toolbar:after{\r\n  color:antiquewhite;\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 722:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".repContainer {\r\n  padding-top: 30px\r\n}\r\n.repContainer div {\r\n  padding: 5px 0;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "@media screen {\r\n  #printpage, #printpage * {\r\n    display:none;\r\n  }\r\n}\r\n@media print {\r\n  body *{\r\n    visibility:hidden;\r\n    background: transparent;\r\n    -webkit-print-color-adjust: exact !important;\r\n  }\r\n\r\n  #printpage, #printpage *{\r\n    visibility:visible;\r\n    -webkit-print-color-adjust: exact !important;\r\n  }\r\n\r\n  #printpage{\r\n    position:absolute;\r\n    left:0;\r\n    top:0;\r\n  }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".OuterDivStyle{\r\n  background-color: #607D8B;\r\n  width: 700px;\r\n  padding: 10px;\r\n  border-radius: 7px;\r\n  text-align: left;\r\n  margin-left: 3px\r\n}\r\n\r\n.InnerDivStyle{\r\n  background-color: white;\r\n  width: 90%;\r\n  padding: 10px;\r\n  margin-left: 2%;\r\n}\r\n\r\n.SpanStyle{\r\n  font-size: x-large;\r\n  font-weight: bold ;\r\n  margin-left: 7px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "/*md-select, md-input-container{*/\r\n  /*margin: 6px;*/\r\n  /*width: 40%;*/\r\n  /*text-indent: 2px;*/\r\n/*}*/\r\n\r\ninput{\r\n  min-width: 100px;\r\n}\r\n\r\n.ButtonStyle{\r\n  margin-left: 12px;\r\n  margin-top: 20px;\r\n  margin-bottom: 5px;\r\n  border-radius: 5px;\r\n  border-width: 5px;\r\n  border-color:#728653;\r\n  background-color: #607D8B;\r\n  font-weight: bold;\r\n}\r\n\r\nmd-card{\r\n  border-style: solid;\r\n  border-width: 2px;\r\n  border-color: #607D8B;\r\n  direction: ltr;\r\n}\r\n\r\n.numInput{\r\n  max-width: 100px;\r\n  min-width: 80px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 726:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 727:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 728:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".h{\r\n  visibility: hidden;\r\n}\r\n.v{\r\n  visibility: visible;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 729:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".InputStyle{\r\n  width: 35%;\r\n  margin-top: 8px;\r\n  border-style: solid;\r\n  border-color:#728653;\r\n  border-width: 1.5px;\r\n  text-indent: 2%;\r\n}\r\n\r\n.DivStyle{\r\n  width: 90%;\r\n  border-style: solid;\r\n  border-color:#728653;\r\n  border-width: 2px;\r\n  direction: ltr;\r\n\r\n}\r\n\r\n.TopSpanStyle{\r\n  width:85px;\r\n  display:inline-block;\r\n  margin-top: 8px;\r\n  text-align: right;\r\n  font-size: small;\r\n  font-weight: bold;\r\n}\r\n\r\n.SpanStyle{\r\n  width:85px;\r\n  display:inline-block;\r\n  margin-top: 4px;\r\n  text-align: right;\r\n  font-size: small;\r\n  font-weight: bold;\r\n}\r\n\r\n\r\n.ButtonStyle{\r\n  margin-left: 12px;\r\n  margin-top: 20px;\r\n  margin-bottom: 5px;\r\n  border-radius: 5px;\r\n  border-width: 5px;\r\n  border-color:#728653;\r\n  background-color: #607D8B;\r\n  font-weight: bold;\r\n}\r\n\r\n.RadioButtonStyle{\r\n  margin-left: 20px;\r\n}\r\n\r\nmd-card{\r\n  border-style: solid;\r\n  border-width: 2px;\r\n  border-color: #607D8B;\r\n  direction: ltr;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 730:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)();
// imports


// module
exports.push([module.i, ".OuterDivStyle{\r\n  background-color: #607D8B;\r\n  width: 700px;\r\n  padding: 10px;\r\n  border-radius: 7px;\r\n  text-align: left;\r\n  margin-left: 3px\r\n}\r\n\r\n.InnerDivStyle{\r\n  background-color: white;\r\n  width: 90%;\r\n  padding: 10px;\r\n  margin-left: 2%;\r\n}\r\n.SpanStyle{\r\n  font-size: x-large;\r\n  font-weight: bold ;\r\n  margin-left: 7px;\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 734:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 317,
	"./af.js": 317,
	"./ar": 323,
	"./ar-dz": 318,
	"./ar-dz.js": 318,
	"./ar-ly": 319,
	"./ar-ly.js": 319,
	"./ar-ma": 320,
	"./ar-ma.js": 320,
	"./ar-sa": 321,
	"./ar-sa.js": 321,
	"./ar-tn": 322,
	"./ar-tn.js": 322,
	"./ar.js": 323,
	"./az": 324,
	"./az.js": 324,
	"./be": 325,
	"./be.js": 325,
	"./bg": 326,
	"./bg.js": 326,
	"./bn": 327,
	"./bn.js": 327,
	"./bo": 328,
	"./bo.js": 328,
	"./br": 329,
	"./br.js": 329,
	"./bs": 330,
	"./bs.js": 330,
	"./ca": 331,
	"./ca.js": 331,
	"./cs": 332,
	"./cs.js": 332,
	"./cv": 333,
	"./cv.js": 333,
	"./cy": 334,
	"./cy.js": 334,
	"./da": 335,
	"./da.js": 335,
	"./de": 337,
	"./de-at": 336,
	"./de-at.js": 336,
	"./de.js": 337,
	"./dv": 338,
	"./dv.js": 338,
	"./el": 339,
	"./el.js": 339,
	"./en-au": 340,
	"./en-au.js": 340,
	"./en-ca": 341,
	"./en-ca.js": 341,
	"./en-gb": 342,
	"./en-gb.js": 342,
	"./en-ie": 343,
	"./en-ie.js": 343,
	"./en-nz": 344,
	"./en-nz.js": 344,
	"./eo": 345,
	"./eo.js": 345,
	"./es": 347,
	"./es-do": 346,
	"./es-do.js": 346,
	"./es.js": 347,
	"./et": 348,
	"./et.js": 348,
	"./eu": 349,
	"./eu.js": 349,
	"./fa": 350,
	"./fa.js": 350,
	"./fi": 351,
	"./fi.js": 351,
	"./fo": 352,
	"./fo.js": 352,
	"./fr": 355,
	"./fr-ca": 353,
	"./fr-ca.js": 353,
	"./fr-ch": 354,
	"./fr-ch.js": 354,
	"./fr.js": 355,
	"./fy": 356,
	"./fy.js": 356,
	"./gd": 357,
	"./gd.js": 357,
	"./gl": 358,
	"./gl.js": 358,
	"./he": 359,
	"./he.js": 359,
	"./hi": 360,
	"./hi.js": 360,
	"./hr": 361,
	"./hr.js": 361,
	"./hu": 362,
	"./hu.js": 362,
	"./hy-am": 363,
	"./hy-am.js": 363,
	"./id": 364,
	"./id.js": 364,
	"./is": 365,
	"./is.js": 365,
	"./it": 366,
	"./it.js": 366,
	"./ja": 367,
	"./ja.js": 367,
	"./jv": 368,
	"./jv.js": 368,
	"./ka": 369,
	"./ka.js": 369,
	"./kk": 370,
	"./kk.js": 370,
	"./km": 371,
	"./km.js": 371,
	"./ko": 372,
	"./ko.js": 372,
	"./ky": 373,
	"./ky.js": 373,
	"./lb": 374,
	"./lb.js": 374,
	"./lo": 375,
	"./lo.js": 375,
	"./lt": 376,
	"./lt.js": 376,
	"./lv": 377,
	"./lv.js": 377,
	"./me": 378,
	"./me.js": 378,
	"./mi": 379,
	"./mi.js": 379,
	"./mk": 380,
	"./mk.js": 380,
	"./ml": 381,
	"./ml.js": 381,
	"./mr": 382,
	"./mr.js": 382,
	"./ms": 384,
	"./ms-my": 383,
	"./ms-my.js": 383,
	"./ms.js": 384,
	"./my": 385,
	"./my.js": 385,
	"./nb": 386,
	"./nb.js": 386,
	"./ne": 387,
	"./ne.js": 387,
	"./nl": 389,
	"./nl-be": 388,
	"./nl-be.js": 388,
	"./nl.js": 389,
	"./nn": 390,
	"./nn.js": 390,
	"./pa-in": 391,
	"./pa-in.js": 391,
	"./pl": 392,
	"./pl.js": 392,
	"./pt": 394,
	"./pt-br": 393,
	"./pt-br.js": 393,
	"./pt.js": 394,
	"./ro": 395,
	"./ro.js": 395,
	"./ru": 396,
	"./ru.js": 396,
	"./se": 397,
	"./se.js": 397,
	"./si": 398,
	"./si.js": 398,
	"./sk": 399,
	"./sk.js": 399,
	"./sl": 400,
	"./sl.js": 400,
	"./sq": 401,
	"./sq.js": 401,
	"./sr": 403,
	"./sr-cyrl": 402,
	"./sr-cyrl.js": 402,
	"./sr.js": 403,
	"./ss": 404,
	"./ss.js": 404,
	"./sv": 405,
	"./sv.js": 405,
	"./sw": 406,
	"./sw.js": 406,
	"./ta": 407,
	"./ta.js": 407,
	"./te": 408,
	"./te.js": 408,
	"./tet": 409,
	"./tet.js": 409,
	"./th": 410,
	"./th.js": 410,
	"./tl-ph": 411,
	"./tl-ph.js": 411,
	"./tlh": 412,
	"./tlh.js": 412,
	"./tr": 413,
	"./tr.js": 413,
	"./tzl": 414,
	"./tzl.js": 414,
	"./tzm": 416,
	"./tzm-latn": 415,
	"./tzm-latn.js": 415,
	"./tzm.js": 416,
	"./uk": 417,
	"./uk.js": 417,
	"./uz": 418,
	"./uz.js": 418,
	"./vi": 419,
	"./vi.js": 419,
	"./x-pseudo": 420,
	"./x-pseudo.js": 420,
	"./yo": 421,
	"./yo.js": 421,
	"./zh-cn": 422,
	"./zh-cn.js": 422,
	"./zh-hk": 423,
	"./zh-hk.js": 423,
	"./zh-tw": 424,
	"./zh-tw.js": 424
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 734;


/***/ }),

/***/ 802:
/***/ (function(module, exports) {

module.exports = "<p-blockUI [blocked]=\"blocked\">\r\n  <div style=\"position:absolute;top:25%;left:40%;text-align: center;width:20%;height:200px\">\r\n    <i class=\"fa fa-circle-o-notch fa-spin fa-5x\" style=\"position:absolute;top:25%;left:50%\"></i>\r\n  </div>\r\n</p-blockUI>\r\n\r\n<app-navbar></app-navbar>\r\n<div *ngIf=\"showError\" style=\"width:100%;background:darkred;color:white\"><i class=\"fa fa-close\" style=\"padding:5px\" (click)=\"closeError()\"></i> {{error}}</div>\r\n<div class=\"flex-container\"\r\n     fxLayout=\"row\" fxLayout.xs=\"column\"\r\n     fxLayoutAlign=\"center center\" fxLayoutAlign.xs=\"start start\">\r\n  <div class=\"flex-item\" fxFlex=\"10\" fxFlex.lg=\"0\" fxFlex.md=\"0\" fxFlex.sm=\"0\" fxFlex.xs=\"0\"></div>\r\n  <div class=\"flex-item\" fxFlex=\"90\" fxFlex.lg=\"100\" fxFlex.md=\"100\" fxFlex.sm=\"100\" fxFlex.xs=\"100\" id=\"main\"><router-outlet></router-outlet></div>\r\n  <div class=\"flex-item\" fxFlex=\"10\" fxFlex.lg=\"0\" fxFlex.md=\"0\" fxFlex.sm=\"0\" fxFlex.xs=\"0\"></div>\r\n</div>\r\n<div class=\"hidden-mobile\" style=\"font-weight: 100;width:100%; font-size: 70%; text-align: center\"><a style=\"text-decoration: none;color: black\" href=\"https://goo.gl/forms/4STw85rDSzk8F2832\" target=\"_blank\">Report a bug</a></div>\r\n\r\n"

/***/ }),

/***/ 803:
/***/ (function(module, exports) {

module.exports = "<span *ngIf=\"!isOverridden\">Inventory Rules By Default:</span>\r\n<span *ngIf=\"isOverridden\">Inventory Rules Overrides:</span>\r\n<br/>\r\n<md-card>\r\n  <div class=\"errorMessage\">{{showMessage}}</div>\r\n  <div class=\"flex-container\" fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"center top\" fxLayoutAlign.xs=\"start start\">\r\n    <div class=\"flex-item\" style=\"margin: 5px;\" fxFlex=\"30%\">\r\n      <div class=\"flex-container\" fxLayout=\"column\" fxLayoutAlign=\"left top\">\r\n        <div class=\"flex-item\" style=\"margin-left: 5px;\" fxFlex=\"20%\">\r\n          <md-card-content>\r\n            <md-input-container>\r\n              <input mdInput min=\"0\" class=\"numInput minQty\" type=\"number\" placeholder=\"Min Qty\" [(ngModel)]=\"minQty\" (ngModelChange)=\"minChange()\" id=\"minQty\" min=\"0\" maxlength=\"5\"/>\r\n            </md-input-container>\r\n            <md-input-container>\r\n              <input mdInput min=\"0\" class=\"numInput maxQty\" type=\"number\" placeholder=\"Max Qty\" [(ngModel)]=\"maxQty\" (ngModelChange)=\"maxChange()\" id=\"maxQty\" maxlength=\"5\"/>\r\n            </md-input-container>\r\n          </md-card-content>\r\n        </div>\r\n        <div class=\"flex-item\" fxFlex=\"80%\">\r\n          <md-card-content>\r\n            <span>Coefficients</span>\r\n            <md-card>\r\n              <md-card-content>\r\n                <div>\r\n                  <br/>\r\n                  <div *ngFor=\"let day of days\">\r\n                    <md-input-container>\r\n\r\n                      <input mdInput min=\"0\" class=\"numInput\" type=\"number\" placeholder=\"{{day}}\" [(ngModel)]=\"coefficients[day]\" (ngModelChange)=\"coeffChange()\" id=\"{{day}}\"/>\r\n                    </md-input-container>\r\n                  </div>\r\n                </div>\r\n              </md-card-content>\r\n            </md-card>\r\n          </md-card-content>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"flex-item\" style=\"margin: 5px;\" fxFlex=\"70%\">\r\n      <md-card-content>\r\n        <span>Inventory Counting Recursion</span>\r\n        <md-card>\r\n          <md-card-content>\r\n            <app-rrule [RRuleStr]=\"recursionRule\" (RRuleStrChange)=\"recurChange($event)\"></app-rrule>\r\n          </md-card-content>\r\n        </md-card>\r\n      </md-card-content>\r\n    </div>\r\n  </div>\r\n</md-card>\r\n"

/***/ }),

/***/ 804:
/***/ (function(module, exports) {

module.exports = "<md-card class=\"outerCard\">\r\n    <md-card-title class=\"cardTitle\">{{unitName}} Delivery</md-card-title>\r\n\r\n  <div>\r\n    <md-card class=\"mat-card\" style=\"width:320px; margin-bottom:10px;padding:5px; border-radius:25px;\">\r\n      <label for=\"show-zero-delivery\" style=\"padding:0 10px\">Zero deliveries:</label>\r\n      <md-radio-group [(ngModel)]=\"showZeroDelivery\" (change)=\"changeFilter()\" id=\"show-zero-delivery\">\r\n        <md-radio-button style=\"padding: 0 10px;\" [value]=\"false\">Hide</md-radio-button>\r\n        <md-radio-button style=\"padding: 0 10px;\" [value]=\"true\">Show</md-radio-button>\r\n      </md-radio-group>\r\n    </md-card>\r\n  </div>\r\n  <material-datepicker  [(date)]=\"selectedDate\" (onSelect)=\"dateChanged()\">\r\n  </material-datepicker>\r\n  <md-tab-group *ngIf=\"dataIsReady\" class=\"materialTab\" [(selectedIndex)]=\"selectedIndex\" (selectChange)=\"tabChanged()\">\r\n    <md-tab label=\"All\" *ngIf=\"overallDeliveryModel._deliveries !== undefined\">\r\n      <md-card class=\"innerCard\">\r\n        <md-card-title>To Do: Delivery</md-card-title>\r\n        <md-card-content>\r\n          <md-card style=\"overflow: auto;\">\r\n            <md-card-content>\r\n              <table class=\"table table-striped\">\r\n                <thead style=\"width: 100%\">\r\n                  <tr>\r\n                    <th [style.width]=\"thereIsProactiveItem ? 'unset' : '30px'\">#</th>\r\n                    <th>Code</th>\r\n                    <th>Product</th>\r\n                    <th>Real Delivery</th>\r\n                    <th>Min Delivery</th>\r\n                    <th>Max Delivery</th>\r\n                    <th>Min Required</th>\r\n                    <th>Max Stock</th>\r\n                    <th>Branches Stock</th>\r\n                  </tr>\r\n                </thead>\r\n                <tbody>\r\n                  <tr *ngFor=\"let delItem of filteredDeliveries;let i = index\">\r\n                    <td *ngIf=\"delItem.id !== null\" [style.width]=\"thereIsProactiveItem ? 'unset' : '30px'\" class=\"number\">{{i + 1}}</td>\r\n                    <td *ngIf=\"delItem.id === null\" style=\"width: unset\">\r\n                      <md-chip-list>\r\n                        <md-chip color=\"primary\" selected=\"true\">Added</md-chip>\r\n                      </md-chip-list>\r\n                    </td>\r\n                    <td>{{delItem.productCode}}</td>\r\n                    <td class=\"name\">{{delItem.productName}}</td>\r\n                    <td>{{delItem.realDelivery}}</td>\r\n                    <td *ngIf=\"delItem.minDelivery !== null\">{{delItem.minDelivery}}</td>\r\n                    <td *ngIf=\"delItem.minDelivery === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                    <td *ngIf=\"delItem.maxDelivery !== null\">{{delItem.maxDelivery}}</td>\r\n                    <td *ngIf=\"delItem.maxDelivery === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                    <td>{{delItem.min}}</td>\r\n                    <td>{{delItem.max}}</td>\r\n                    <td *ngIf=\"delItem.stock !== null\">{{delItem.stock}}</td>\r\n                    <td *ngIf=\"delItem.stock === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                </tr>\r\n                  <tr>\r\n                    <td [style.width]=\"thereIsProactiveItem ? 'unset' : '30px'\" class=\"number\"></td>\r\n                    <td class=\"sum\" colspan=\"2\">Sum</td>\r\n                    <td>{{receiversSumDeliveries['All'].realDelivery}}</td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].minDelivery !== null\">{{receiversSumDeliveries['All'].minDelivery}}</td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].minDelivery === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].maxDelivery !== null\">{{receiversSumDeliveries['All'].maxDelivery}}</td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].maxDelivery === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                    <td>{{receiversSumDeliveries['All'].min}}</td>\r\n                    <td>{{receiversSumDeliveries['All'].max}}</td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].stock !== null\">{{receiversSumDeliveries['All'].stock}}</td>\r\n                    <td *ngIf=\"receiversSumDeliveries['All'].stock === null\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                  </tr>\r\n                </tbody>\r\n              </table>\r\n            </md-card-content>\r\n          </md-card>\r\n        </md-card-content>\r\n        <md-card-content>\r\n          <button md-raised-button class=\"ButtonStyle\"\r\n                  *ngIf=\"isToday\"\r\n                  [(disabled)]=\"overallDeliveryModel._shouldDisabled\"\r\n                  (click)=\"printDelivery(overallDeliveryModel)\">Print</button>\r\n        </md-card-content>\r\n      </md-card>\r\n    </md-tab>\r\n    <md-tab *ngFor=\"let rcv of receivers\" class=\"delayedTab\">\r\n      <ng-template md-tab-label>\r\n        <i *ngIf=\"rcv.warn === 'count'\" class=\"fa fa-exclamation warnColoring\" aria-hidden=\"true\"></i>\r\n        {{rcv.name}}\r\n      </ng-template>\r\n      <ng-template md-tab-label *ngIf=\"rcv.warn === 'login'\">\r\n        <i class=\"fa fa-exclamation warnColoring\" aria-hidden=\"true\"></i>\r\n        <i class=\"fa fa-exclamation warnColoring\" aria-hidden=\"true\"></i> {{rcv.name}}\r\n      </ng-template>\r\n      <ng-template md-tab-label *ngIf=\"rcv.warn === 'count'\">\r\n        <i class=\"fa fa-exclamation warnColoring\" aria-hidden=\"true\"></i> {{rcv.name}}\r\n      </ng-template>\r\n      <ng-template md-tab-label *ngIf=\"rcv.warn === 'no'\">\r\n        {{rcv.name}}\r\n      </ng-template>\r\n      <md-card class=\"innerCard\"\r\n               *ngIf=\"!isWaiting[rcv.name] && receiversDeliveryModels[rcv.name] !== undefined && receiversDeliveryModels[rcv.name] !== null\">\r\n        <md-card-title>To Do: Delivery</md-card-title>\r\n        <md-card-content>\r\n          <md-card style=\"min-width: 600px !important; overflow-x: auto;\">\r\n            <md-card-content>\r\n              <table class=\"table table-striped\">\r\n                <thead style=\"width: 100%\">\r\n                <tr>\r\n                  <th style=\"width: 30px\">#</th>\r\n                  <th>Code</th>\r\n                  <th>Product</th>\r\n                  <th>Real Delivery</th>\r\n                  <th>Min Delivery</th>\r\n                  <th>Max Delivery</th>\r\n                  <th>Min Required</th>\r\n                  <th>Max Stock</th>\r\n                  <th>Current Stock</th>\r\n                  <th>Last Count</th>\r\n                  <th>Last Count Date</th>\r\n                  <th>Days to Next Counting</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                <tr *ngFor=\"let delItem of filteredBranchDeliveries[rcv.name];let i = index\" [ngClass]=\"[delItem.realDelivery ? countToday(delItem.stockDate) ? 'normalColoring' : 'warnColoring' : 'zeroColoring']\">\r\n                  <td  style=\"width: 40px\" class=\"buttonItem\" *ngIf=\"delItem.id !== null && delItem.state !== 'added'\" class=\"number\">{{i+1}}</td>\r\n                  <td style=\"width: 40px\" class=\"buttonItem\" *ngIf=\"delItem.id === null\">\r\n                    <button md-mini-fab\r\n                            (click)=\"removeDeliveryItem(delItem)\">\r\n                      <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\r\n                    </button>\r\n                  </td>\r\n                  <td class=\"buttonItem\" *ngIf=\"delItem.id !== null && delItem.state === 'added'\">\r\n                    <md-chip-list>\r\n                      <md-chip color=\"primary\" selected=\"true\">Added</md-chip>\r\n                    </md-chip-list>\r\n                  </td>\r\n                  <td class=\"codeItem\">\r\n                    {{delItem.productCode}}\r\n                  </td>\r\n                  <td class=\"nameItem name\"\r\n                      [ngClass]=\"[(countToday(delItem.stockDate)) ? 'normalColoring' : 'warnColoring']\">\r\n                    {{delItem.productName}}\r\n                  </td>\r\n                  <td class=\"inputItem\">\r\n                    <md-input-container>\r\n                      <input mdInput type=\"number\"\r\n                             min=\"0\"\r\n                             [ngClass]=\"[(rcv.warn ||((delItem.minDelivery > delItem.realDelivery || delItem.maxDelivery < delItem.realDelivery ) && isToday)) ? 'notEqualValues' : 'equalValues']\"\r\n                             [(disabled)]=\"!isToday\"\r\n                             placeholder=\"Real Delivery\"\r\n                             [ngModel]=\"delItem.realDelivery\"\r\n                             (change)=\"checkRealDeliveryValue($event, delItem)\"/>\r\n                    </md-input-container>\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock !== null && delItem.id !== null\">\r\n                    {{delItem.minDelivery}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock === null || delItem.id === null\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock !== null && delItem.id !== null\">\r\n                    {{delItem.maxDelivery}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock === null || delItem.id === null\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td class=\"column\">{{delItem.min}}\r\n                  </td>\r\n                  <td class=\"column\">{{delItem.max}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock !== null && delItem.id !== null\">\r\n                    {{delItem.stock}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"delItem.stock === null || delItem.id === null\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td class=\"column\">\r\n                    {{delItem.oldCount}}\r\n                  </td>\r\n                  <td style=\"min-width: 80px !important;\" class=\"column\">\r\n                    {{delItem.stockDate}}\r\n                  </td>\r\n                  <td *ngIf=\"delItem.untilNextCountingDay!==null\" class=\"column\">{{delItem.untilNextCountingDay}}</td>\r\n                  <td *ngIf=\"delItem.untilNextCountingDay===null\" class=\"column\"><i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i></td>\r\n                </tr>\r\n                <tr>\r\n                  <td [style.width]=\"thereIsProactiveItem ? 'unset' : '30px'\" class=\"number\"></td>\r\n                  <td class=\"sum\" colspan=\"3\">Sum</td>\r\n                  <td class=\"inputItem\">{{receiversSumDeliveries[rcv.name].realDelivery}}</td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'no'\">\r\n                    {{receiversSumDeliveries[rcv.name].minDelivery}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'count' || rcv.warn === 'unknown'\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'no'\">\r\n                    {{receiversSumDeliveries[rcv.name].maxDelivery}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'count' || rcv.warn === 'unknown'\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td class=\"column\">{{receiversSumDeliveries[rcv.name].min}}</td>\r\n                  <td class=\"column\">{{receiversSumDeliveries[rcv.name].max}}</td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'no'\">\r\n                    {{receiversSumDeliveries[rcv.name].stock}}\r\n                  </td>\r\n                  <td class=\"column\" *ngIf=\"rcv.warn === 'count' || rcv.warn === 'unknown'\">\r\n                    <i class=\"fa fa-question warnColoring\" aria-hidden=\"true\"></i>\r\n                  </td>\r\n                  <td style=\"min-width: 80px !important;\" class=\"column\">-</td>\r\n                  <td>-</td>\r\n                </tr>\r\n                <tr\r\n                  *ngIf=\"isToday && !receiversDeliveryModels[rcv.name]._shouldDisabled && productsList[rcv.name] !== undefined && productsList[rcv.name].length > 0\">\r\n                  <td class=\"buttonItem\"></td>\r\n                  <td class=\"codeItem\" colspan=\"2\">\r\n                    <md-input-container>\r\n                      <input mdInput type=\"text\" [(disabled)]=\"receiversDeliveryModels[rcv.name]._shouldDisabled\"\r\n                             class=\"pnc\" placeholder=\"Product name/code\" [mdAutocomplete]=\"auto\"\r\n                             [formControl]=\"productNameCodeCtrl\" (focus)=\"showProductList()\"\r\n                             (blur)=\"clearInput($event)\"/>\r\n                      <md-autocomplete #auto=\"mdAutocomplete\">\r\n                        <md-option *ngFor=\"let nameCode of filteredNameCode | async\" [value]=\"nameCode\">\r\n                          {{nameCode}}\r\n                        </md-option>\r\n                      </md-autocomplete>\r\n                    </md-input-container>\r\n                  </td>\r\n                  <td class=\"nameItem\"></td>\r\n                  <td class=\"inputItem\"></td>\r\n                  <td class=\"column\"></td>\r\n                  <td class=\"column\"></td>\r\n                  <td class=\"column\"></td>\r\n                  <td class=\"column\"></td>\r\n                  <td style=\"min-width: 80px !important;\" class=\"column\"></td>\r\n                </tr>\r\n                </tbody>\r\n              </table>\r\n            </md-card-content>\r\n          </md-card>\r\n        </md-card-content>\r\n        <md-card-content>\r\n          <button md-raised-button class=\"ButtonStyle\"\r\n\r\n                  [disabled]=\"!receiversDeliveryModels[rcv.name]._isSubmitted || receiversDeliveryModels[rcv.name]._deliveries.length <= 0 || buttonDisabled\"\r\n                  (click)=\"printDelivery(receiversDeliveryModels[rcv.name])\">Print</button>\r\n          <button md-raised-button class=\"ButtonStyle\"\r\n                  [disabled]=\"buttonDisabled\"\r\n                  (click)=\"submitDelivery(receiversDeliveryModels[rcv.name])\">Submit</button>\r\n        </md-card-content>\r\n      </md-card>\r\n    </md-tab>\r\n  </md-tab-group>\r\n  <div *ngIf=\"!dataIsReady\">\r\n    <div class=\"flex-container waiting\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\r\n      <div class=\"flex-item\" fxFlex=\"80\">\r\n        <div class=\"flex-container\" fxLayout=\"column\" fxLayoutAlign=\"center center\">\r\n          <div class=\"flex-item\" fxFlex=\"80\">\r\n            <i style=\"color: white !important;\" class=\"fa fa-circle-o-notch fa-spin fa-3x fa-fw\"></i>\r\n            <span class=\"sr-only\">Loading...</span>\r\n          </div>\r\n          <div class=\"flex-item\" fxFlex=\"20\">\r\n            <br/>\r\n            <span class=\"waitingMessage\">Please wait until we fetch and process delivery data</span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</md-card>\r\n"

/***/ }),

/***/ 805:
/***/ (function(module, exports) {

module.exports = "\r\n"

/***/ }),

/***/ 806:
/***/ (function(module, exports) {

module.exports = "<md-card>\r\n  <md-card-header>\r\n    <md-card-title>\r\n      <h3> WARNING!</h3>\r\n    </md-card-title>\r\n  </md-card-header>\r\n  <md-card-content>\r\n    <p>The values entered for some products are greater than the maximum, so be sure to confirm</p>\r\n  </md-card-content>\r\n  <md-card-actions>\r\n    <button md-raised-button color=\"primary\" (click)=\"dialogRef.close(true)\">Confirm</button>\r\n    <button md-raised-button color=\"accent\" (click)=\"dialogRef.close(false)\">Cancel</button>\r\n  </md-card-actions>\r\n</md-card>\r\n"

/***/ }),

/***/ 807:
/***/ (function(module, exports) {

module.exports = "<md-card style=\"background-color: #607D8B; border-radius: 7px; text-align: left; margin: 10px;\">\r\n  <md-card-title class=\"cardTitle hidden-mobile\">{{unitName}} Inventory</md-card-title>\r\n  <md-card class=\"innerCard\">\r\n\r\n    <md-card-title class=\"hidden-mobile\">To Do: Inventory Takings</md-card-title>\r\n    <md-card-header class=\"hidden-mobile\">\r\n      <material-datepicker [(rangeEnd)]=\"currentDate\" [(date)]=\"selectedDate\" (onSelect)=\"dateChanged()\">\r\n      </material-datepicker>\r\n    </md-card-header>\r\n    <md-card-content>\r\n      <md-card style=\"overflow: auto;\">\r\n        <div *ngIf=\"isEnableToInventoryTaking\" class=\"alert alert-primary\" role=\"alert\">\r\n                inventory taking is related to date {{selectedDate | date: 'd MMM yy'}}\r\n        </div>\r\n        <md-card-content>\r\n          <table class=\"table table-responsive\">\r\n            <thead style=\"width:100%\">\r\n              <tr>\r\n                <th style=\"width:30px\">#</th>\r\n                <th [ngStyle]=\"{'width.px': noButton ? 0 : 24}\">&nbsp;</th>\r\n                <th class=\"name\">Product</th>\r\n                <th>Code</th>\r\n                <th>Unopened Packs</th>\r\n                <th class=\"hidden-mobile\">Last Count</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody class=\"scrollable\"\r\n              *ngIf=\"inventoryModel !== null && inventoryModel !== undefined && inventoryModel._inventories.length > 0\">\r\n              <tr *ngFor=\"let invItem of inventoryModel._inventories;let i = index\" [@itemState]=\"invItem.state\"\r\n                  [ngClass]=\"[invItem.unopenedPack ? 'counted': '',\r\n                            (!invItem.shouldCountToday && invItem.shouldIncluded) ? 'warnColoring' : 'normalColoring',\r\n                            invItem.unopenedPack > invItem.stockMax ? 'packMoreThanMax' : 'clear-background']\">\r\n                  <td class=\"number\">{{i+1}}</td>\r\n                  <td [ngStyle]=\"{'width.px': noButton ? 0 : 24}\" *ngIf=\"invItem.shouldIncluded\">&nbsp;</td>\r\n                  <td *ngIf=\"!invItem.shouldIncluded\">\r\n                    <button md-mini-fab (click)=\"removeInventoryItem(invItem)\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button>\r\n                  </td>\r\n                <td class=\"name\">\r\n                  {{invItem.productName}}\r\n                </td>\r\n                <td>\r\n                  {{invItem.productCode}}\r\n                </td>\r\n                <td>\r\n                  <md-input-container>\r\n                    <input mdInput type=\"number\" [(ngModel)]=\"invItem.unopenedPack\" placeholder=\"Packs\"\r\n                      (ngModelChange)=\"checkDisability(invItem)\" [disabled]=\"!isSameDates || invItem?.is_disabled\"\r\n                      min=\"0\" />\r\n                  </md-input-container>\r\n                </td>\r\n                <td *ngIf=\"invItem.lastCount !== null\" class=\"hidden-mobile\"\r\n                  [ngClass]=\"[(this.isSameDates && !invItem.shouldCountToday && invItem.shouldIncluded) ? 'warnColoring' : 'normalColoring']\">\r\n                  {{invItem.lastCount | date: 'd MMM yy'}}\r\n                </td>\r\n                <td *ngIf=\"invItem.lastCount === null\">\r\n                  -\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n          <table class=\"table\">\r\n            <tr *ngIf=\"isSameDates\">\r\n              <td class=\"buttonItem\">&nbsp;</td>\r\n              <td class=\"inputItem\">\r\n                <md-input-container>\r\n                  <input mdInput type=\"number\" placeholder=\"Unopened Packs\" #unopenedPack />\r\n                </md-input-container>\r\n              </td>\r\n              <td class=\"inputItem\" colspan=\"2\">\r\n                <md-input-container>\r\n                  <input mdInput type=\"text\" class=\"pnc\" placeholder=\"Product name/code\" [mdAutocomplete]=\"auto\"\r\n                    [formControl]=\"productNameCodeCtrl\" #autoNameCode (focus)=\"showProductList()\" />\r\n                  <md-autocomplete #auto=\"mdAutocomplete\">\r\n                    <md-option *ngFor=\"let nameCode of filteredNameCode | async\" [value]=\"nameCode\">\r\n                      {{nameCode}}\r\n                    </md-option>\r\n                  </md-autocomplete>\r\n                </md-input-container>\r\n              </td>\r\n              <td style=\"min-width: 80px !important;\" class=\"column\">\r\n              </td>\r\n            </tr>\r\n          </table>\r\n        </md-card-content>\r\n      </md-card>\r\n    </md-card-content>\r\n    <md-card-content>\r\n      <div *ngIf=\"!isFinalized\">\r\n        <button md-raised-button class=\"ButtonStyle\" *ngIf=\"isSameDates\" [disabled]=\"submitDisability()\"\r\n          (click)=\"isUpdateMode ? enableEditMode() : submitInventories()\">{{isUpdateMode ? 'Update' : 'Submit'}}</button>\r\n      </div>\r\n    </md-card-content>\r\n  </md-card>\r\n</md-card>\r\n"

/***/ }),

/***/ 808:
/***/ (function(module, exports) {

module.exports = "<md-card style=\"margin:16px !important; padding: 24px 16px !important;\">\r\n  <md-card-title>Login</md-card-title>\r\n  <md-card-content>\r\n    <md-input-container>\r\n      <input mdInput focus placeholder=\"Username\" [(ngModel)]=\"username\" (change)=\"onChange()\">\r\n    </md-input-container>\r\n    <md-input-container>\r\n      <input mdInput placeholder=\"Password\" type=\"password\" [(ngModel)]=\"password\" (change)=\"onChange()\" (keydown)=\"ifEnterLogin($event)\">\r\n    </md-input-container>\r\n  </md-card-content>\r\n  <md-card-actions>\r\n    <button md-mini-fab [disabled]=\"!loginEnabled\" (click)=\"userLogin()\" color=\"primary\" title=\"Login\">\r\n      <md-icon fontSet=\"fa\" fontIcon=\"fa-arrow-right\"></md-icon>\r\n    </button>\r\n  </md-card-actions>\r\n</md-card>\r\n"

/***/ }),

/***/ 809:
/***/ (function(module, exports) {

module.exports = "<md-toolbar color=\"primary\" style=\"font-weight:200;font-size:100%; overflow: hidden;max-width:100vw\">\r\n  <span><a style=\"font-size:120%\" class=\"toolbar\" [routerLink]=\"['']\">Siirgista Internal Delivery</a></span>\r\n  <div style=\"margin: 20px;\">\r\n    {{currentDate | date:'yyyy-MM-dd HH-mm-ss'}}\r\n  </div>\r\n  <span class=\"fill-remaining-space\"></span>\r\n  <span *ngIf=\"!auth\"><a  class=\"toolbar\" [routerLink]=\"['login']\"><span class=\"fa fa-sign-in\"></span> Login</a></span>\r\n  <span *ngIf=\"auth\"><a  class=\"toolbar\" (click)=\"logout()\">{{user}} <i class=\"fa fa-sign-out\"></i> Logout</a></span>\r\n  <span *ngIf=\"auth\" class=\"hidden-mobile\" style=\"margin-left:20px\">{{remainedTime}}</span>\r\n</md-toolbar>\r\n<nav *ngIf=\"auth\" class=\"hidden-mobile\" md-tab-nav-bar>\r\n  <a md-tab-link *ngIf=\"isAdmin\" [routerLink]=\"['units']\" routerLinkActive #unitsLink=\"routerLinkActive\" [active]=\"unitsLink.isActive\">Units</a>\r\n  <a md-tab-link *ngIf=\"isAdmin\" [routerLink]=\"['products']\" routerLinkActive #productsLink=\"routerLinkActive\" [active]=\"productsLink.isActive\">Products</a>\r\n  <a md-tab-link *ngIf=\"isAdmin\" [routerLink]=\"['override']\" routerLinkActive #overrideLink=\"routerLinkActive\" [active]=\"overrideLink.isActive\">Override Rules</a>\r\n  <a md-tab-link *ngIf=\"isBranch\" [routerLink]=\"['inventory']\" routerLinkActive #inventoryLink=\"routerLinkActive\" [active]=\"inventoryLink.isActive\">Inventory</a>\r\n  <a md-tab-link *ngIf=\"isPrep\" [routerLink]=\"['delivery']\" routerLinkActive #deliveryLink=\"routerLinkActive\" [active]=\"deliveryLink.isActive\">Delivery</a>\r\n  <a md-tab-link *ngIf=\"isAdmin\" [routerLink]=\"['reports']\" routerLinkActive #reportsLink=\"routerLinkActive\" [active]=\"reportsLink.isActive\">Reports</a>\r\n</nav>\r\n"

/***/ }),

/***/ 810:
/***/ (function(module, exports) {

module.exports = "<md-card style=\"background-color: #607D8B; border-radius: 7px; text-align: left; margin: 10px;\">\r\n  <md-card-title class=\"cardTitle\">Inventory Rules Overrides</md-card-title>\r\n  <div *ngIf=\"!isAdmin\">\r\n    <md-card\r\n      [ngClass]=\"[(isFiltered && filteredProductModel._product.isOverridden) ? 'innerCardOverride' : 'innerCard']\">\r\n      <md-card-content>\r\n        <md-input-container style=\"width: 100%;\">\r\n          <input mdInput focus type=\"text\" class=\"pnc\" placeholder=\"Product name/code\"\r\n                 [mdAutocomplete]=\"auto\" [formControl]=\"productModelCtrl\" #autoNameCode/>\r\n          <md-autocomplete #auto=\"mdAutocomplete\">\r\n            <md-option *ngFor=\"let nameCode of filteredNameCode | async\" [value]=\"nameCode\">\r\n              {{nameCode}}\r\n            </md-option>\r\n          </md-autocomplete>\r\n        </md-input-container>\r\n      </md-card-content>\r\n      <app-counting-rule *ngIf=\"isFiltered\"\r\n                         [isOverridden]=\"true\"\r\n                         [(minQty)]=\"filteredProductModel._product.minQty\"\r\n                         [(maxQty)]=\"filteredProductModel._product.maxQty\"\r\n                         [(coefficients)]=\"filteredProductModel._product.coefficients\"\r\n                         [(recursionRule)]=\"filteredProductModel._product.countingRecursion\"\r\n                         (hasError)=\"countingRuleErrorHandler($event)\"\r\n                         (changed)=\"checkDisabilityStatus()\">\r\n      </app-counting-rule>\r\n    </md-card>\r\n  </div>\r\n  <div>\r\n    <md-card class=\"mat-card\" style=\"width:210px; margin-bottom:10px;padding:5px; border-radius:25px;\">\r\n      <md-radio-group [(ngModel)]=\"is_kitchen\" (change)=\"changeFilter()\">\r\n        <md-radio-button style=\"padding: 0 10px;\" [value]=\"false\">Front</md-radio-button>\r\n        <md-radio-button style=\"padding: 0 10px;\" [value]=\"true\">Kitchen</md-radio-button>\r\n      </md-radio-group>\r\n    </md-card>\r\n  </div>\r\n  <md-tab-group *ngIf=\"isAdmin\" class=\"materialTab\" [(selectedIndex)]=\"selectedIndex\" (selectChange)=\"changedTab()\">\r\n    <md-tab *ngFor=\"let branch of branchList\" label=\"{{branch.name}}\">\r\n      <md-card\r\n        [ngClass]=\"[(isFiltered && filteredProductModel._product.isOverridden) ? 'innerCardOverride' : 'innerCard']\">\r\n        <md-card-content>\r\n          <md-input-container style=\"width: 100%;\">\r\n            <input mdInput type=\"text\" class=\"pnc\" placeholder=\"Product name/code\"\r\n                   [mdAutocomplete]=\"auto\" [formControl]=\"productModelCtrl\"\r\n                   (focus)=\"showProductList($event)\" #autoNameCode/>\r\n            <md-autocomplete #auto=\"mdAutocomplete\">\r\n              <md-option *ngFor=\"let nameCode of filteredNameCode | async\" [value]=\"nameCode\">\r\n                {{nameCode}}\r\n              </md-option>\r\n            </md-autocomplete>\r\n          </md-input-container>\r\n        </md-card-content>\r\n        <app-counting-rule *ngIf=\"isFiltered\"\r\n                           [isOverridden]=\"true\"\r\n                           [(minQty)]=\"filteredProductModel._product.minQty\"\r\n                           [(maxQty)]=\"filteredProductModel._product.maxQty\"\r\n                           [(coefficients)]=\"filteredProductModel._product.coefficients\"\r\n                           [(recursionRule)]=\"filteredProductModel._product.countingRecursion\"\r\n                           (hasError)=\"countingRuleErrorHandler($event)\"\r\n                           (changed)=\"checkDisabilityStatus()\">\r\n        </app-counting-rule>\r\n      </md-card>\r\n    </md-tab>\r\n  </md-tab-group>\r\n  <br/>\r\n  <md-card-content>\r\n    <button md-raised-button *ngIf=\"isFiltered && !filteredProductModel._product.isOverridden\"\r\n            class=\"ButtonStyle addBtn\" (click)=\"doClickedAction(ae.add)\" [(disabled)]=\"addIsDisable\">Add\r\n    </button>\r\n    <button md-raised-button *ngIf=\"isFiltered && filteredProductModel._product.isOverridden\"\r\n            class=\"ButtonStyle updateBtn\" (click)=\"doClickedAction(ae.update)\" [(disabled)]=\"updateIsDisable\">Update\r\n    </button>\r\n    <button md-raised-button *ngIf=\"isFiltered && filteredProductModel._product.isOverridden\"\r\n            class=\"ButtonStyle deleteBtn\" (click)=\"doClickedAction(ae.delete)\" [(disabled)]=\"deleteIsDisable\">Delete\r\n    </button>\r\n  </md-card-content>\r\n</md-card>\r\n"

/***/ }),

/***/ 811:
/***/ (function(module, exports) {

module.exports = "<div class=\"flex-container\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\r\n  <div class=\"flex-item title\" fxFlex=\"80\">Siirgista Bros - {{unitName_title}}</div>\r\n  <div style=\"float: right;\" class=\"flex-item subtitle\" fxFlex=\"20\">{{currentDate | date: 'dd MMMM yyyy'}}</div>\r\n</div>\r\n<div class=\"title\" style=\"font-weight: bold\">{{unitName_subTitle}} Delivery Note</div>\r\n\r\n<div *ngIf=\"!isOverallPrint\">\r\n  <table class=\"table\">\r\n    <thead class=\"titleBox\">\r\n      <tr>\r\n      <td>#</td>\r\n      <td>Product Code</td>\r\n      <td>Product Name</td>\r\n      <td>Real Delivery</td>\r\n      <td>Current Stock</td>\r\n      <td>Stock After Delivery</td>\r\n      <td>Min Delivery</td>\r\n      <td>Days to Next Counting</td>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let item of itemList;let i=index\">\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{i + 1}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.productCode}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.productName}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.realDelivery}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.currentStock===null ? 'NA' : item.currentStock}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.stockAfterDelivery}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.minDelivery}}</td>\r\n      <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.daysToNext}}</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>\r\n<div *ngIf=\"isOverallPrint\">\r\n  <table class=\"table\">\r\n    <thead class=\"titleBox\">\r\n      <tr>\r\n        <td>#</td>\r\n        <td>Product Code</td>\r\n        <td>Product Name</td>\r\n        <td>Total Delivery</td>\r\n        <td *ngFor=\"let rcvName of receivers\">{{rcvName}}</td>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngFor=\"let item of itemList;let i = index\">\r\n        <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{i + 1}}</td>\r\n        <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.productCode}}</td>\r\n        <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.productName}}</td>\r\n        <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\">{{item.totalDelivery}}</td>\r\n        <td class=\"box\" [style.background]=\"i%2 ? 'silver' : 'unset'\" *ngFor=\"let rcvName of receivers\">{{item[rcvName]}}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</div>\r\n<br/>\r\n<!--<div style=\"color: darkred\" *ngIf=\"showWarningMessage\">-->\r\n  <!--<div>-->\r\n    <!--<label>Warning: Hitting print button will finalised delivery numbers.</label>-->\r\n  <!--</div>-->\r\n  <!--<div>-->\r\n    <!--<label>Please make sure all values are correct</label>-->\r\n  <!--</div>-->\r\n<!--</div>-->\r\n<br/>\r\n<div>\r\n  <button md-raised-button class=\"ButtonStyle\" (click)=\"dialogRef.close('print')\">Print</button>\r\n  <button md-raised-button class=\"ButtonStyle\" (click)=\"dialogRef.close('cancel')\">Cancel</button>\r\n</div>\r\n"

/***/ }),

/***/ 812:
/***/ (function(module, exports) {

module.exports = "<md-card style=\"background-color: #607D8B; border-radius: 7px; text-align: left; margin: 10px;\">\r\n <md-card-title class=\"cardTitle\">Products</md-card-title>\r\n  <md-tab-group class=\"materialTab\" [selectedIndex]=\"selectedIndex\">\r\n    <md-tab label=\"Add\">\r\n      <md-card class=\"innerCard\">\r\n        <app-product-sub-form [isAdd]=\"true\" [isAdding]=\"isAdding\" [actionIsSuccess]=\"actionIsSuccess\" (action)=\"doClickedAction($event)\"></app-product-sub-form>\r\n      </md-card>\r\n    </md-tab>\r\n    <md-tab label=\"Modify\">\r\n      <md-card class=\"innerCard\">\r\n        <md-card-content>\r\n          <md-grid-list cols=\"3\" rowHeight=\"50px\">\r\n            <md-grid-tile colspan=\"2\" style=\"margin-right: 5px;\">\r\n              <md-input-container style=\"width: 100%;\">\r\n                <input mdInput type=\"text\" class=\"pnc\" placeholder=\"Product name\"\r\n                       [mdAutocomplete]=\"autoName\" [formControl]=\"productModelCtrlName\"\r\n                       #autoNameInput (focus)=\"showProductList($event, 'name')\"/>\r\n                <md-autocomplete #autoName=\"mdAutocomplete\">\r\n                  <md-option *ngFor=\"let name of filteredName | async\" [value]=\"name\">\r\n                    {{name}}\r\n                  </md-option>\r\n                </md-autocomplete>\r\n              </md-input-container>\r\n            </md-grid-tile>\r\n            <md-grid-tile colspan=\"1\" style=\"margin-left: 5px;\">\r\n              <md-input-container style=\"width: 100%\">\r\n                <input mdInput type=\"text\" class=\"pnc\" placeholder=\"Product code\"\r\n                       [mdAutocomplete]=\"autoCode\" [formControl]=\"productModelCtrlCode\"\r\n                       #autoCodeInput (focus)=\"showProductList($event, 'code')\"/>\r\n                <md-autocomplete #autoCode=\"mdAutocomplete\">\r\n                  <md-option *ngFor=\"let code of filteredCode | async\" [value]=\"code\">\r\n                    {{code}}\r\n                  </md-option>\r\n                </md-autocomplete>\r\n              </md-input-container>\r\n            </md-grid-tile>\r\n          </md-grid-list>\r\n        </md-card-content>\r\n        <app-product-sub-form *ngIf=\"isFiltered\" [isAdd]=\"false\" [actionIsSuccess]=\"actionIsSuccess\" [productModel]=\"filteredProductModel\" (action)=\"doClickedAction($event)\"></app-product-sub-form>\r\n      </md-card>\r\n    </md-tab>\r\n  </md-tab-group>\r\n</md-card>\r\n"

/***/ }),

/***/ 813:
/***/ (function(module, exports) {

module.exports = "<span class=\"FormTitleStyle\">{{formTitle}}</span>\r\n<md-card>\r\n  <div class=\"flex-container\" fxLayout=\"column\" fxLayoutAlign=\"left top\">\r\n    <div class=\"flex-item\" fxFlex=\"20%\">\r\n      <md-card-content>\r\n        <md-input-container>\r\n          <input mdInput type=\"text\" class=\"name\" placeholder=\"Name\" [(ngModel)]=\"product.name\" (keyup)=\"disabilityStatus()\"/>\r\n        </md-input-container>\r\n        <md-input-container>\r\n          <input mdInput type=\"text\" class=\"code\" placeholder=\"Code\" [(ngModel)]=\"product.code\" (keyup)=\"disabilityStatus()\"/>\r\n        </md-input-container>\r\n        <md-input-container>\r\n          <input mdInput type=\"number\" class=\"size\" placeholder=\"size\" [(ngModel)]=\"product.size\" (keyup)=\"disabilityStatus()\"/>\r\n        </md-input-container>\r\n        <md-select placeholder=\"Measuring Units\" class=\"measuringUnit\" [(ngModel)]=\"product.measuringUnit\" (change)=\"disabilityStatus()\">\r\n          <md-option *ngFor=\"let mu of measuringUnits\" [value]=\"mu\">{{mu}}</md-option>\r\n        </md-select>\r\n        <md-input-container>\r\n          <input mdInput type=\"number\" class=\"size\" placeholder=\"Price (£)\" [(ngModel)]=\"product.price\" (keyup)=\"disabilityStatus()\"/>\r\n        </md-input-container>\r\n        <div>\r\n          <span>Preparation Unit</span>\r\n          <md-radio-group class=\"prepUnitId\" [(ngModel)]=\"product.prep_unit_id\" (change)=\"disabilityStatus()\">\r\n            <div *ngFor=\"let pu of prepUnits\">\r\n              <md-radio-button [value]=\"pu.id\">{{pu.name}}</md-radio-button>\r\n              <br/>\r\n            </div>\r\n          </md-radio-group>\r\n        </div>\r\n      </md-card-content>\r\n    </div>\r\n    <div class=\"flex-item\" fxFlex=\"70%\">\r\n      <md-card-content *ngIf=\"hasCountingRuleError\">\r\n        <label class=\"errorMessage\">{{countingRuleError}}</label>\r\n      </md-card-content>\r\n      <md-card-content>\r\n        <app-counting-rule [(coefficients)]=\"product.coefficients\"\r\n                           [(minQty)]=\"product.minQty\"\r\n                           [(maxQty)]=\"product.maxQty\"\r\n                           [(recursionRule)]=\"product.countingRecursion\"\r\n                           (hasError)=\"countingRuleErrorHandler($event)\"></app-counting-rule>\r\n      </md-card-content>\r\n    </div>\r\n    <div class=\"flex-item\" fxFlex=\"10%\">\r\n      <md-card-content>\r\n        <button md-raised-button *ngIf=\"isAdd\" class=\"ButtonStyle addBtn\" (click)=\"actionEmitter(ae.add)\" [(disabled)]=\"addIsDisable\" id=\"addBtn\">Add</button>\r\n        <button md-raised-button *ngIf=\"!isAdd\" class=\"ButtonStyle updateBtn\" (click)=\"actionEmitter(ae.update)\" [(disabled)]=\"updateIsDisable\" id=\"updateBtn\">Update</button>\r\n        <button md-raised-button *ngIf=\"!isAdd\" class=\"ButtonStyle deleteBtn\" (click)=\"actionEmitter(ae.delete)\" [(disabled)]= \"deleteIsDisable\" id=\"deleteBtn\">Delete</button>\r\n      </md-card-content>\r\n    </div>\r\n  </div>\r\n</md-card>\r\n<br/>\r\n"

/***/ }),

/***/ 814:
/***/ (function(module, exports) {

module.exports = "<md-card class=\"outerCard\">\r\n  <md-card-title class=\"cardTitle\">Reports</md-card-title>\r\n  <md-card class=\"innerCard\" style=\"margin: 15px\">\r\n    <div>\r\n      <md-card-title style=\"font-size:125%;font-weight: 600\">Delivery Report</md-card-title>\r\n    </div>\r\n    <md-card-content class=\"mat-card\">\r\n    <div fxLayout.xs=\"column\" fxLayout.sm=\"column\" fxLayout=\"row\" style=\"padding-top:30px\">\r\n      <div fxFlex=\"50\">\r\n        <md-select placeholder=\"Branch\" style=\"width:300px\" [(ngModel)]=\"branchIdForDeliveryReport\">\r\n          <md-option *ngFor=\"let branch of branches\" [value]=\"branch.id\">{{branch.name}}</md-option>\r\n        </md-select>\r\n      </div>\r\n\r\n      <div fxFlex=\"25\" style=\"padding:5px 0\">\r\n        <label for=\"start-range-input\">Start of period:</label>\r\n        <material-datepicker class=\"flex-item\" placeholder=\"Start of period\" [(date)]=\"startDate\" id=\"start-range-input\" (dateChange)=\"checkDisabilityStatus()\">\r\n        </material-datepicker>\r\n      </div>\r\n      <div fxFlex=\"25\"  style=\"padding:5px 0\">\r\n        <label for=\"start-range-input\">End of period:</label>\r\n        <material-datepicker class=\"flex-item\" placeholder=\"End of period\" [(date)]=\"endDate\" id=\"end-range-input\" (dateChange)=\"checkDisabilityStatus()\">\r\n        </material-datepicker>\r\n      </div>\r\n    </div>\r\n    </md-card-content>\r\n    <md-card-actions style=\"text-align: right\">\r\n        <button md-raised-button (click)=\"prepareDeliveryReport()\" [disabled]=\"deliveryReportBtnDisabled\">\r\n          <i class=\"fa fa-download\" aria-hidden=\"true\"></i> Download\r\n        </button>\r\n    </md-card-actions>\r\n  </md-card>\r\n  <md-card class=\"innerCard\" style=\"margin: 15px\">\r\n    <md-card-title style=\"font-size:125%;font-weight: 600\">Products Report</md-card-title>\r\n    <md-card-content class=\"mat-card\">\r\n    <div fxLayout.xs=\"column\" fxLayout.sm=\"column\" fxLayout=\"row\" style=\"padding-top:30px\">\r\n      <div fxFlex=\"50\">\r\n        <md-select placeholder=\"Branch\" style=\"width:300px\" [(ngModel)]=\"branchIdForProductReport\">\r\n          <md-option *ngFor=\"let branch of branches\" [value]=\"branch.id\">{{branch.name}}</md-option>\r\n        </md-select>\r\n      </div>\r\n    </div>\r\n      </md-card-content>\r\n      <md-card-actions style=\"text-align: right\">\r\n        <button md-raised-button (click)=\"loadDataForProductsReport()\">\r\n          <i class=\"fa fa-download\" aria-hidden=\"true\"></i> Download\r\n        </button>\r\n      </md-card-actions>\r\n  </md-card>\r\n  <md-card class=\"innerCard\" style=\"margin: 15px\">\r\n    <md-card-title style=\"font-size:125%;font-weight: 600\">Inventory Counting Report</md-card-title>\r\n    <md-card-content  class=\"mat-card\">\r\n    <div fxLayout.xs=\"column\" fxLayout.sm=\"column\" fxLayout=\"row\" style=\"padding-top:30px\">\r\n      <div fxFlex=\"50\">\r\n        <md-select placeholder=\"Branch\" style=\"width:300px\" [(ngModel)]=\"branchIdForInventoryReport\" (change)=\"checkDisabilityStatus()\">\r\n          <md-option *ngFor=\"let branch of branchesWithoutAllOption\" [value]=\"branch.id\">{{branch.name}}</md-option>\r\n        </md-select>\r\n      </div>\r\n    </div>\r\n    </md-card-content>\r\n      <md-card-actions style=\"text-align: right\">\r\n        <button md-raised-button (click)=\"prepareInventoryCountingReport()\" [disabled]=\"inventoryReportBtnDisabled\">\r\n          <i class=\"fa fa-download\" aria-hidden=\"true\"></i> Download\r\n        </button>\r\n      </md-card-actions>\r\n  </md-card>\r\n</md-card>\r\n"

/***/ }),

/***/ 815:
/***/ (function(module, exports) {

module.exports = "<md-card>\r\n  <md-card-title>\r\n  Days {{reverse?'remained to month-end':'past from month'}}\r\n  </md-card-title>\r\n  <md-card-content>\r\n    <md-button-toggle-group *ngFor=\"let row of calDays;let i=index\" multiple [vertical]=\"true\">\r\n      <md-button-toggle *ngFor=\"let day of row\" [value]=\"day\" (change)=\"monthDaysChange($event)\" [checked]=\"days.indexOf(reverse?day+1:day)!==-1\">{{day}}</md-button-toggle>\r\n    </md-button-toggle-group>\r\n  </md-card-content>\r\n</md-card>\r\n"

/***/ }),

/***/ 816:
/***/ (function(module, exports) {

module.exports = "<md-input-container>\r\n  <input mdInput type=\"number\" placeholder=\"Interval\" [(ngModel)]=\"options.interval\" (ngModelChange)=\"onChange()\"\r\n         min=\"1\">\r\n  <md-hint>{{options.freq ? 'Every' : 'Never'}} {{options.freq && options.interval>1?options.interval:''}}\r\n    {{freqsName[freqsConst.indexOf(options.freq)]}}{{options.interval>1?'s':''}}\r\n  </md-hint>\r\n</md-input-container><br/>\r\n<md-button-toggle-group [(ngModel)]=\"freq\" [vertical]=\"true\" (ngModelChange)=\"onChange()\">\r\n  <md-button-toggle *ngFor=\"let f of freqs;let i = index;\" [value]=\"freqsConst[i]\">\r\n    {{f}}\r\n  </md-button-toggle>\r\n</md-button-toggle-group>\r\n<span *ngIf=\"showMonthOptions\">\r\n<md-button-toggle-group [(ngModel)]=\"monthlyInputMode\" [vertical]=\"true\" (ngModelChange)=\"onMonthlyInputModeChange($event)\">\r\n  <md-button-toggle [value]=\"'week'\">\r\n    By Weekdays\r\n  </md-button-toggle>\r\n  <md-button-toggle [value]=\"'month'\">\r\n    By Month Days\r\n  </md-button-toggle>\r\n</md-button-toggle-group>\r\n   <span *ngIf=\"monthlyInputMode==='month'\">\r\n<md-button-toggle-group multiple [vertical]=\"true\">\r\n  <md-button-toggle value=\"past\" (change)=\"monthDaysPastOrRemainedChange($event)\"\r\n                    [checked]=\"monthDaysOption.indexOf('past')!==-1\">\r\n    Days Past\r\n  </md-button-toggle>\r\n  <md-button-toggle value=\"remained\" (change)=\"monthDaysPastOrRemainedChange($event)\"\r\n                    [checked]=\"monthDaysOption.indexOf('remained')!==-1\">\r\n    Days Remained\r\n  </md-button-toggle>\r\n</md-button-toggle-group>\r\n<app-monthday *ngIf=\"showMonthDaysPast\" [days]=\"monthDaysPast\" (daysChange)=\"monthDaysPastChange($event)\"></app-monthday>\r\n<app-monthday *ngIf=\"showMonthDaysRemained\" [reverse]=\"true\" [days]=\"monthDaysRemained\"\r\n              (daysChange)=\"monthDaysRemainedChange($event)\"></app-monthday>\r\n</span>\r\n<md-button-toggle-group *ngIf=\"monthlyInputMode==='week'\" multiple [vertical]=\"true\">\r\n  <md-button-toggle *ngFor=\"let pos of weekpos;let i=index\" [value]=\"pos\" [checked]=\"bysetpos.indexOf(pos)!==-1\"\r\n                    (change)=\"weekposChange($event)\">{{weekposName[i]}}</md-button-toggle>\r\n</md-button-toggle-group>\r\n  </span>\r\n<md-button-toggle-group *ngIf=\"showWeekdays\" multiple [vertical]=\"true\">\r\n  <md-button-toggle *ngFor=\"let weekday of weekdays;let i = index;\" [value]=\"weekdaysConst[i]\"\r\n                    [checked]=\"byweekday.indexOf(weekdaysConst[i])!==-1\" (change)=\"byweekdayChange($event)\">\r\n    {{weekday}}\r\n  </md-button-toggle>\r\n</md-button-toggle-group>\r\n<h4>Next occurrences</h4>\r\n<pre>{{text}}</pre>\r\n"

/***/ }),

/***/ 817:
/***/ (function(module, exports) {

module.exports = "<span class=\"FormTitleStyle\">{{formTitle}}</span>\r\n<md-card>\r\n  <md-radio-group class=\"RadioButtonStyle\" [(ngModel)]=\"unit.is_branch\" id=\"isBranch\" (change)=\"disabilityStatus()\">\r\n    <md-radio-button [value]=\"true\">Branch</md-radio-button>\r\n    <md-radio-button [value]=\"false\">Prep Unit</md-radio-button>\r\n  </md-radio-group>\r\n  <br>\r\n  <md-radio-group *ngIf=\"unit.is_branch !== null && unit.is_branch\" class=\"RadioButtonStyle\" [(ngModel)]=\"unit.is_kitchen\" id=\"isKitchen\" (change)=\"disabilityStatus()\">\r\n    <md-radio-button [value]=\"false\">Front</md-radio-button>\r\n    <md-radio-button [value]=\"true\">Kitchen</md-radio-button>\r\n  </md-radio-group>\r\n  <md-radio-group *ngIf=\"unit.is_branch !== null &&!unit.is_branch\" class=\"RadioButtonStyle\" [(ngModel)]=\"unit.is_kitchen\" id=\"isKitchen2\" (change)=\"disabilityStatus()\">\r\n    <md-radio-button [value]=\"false\">Main Depot</md-radio-button>\r\n    <md-radio-button [value]=\"true\">Prep Kitchen</md-radio-button>\r\n  </md-radio-group>\r\n  <br>\r\n  <md-input-container>\r\n    <input mdInput placeholder=\"Unit Name\" type=\"text\" (keyup)=\"disabilityStatus()\" [(ngModel)]=\"unit.name\" class=\"name\"/>\r\n  </md-input-container>\r\n  <md-input-container>\r\n\r\n    <input mdInput autocomplete=\"off\" placeholder=\"Admin Username\" type=\"text\" (keyup)=\"disabilityStatus()\" [(ngModel)]=\"unit.username\" class=\"username\"/>\r\n  </md-input-container>\r\n  <br>\r\n  <md-input-container >\r\n    <input mdInput autocomplete=\"off\" placeholder=\"Admin Password\" type=\"password\" (keyup)=\"disabilityStatus()\" [(ngModel)]=\"unit.password\" class=\"password\"/>\r\n  </md-input-container>\r\n  <br>\r\n    <button md-raised-button *ngIf=\"isAdd\" class=\"ButtonStyle\" (click)=\"actionEmitter(ae.add)\" [(disabled)]=\"addIsDisable\" class=\"addBtn\">Add</button>\r\n    <button md-raised-button *ngIf=\"!isAdd\" class=\"ButtonStyle\" (click)=\"actionEmitter(ae.update)\" [(disabled)]=\"updateIsDisable\" class=\"updateBtn\">Update</button>\r\n    <button md-raised-button *ngIf=\"!isAdd\" class=\"ButtonStyle\" (click)=\"actionEmitter(ae.delete)\" [(disabled)]= \"deleteIsDisable\" class=\"deleteBtn\">Delete</button>\r\n</md-card>\r\n"

/***/ }),

/***/ 818:
/***/ (function(module, exports) {

module.exports = "<md-card class=\"outerCard\">\r\n  <md-card-title class=\"cardTitle\">Branches and Preparation Units</md-card-title>\r\n  <md-card class=\"innerCard\">\r\n    <app-sub-form [isAdd]=\"true\" [isAdding]=\"isAdding\" [actionIsSuccess]=\"actionIsSuccess\" (action)=\"doClickedAction($event)\"></app-sub-form>\r\n    <app-sub-form *ngFor=\"let um of unitModels\" [isAdd]=\"false\" [actionIsSuccess]=\"actionIsSuccess\" [unitModel]=\"um\" (action)=\"doClickedAction($event)\"></app-sub-form>\r\n  </md-card>\r\n</md-card>\r\n"

/***/ }),

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ActionEnum;
(function (ActionEnum) {
    ActionEnum[ActionEnum["add"] = 0] = "add";
    ActionEnum[ActionEnum["update"] = 1] = "update";
    ActionEnum[ActionEnum["delete"] = 2] = "delete";
})(ActionEnum = exports.ActionEnum || (exports.ActionEnum = {}));
//# sourceMappingURL=C:/Users/305-2/Desktop/burgista/burgista-delivery-client/src/actionEnum.js.map

/***/ })

},[1083]);
//# sourceMappingURL=main.bundle.js.map