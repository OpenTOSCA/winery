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
import {
    ChangeYamlPoliciesAction, DecMaxInstances, DecMinInstances, DeleteDeploymentArtifactAction, DeleteNodeAction, DeletePolicyAction, DeleteRelationshipAction,
    DeleteYamlArtifactAction, HideNavBarAndPaletteAction, IncMaxInstances, IncMinInstances, SaveNodeTemplateAction, SaveRelationshipAction,
    SendCurrentNodeIdAction, SendLiveModelingSidebarOpenedAction, SendPaletteOpenedAction, SetCababilityAction, SetDeploymentArtifactAction,
    SetLastSavedJsonTopologyAction, SetNodeInstanceStateAction, SetNodePropertyValidityAction, SetNodeVisuals, SetNodeWorkingAction, SetPolicyAction,
    SetPropertyAction, SetRequirementAction, SetTargetLocation, SetUnsavedChangesAction, SetYamlArtifactAction, SidebarMaxInstanceChanges,
    SidebarMinInstanceChanges, SidebarNodeNamechange, SidebarStateAction, UpdateNodeCoordinatesAction, UpdateRelationshipNameAction, WineryActions
} from '../actions/winery.actions';
import { TArtifact, TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from '../../models/ttopology-template';
import { TDeploymentArtifact } from '../../models/artifactsModalData';
import { Visuals } from '../../models/visuals';
import { TopologyTemplateUtil } from '../../models/topologyTemplateUtil';

export interface WineryState {
    currentPaletteOpenedState: boolean;
    hideNavBarAndPaletteState: boolean;
    sidebarContents: any;
    currentJsonTopology: TTopologyTemplate;
    currentNodeData: any;
    nodeVisuals: Visuals[];
    liveModelingSidebarOpenedState: boolean;
    lastSavedJsonTopology: TTopologyTemplate;
    unsavedChanges: boolean;
}

export const INITIAL_WINERY_STATE: WineryState = {
    currentPaletteOpenedState: true,
    hideNavBarAndPaletteState: false,
    sidebarContents: {
        sidebarVisible: false,
        nodeClicked: false,
        id: '',
        nameTextFieldValue: '',
        type: '',
        minInstances: 1,
        maxInstances: 1,
        properties: '',
        liveModelingNoteTemplateData: null,
        source: '',
        target: ''
    },
    currentJsonTopology: new TTopologyTemplate,
    currentNodeData: {
        id: '',
        focus: false
    },
    nodeVisuals: null,
    liveModelingSidebarOpenedState: false,
    lastSavedJsonTopology: null,
    unsavedChanges: false,
};

/**
 * Reducer for the rest of the topology modeler
 */
export const WineryReducer =
    function (lastState: WineryState = INITIAL_WINERY_STATE, action: Action): WineryState {
        switch (action.type) {
            case WineryActions.SEND_PALETTE_OPENED: {
                const paletteOpened: boolean = (<SendPaletteOpenedAction>action).paletteOpened;

                return <WineryState>{
                    ...lastState,
                    currentPaletteOpenedState: paletteOpened
                };
            }
            case WineryActions.HIDE_NAVBAR_AND_PALETTE: {
                const hideNavBarAndPalette: boolean = (<HideNavBarAndPaletteAction>action).hideNavBarAndPalette;

                return <WineryState>{
                    ...lastState,
                    hideNavBarAndPaletteState: hideNavBarAndPalette
                };
            }
            case WineryActions.OPEN_SIDEBAR: {
                const newSidebarData: any = (<SidebarStateAction>action).sidebarContents;

                return <WineryState>{
                    ...lastState,
                    sidebarContents: newSidebarData
                };
            }
            case WineryActions.CHANGE_MIN_INSTANCES: {
                const sideBarNodeId: any = (<SidebarMinInstanceChanges>action).minInstances.id;
                const minInstances: any = (<SidebarMinInstanceChanges>action).minInstances.count;
                const indexChangeMinInstances = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(sideBarNodeId);
                const fool = true;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === sideBarNodeId ?
                            nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('minInstances', minInstances.toString()) : nodeTemplate
                        )
                    }
                };
            }
            case WineryActions.CHANGE_MAX_INSTANCES: {
                const sideBarNodeId2: any = (<SidebarMaxInstanceChanges>action).maxInstances.id;
                const maxInstances: any = (<SidebarMaxInstanceChanges>action).maxInstances.count;
                const indexChangeMaxInstances = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(sideBarNodeId2);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === sideBarNodeId2 ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('maxInstances', maxInstances.toString()) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.INC_MIN_INSTANCES: {
                const id_incMinInstances: any = (<IncMinInstances>action).minInstances.id;
                const indexIncMinInstances = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(id_incMinInstances);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === id_incMinInstances ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('minInstances',
                                    (Number(lastState.currentJsonTopology.nodeTemplates[indexIncMinInstances].minInstances) + 1).toString())
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.DEC_MIN_INSTANCES: {
                const id_decMinInstances: any = (<DecMinInstances>action).minInstances.id;
                const indexDecMinInstances = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(id_decMinInstances);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === id_decMinInstances ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('minInstances',
                                    (Number(lastState.currentJsonTopology.nodeTemplates[indexDecMinInstances].minInstances) - 1).toString())
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.INC_MAX_INSTANCES: {
                const id_incMaxInstances: any = (<IncMaxInstances>action).maxInstances.id;
                const indexIncMaxInstances = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(id_incMaxInstances);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === id_incMaxInstances ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('maxInstances',
                                    (Number(lastState.currentJsonTopology.nodeTemplates[indexIncMaxInstances].maxInstances) + 1).toString())
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.DEC_MAX_INSTANCES: {
                const id_decMaxInstances: any = (<DecMaxInstances>action).maxInstances.id;
                const indexDecMaxInstances = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(id_decMaxInstances);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === id_decMaxInstances ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('maxInstances',
                                    (Number(lastState.currentJsonTopology.nodeTemplates[indexDecMaxInstances].maxInstances) - 1).toString())
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_REQUIREMENT: {
                const newRequirement: any = (<SetRequirementAction>action).nodeRequirement;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newRequirement.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('requirements',
                                    {
                                        requirement: newRequirement.requirement
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_PROPERTY: {
                const newProperty: any = (<SetPropertyAction>action).nodeProperty;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newProperty.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('properties',
                                    newProperty.propertyType === 'KV' ?
                                        { kvproperties: newProperty.newProperty } : { any: newProperty.newProperty }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_CAPABILITY: {
                const newCapability: any = (<SetCababilityAction>action).nodeCapability;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newCapability.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('capabilities',
                                    {
                                        capability: newCapability.capability
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_DEPLOYMENT_ARTIFACT: {
                const newDepArt: any = (<SetDeploymentArtifactAction>action).nodeDeploymentArtifact;
                const newDeploymentArtifact: TDeploymentArtifact = newDepArt.newDeploymentArtifact;
                const indexOfNodeDepArt = lastState.currentJsonTopology.nodeTemplates
                    .map(node => node.id).indexOf(newDepArt.nodeId);
                const nodeDepArtTemplate = lastState.currentJsonTopology.nodeTemplates
                    .find(nodeTemplate => nodeTemplate.id === newDepArt.nodeId);
                const depArtExist = nodeDepArtTemplate.deploymentArtifacts && nodeDepArtTemplate.deploymentArtifacts.deploymentArtifact;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newDepArt.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('deploymentArtifacts',
                                    depArtExist ? {
                                        deploymentArtifact: [
                                            ...lastState.currentJsonTopology.nodeTemplates[indexOfNodeDepArt].deploymentArtifacts.deploymentArtifact,
                                            newDeploymentArtifact
                                        ]
                                    } : {
                                        deploymentArtifact: [
                                            newDeploymentArtifact
                                        ]
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_YAML_ARTIFACT: {
                const newArtActionData: any = (<SetYamlArtifactAction>action).nodeYamlArtifact;
                const newYamlArtifact: TArtifact = newArtActionData.newYamlArtifact;
                const indexOfContainingNodeTemplate = lastState.currentJsonTopology.nodeTemplates
                    .map(node => node.id).indexOf(newArtActionData.nodeId);
                const containingNodeTemplate = lastState.currentJsonTopology.nodeTemplates
                    .find(nodeTemplate => nodeTemplate.id === newArtActionData.nodeId);
                const artifactsExistInNodeTemplate = containingNodeTemplate.artifacts && containingNodeTemplate.artifacts.artifact;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newArtActionData.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('artifacts',
                                    artifactsExistInNodeTemplate ?
                                        {
                                            artifact: [
                                                ...lastState.currentJsonTopology.nodeTemplates[indexOfContainingNodeTemplate].artifacts.artifact,
                                                newYamlArtifact
                                            ]
                                        } :
                                        {
                                            artifact: [
                                                newYamlArtifact
                                            ]
                                        }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.DELETE_DEPLOYMENT_ARTIFACT: {
                const deletedDeploymentArtifact: any = (<DeleteDeploymentArtifactAction>action).nodeDeploymentArtifact.deletedDeploymentArtifact;
                const indexOfNodeWithDeletedDeploymentArtifact = lastState.currentJsonTopology.nodeTemplates
                    .map((node) => {
                        return node.id;
                    })
                    .indexOf((<DeleteDeploymentArtifactAction>action).nodeDeploymentArtifact.nodeId);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map((nodeTemplate) => nodeTemplate.id === (<DeleteDeploymentArtifactAction>action).nodeDeploymentArtifact.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('deploymentArtifacts',
                                    {
                                        deploymentArtifact: [
                                            ...lastState.currentJsonTopology.nodeTemplates[indexOfNodeWithDeletedDeploymentArtifact]
                                                .deploymentArtifacts.deploymentArtifact
                                                .filter(da => da.name !== deletedDeploymentArtifact)
                                        ]
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.DELETE_YAML_ARTIFACT : {
                const deletedYamlArtifactId: any = (<DeleteYamlArtifactAction>action).nodeYamlArtifact.deletedYamlArtifactId;
                const indexOfNodeWithDeletedYamlArtifact = lastState.currentJsonTopology.nodeTemplates
                    .map(node => node.id)
                    .indexOf((<DeleteYamlArtifactAction>action).nodeYamlArtifact.nodeId);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map((nodeTemplate) => nodeTemplate.id === (<DeleteYamlArtifactAction>action).nodeYamlArtifact.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('artifacts',
                                    {
                                        artifact: [
                                            ...lastState.currentJsonTopology.nodeTemplates[indexOfNodeWithDeletedYamlArtifact]
                                                .artifacts.artifact
                                                .filter(a => a.id !== deletedYamlArtifactId)
                                        ]
                                    })
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_POLICY : {
                const newPolicy: any = (<SetPolicyAction>action).nodePolicy;
                const policy = newPolicy.newPolicy;
                const indexOfNodePolicy = lastState.currentJsonTopology.nodeTemplates
                    .map(node => node.id).indexOf(newPolicy.nodeId);
                const nodePolicyTemplate = lastState.currentJsonTopology.nodeTemplates
                    .find(nodeTemplate => nodeTemplate.id === newPolicy.nodeId);
                const policyExist = nodePolicyTemplate.policies && nodePolicyTemplate.policies.policy;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newPolicy.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('policies',
                                    policyExist ? {
                                        policy: [
                                            ...lastState.currentJsonTopology.nodeTemplates[indexOfNodePolicy].policies.policy,
                                            policy
                                        ]
                                    } : {
                                        policy: [
                                            policy
                                        ]
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.UPDATE_YAML_POLICIES : {
                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        policies: (<ChangeYamlPoliciesAction>action).yamlPolicies.policies
                    }
                };
            }
            case WineryActions.SET_POLICY_FOR_RELATIONSHIP : {
                const newRelPolicy: any = (<SetPolicyAction>action).nodePolicy;
                const relPolicy = newRelPolicy.newPolicy;
                const indexOfRelationshipPolicy = lastState.currentJsonTopology.relationshipTemplates
                    .map(node => node.id).indexOf(newRelPolicy.nodeId);
                const relationshipPolicyTemplate = lastState.currentJsonTopology.relationshipTemplates
                    .find(relationshipTemplate => relationshipTemplate.id === newRelPolicy.nodeId);
                const policyExistCheck = relationshipPolicyTemplate.policies && relationshipPolicyTemplate.policies.policy;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates
                            .map(relationshipTemplate => relationshipTemplate.id === newRelPolicy.nodeId ?
                                relationshipTemplate.generateNewRelTemplateWithUpdatedAttribute('policies',
                                    policyExistCheck ? {
                                        policy: [
                                            ...lastState.currentJsonTopology.relationshipTemplates[indexOfRelationshipPolicy].policies.policy,
                                            relPolicy
                                        ]
                                    } : {
                                        policy: [
                                            relPolicy
                                        ]
                                    }) : relationshipTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_TARGET_LOCATION : {
                const newTargetLocation: any = (<SetTargetLocation>action).nodeTargetLocation;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newTargetLocation.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('location',
                                    newTargetLocation.newTargetLocation) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.DELETE_POLICY : {
                const deletedPolicy: any = (<DeletePolicyAction>action).nodePolicy.deletedPolicy;
                const indexOfNodeWithDeletedPolicy = lastState.currentJsonTopology.nodeTemplates
                    .map((node) => {
                        return node.id;
                    })
                    .indexOf((<DeletePolicyAction>action).nodePolicy.nodeId);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map((nodeTemplate) => nodeTemplate.id === (<DeletePolicyAction>action).nodePolicy.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('policies',
                                    {
                                        policy: [
                                            ...lastState.currentJsonTopology.nodeTemplates[indexOfNodeWithDeletedPolicy]
                                                .policies.policy
                                                .filter(da => da.name !== deletedPolicy)
                                        ]
                                    }) : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.CHANGE_NODE_NAME : {
                const newNodeName: any = (<SidebarNodeNamechange>action).nodeNames;
                const indexChangeNodeName = lastState.currentJsonTopology.nodeTemplates
                    .map(el => el.id).indexOf(newNodeName.id);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === newNodeName.id ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('name', newNodeName.newNodeName)
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.UPDATE_NODE_COORDINATES : {
                const currentNodeCoordinates: any = (<UpdateNodeCoordinatesAction>action).otherAttributes;
                const nodeId = currentNodeCoordinates.id;
                const otherAttributes = {
                    x: currentNodeCoordinates.x,
                    y: currentNodeCoordinates.y
                };
                const indexUpdateNodeCoordinates = lastState.currentJsonTopology.nodeTemplates
                    .map(nodeTemplate => nodeTemplate.id).indexOf(nodeId);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('coordinates', otherAttributes)
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SAVE_NODE_TEMPLATE : {
                const newNode: TNodeTemplate = (<SaveNodeTemplateAction>action).nodeTemplate;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: [...lastState.currentJsonTopology.nodeTemplates, newNode]
                    }
                };
            }
            case WineryActions.SAVE_RELATIONSHIP : {
                const newRelationship: TRelationshipTemplate = (<SaveRelationshipAction>action).relationshipTemplate;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        relationshipTemplates: [...lastState.currentJsonTopology.relationshipTemplates, newRelationship]
                    }
                };
            }
            case WineryActions.DELETE_NODE_TEMPLATE : {
                const deletedNodeId: string = (<DeleteNodeAction>action).nodeTemplateId;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .filter(nodeTemplate => nodeTemplate.id !== deletedNodeId),
                        relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates.filter(
                            relationshipTemplate => relationshipTemplate.sourceElement.ref !== deletedNodeId &&
                                relationshipTemplate.targetElement.ref !== deletedNodeId),
                        // we check if the targets of YAML policies include the deleted node template<
                        policies: {
                            policy: lastState.currentJsonTopology.policies.policy.map(pol => {
                                if (pol.targets) {
                                    pol.targets = pol.targets.filter(target => target !== deletedNodeId);
                                    // to keep a consistent behavior, if no targets remain, remove the field.
                                    if (pol.targets.length === 0) {
                                        pol.targets = undefined;
                                    }
                                }

                                return pol;
                            })
                        }
                    }
                };
            }
            case WineryActions.DELETE_RELATIONSHIP_TEMPLATE : {
                const deletedRelNodeId: string = (<DeleteRelationshipAction>action).nodeTemplateId;

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates.filter(
                            relationshipTemplate => relationshipTemplate.id !== deletedRelNodeId)
                    }
                };
            }
            case WineryActions.UPDATE_REL_DATA : {
                const relData: any = (<UpdateRelationshipNameAction>action).relData;
                const indexRel = lastState.currentJsonTopology.relationshipTemplates
                    .map(rel => rel.id).indexOf(relData.id);

                return <WineryState>{
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates
                            .map(relTemplate => relTemplate.id === relData.id ?
                                relTemplate.generateNewRelTemplateWithUpdatedAttribute('name', relData.newRelName)
                                : relTemplate
                            )
                    }
                };
            }
            case WineryActions.SEND_CURRENT_NODE_ID : {
                const currentNodeData: string = (<SendCurrentNodeIdAction>action).currentNodeData;

                return <WineryState>{
                    ...lastState,
                    currentNodeData: currentNodeData
                };
            }
            case WineryActions.SET_NODE_VISUALS : {
                const visuals: Visuals[] = (<SetNodeVisuals>action).visuals;

                return {
                    ...lastState,
                    nodeVisuals: visuals
                };
            }
            case WineryActions.SEND_LIVE_MODELING_SIDEBAR_OPENED : {
                const sidebarOpened: boolean = (<SendLiveModelingSidebarOpenedAction>action).sidebarOpened;

                return <WineryState>{
                    ...lastState,
                    liveModelingSidebarOpenedState: sidebarOpened
                };
            }
            case WineryActions.SET_LAST_SAVED_JSON_TOPOLOGY : {
                const lastSavedJsonTopology: TTopologyTemplate = (<SetLastSavedJsonTopologyAction>action).lastSavedJsonTopology;

                return {
                    ...lastState,
                    lastSavedJsonTopology: TopologyTemplateUtil.cloneTopologyTemplate(lastSavedJsonTopology)
                };
            }
            case WineryActions.SET_UNSAVED_CHANGES : {
                const unsavedChanges: boolean = (<SetUnsavedChangesAction>action).unsavedChanges;

                return {
                    ...lastState,
                    unsavedChanges: unsavedChanges
                };
            }
            case WineryActions.SET_NODE_VALIDITY : {
                const nodeValidity = (<SetNodePropertyValidityAction>action).nodeValidity;

                return {
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === nodeValidity.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('valid', nodeValidity.valid)
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_NODE_INSTANCE_STATE: {
                const nodeInstanceState = (<SetNodeInstanceStateAction>action).nodeInstanceState;

                return {
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === nodeInstanceState.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('instanceState', nodeInstanceState.state)
                                : nodeTemplate
                            )
                    }
                };
            }
            case WineryActions.SET_NODE_WORKING: {
                const nodeWorking = (<SetNodeWorkingAction>action).nodeWorking;

                return {
                    ...lastState,
                    currentJsonTopology: {
                        ...lastState.currentJsonTopology,
                        nodeTemplates: lastState.currentJsonTopology.nodeTemplates
                            .map(nodeTemplate => nodeTemplate.id === nodeWorking.nodeId ?
                                nodeTemplate.generateNewNodeTemplateWithUpdatedAttribute('working', nodeWorking.working)
                                : nodeTemplate
                            )
                    }
                };
            }
            default:
                return <WineryState>lastState;
        }
    };
