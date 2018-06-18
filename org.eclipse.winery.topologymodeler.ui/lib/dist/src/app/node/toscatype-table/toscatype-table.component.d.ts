/*******************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
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
 *******************************************************************************/
import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EntitiesModalService } from '../../canvas/entities-modal/entities-modal.service';
import { BackendService } from '../../services/backend.service';
export declare class ToscatypeTableComponent implements OnInit, OnChanges {
    private entitiesModalService;
    private backendService;
    toscaType: string;
    currentNodeData: any;
    toscaTypeData: any;
    showClickedReqOrCapModal: EventEmitter<any>;
    currentToscaTypeData: any;
    currentToscaType: any;
    latestNodeTemplate?: any;
    constructor(entitiesModalService: EntitiesModalService, backendService: BackendService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    isEllipsisActive(cell: any): boolean;
    getLocalName(qName?: string): string;
    getNamespace(qName?: string): string;
    clickArtifactRef(artifactRef: string): void;
    clickArtifactType(artifactType: string): void;
    clickPolicyRef(policyRef: string): void;
    clickPolicyType(policyType: string): void;
    openPolicyModal(policy: any): void;
    openDeploymentArtifactModal(deploymentArtifact: any): void;
    /**
     * This modal handler gets triggered upon clicking on a capability or requirement id in the table
     * @param clickEvent - this holds the information about the click event, needed for determining which element was
     *     clicked
     */
    showExistingReqOrCapModal(clickEvent: any): void;
    /**
     * Gets triggered upon clicking on a capability or requirement name in the table, links to the defined names in the
     * management UI
     * @param reqOrCapRef - the name
     */
    clickReqOrCapRef(reqOrCapRef: string): void;
    /**
     * Gets triggered upon clicking on a capability or requirement type in the table, links to the defined type in the
     * management UI
     * @param reqOrCapType - the type
     */
    clickReqOrCapType(reqOrCapType: string): void;
}
