import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { backendBaseURL } from './configuration';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BackendService {
  configuration: TopologyModelerConfiguration;

  private serviceTemplate = new Subject<any>();
  serviceTemplate$ = this.serviceTemplate.asObservable();

  private visuals = new Subject<any>();
  visuals$ = this.visuals.asObservable();

  constructor(private http: Http,
              private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe((params: TopologyModelerConfiguration) => {
      if (!(isNullOrUndefined(params.id) &&
        isNullOrUndefined(params.ns) &&
        isNullOrUndefined(params.repositoryURL) &&
        isNullOrUndefined(params.uiURL))) {
        this.configuration = params;
        this.requestServiceTemplate().subscribe(data => {
          // emit JSON, WineryComponent will subscribe to its Observable
          this.serviceTemplate.next(data);
        });
        this.requestAllNodeTemplateVisuals().subscribe(data => {
          // emit JSON, WineryComponent will subscribe to its Observable
          this.visuals.next(data);
        });
      }
    });
  }

  requestServiceTemplate(): Observable<string> {
    if (isNullOrUndefined(this.configuration)) { setTimeout(null, 100); }
    const headers = new Headers({'Accept': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = this.configuration.repositoryURL + '/servicetemplates/'
      + encodeURIComponent(encodeURIComponent(this.configuration.ns)) + '/'
      + this.configuration.id + '/topologytemplate/';
    return this.http.get(url, options)
      .map(res => res.json());
  }

  requestAllNodeTemplateVisuals(): Observable<string> {
    const headers = new Headers({'Accept': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.get(backendBaseURL + '/nodetypes/allvisualappearancedata', options)
      .map(res => res.json());
  }

  /*  saveVisuals(data: any): Observable<Response> {
   const headers = new Headers({ 'Content-Type': 'application/json' });
   const options = new RequestOptions({ headers: headers });
   return this.http.put(backendBaseURL + this.activatedRoute.url + '/', JSON.stringify(data), options);
   }*/
}

export class TopologyModelerConfiguration {
  readonly id: string;
  readonly ns: string;
  readonly repositoryURL: string;
  readonly uiURL: string;
}
