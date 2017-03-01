import { OnInit, EventEmitter } from '@angular/core';
export declare class CountingRuleComponent implements OnInit {
    isOverridden: boolean;
    coefficients: any;
    private _mq;
    minQty: any;
    maxQty: any;
    recursionRule: any;
    coefficientsChange: EventEmitter<any>;
    minQtyChange: EventEmitter<number>;
    maxQtyChange: EventEmitter<number>;
    recursionRuleChange: EventEmitter<string>;
    hasError: EventEmitter<string>;
    days: string[];
    private errorMessage;
    private showMessage;
    constructor();
    ngOnInit(): void;
    coeffChange(): void;
    minChange(): void;
    maxChange(): void;
    recurChange(event: any): void;
    checkMinMax(): void;
    sendError(msg: any, index: any): void;
}
