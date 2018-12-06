import { Subject, Observable } from "rxjs";
import { Response } from "@angular/http";
export declare class MessageService {
    private errStream;
    err$: Observable<Response>;
    private msgStream;
    msg$: Observable<string>;
    private warningStream;
    warn$: Observable<string>;
    block$: Subject<boolean>;
    block(bl?: boolean): void;
    error(err: Response): void;
    message(msg: string): void;
    warn(msg: string): void;
    constructor();
    changeToUnderstandableMessage(msg: any): Response;
}
