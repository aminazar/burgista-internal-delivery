"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unit_model_1 = require("./unit.model");
var unit_1 = require("./unit");
describe('Unit Model', function () {
    var unit;
    var anotherUnit;
    var unitModel;
    it('should set own unit', function () {
        unit = new unit_1.Unit();
        unit.id = 0;
        unit.name = 'CenterBranch';
        unit.username = 'Jack';
        unit.password = '';
        unit.isBranch = true;
        unitModel = new unit_model_1.UnitModel(unit);
        expect(unitModel).toBeTruthy();
    });
    it('should return first value', function () {
        expect(unitModel._unit.name).toContain('CenterBranch');
    });
    it('should compare two unit (Different in name)', function () {
        anotherUnit = new unit_1.Unit();
        anotherUnit.id = 0;
        anotherUnit.name = 'CountryBranch';
        anotherUnit.username = 'Jack';
        anotherUnit.password = '';
        anotherUnit.isBranch = true;
        expect(unitModel.isDifferent(anotherUnit)).toBe(true);
    });
    it('should give changed properties', function () {
        expect(unitModel.getDifferentValues(anotherUnit)).toEqual(jasmine.objectContaining({
            name: 'CountryBranch'
        }));
    });
    it('should compare two unit (no difference)', function () {
        anotherUnit.name = 'CenterBranch';
        expect(unitModel.isDifferent(anotherUnit)).toBe(false);
    });
    it('should return true for difference in password', function () {
        anotherUnit.password = '123';
        expect(unitModel.isDifferent(anotherUnit)).toBe(true);
    });
    it('should return empty object', function () {
        anotherUnit.password = '';
        expect(unitModel.getDifferentValues(anotherUnit)).toEqual(jasmine.objectContaining({}));
    });
    it('should check correct value for waiting on update', function () {
        expect(unitModel.waiting.updating).toBe(false);
        unitModel.waiting.updating = true;
        expect(unitModel.waiting.updating).toBe(true);
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/unit-form/unit.model.spec.js.map