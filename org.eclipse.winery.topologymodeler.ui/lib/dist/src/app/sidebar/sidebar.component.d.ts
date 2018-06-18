import { OnDestroy, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';
import { Subject, Subscription } from 'rxjs';
import { BackendService } from '../services/backend.service';
/**
 * This is the right sidebar, where attributes of nodes and relationships get displayed.
 */
export declare class SidebarComponent implements OnInit, OnDestroy {
    private $ngRedux;
    private actions;
    private backendService;
    sidebarSubscription: any;
    sidebarState: any;
    sidebarAnimationStatus: string;
    maxInputEnabled: boolean;
    min: number;
    nodeNameKeyUp: Subject<string>;
    nodeMinInstancesKeyUp: Subject<string>;
    nodeMaxInstancesKeyUp: Subject<string>;
    subscription: Subscription;
    constructor($ngRedux: NgRedux<IWineryState>, actions: WineryActions, backendService: BackendService);
    /**
     * Closes the sidebar.
     */
    closeSidebar(): void;
    /**
     * CSS styling for "infinity button"
     */
    getInfinityButtonStyle(): string;
    /**
     * Angular lifecycle event.
     * initializes the sidebar with the correct data, also implements debounce time for a smooth user experience
     */
    ngOnInit(): void;
    /**
     * Implements some checks, if the values from the user are correct, and updates the nodes
     * @param $event
     */
    minInstancesChanged($event: any): void;
    /**
     * Implements some checks, if the values from the user are correct, and updates the nodes
     * @param $event
     */
    maxInstancesChanged($event: any): void;
    /**
     * Unmarks the node or relationship template upon altering the name in the side bar. Guarantuees that upon clicking
     * the 'del' key for intentionally clearing the node name the whole node template is not deleted. Upon putting focus
     * the node template is unmarked
     * @param $event
     */
    onFocus($event: any): void;
    /**
     * Unmarks the node or relationship template upon altering the name in the side bar. Guarantuees that upon clicking
     * the 'del' key for intentionally clearing the node name the whole node template is not deleted. Upon blurring
     * the node template is marked again
     * @param $event
     */
    onBlur($event: any): void;
    /**
     * Navigates to the corresponding type in the management UI
     * @param $event
     */
    linkType($event: any): void;
    ngOnDestroy(): void;
}
