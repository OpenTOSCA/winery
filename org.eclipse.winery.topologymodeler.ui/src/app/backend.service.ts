import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { backendBaseURL } from './configuration';

@Injectable()
export class BackendService {
  configuration: TopologyModelerConfiguration;

  constructor(private http: Http,
              private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe((params: TopologyModelerConfiguration) => {
      if (!(isNullOrUndefined(params.id) &&
        isNullOrUndefined(params.ns) &&
        isNullOrUndefined(params.repositoryURL) &&
        isNullOrUndefined(params.uiURL))) {
        this.configuration = params;
        this.getServiceTemplate().subscribe(d => console.log(d));
        this.getVisuals().subscribe(d => console.log(d));
      }

    });
  }

  getServiceTemplate(): Observable<string> {
    console.log(this.configuration);
    const headers = new Headers({'Accept': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = this.configuration.repositoryURL + '/servicetemplates/'
      + encodeURIComponent(encodeURIComponent(this.configuration.ns)) + '/'
      + this.configuration.id + '/topologytemplate/';
    return this.http.get(url, options)
      .map(res => res.json());
  }

  getVisuals(): Observable<string> {
    const headers = new Headers({'Accept': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.get(backendBaseURL + this.activatedRoute.url + '/', options)
      .map(res => res.json());
  }

  saveVisuals(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(backendBaseURL + this.activatedRoute.url + '/', JSON.stringify(data), options);
  }
}

export class TopologyModelerConfiguration {
  readonly id: string;
  readonly ns: string;
  readonly repositoryURL: string;
  readonly uiURL: string;
}
