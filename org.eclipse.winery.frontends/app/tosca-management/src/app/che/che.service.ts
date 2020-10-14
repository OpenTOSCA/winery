import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../../../../topologymodeler/src/app/services/backend.service';

export interface CheResponse {
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class CheService {

    constructor(private http: HttpClient,
                private backendService: BackendService) {
    }

    getCheTheiaUrl(): Observable<CheResponse> {
        return this.http.get<CheResponse>(`${this.backendService.configuration.repositoryURL}/admin/che`);
    }
}
