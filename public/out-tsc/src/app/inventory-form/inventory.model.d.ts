import { Inventory } from "./inventory";
export declare class InventoryModel {
    _inventories: Inventory[];
    _unitName: string;
    constructor(unitName: string);
    clear(): void;
    add(item: Inventory): void;
    get(id: any): Inventory;
    getByCode(code: any): Inventory;
    delete(id: any): void;
    static toAnyObject(inventory: Inventory): any;
    static fromAnyObject(object: any): Inventory;
}
