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
import { EventEmitter, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToscaDiff } from '../models/ToscaDiff';
import { TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from '../models/ttopology-template';
import { NgRedux } from '@angular-redux/store';
import { WineryActions } from '../redux/actions/winery.actions';
import { IWineryState } from '../redux/store/winery.store';
import { ILoaded } from '../services/loaded.service';
import { Subscription } from 'rxjs';
/**
 * This is the parent component of the canvas and navbar component.
 */
export declare class TopologyRendererComponent implements OnInit, OnDestroy {
    private ngRedux;
    private actions;
    private notify;
    readonly: boolean;
    entityTypes: any;
    relationshipTypes: Array<any>;
    differencesData: [ToscaDiff, TTopologyTemplate];
    nodeTemplates: Array<TNodeTemplate>;
    relationshipTemplates: Array<TRelationshipTemplate>;
    generatedReduxState: EventEmitter<{}>;
    hideNavBarState: boolean;
    subscriptions: Array<Subscription>;
    private topologyDiff;
    private oldTopology;
    loader: ILoaded;
    diffMode: boolean;
    constructor(ngRedux: NgRedux<IWineryState>, actions: WineryActions, vcr: ViewContainerRef, notify: ToastrService);
    ngOnInit(): void;
    generateDiffTopology(): void;
    private addElementsToRedux();
    /**
     * Lifecycle event
     */
    ngOnDestroy(): void;
}
