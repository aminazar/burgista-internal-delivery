export declare class Product {
    id: number;
    name: string;
    code: string;
    size: number;
    measuringUnit: string;
    prep_unit_id: number;
    minQty: number;
    maxQty: number;
    countingRecursion: string;
    coefficients: {
        Monday: number;
        Tuesday: number;
        Wednesday: number;
        Thursday: number;
        Friday: number;
        Saturday: number;
        Sunday: number;
        Usage: number;
    };
}
