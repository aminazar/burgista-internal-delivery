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
var rxjs_1 = require("rxjs");
var unit_model_1 = require("./unit.model");
var actionEnum_1 = require("./actionEnum");
var unit_1 = require("./unit");
var rest_service_1 = require("../rest.service");
var message_service_1 = require("../message.service");
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
    UnitFormComponent = __decorate([
        core_1.Component({
            selector: 'app-unit-form',
            templateUrl: './unit-form.component.html',
            styleUrls: ['./unit-form.component.css']
        }), 
        __metadata('design:paramtypes', [rest_service_1.RestService, message_service_1.MessageService])
    ], UnitFormComponent);
    return UnitFormComponent;
}());
exports.UnitFormComponent = UnitFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/unit-form/unit-form.component.js.map