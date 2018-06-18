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
import { OnDestroy, OnInit } from '@angular/core';
import { WineryActions } from '../redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { TNodeTemplate } from '../models/ttopology-template';
import { BackendService } from '../services/backend.service';
import { NewNodeIdTypeColorPropertiesModel } from '../models/newNodeIdTypeColorModel';
import { Subscription } from 'rxjs';
/**
 * This is the left sidebar, where nodes can be created from.
 */
export declare class PaletteComponent implements OnInit, OnDestroy {
    private ngRedux;
    private actions;
    private backendService;
    entityTypes: any;
    paletteRootState: string;
    paletteButtonRootState: string;
    subscriptions: Array<Subscription>;
    oneAtATime: boolean;
    allNodeTemplates: TNodeTemplate[];
    readonly newNodePositionOffsetX: number;
    readonly newNodePositionOffsetY: number;
    constructor(ngRedux: NgRedux<IWineryState>, actions: WineryActions, backendService: BackendService);
    /**
     * Applies the correct css, depending on if the palette is open or not.
     * @param newPaletteOpenedState
     */
    updateState(newPaletteOpenedState: any): void;
    /**
     * Angular lifecycle event.
     */
    ngOnInit(): void;
    /**
     * opens the palette if its closed and vice versa.
     */
    toggleRootState(): void;
    /**
     * Gets called if nodes get deleted or created and calls the
     * correct handler.
     * @param currentNodes  List of all displayed nodes.
     */
    updateNodes(currentNodes: Array<TNodeTemplate>): void;
    /**
     * Generates and stores a new node in the store.
     * @param $event
     */
    generateNewNode($event: any): void;
    /**
     * Generates a new unique node id, type, color and properties
     * @param name
     * @return result
     */
    generateIdTypeColorProperties(name: string): NewNodeIdTypeColorPropertiesModel;
    /**
     * This function transforms the node's KV properties from an array to an object representation
     * @param any type : the element type, e.g. capabilityType, requirementType etc.
     * @return newKvProperties : properties as a object
     */
    setKVProperties(type: any): any;
    /**
     * Generates node id, type, color and properties from the node types
     * @param name
     * @return result
     */
    private getNewNodeDataFromNodeTypes(name);
    /**
     * Generates default properties from node types
     * @param name
     * @return result
     */
    private getDefaultPropertiesFromNodeTypes(name);
    /**
     * Angular lifecycle event.
     */
    ngOnDestroy(): void;
}
