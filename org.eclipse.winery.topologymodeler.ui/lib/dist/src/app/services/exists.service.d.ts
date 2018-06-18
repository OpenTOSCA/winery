import { Http } from '@angular/http';
import { Observable } from 'rxjs';
export declare class ExistsService {
    private http;
    constructor(http: Http);
    check(url: string): Observable<any>;
}
