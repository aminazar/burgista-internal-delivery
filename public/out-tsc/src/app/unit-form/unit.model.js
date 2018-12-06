"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unit_1 = require("./unit");
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
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/unit-form/unit.model.js.map