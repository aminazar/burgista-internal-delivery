import { OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
export declare class NavbarComponent implements OnInit {
    private authService;
    private router;
    private auth;
    private user;
    private isAdmin;
    private isBranch;
    private isPrep;
    private navLinks;
    constructor(authService: AuthService, router: Router);
    ngOnInit(): void;
    logout(): void;
}
