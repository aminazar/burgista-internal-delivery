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
var rxjs_1 = require("rxjs");
var actionEnum_1 = require("./actionEnum");
var unit_1 = require("./unit");
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
    __metadata("design:type", rxjs_1.Observable)
], SubFormComponent.prototype, "actionIsSuccess", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SubFormComponent.prototype, "action", void 0);
SubFormComponent = __decorate([
    core_1.Component({
        selector: 'app-sub-form',
        templateUrl: './sub-form.component.html',
        styleUrls: ['./sub-form.component.css']
    }),
    __metadata("design:paramtypes", [])
], SubFormComponent);
exports.SubFormComponent = SubFormComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/unit-form/sub-form.component.js.map