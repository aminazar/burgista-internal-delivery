"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inventory_1 = require("./inventory");
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
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/inventory-form/inventory.model.js.map