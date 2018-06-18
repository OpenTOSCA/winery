import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../../redux/store/winery.store';
import { WineryActions } from '../../redux/actions/winery.actions';
import { JsPlumbService } from '../../services/jsPlumb.service';
export declare class PropertiesContentComponent implements OnInit, OnChanges, OnDestroy {
    private $ngRedux;
    private actions;
    private jsPlumbService;
    properties: Subject<string>;
    keyOfEditedKVProperty: Subject<string>;
    readonly: boolean;
    currentNodeData: any;
    key: string;
    nodeProperties: any;
    subscriptions: Array<Subscription>;
    constructor($ngRedux: NgRedux<IWineryState>, actions: WineryActions, jsPlumbService: JsPlumbService);
    /**
     * Angular lifecycle event.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Angular lifecycle event.
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
}
