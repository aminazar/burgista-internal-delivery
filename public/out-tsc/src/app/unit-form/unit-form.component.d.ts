import { OnInit } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { UnitModel } from "./unit.model";
import { RestService } from "../rest.service";
import { MessageService } from "../message.service";
export declare class UnitFormComponent implements OnInit {
    private restService;
    private messageService;
    unitModels: UnitModel[];
    isAdding: boolean;
    actionIsSuccess: BehaviorSubject<boolean>;
    constructor(restService: RestService, messageService: MessageService);
    ngOnInit(): void;
    doClickedAction(value: any): void;
    private addUnit(unit);
    private deleteUnit(unitId);
    private updateUnit(unitId, unit);
    private disableEnable(unitId, btnType, isDisable);
    sortUnitModelList(): void;
}
