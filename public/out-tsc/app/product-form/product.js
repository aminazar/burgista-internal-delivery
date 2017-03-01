"use strict";
var Product = (function () {
    function Product() {
        this.countingRecursion = '';
        this.coefficients = {
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Sunday: 1,
            Usage: 1
        };
        this.isOverridden = false;
    }
    return Product;
}());
exports.Product = Product;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/app/product-form/product.js.map