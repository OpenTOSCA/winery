import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {WineryAlertService} from '../winery-alert/winery-alert.service';
import {Subscription} from 'rxjs/Subscription';
import {IWineryState} from '../redux/store/winery.store';
import {NgRedux} from '@angular-redux/store';

@Injectable()
export class SplitMatchTopologyService {

    constructor(private alert: WineryAlertService) {
    }

    /**
     * Splits the topology.
     */
    splitTopology(backendService: BackendService): void {

        backendService.splitTopology().subscribe(res => {
            console.log(res);
            res.ok === true ? this.alert.success('<p>Saved the topology!<br>' + 'Response Status: '
                + res.statusText + ' ' + res.status + '</p>')
                : this.alert.info('<p>Something went wrong! <br>' + 'Response Status: '
                + res.statusText + ' ' + res.status + '</p>');
        });
    }

}
