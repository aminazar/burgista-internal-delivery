"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var moment = require("moment");
var print_service_1 = require("../print.service");
var PrintViewerComponent = (function () {
    function PrintViewerComponent(dialogRef, printService) {
        this.dialogRef = dialogRef;
        this.printService = printService;
        this.unitName_title = '';
        this.unitName_subTitle = '';
        this.isOverallPrint = false;
        this.currentDate = moment().format('D MMMM YYYY');
        this.receivers = [];
        this.itemList = [];
        this.showWarningMessage = true;
    }
    PrintViewerComponent.prototype.ngOnInit = function () {
        this.isOverallPrint = this.printService._isOverallPrint;
        this.receivers = this.printService._receivers;
        this.unitName_title = this.printService._unitSupplier;
        this.unitName_subTitle = this.printService._unitConsumer;
        this.showWarningMessage = this.printService._showWarningMessage;
        this.currentDate = moment(this.printService.currentDate).format('D MMMM YYYY');
        this.itemList = this.printService.getItems();
    };
    return PrintViewerComponent;
}());
PrintViewerComponent = __decorate([
    core_1.Component({
        selector: 'app-print-viewer',
        templateUrl: './print-viewer.component.html',
        styleUrls: ['./print-viewer.component.css']
    }),
    __metadata("design:paramtypes", [material_1.MdDialogRef, print_service_1.PrintService])
], PrintViewerComponent);
exports.PrintViewerComponent = PrintViewerComponent;
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/print-viewer/print-viewer.component.js.map