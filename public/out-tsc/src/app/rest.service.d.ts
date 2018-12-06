import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs";
import { MessageService } from './message.service';
export declare class RestService {
    private http;
    private messageService;
    constructor(http: Http, messageService: MessageService);
    call(table: any): Observable<Response>;
    insert(table: any, values: any): Observable<any>;
    get(table: any): Observable<any>;
    getWithParams(table: any, values: any): Observable<any>;
    delete(table: any, id: any): Observable<Response>;
    update(table: any, id: any, values: any): Observable<Response>;
}
