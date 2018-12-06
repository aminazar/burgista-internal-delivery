"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delivery_1 = require("./delivery");
var DeliveryModel = (function () {
    function DeliveryModel(unitName) {
        this._deliveries = [];
        this._unitName = '';
        this._shouldDisabled = false;
        this._isSubmitted = false;
        this._isPrinted = false;
        this._unitName = unitName;
    }
    DeliveryModel.prototype.add = function (delivery) {
        var tempDelivery = new delivery_1.Delivery();
        for (var prop in delivery) {
            tempDelivery[prop] = delivery[prop];
        }
        this._deliveries.push(tempDelivery);
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
    return DeliveryModel;
}());
exports.DeliveryModel = DeliveryModel;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/delivery-form/delivery.model.js.map