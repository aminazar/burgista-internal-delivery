export declare class Inventory {
    id: number;
    productId: number;
    unopenedPack: number;
    productCode: string;
    productName: string;
    lastCount: Date;
    state: string;
    shouldIncluded: boolean;
    shouldCountToday: boolean;
}
