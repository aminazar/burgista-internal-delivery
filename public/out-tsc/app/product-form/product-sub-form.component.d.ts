import { OnInit, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { Product } from "./product";
import { ProductModel } from "./product.model";
import { ActionEnum } from "../unit-form/actionEnum";
import { RestService } from "../rest.service";
import { MessageService } from "../message.service";
export declare class ProductSubFormComponent implements OnInit {
    private restService;
    private messageService;
    isAdd: boolean;
    isAdding: Observable<boolean>;
    productModel: ProductModel;
    actionIsSuccess: Observable<boolean>;
    action: EventEmitter<{}>;
    hasCountingRuleError: boolean;
    countingRuleError: string;
    _isAdding: boolean;
    _isUpdating: boolean;
    _isDeleting: boolean;
    formTitle: string;
    product: Product;
    ae: typeof ActionEnum;
    addIsDisable: boolean;
    updateIsDisable: boolean;
    deleteIsDisable: boolean;
    measuringUnits: string[];
    prepUnits: any[];
    constructor(restService: RestService, messageService: MessageService);
    ngOnInit(): void;
    actionEmitter(clickType: any): void;
    disabilityStatus(): void;
    isCorrectFormData(): boolean;
    shouldDisableAddBtn(): boolean;
    shouldDisableUpdateBtn(): boolean;
    shouldDisableDeleteBtn(): boolean;
    countingRuleErrorHandler(message: any): void;
}
