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
        templateUrl: './monthday.component.html',
        styleUrls: ['./monthday.component.css']
    }),
    __metadata("design:paramtypes", [])
], MonthdayComponent);
exports.MonthdayComponent = MonthdayComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rrule/monthday.component.js.map