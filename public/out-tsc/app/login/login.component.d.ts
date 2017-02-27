import { OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
export declare class LoginComponent implements OnInit {
    private authService;
    username: any;
    password: any;
    loginEnabled: boolean;
    onChange(): void;
    constructor(authService: AuthService);
    ngOnInit(): void;
    ifEnterLogin(e: any): void;
    userLogin(): void;
}
