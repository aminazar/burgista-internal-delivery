import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from "../auth.service";
export declare class LoggedInGuard implements CanActivate {
    private authService;
    private router;
    private isLoggedIn;
    constructor(authService: AuthService, router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
}
