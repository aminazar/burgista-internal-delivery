import { OnInit, EventEmitter } from '@angular/core';
export declare class MonthdayComponent implements OnInit {
    private _days;
    days: number[];
    daysChange: EventEmitter<number[]>;
    reverse: boolean;
    private calDays;
    constructor();
    ngOnInit(): void;
    monthDaysChange(event: any): void;
}
