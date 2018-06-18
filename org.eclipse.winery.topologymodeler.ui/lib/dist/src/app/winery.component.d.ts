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
import { OnInit } from '@angular/core';
import { EntityType, TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from './models/ttopology-template';
import { ILoaded, LoadedService } from './services/loaded.service';
import { AppReadyEventService } from './services/app-ready-event.service';
import { BackendService } from './services/backend.service';
import { Subscription } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from './redux/store/winery.store';
import { NodeRelationshipTemplatesGeneratorService } from './services/node-relationship-templates-generator.service';
import { ToscaDiff } from './models/ToscaDiff';
import { TopologyModelerInputDataFormat } from './models/entityTypesModel';
/**
 * This is the root component of the topology modeler.
 */
export declare class WineryComponent implements OnInit {
    private loadedService;
    private appReadyEvent;
    private backendService;
    private nodeRelationshipGeneratorService;
    private ngRedux;
    topologyModelerData: TopologyModelerInputDataFormat;
    nodeTemplates: Array<TNodeTemplate>;
    relationshipTemplates: Array<TRelationshipTemplate>;
    artifactTypes: Array<any>;
    policyTypes: Array<any>;
    policyTemplates: Array<any>;
    capabilityTypes: Array<any>;
    requirementTypes: Array<any>;
    groupedNodeTypes: Array<any>;
    relationshipTypes: Array<EntityType>;
    entityTypes: any;
    hideNavBarState: boolean;
    subscriptions: Array<Subscription>;
    readonly: boolean;
    topologyDifferences: [ToscaDiff, TTopologyTemplate];
    loaded: ILoaded;
    constructor(loadedService: LoadedService, appReadyEvent: AppReadyEventService, backendService: BackendService, nodeRelationshipGeneratorService: NodeRelationshipTemplatesGeneratorService, ngRedux: NgRedux<IWineryState>);
    /**
     * Angular LifeCycle function OnInit().
     * All necessary data is being requested inside this function via the backendService instance.
     * The data is passed to various init...() functions that parse the received JSON data into Objects that get stored
     * inside the Redux store of this application.
     */
    ngOnInit(): void;
    /**
     * Save the received Array of Entity Types inside the respective variables in the entityTypes array of arrays
     * which is getting passed to the palette and the topology renderer
     * @param entityTypeJSON
     * @param entityType
     */
    initEntityType(entityTypeJSON: Array<any>, entityType: string): void;
    initiateLocalRendering(tmData: TopologyModelerInputDataFormat): void;
    initTopologyTemplate(nodeTemplateArray: Array<TNodeTemplate>, relationshipTemplateArray: Array<TRelationshipTemplate>): void;
    initiateBackendCalls(): void;
    onReduxReady(): void;
    private setNodeVisuals(nodeVisuals);
}
