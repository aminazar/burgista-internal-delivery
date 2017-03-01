import { Product } from './product';
import { BehaviorSubject } from "rxjs";
export declare class ProductModel {
    _product: Product;
    waiting: BehaviorSubject<any>;
    constructor(product: Product);
    isDifferent(product: Product): boolean;
    getDifferentValues(product: Product): {};
    setProduct(product: Product): void;
    static toAnyObject(product: any): any;
    static toAnyObjectOverride(product: any): any;
    static fromAnyObject(object: any): Product;
}
