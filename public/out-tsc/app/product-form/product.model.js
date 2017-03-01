"use strict";
var product_1 = require('./product');
var rxjs_1 = require("rxjs");
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
        this._product.code = product.code;
        this._product.size = product.size;
        this._product.measuringUnit = product.measuringUnit;
        this._product.prep_unit_id = product.prep_unit_id;
        this._product.minQty = product.minQty;
        this._product.maxQty = product.maxQty;
        for (var day in product.coefficients)
            this._product.coefficients[day] = product.coefficients[day];
        this._product.countingRecursion = product.countingRecursion;
    }
    ProductModel.prototype.isDifferent = function (product) {
        for (var prop in product) {
            if (prop === 'coefficients') {
                for (var day in product.coefficients) {
                    if (this._product.coefficients[day] !== product.coefficients[day])
                        return true;
                }
            }
            else if (this._product[prop] !== product[prop])
                return true;
        }
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
        if (this._product == null)
            this._product = new product_1.Product();
        this._product.isOverridden = product.isOverridden;
        this._product.id = product.id;
        this._product.name = product.name;
        this._product.code = product.code;
        this._product.size = product.size;
        this._product.measuringUnit = product.measuringUnit;
        this._product.prep_unit_id = product.prep_unit_id;
        this._product.minQty = product.minQty;
        this._product.maxQty = product.maxQty;
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
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/product-form/product.model.js.map