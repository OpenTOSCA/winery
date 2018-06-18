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
import { Action, ActionCreator } from 'redux';
import { TNodeTemplate, TRelationshipTemplate } from '../../models/ttopology-template';
import { TDeploymentArtifact } from '../../models/artifactsModalData';
import { TPolicy } from '../../models/policiesModalData';
export interface SendPaletteOpenedAction extends Action {
    paletteOpened: boolean;
}
export interface HideNavBarAndPaletteAction extends Action {
    hideNavBarAndPalette: boolean;
}
export interface SidebarStateAction extends Action {
    sidebarContents: {
        sidebarVisible: boolean;
        nodeClicked: boolean;
        id: string;
        nameTextFieldValue: string;
        type: string;
        minInstances: string;
        maxInstances: string;
    };
}
export interface SidebarNodeNamechange extends Action {
    nodeNames: {
        newNodeName: string;
        id: string;
    };
}
export interface SidebarMinInstanceChanges extends Action {
    minInstances: {
        id: string;
        count: number;
    };
}
export interface SidebarMaxInstanceChanges extends Action {
    maxInstances: {
        id: string;
        count: number;
    };
}
export interface IncMaxInstances extends Action {
    maxInstances: {
        id: string;
    };
}
export interface DecMaxInstances extends Action {
    maxInstances: {
        id: string;
    };
}
export interface IncMinInstances extends Action {
    minInstances: {
        id: string;
    };
}
export interface DecMinInstances extends Action {
    minInstances: {
        id: string;
    };
}
export interface SaveNodeTemplateAction extends Action {
    nodeTemplate: TNodeTemplate;
}
export interface UpdateNodeCoordinatesAction extends Action {
    otherAttributes: any;
}
export interface SaveRelationshipAction extends Action {
    relationshipTemplate: TRelationshipTemplate;
}
export interface DeleteNodeAction extends Action {
    nodeTemplateId: string;
}
export interface DeleteRelationshipAction extends Action {
    nodeTemplateId: string;
}
export interface UpdateRelationshipNameAction extends Action {
    relData: {
        newRelName: string;
        id: string;
    };
}
export interface SetPropertyAction extends Action {
    nodeProperty: {
        newProperty: any;
        propertyType: string;
        nodeId: string;
    };
}
export interface SetCababilityAction extends Action {
    nodeCapability: {
        nodeId: string;
        color: string;
        id: string;
        name: string;
        namespace: string;
        qName: string;
    };
}
export interface SetRequirementAction extends Action {
    nodeRequirement: {
        nodeId: string;
        color: string;
        id: string;
        name: string;
        namespace: string;
        qName: string;
    };
}
export interface SetDeploymentArtifactAction extends Action {
    nodeDeploymentArtifact: {
        nodeId: string;
        newDeploymentArtifact: TDeploymentArtifact;
    };
}
export interface DeleteDeploymentArtifactAction extends Action {
    nodeDeploymentArtifact: {
        nodeId: string;
        deletedDeploymentArtifact: any;
    };
}
export interface SetPolicyAction extends Action {
    nodePolicy: {
        nodeId: string;
        newPolicy: TPolicy;
    };
}
export interface SetTargetLocation extends Action {
    nodeTargetLocation: {
        nodeId: string;
        newTargetLocation: string;
    };
}
export interface DeletePolicyAction extends Action {
    nodePolicy: {
        nodeId: string;
        deletedPolicy: any;
    };
}
export interface SendCurrentNodeIdAction extends Action {
    currentNodeData: any;
}
/**
 * Winery Actions
 */
export declare class WineryActions {
    static SEND_PALETTE_OPENED: string;
    static HIDE_NAVBAR_AND_PALETTE: string;
    static SAVE_NODE_TEMPLATE: string;
    static SAVE_RELATIONSHIP: string;
    static DELETE_NODE_TEMPLATE: string;
    static DELETE_RELATIONSHIP_TEMPLATE: string;
    static CHANGE_NODE_NAME: string;
    static OPEN_SIDEBAR: string;
    static UPDATE_NODE_COORDINATES: string;
    static UPDATE_REL_DATA: string;
    static CHANGE_MIN_INSTANCES: string;
    static CHANGE_MAX_INSTANCES: string;
    static INC_MIN_INSTANCES: string;
    static DEC_MIN_INSTANCES: string;
    static INC_MAX_INSTANCES: string;
    static DEC_MAX_INSTANCES: string;
    static SET_PROPERTY: string;
    static SET_CAPABILITY: string;
    static SET_REQUIREMENT: string;
    static SET_DEPLOYMENT_ARTIFACT: string;
    static DELETE_DEPLOYMENT_ARTIFACT: string;
    static SET_POLICY: string;
    static SET_TARGET_LOCATION: string;
    static DELETE_POLICY: string;
    static SEND_CURRENT_NODE_ID: string;
    sendPaletteOpened: ActionCreator<SendPaletteOpenedAction>;
    hideNavBarAndPalette: ActionCreator<HideNavBarAndPaletteAction>;
    openSidebar: ActionCreator<SidebarStateAction>;
    changeNodeName: ActionCreator<SidebarNodeNamechange>;
    changeMinInstances: ActionCreator<SidebarMinInstanceChanges>;
    changeMaxInstances: ActionCreator<SidebarMaxInstanceChanges>;
    incMinInstances: ActionCreator<IncMinInstances>;
    incMaxInstances: ActionCreator<IncMaxInstances>;
    decMinInstances: ActionCreator<DecMinInstances>;
    decMaxInstances: ActionCreator<DecMaxInstances>;
    saveNodeTemplate: ActionCreator<SaveNodeTemplateAction>;
    saveRelationship: ActionCreator<SaveRelationshipAction>;
    deleteNodeTemplate: ActionCreator<DeleteNodeAction>;
    deleteRelationshipTemplate: ActionCreator<DeleteRelationshipAction>;
    updateNodeCoordinates: ActionCreator<UpdateNodeCoordinatesAction>;
    updateRelationshipName: ActionCreator<UpdateRelationshipNameAction>;
    setProperty: ActionCreator<SetPropertyAction>;
    setCapability: ActionCreator<SetCababilityAction>;
    setRequirement: ActionCreator<SetRequirementAction>;
    setDeploymentArtifact: ActionCreator<SetDeploymentArtifactAction>;
    deleteDeploymentArtifact: ActionCreator<DeleteDeploymentArtifactAction>;
    setPolicy: ActionCreator<SetPolicyAction>;
    setTargetLocation: ActionCreator<SetTargetLocation>;
    deletePolicy: ActionCreator<DeletePolicyAction>;
    sendCurrentNodeId: ActionCreator<SendCurrentNodeIdAction>;
}
