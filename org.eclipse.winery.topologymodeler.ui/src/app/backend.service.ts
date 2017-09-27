import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

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
      }

    });
  }

  getServiceTemplate(): Observable<string> {
    console.log(this.configuration)
    const headers = new Headers({'Accept': 'application/json'});
    const options = new RequestOptions({headers: headers});
    const url = this.configuration.repositoryURL + '/servicetemplates/'
      + encodeURIComponent(encodeURIComponent(this.configuration.ns)) + '/'
      + this.configuration.id + '/topologytemplate/';
    return this.http.get(url, options)
      .map(res => res.json());
  }
}

export class TopologyModelerConfiguration {
  readonly id: string;
  readonly ns: string;
  readonly repositoryURL: string;
  readonly uiURL: string;
}
