import { Delivery } from "./delivery";
export declare class DeliveryModel {
    _deliveries: Delivery[];
    _unitName: string;
    _shouldDisabled: boolean;
    _isSubmitted: boolean;
    _isPrinted: boolean;
    constructor(unitName: string);
    add(delivery: Delivery): void;
    get(id: number): Delivery;
    getByCode(code: string): Delivery;
    deleteByCode(code: string): boolean;
    clear(): void;
    replaceDeliveryProperty(code: string, whichItem: string, value: any): boolean;
    updateDeliveryProperty(action: string, code: string, whichItem: string, value: any): boolean;
    static toAnyObject(delivery: Delivery, isPrinted: boolean, product_id: number): any;
}
