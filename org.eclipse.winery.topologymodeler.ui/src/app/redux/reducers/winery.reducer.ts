/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Thommy Zelenik - initial API and implementation
 */
import { Action } from 'redux';
import {
  DeleteNodeAction,
  SaveNodeTemplateAction,
  SaveRelationshipAction,
  SendPaletteOpenedAction,
  SidebarNodeNamechange,
  SidebarStateAction,
  UpdateNodeCoordinatesAction,
  WineryActions,
  UpdateRelationshipNameAction
} from '../actions/winery.actions';
import { TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from 'app/ttopology-template';

export interface WineryState {
  currentPaletteOpenedState: boolean;
  sidebarContents: any;
  currentJsonTopology: TTopologyTemplate;
}

export const INITIAL_WINERY_STATE: WineryState = {
  currentPaletteOpenedState: false,
  sidebarContents: {
    sidebarVisible: false,
    nodeClicked: false,
    id: '',
    nameTextFieldValue: '',
    type: ''
  },
  currentJsonTopology: new TTopologyTemplate
};

export const WineryReducer =
  function (lastState: WineryState = INITIAL_WINERY_STATE, action: Action): WineryState {
    switch (action.type) {
      case WineryActions.SEND_PALETTE_OPENED:
        const paletteOpened: boolean = (<SendPaletteOpenedAction>action).paletteOpened;
        return {
          ...lastState,
          currentPaletteOpenedState: paletteOpened
        };
      case WineryActions.OPEN_SIDEBAR:
        const newSidebarData: any = (<SidebarStateAction>action).sidebarContents;
        /*console.log({
         ...lastState,
         sidebarContents: newSidebarData
         });*/
        return {
          ...lastState,
          sidebarContents: newSidebarData
        };
      case WineryActions.CHANGE_NODE_NAME:
        const nodeNames: any = (<SidebarNodeNamechange>action).nodeNames;
        const index = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(nodeNames.id);
        /*
        console.log(index);
        console.log(nodeNames);
        console.log({
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === nodeNames.id ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[index].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[index].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[index].type,
                // name
                nodeNames.newNodeName,
                lastState.currentJsonTopology.nodeTemplates[index].minInstances,
                lastState.currentJsonTopology.nodeTemplates[index].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[index].color,
                lastState.currentJsonTopology.nodeTemplates[index].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[index].any,
                lastState.currentJsonTopology.nodeTemplates[index].documentation,
                lastState.currentJsonTopology.nodeTemplates[index].otherAttributes
              ) : nodeTemplate
            )
          }
        });
        */
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === nodeNames.id ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[index].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[index].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[index].type,
                // name
                nodeNames.newNodeName,
                lastState.currentJsonTopology.nodeTemplates[index].minInstances,
                lastState.currentJsonTopology.nodeTemplates[index].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[index].color,
                lastState.currentJsonTopology.nodeTemplates[index].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[index].any,
                lastState.currentJsonTopology.nodeTemplates[index].documentation,
                lastState.currentJsonTopology.nodeTemplates[index].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.UPDATE_NODE_COORDINATES:
        const currentNodeCoordinates: any = (<UpdateNodeCoordinatesAction>action).otherAttributes;
        const otherAttributes = {
          x: currentNodeCoordinates.x,
          y: currentNodeCoordinates.y
        };
        const nodeId = currentNodeCoordinates.id;
        const nodeIndex = lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id).indexOf(nodeId);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === nodeId ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].properties,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].id,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].type,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].name,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].minInstances,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].color,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].any,
                lastState.currentJsonTopology.nodeTemplates[nodeIndex].documentation,
                otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.SAVE_NODE_TEMPLATE :
        const newNode: TNodeTemplate = (<SaveNodeTemplateAction>action).nodeTemplate;
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: [...lastState.currentJsonTopology.nodeTemplates, newNode]
          }
        };
      case WineryActions.SAVE_RELATIONSHIP :
        const newRelationship: TRelationshipTemplate = (<SaveRelationshipAction>action).relationshipTemplate;
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            relationshipTemplates: [...lastState.currentJsonTopology.relationshipTemplates, newRelationship]
          }
        };
      case WineryActions.DELETE_NODE_TEMPLATE:
        const deletedNodeId: string = (<DeleteNodeAction>action).nodeTemplateId;
        return {
          ...lastState,
          currentJsonTopology: {
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.filter(nodeTemplate => nodeTemplate.id !== deletedNodeId),
            relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates.filter(
              relationshipTemplate => relationshipTemplate.sourceElement !== deletedNodeId &&
              relationshipTemplate.targetElement !== deletedNodeId)
          }
        };
      case WineryActions.UPDATE_REL_DATA:
        const relData: any = (<UpdateRelationshipNameAction>action).relData;
        const indexRel = lastState.currentJsonTopology.relationshipTemplates.map(rel => rel.id).indexOf(relData.id);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            relationshipTemplates: lastState.currentJsonTopology.relationshipTemplates.map(relTemplate => relTemplate.id === relData.id ?
              new TRelationshipTemplate(
                lastState.currentJsonTopology.relationshipTemplates[indexRel].sourceElement,
                lastState.currentJsonTopology.relationshipTemplates[indexRel].targetElement,
                relData.newRelName,
                lastState.currentJsonTopology.relationshipTemplates[indexRel].id,
                lastState.currentJsonTopology.relationshipTemplates[indexRel].type,
              ) : relTemplate
            )
          }
        };
      default:
        return lastState;
    }
  };

