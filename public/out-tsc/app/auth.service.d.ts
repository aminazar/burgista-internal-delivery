import { Observable } from "rxjs/Observable";
import { RestService } from "./rest.service";
import { Router } from "@angular/router";
import { MessageService } from "./message.service";
export declare class AuthService {
    private restService;
    private router;
    private messageService;
    private authStream;
    user: string;
    userType: string;
    auth$: Observable<boolean>;
    originBeforeLogin: string;
    constructor(restService: RestService, router: Router, messageService: MessageService);
    logIn(username: any, password: any): void;
    logOff(): void;
}
