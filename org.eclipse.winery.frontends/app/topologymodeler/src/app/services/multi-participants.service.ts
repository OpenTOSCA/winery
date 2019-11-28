import { Injectable } from '@angular/core';
import { TopologyModelerConfiguration } from '../models/topologyModelerConfiguration';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { backendBaseURL } from '../../../../tosca-management/src/app/configuration';

@Injectable({
    providedIn: 'root',
})
export class MultiParticipantsService {

    private readonly configuration: TopologyModelerConfiguration;
    private readonly httpHeaders: HttpHeaders;

    constructor(private httpClient: HttpClient,
                private backendService: BackendService) {
        this.configuration = backendService.configuration;
        this.httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    }

    postNewVersion(): Observable<any> {
        const url = this.configuration.repositoryURL
            + '/servicetemplates/'
            + encodeURIComponent(encodeURIComponent(this.configuration.ns))
            + '/'
            + encodeURIComponent(this.configuration.id)
            + '/createplaceholderversion';

        return this.httpClient.post(
            url,
            { headers: this.httpHeaders, observe: 'response', responseType: 'text' });
    }

    postParticipantsVersion(serviceTemplateId: string, serviceTemplateNs?: string): Observable<any> {
        const url = this.configuration.repositoryURL
            + '/servicetemplates/'
            + encodeURIComponent(encodeURIComponent(this.configuration.ns))
            + '/'
            + encodeURIComponent(serviceTemplateId)
            + '/createparticipantsversion';
        console.log(url);
        return this.httpClient.post(
            url,
            { headers: this.httpHeaders, observe: 'response', responseType: 'json' }
        );
    }

    postPlaceholders(serviceTemplateId: string): Observable<any> {
        const url = this.configuration.repositoryURL
            + '/servicetemplates/'
            + encodeURIComponent(encodeURIComponent(this.configuration.ns))
            + '/'
            + encodeURIComponent(serviceTemplateId)
            + '/placeholder/generator';
        return this.httpClient.post(
            url,
            { headers: this.httpHeaders, observe: 'response', responseType: 'string' });
    }
}