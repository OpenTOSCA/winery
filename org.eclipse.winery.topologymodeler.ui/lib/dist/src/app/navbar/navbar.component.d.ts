/********************************************************************************
 * Copyright (c) 2017-2018 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 ********************************************************************************/
import { OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgRedux } from '@angular-redux/store';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { IWineryState } from '../redux/store/winery.store';
import { BackendService } from '../services/backend.service';
import { Subscription } from 'rxjs';
import { HotkeysService } from 'angular2-hotkeys';
/**
 * The navbar of the topologymodeler.
 */
export declare class NavbarComponent implements OnDestroy {
    private alert;
    private ngRedux;
    private actions;
    private backendService;
    private hotkeysService;
    /**
     * Boolean variables that hold the state (pressed vs. !pressed) of the navbar buttons.
     */
    hideNavBarState: any;
    readonly: boolean;
    private exportCsarButtonRef;
    navbarButtonsState: ButtonsStateModel;
    unformattedTopologyTemplate: any;
    subscriptions: Array<Subscription>;
    exportCsarUrl: string;
    splittingOngoing: boolean;
    matchingOngoing: boolean;
    constructor(alert: ToastrService, ngRedux: NgRedux<IWineryState>, actions: TopologyRendererActions, backendService: BackendService, hotkeysService: HotkeysService);
    /**
     * Setter for buttonstate
     * @param newButtonsState
     */
    setButtonsState(newButtonsState: ButtonsStateModel): void;
    /**
     * Getter for the style of a pressed button.
     * @param buttonPressed
     */
    getStyle(buttonPressed: boolean): string;
    /**
     * Exports the service template as a CSAR file
     * @param event
     */
    exportCsar(event: any): void;
    /**
     * This function is called whenever a navbar button is clicked.
     * It contains a separate case for each button.
     * It toggles the `pressed` state of a button and publishes the respective
     * button id and boolean to the subscribers of the Observable inside
     * SharedNodeNavbarService.
     * @param event -- The click event of a button.
     */
    toggleButton(event: any): void;
    /**
     * Calls the BackendService's saveTopologyTemplate method and displays a success message if successful.
     */
    saveTopologyTemplateToRepository(): void;
    /**
     * Angular lifecycle event.
     */
    ngOnDestroy(): void;
}
