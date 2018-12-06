import { OnInit, EventEmitter } from '@angular/core';
import { RRule } from 'rrule';
export declare class RRuleComponent implements OnInit {
    private _rstr;
    RRuleStr: any;
    RRuleStrChange: EventEmitter<any>;
    options: any;
    rule: RRule;
    freqs: string[];
    freqsConst: any[];
    freqsName: string[];
    weekdays: string[];
    weekdaysConst: any[];
    weekpos: number[];
    weekposName: string[];
    byweekday: any[];
    text: string;
    showWeekdays: boolean;
    showMonthOptions: boolean;
    monthlyInputMode: string;
    monthDaysOption: any[];
    monthDaysPast: any[];
    monthDaysRemained: any[];
    bymonthday: any[];
    showMonthDaysPast: boolean;
    showMonthDaysRemained: boolean;
    bysetpos: any[];
    freq: string;
    constructor();
    ngOnInit(): void;
    onChange(): void;
    private calcPastOrRemained();
    private emitChange();
    private populateNextOccurrences();
    validate(): string;
    onMonthlyInputModeChange(event: any): void;
    byweekdayChange(event: any): void;
    monthDaysPastOrRemainedChange(event: any): void;
    monthDaysRemainedChange(event: any): void;
    monthDaysPastChange(event: any): void;
    weekposChange(event: any): void;
    multipleChoice(event: any, member: any): void;
}
