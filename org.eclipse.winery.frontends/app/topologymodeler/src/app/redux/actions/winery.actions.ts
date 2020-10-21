/********************************************************************************
 * Copyright (c) 2017-2020 Contributors to the Eclipse Foundation
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

import { Action } from 'redux';
import { Injectable } from '@angular/core';
import { TArtifact, TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from '../../models/ttopology-template';
import { TDeploymentArtifact } from '../../models/artifactsModalData';
import { TPolicy } from '../../models/policiesModalData';
import { Visuals } from '../../models/visuals';
import { NodeTemplateInstanceStates } from '../../models/enums';

export interface SendPaletteOpenedAction extends Action {
    paletteOpened: boolean;
}

export interface HideNavBarAndPaletteAction extends Action {
    hideNavBarAndPalette: boolean;
}

export interface SidebarStateAction extends Action {
    sidebarContents: {
        sidebarVisible: boolean,
        nodeClicked: boolean,
        id: string,
        nameTextFieldValue: string,
        type: string,
        minInstances: string,
        maxInstances: string,
        properties: string,
        source: string,
        target: string
    };
}

export interface SidebarNodeNamechange extends Action {
    nodeNames: {
        newNodeName: string,
        id: string
    };
}

export interface SidebarMinInstanceChanges extends Action {
    minInstances: {
        id: string,
        count: number
    };
}

export interface SidebarMaxInstanceChanges extends Action {
    maxInstances: {
        id: string,
        count: number
    };
}

export interface IncMaxInstances extends Action {
    maxInstances: {
        id: string
    };
}

export interface DecMaxInstances extends Action {
    maxInstances: {
        id: string
    };
}

export interface IncMinInstances extends Action {
    minInstances: {
        id: string
    };
}

export interface DecMinInstances extends Action {
    minInstances: {
        id: string
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
        newRelName: string,
        id: string
    };
}

export interface SetPropertyAction extends Action {
    nodeProperty: {
        newProperty: any,
        propertyType: string,
        nodeId: string,
    };
}

export interface SetCababilityAction extends Action {
    nodeCapability: {
        nodeId: string,
        color: string,
        id: string,
        name: string,
        namespace: string,
        qName: string
    };
}

export interface SetRequirementAction extends Action {
    nodeRequirement: {
        nodeId: string,
        color: string,
        id: string,
        name: string,
        namespace: string,
        qName: string
    };
}

export interface SetDeploymentArtifactAction extends Action {
    nodeDeploymentArtifact: {
        nodeId: string,
        newDeploymentArtifact: TDeploymentArtifact
    };
}

export interface SetYamlArtifactAction extends Action {
    nodeYamlArtifact: {
        nodeId: string,
        newYamlArtifact: TArtifact
    };
}

export interface DeleteYamlArtifactAction extends Action {
    nodeYamlArtifact: {
        nodeId: string,
        deletedYamlArtifactId: TArtifact
    };
}

export interface DeleteDeploymentArtifactAction extends Action {
    nodeDeploymentArtifact: {
        nodeId: string,
        deletedDeploymentArtifact: any
    };
}

export interface SetPolicyAction extends Action {
    nodePolicy: {
        nodeId: string,
        newPolicy: TPolicy
    };
}

export interface ChangeYamlPoliciesAction extends Action {
    yamlPolicies: {
        policies: { policy: TPolicy[] }
    };
}

export interface SetTargetLocation extends Action {
    nodeTargetLocation: {
        nodeId: string,
        newTargetLocation: string
    };
}

export interface DeletePolicyAction extends Action {
    nodePolicy: {
        nodeId: string,
        deletedPolicy: any
    };
}

export interface SendCurrentNodeIdAction extends Action {
    currentNodeData: any;
}

export interface SetNodeVisuals extends Action {
    visuals: Visuals[];
}

export interface SendLiveModelingSidebarOpenedAction extends Action {
    sidebarOpened: boolean;
}

export interface SetLastSavedJsonTopologyAction extends Action {
    lastSavedJsonTopology: TTopologyTemplate;
}

export interface SetUnsavedChangesAction extends Action {
    unsavedChanges: boolean;
}

export interface SetNodePropertyValidityAction extends Action {
    nodeValidity: {
        nodeId: string;
        valid: boolean;
    };
}

export interface SetNodeInstanceStateAction extends Action {
    nodeInstanceState: {
        nodeId: string;
        state: NodeTemplateInstanceStates
    };
}

export interface SetNodeWorkingAction extends Action {
    nodeWorking: {
        nodeId: string;
        working: boolean;
    };
}

/**
 * Winery Actions
 */
@Injectable()
export class WineryActions {

    static SEND_PALETTE_OPENED = 'SEND_PALETTE_OPENED';
    static HIDE_NAVBAR_AND_PALETTE = 'HIDE_NAVBAR_AND_PALETTE';
    static SAVE_NODE_TEMPLATE = 'SAVE_NODE_TEMPLATE';
    static SAVE_RELATIONSHIP = 'SAVE_RELATIONSHIP';
    static DELETE_NODE_TEMPLATE = 'DELETE_NODE_TEMPLATE';
    static DELETE_RELATIONSHIP_TEMPLATE = 'DELETE_RELATIONSHIP_TEMPLATE';
    static CHANGE_NODE_NAME = 'CHANGE_NODE_NAME';
    static OPEN_SIDEBAR = 'OPEN_SIDEBAR';
    static UPDATE_NODE_COORDINATES = 'UPDATE_NODE_COORDINATES';
    static UPDATE_REL_DATA = 'UPDATE_REL_DATA';
    static CHANGE_MIN_INSTANCES = 'CHANGE_MIN_INSTANCES';
    static CHANGE_MAX_INSTANCES = 'CHANGE_MAX_INSTANCES';

    static INC_MIN_INSTANCES = 'INC_MIN_INSTANCES';
    static DEC_MIN_INSTANCES = 'DEC_MIN_INSTANCES';

    static INC_MAX_INSTANCES = 'INC_MAX_INSTANCES';
    static DEC_MAX_INSTANCES = 'DEC_MAX_INSTANCES';
    static SET_PROPERTY = 'SET_PROPERTY';
    static SET_CAPABILITY = 'SET_CAPABILITY';
    static SET_REQUIREMENT = 'SET_REQUIREMENT';
    static SET_DEPLOYMENT_ARTIFACT = 'SET_DEPLOYMENT_ARTIFACT';
    static DELETE_DEPLOYMENT_ARTIFACT = 'DELETE_DEPLOYMENT_ARTIFACT';
    static SET_YAML_ARTIFACT = 'SET_YAML_ARTIFACT';
    static DELETE_YAML_ARTIFACT = 'DELETE_YAML_ARTIFACT';
    static SET_POLICY = 'SET_POLICY';
    static UPDATE_YAML_POLICIES = 'UPDATE_YAML_POLICIES';
    static SET_POLICY_FOR_RELATIONSHIP = 'SET_POLICY_FOR_RELATIONSHIP';
    static SET_TARGET_LOCATION = 'SET_TARGET_LOCATION';
    static DELETE_POLICY = 'DELETE_POLICY';
    static SEND_CURRENT_NODE_ID = 'SEND_CURRENT_NODE_ID';
    static SET_NODE_VISUALS = 'SET_NODE_VISUALS';
    static SEND_LIVE_MODELING_SIDEBAR_OPENED = 'SEND_LIVE_MODELING_SIDEBAR_OPENED';

    static SET_LAST_SAVED_JSON_TOPOLOGY = 'SET_LAST_SAVED_JSON_TOPOLOGY';
    static SET_UNSAVED_CHANGES = 'SET_UNSAVED_CHANGES';
    static SET_NODE_VALIDITY = 'SET_NODE_VALIDITY';
    static SET_NODE_INSTANCE_STATE = 'SET_NODE_INSTANCE_STATE';
    static SET_NODE_WORKING = 'SET_NODE_WORKING';

    sendPaletteOpened(paletteOpened: boolean): SendPaletteOpenedAction {
        return {
            type: WineryActions.SEND_PALETTE_OPENED,
            paletteOpened: paletteOpened
        };
    }

    hideNavBarAndPalette(hideNavBarAndPalette: boolean): HideNavBarAndPaletteAction {
        return {
            type: WineryActions.HIDE_NAVBAR_AND_PALETTE,
            hideNavBarAndPalette: hideNavBarAndPalette
        };
    }

    openSidebar(newSidebarData): SidebarStateAction {
        return {
            type: WineryActions.OPEN_SIDEBAR,
            sidebarContents: newSidebarData.sidebarContents
        };
    }

    changeNodeName(nodeNames): SidebarNodeNamechange {
        return {
            type: WineryActions.CHANGE_NODE_NAME,
            nodeNames: nodeNames.nodeNames
        };
    }

    changeMinInstances(minInstances): SidebarMinInstanceChanges {
        return {
            type: WineryActions.CHANGE_MIN_INSTANCES,
            minInstances: minInstances.minInstances
        };
    }

    changeMaxInstances(maxInstances): SidebarMaxInstanceChanges {
        return {
            type: WineryActions.CHANGE_MAX_INSTANCES,
            maxInstances: maxInstances.maxInstances
        };
    }

    incMinInstances(minInstances): IncMinInstances {
        return {
            type: WineryActions.INC_MIN_INSTANCES,
            minInstances: minInstances.minInstances
        };
    }

    incMaxInstances(maxInstances): IncMaxInstances {
        return {
            type: WineryActions.INC_MAX_INSTANCES,
            maxInstances: maxInstances.maxInstances
        };
    }

    decMinInstances(minInstances): DecMinInstances {
        return {
            type: WineryActions.DEC_MIN_INSTANCES,
            minInstances: minInstances.minInstances
        };
    }

    decMaxInstances(maxInstances): DecMaxInstances {
        return {
            type: WineryActions.DEC_MAX_INSTANCES,
            maxInstances: maxInstances.maxInstances
        };
    }

    saveNodeTemplate(newNode): SaveNodeTemplateAction {
        return {
            type: WineryActions.SAVE_NODE_TEMPLATE,
            nodeTemplate: newNode
        };
    }

    saveRelationship(newRelationship): SaveRelationshipAction {
        return {
            type: WineryActions.SAVE_RELATIONSHIP,
            relationshipTemplate: newRelationship
        };
    }

    deleteNodeTemplate(deletedNodeId): DeleteNodeAction {
        return {
            type: WineryActions.DELETE_NODE_TEMPLATE,
            nodeTemplateId: deletedNodeId
        };
    }

    deleteRelationshipTemplate(deletedRelationshipId): DeleteRelationshipAction {
        return {
            type: WineryActions.DELETE_RELATIONSHIP_TEMPLATE,
            nodeTemplateId: deletedRelationshipId
        };
    }

    updateNodeCoordinates(currentNodeCoordinates): UpdateNodeCoordinatesAction {
        return {
            type: WineryActions.UPDATE_NODE_COORDINATES,
            otherAttributes: currentNodeCoordinates
        };
    }

    updateRelationshipName(currentRelData): UpdateRelationshipNameAction {
        return {
            type: WineryActions.UPDATE_REL_DATA,
            relData: currentRelData.relData
        };
    }

    setProperty(newProperty): SetPropertyAction {
        return {
            type: WineryActions.SET_PROPERTY,
            nodeProperty: newProperty.nodeProperty
        };
    }

    setCapability(newCapability): SetCababilityAction {
        return {
            type: WineryActions.SET_CAPABILITY,
            nodeCapability: newCapability
        };
    }

    setRequirement(newRequirement): SetRequirementAction {
        return {
            type: WineryActions.SET_REQUIREMENT,
            nodeRequirement: newRequirement
        };
    }

    setDeploymentArtifact(newDepArt): SetDeploymentArtifactAction {
        return {
            type: WineryActions.SET_DEPLOYMENT_ARTIFACT,
            nodeDeploymentArtifact: newDepArt
        };
    }

    deleteDeploymentArtifact(deletedDeploymentArtifact): DeleteDeploymentArtifactAction {
        return {
            type: WineryActions.DELETE_DEPLOYMENT_ARTIFACT,
            nodeDeploymentArtifact: deletedDeploymentArtifact
        };
    }

    setYamlArtifact(newYamlArt): SetYamlArtifactAction {
        return {
            type: WineryActions.SET_YAML_ARTIFACT,
            nodeYamlArtifact: newYamlArt
        };
    }

    deleteYamlArtifact(deletedYamlArt): DeleteYamlArtifactAction {
        return {
            type: WineryActions.DELETE_YAML_ARTIFACT,
            nodeYamlArtifact: deletedYamlArt
        };
    }

    setPolicy(newPolicy): SetPolicyAction {
        return {
            type: WineryActions.SET_POLICY,
            nodePolicy: newPolicy
        };
    }

    setPolicyForRelationship(newPolicy): SetPolicyAction {
        return {
            type: WineryActions.SET_POLICY_FOR_RELATIONSHIP,
            nodePolicy: newPolicy
        };
    }

    changeYamlPolicies(policies): ChangeYamlPoliciesAction {
        return {
            type: WineryActions.UPDATE_YAML_POLICIES,
            yamlPolicies: {
                policies: {
                    policy: policies
                }
            }
        };
    }

    setTargetLocation(newTargetLocation): SetTargetLocation {
        return {
            type: WineryActions.SET_TARGET_LOCATION,
            nodeTargetLocation: newTargetLocation
        };
    }

    deletePolicy(deletedPolicy): DeletePolicyAction {
        return {
            type: WineryActions.DELETE_POLICY,
            nodePolicy: deletedPolicy
        };
    }

    sendCurrentNodeId(currentNodeData): SendCurrentNodeIdAction {
        return {
            type: WineryActions.SEND_CURRENT_NODE_ID,
            currentNodeData: currentNodeData
        };
    }

    setNodeVisuals(visuals): SetNodeVisuals {
        return {
            type: WineryActions.SET_NODE_VISUALS,
            visuals: visuals
        };
    }

    sendLiveModelingSidebarOpened(sidebarOpened): SendLiveModelingSidebarOpenedAction {
        return {
            type: WineryActions.SEND_LIVE_MODELING_SIDEBAR_OPENED,
            sidebarOpened: sidebarOpened
        };
    }

    setLastSavedJsonTopology(lastSavedJsonTopology: TTopologyTemplate): SetLastSavedJsonTopologyAction {
        return {
            type: WineryActions.SET_LAST_SAVED_JSON_TOPOLOGY,
            lastSavedJsonTopology: lastSavedJsonTopology
        };
    }

    setUnsavedChanges(unsavedChanges: boolean): SetUnsavedChangesAction {
        return {
            type: WineryActions.SET_UNSAVED_CHANGES,
            unsavedChanges: unsavedChanges
        };
    }

    setNodePropertyValidity(nodeId: string, valid: boolean): SetNodePropertyValidityAction {
        return {
            type: WineryActions.SET_NODE_VALIDITY,
            nodeValidity: {
                nodeId: nodeId,
                valid: valid
            }
        };
    }

    setNodeInstanceState(nodeId: string, state: NodeTemplateInstanceStates): SetNodeInstanceStateAction {
        return {
            type: WineryActions.SET_NODE_INSTANCE_STATE,
            nodeInstanceState: {
                nodeId: nodeId,
                state: state
            }
        };
    }

    setNodeWorking(nodeId: string, working: boolean): SetNodeWorkingAction {
        return {
            type: WineryActions.SET_NODE_WORKING,
            nodeWorking: {
                nodeId: nodeId,
                working: working
            }
        };
    }
}
