import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { IWineryState } from '../../redux/store/winery.store';
import { NgRedux } from '@angular-redux/store';
import { WineryActions } from '../../redux/actions/winery.actions';
export declare class TargetLocationsComponent implements OnInit, OnChanges {
    private $ngRedux;
    private actions;
    properties: Subject<string>;
    readonly: boolean;
    currentNodeData: any;
    sendTargetLocation: EventEmitter<any>;
    targetLocation: string;
    subscriptionTargetLocation: Subscription;
    constructor($ngRedux: NgRedux<IWineryState>, actions: WineryActions);
    /**
     * Angular lifecycle event.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Assigns the target location value for display.
     */
    private checkForTargetLocations();
    /**
     * Angular lifecycle event.
     */
    ngOnInit(): void;
}
