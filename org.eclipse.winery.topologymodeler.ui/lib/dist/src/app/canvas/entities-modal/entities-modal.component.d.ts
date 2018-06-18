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
import { AfterViewInit, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { TPolicy } from '../../models/policiesModalData';
import { TDeploymentArtifact } from '../../models/artifactsModalData';
import { QNameWithTypeApiData } from '../../models/generateArtifactApiData';
import { EntityTypesModel } from '../../models/entityTypesModel';
import { BackendService } from '../../services/backend.service';
import { IWineryState } from '../../redux/store/winery.store';
import { NgRedux } from '@angular-redux/store';
import { WineryActions } from '../../redux/actions/winery.actions';
import { ExistsService } from '../../services/exists.service';
import { ToastrService } from 'ngx-toastr';
import { DeploymentArtifactOrPolicyModalData, ModalVariant, ModalVariantAndState } from './modal-model';
import { EntitiesModalService } from './entities-modal.service';
export declare class EntitiesModalComponent implements OnInit, AfterViewInit, OnChanges {
    private backendService;
    private ngRedux;
    private actions;
    private existsService;
    private entitiesModalService;
    private alert;
    modal: ModalDirective;
    modalVariantAndState: ModalVariantAndState;
    entityTypes: EntityTypesModel;
    currentNodeData: any;
    modalDataChange: EventEmitter<ModalVariantAndState>;
    allNamespaces: any;
    defaultValue: any;
    deploymentArtifactOrPolicyModalData: DeploymentArtifactOrPolicyModalData;
    modalSelectedRadioButton: string;
    artifactTemplateAlreadyExists: boolean;
    artifact: QNameWithTypeApiData;
    artifactUrl: string;
    modalVariantForEditDeleteTasks: string;
    ModalVariant: typeof ModalVariant;
    constructor(backendService: BackendService, ngRedux: NgRedux<IWineryState>, actions: WineryActions, existsService: ExistsService, entitiesModalService: EntitiesModalService, alert: ToastrService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Updates the modal state when needed
     */
    updateModal(): void;
    /**
     * This method gets called when the add button is pressed inside the "Add Deployment Artifact" modal
     */
    addDeploymentArtifactOrPolicy(): void;
    /**
     * Auto-completes other relevant values when a deployment-artifact or policy type has been selected in
     * the modal
     */
    onChangeArtifactTypeOrPolicyTypeInModal(artifactTypeOrPolicyType: any, variant: string): void;
    /**
     * This is required to figure out which templateName and Ref have to be pushed to the redux state
     * @param template - either an artifactTemplate or a policyTemplate
     */
    updatedTemplateToBeLinkedInModal(template: any, modalVariant: string): void;
    checkIfArtifactTemplateAlreadyExists(event: any, changedField: string): void;
    resetDeploymentArtifactOrPolicyModalData(): void;
    /**
     * Saves a deployment artifacts template to the model and gets pushed into the Redux state of the application
     */
    saveDeploymentArtifactsToModel(deploymentArtifactToBeSavedToRedux: TDeploymentArtifact): void;
    /**
     * Saves a policy to the nodeTemplate model and gets pushed into the Redux state of the application
     */
    savePoliciesToModel(policyToBeSavedToRedux: TPolicy): void;
    getHostUrl(): string;
    resetModalData(): void;
    deleteDeploymentArtifactOrPolicy(): void;
    getLocalName(qName?: string): string;
    getNamespace(qName?: string): string;
    clickArtifactRef(): void;
    private makeArtifactUrl();
}
