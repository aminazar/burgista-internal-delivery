import { WindowRef } from './WindowRef';
import { MessageService } from "./message.service";
export declare class PrintService {
    private messageService;
    private winRef;
    _unitSupplier: string;
    _unitConsumer: string;
    _isOverallPrint: boolean;
    _receivers: string[];
    _deliveryModels: any;
    _showWarningMessage: boolean;
    currentDate: Date;
    _window: any;
    constructor(messageService: MessageService, winRef: WindowRef);
    getItems(): any[];
    private eachUnitItems();
    private overallItems();
    printData(): void;
    private getMonthName(monthNo);
}
