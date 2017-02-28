import { OnInit, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { ActionEnum } from "./actionEnum";
import { Unit } from "./unit";
export declare class SubFormComponent implements OnInit {
    isAdd: boolean;
    isAdding: boolean;
    unitModel: any;
    actionIsSuccess: Observable<boolean>;
    action: EventEmitter<{}>;
    unit: Unit;
    ae: typeof ActionEnum;
    formTitle: string;
    addIsDisable: boolean;
    updateIsDisable: boolean;
    deleteIsDisable: boolean;
    constructor();
    ngOnInit(): void;
    disabilityStatus(): void;
    actionEmitter(clickType: any): void;
    isCorrectFormData(isForAdd: boolean): boolean;
    shouldDisableAddBtn(): boolean;
    shouldDisableUpdateBtn(): boolean;
    shouldDisableDeleteBtn(): boolean;
}
