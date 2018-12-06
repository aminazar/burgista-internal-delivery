import { Unit } from "./unit";
export declare class UnitModel {
    _unit: Unit;
    waiting: {
        updating: boolean;
        deleting: boolean;
        adding: boolean;
    };
    constructor(unit: Unit);
    isDifferent(unit: Unit): boolean;
    getDifferentValues(unit: Unit): {};
    setUnit(unit: Unit): void;
}
