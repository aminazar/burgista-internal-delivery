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
var Rrule = require('rrule');
var moment = require('moment');
var RRuleComponent = (function () {
    function RRuleComponent() {
        this.RRuleStrChange = new core_1.EventEmitter();
        this.freqs = ['Daily', 'Weekly', 'Monthly'];
        this.freqsConst = [Rrule.DAILY, Rrule.WEEKLY, Rrule.MONTHLY];
        this.freqsName = ['day', 'week', 'month'];
        this.weekdays = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
        this.weekdaysConst = [Rrule.MO, Rrule.TU, Rrule.WE, Rrule.TH, Rrule.FR, Rrule.SA, Rrule.SU];
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
        this.rule = Rrule.fromString(this.RRuleStr);
        this.options = this.rule.options;
        if (this.options.bysetpos)
            this.bysetpos = this.options.bysetpos;
        if (this.options.bymonthday)
            this.bymonthday = this.options.bymonthday;
        if (this.options.byweekday && this.options.byweekday.length)
            this.byweekday = this.options.byweekday.map(function (r) { return _this.weekdaysConst[r]; });
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
            if (this.options.freq === Rrule.DAILY) {
                delete this.options.byweekday;
                delete this.options.bysetpos;
                this.bysetpos = [];
                this.byweekday = [];
                delete this.options.bymonthday;
                this.bymonthday = [];
                this.monthDaysPast = [];
                this.monthDaysRemained = [];
            }
            else if (this.options.freq === Rrule.WEEKLY) {
                delete this.options.bysetpos;
                this.bysetpos = [];
                delete this.options.bymonthday;
                this.bymonthday = [];
                this.monthDaysPast = [];
                this.monthDaysRemained = [];
            }
            else
                this.onMonthlyInputModeChange(this.monthlyInputMode);
            this.showWeekdays = this.options.freq === Rrule.WEEKLY;
            this.showMonthOptions = this.options.freq === Rrule.MONTHLY;
            this.calcPastOrRemained();
            if (!this.showWeekdays)
                this.options.byweekday = [];
            this.emitChange();
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
        for (var key in this.options)
            if (!this.options[key] || this.options[key].length === 0 || ['bynmonthday', 'bynweeday', 'bynsetpos', 'byhour', 'byminute', 'bysecond'].indexOf(key) !== -1)
                delete this.options[key];
        this.rule = new Rrule(this.options);
        if (this.rule.options.freq) {
            var d = new Date();
            var d2 = moment(d).add(366, 'd').toDate();
            this.text = this.rule.between(d, d2).map(function (r) { return moment(r).format('ddd DD-MMM-YY'); }).splice(0, 10).join('\n');
        }
        else {
            this.text = '';
        }
        this.RRuleStrChange.emit({ value: this.rule.toString(), error: this.validate() });
    };
    RRuleComponent.prototype.validate = function () {
        var v = '';
        if (!this.options.freq)
            v = 'choose a period';
        else if (this.options.freq === Rrule.WEEKLY && !this.byweekday.length) {
            v = 'choose a weekday';
        }
        else if (this.rule.options.freq === Rrule.MONTHLY && this.monthlyInputMode === 'week') {
            if (this.bysetpos.length && !this.byweekday.length) {
                v = 'choose weekdays';
            }
            else if (this.byweekday.length && !this.bysetpos.length) {
                v = 'choose week numbers in month';
            }
            else if (!this.byweekday.length && !this.bysetpos.length) {
                v = 'choose week numbers and weekdays';
            }
        }
        else if (this.rule.options.freq === Rrule.MONTHLY && this.monthlyInputMode === 'month') {
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
        delete this.options.byweekday;
        delete this.options.bysetpos;
        if (event === 'month') {
            this.bymonthday = [moment().get('D')];
            this.options.bymonthday = this.bymonthday;
        }
        else {
            delete this.options.bymonthday;
            this.bymonthday = [];
        }
        this.bysetpos = [];
        this.byweekday = [];
        this.calcPastOrRemained();
        this.emitChange();
    };
    RRuleComponent.prototype.byweekdayChange = function (event) {
        this.multipleChoice(event, 'byweekday');
        this.options.byweekday = this.byweekday;
        delete this.options.bymonthday;
        this.emitChange();
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
        this.emitChange();
    };
    RRuleComponent.prototype.monthDaysRemainedChange = function (event) {
        this.monthDaysRemained = event;
        this.bymonthday = this.bymonthday.filter(function (r) { return r > 0; }).concat(this.monthDaysRemained.map(function (r) { return -r; }));
        if (this.options.bymonthday !== this.bymonthday) {
            this.options.bymonthday = this.bymonthday;
            this.emitChange();
        }
    };
    RRuleComponent.prototype.monthDaysPastChange = function (event) {
        this.monthDaysPast = event;
        this.bymonthday = this.bymonthday.filter(function (r) { return r < 0; }).concat(this.monthDaysPast);
        if (this.options.bymonthday !== this.bymonthday) {
            this.options.bymonthday = this.bymonthday;
            this.emitChange();
        }
    };
    RRuleComponent.prototype.weekposChange = function (event) {
        this.multipleChoice(event, 'bysetpos');
        this.options.bysetpos = this.bysetpos;
        delete this.options.bymonthday;
        this.emitChange();
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
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], RRuleComponent.prototype, "RRuleStr", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RRuleComponent.prototype, "RRuleStrChange", void 0);
    RRuleComponent = __decorate([
        core_1.Component({
            selector: 'app-rrule',
            templateUrl: './rrule.component.html',
            styleUrls: ['./rrule.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], RRuleComponent);
    return RRuleComponent;
}());
exports.RRuleComponent = RRuleComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/rrule/rrule.component.js.map