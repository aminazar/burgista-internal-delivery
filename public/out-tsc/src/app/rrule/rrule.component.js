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
var rrule_1 = require("rrule");
var moment = require("moment");
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
        templateUrl: './rrule.component.html',
        styleUrls: ['./rrule.component.css']
    }),
    __metadata("design:paramtypes", [])
], RRuleComponent);
exports.RRuleComponent = RRuleComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/rrule/rrule.component.js.map