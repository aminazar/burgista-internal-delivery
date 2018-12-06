import { OnInit } from '@angular/core';
import { LoggedInGuard } from "./login/logged-in.guard";
import { MessageService } from "./message.service";
import { MdSnackBar } from "@angular/material";
export declare class AppComponent implements OnInit {
    private loggedInGuard;
    private messageService;
    snackBar: MdSnackBar;
    private showError;
    private error;
    blocked: boolean;
    constructor(loggedInGuard: LoggedInGuard, messageService: MessageService, snackBar: MdSnackBar);
    ngOnInit(): void;
    closeError(): void;
}
