import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";
export declare class RestService {
    private http;
    constructor(http: Http);
    call(table: any): Observable<Response>;
    insert(table: any, values: any): Observable<any>;
    get(table: any): Observable<any>;
    getWithParams(table: any, values: any): Observable<any>;
    delete(table: any, id: any): Observable<Response>;
    update(table: any, id: any, values: any): Observable<Response>;
}
