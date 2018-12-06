import { OnInit } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { PrintService } from "../print.service";
export declare class PrintViewerComponent implements OnInit {
    dialogRef: MdDialogRef<PrintViewerComponent>;
    private printService;
    unitName_title: string;
    unitName_subTitle: string;
    isOverallPrint: boolean;
    currentDate: string;
    receivers: string[];
    itemList: any[];
    showWarningMessage: boolean;
    constructor(dialogRef: MdDialogRef<PrintViewerComponent>, printService: PrintService);
    ngOnInit(): void;
}
