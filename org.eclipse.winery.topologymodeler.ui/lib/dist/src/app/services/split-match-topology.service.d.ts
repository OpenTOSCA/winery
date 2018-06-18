import { BackendService } from './backend.service';
import { ToastrService } from 'ngx-toastr';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';
import { ErrorHandlerService } from './error-handler.service';
export declare class SplitMatchTopologyService {
    private alert;
    constructor(alert: ToastrService);
    /**
     * Splits the topology.
     * @param backendService    the backend service for accessing the post method for splitting
     * @param ngRedux    the redux instance
     * @param topologyRendererActions    the redux actions for toggling the split button
     */
    splitTopology(backendService: BackendService, ngRedux: NgRedux<IWineryState>, topologyRendererActions: TopologyRendererActions, errorHandler: ErrorHandlerService): void;
    /**
     * Matches the topology.
     * @param backendService    the backend service for accessing the post method for matching
     * @param ngRedux    the redux instance
     * @param topologyRendererActions    the redux actions for toggling the match button
     */
    matchTopology(backendService: BackendService, ngRedux: NgRedux<IWineryState>, topologyRendererActions: TopologyRendererActions, errorHandler: ErrorHandlerService): void;
}
