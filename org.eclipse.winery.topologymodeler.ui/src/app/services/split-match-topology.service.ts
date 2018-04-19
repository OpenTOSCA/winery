import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { WineryAlertService } from '../winery-alert/winery-alert.service';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SplitMatchTopologyService {
    private url: string;

    constructor(private alert: WineryAlertService) {
    }

    /**
     * Splits the topology.
     * @param backendService    the backend service for accessing the post method for splitting
     * @param ngRedux    the redux instance
     * @param topologyRendererActions    the redux actions for toggling the split button
     */
    splitTopology(backendService: BackendService, ngRedux: NgRedux<IWineryState>, topologyRendererActions: TopologyRendererActions): void {

        backendService.splitTopology().subscribe(res => {
            ngRedux.dispatch(topologyRendererActions.splitTopology());
            console.log(res);
            this.url = backendService.configuration.uiURL + '#' + '/servicetemplates/'
                + encodeURIComponent(encodeURIComponent(backendService.configuration.ns)) + '/'
                + backendService.configuration.id + '-split';
            console.log(this.url);
            if (res.ok) {
                this.alert.success('<p>Successfully split.<br>' + '<a target=\"_blank\" href=\""' + this.url +
            '>Open split service template</a>');
            }
        },
            error => {
                console.log(error);
                this.handleError(error);
                ngRedux.dispatch(topologyRendererActions.splitTopology());
            });
    }

    /**
     * Matches the topology.
     * @param backendService    the backend service for accessing the post method for matching
     * @param ngRedux    the redux instance
     * @param topologyRendererActions    the redux actions for toggling the match button
     */
    matchTopology(backendService: BackendService, ngRedux: NgRedux<IWineryState>, topologyRendererActions: TopologyRendererActions): void {
        backendService.matchTopology().subscribe(res => {
            ngRedux.dispatch(topologyRendererActions.matchTopology());
            console.log(res);
            res.ok === true ? this.alert.success('<p>Successfully matched.<br>' + 'Response Status: '
                + res.statusText + ' ' + res.status + '</p>')
                : this.alert.info('<p>Something went wrong! <br>' + 'Response Status: '
                + res.statusText + ' ' + res.status + '</p>');
        },
            error => {
            console.log(error);
                this.handleError(error);
                ngRedux.dispatch(topologyRendererActions.matchTopology());
            });
    }

    /**
     * Error handler.
     * @param error    the error
     */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            this.alert.info('<p>Something went wrong! <br>' + 'Response Status: '
                + error.statusText + ' ' + error.status + '</p><br>' + error.error.message);
        } else {
            this.alert.info('<p>Something went wrong! <br>' + 'Response Status: '
                + error.statusText + ' ' + error.status + '</p><br>' + error.error);
        }
    }

}
