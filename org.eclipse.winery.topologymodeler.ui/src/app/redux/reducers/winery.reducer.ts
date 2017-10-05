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
  UpdateRelationshipNameAction, SidebarMinInstanceChanges, SidebarMaxInstanceChanges, IncMinInstances, DecMinInstances,
  DecMaxInstances, IncMaxInstances
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
    type: '',
    minInstances: 1,
    maxInstances: 1
  },
  currentJsonTopology: new TTopologyTemplate
};

/**
 * Reducer for the rest of the topology modeler
 */
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
      case WineryActions.CHANGE_MIN_INSTANCES:
        const sideBarNodeId: any = (<SidebarMinInstanceChanges>action).minInstances.id;
        const minInstances: any = (<SidebarMinInstanceChanges>action).minInstances.count;
        const i = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(sideBarNodeId);
        console.log('asd' + minInstances);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === sideBarNodeId ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[i].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[i].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[i].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[i].name,
                minInstances,
                lastState.currentJsonTopology.nodeTemplates[i].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[i].color,
                lastState.currentJsonTopology.nodeTemplates[i].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[i].any,
                lastState.currentJsonTopology.nodeTemplates[i].documentation,
                lastState.currentJsonTopology.nodeTemplates[i].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.CHANGE_MAX_INSTANCES:
        const sideBarNodeId2: any = (<SidebarMaxInstanceChanges>action).maxInstances.id;
        const maxInstances: any = (<SidebarMaxInstanceChanges>action).maxInstances.count;
        console.log(sideBarNodeId2);
        const j = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(sideBarNodeId2);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === sideBarNodeId2 ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[j].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[j].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[j].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[j].name,
                lastState.currentJsonTopology.nodeTemplates[j].minInstances,
                maxInstances,
                lastState.currentJsonTopology.nodeTemplates[j].color,
                lastState.currentJsonTopology.nodeTemplates[j].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[j].any,
                lastState.currentJsonTopology.nodeTemplates[j].documentation,
                lastState.currentJsonTopology.nodeTemplates[j].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.INC_MIN_INSTANCES:
        const id_incMinInstances: any = (<IncMinInstances>action).minInstances.id;
        const k = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(id_incMinInstances);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === id_incMinInstances ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[k].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[k].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[k].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[k].name,
                Number(lastState.currentJsonTopology.nodeTemplates[k].minInstances) + 1,
                lastState.currentJsonTopology.nodeTemplates[k].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[k].color,
                lastState.currentJsonTopology.nodeTemplates[k].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[k].any,
                lastState.currentJsonTopology.nodeTemplates[k].documentation,
                lastState.currentJsonTopology.nodeTemplates[k].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.DEC_MIN_INSTANCES:
        const id_decMinInstances: any = (<DecMinInstances>action).minInstances.id;
        const l = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(id_decMinInstances);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === id_decMinInstances ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[l].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[l].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[l].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[l].name,
                Number(lastState.currentJsonTopology.nodeTemplates[l].minInstances) - 1,
                lastState.currentJsonTopology.nodeTemplates[l].maxInstances,
                lastState.currentJsonTopology.nodeTemplates[l].color,
                lastState.currentJsonTopology.nodeTemplates[l].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[l].any,
                lastState.currentJsonTopology.nodeTemplates[l].documentation,
                lastState.currentJsonTopology.nodeTemplates[l].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.INC_MAX_INSTANCES:
        const id_incMaxInstances: any = (<IncMaxInstances>action).maxInstances.id;
        const m = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(id_incMaxInstances);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === id_incMaxInstances ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[m].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[m].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[m].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[m].name,
                lastState.currentJsonTopology.nodeTemplates[m].minInstances,
                Number(lastState.currentJsonTopology.nodeTemplates[m].maxInstances) + 1,
                lastState.currentJsonTopology.nodeTemplates[m].color,
                lastState.currentJsonTopology.nodeTemplates[m].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[m].any,
                lastState.currentJsonTopology.nodeTemplates[m].documentation,
                lastState.currentJsonTopology.nodeTemplates[m].otherAttributes
              ) : nodeTemplate
            )
          }
        };
      case WineryActions.DEC_MAX_INSTANCES:
        const id_decMaxInstances: any = (<DecMaxInstances>action).maxInstances.id;
        const n = lastState.currentJsonTopology.nodeTemplates.map(el => el.id).indexOf(id_decMaxInstances);
        return {
          ...lastState,
          currentJsonTopology: {
            ...lastState.currentJsonTopology,
            nodeTemplates: lastState.currentJsonTopology.nodeTemplates.map(nodeTemplate => nodeTemplate.id === id_decMaxInstances ?
              new TNodeTemplate(
                lastState.currentJsonTopology.nodeTemplates[n].properties,
                // id
                lastState.currentJsonTopology.nodeTemplates[n].id,
                // type
                lastState.currentJsonTopology.nodeTemplates[n].type,
                // name
                lastState.currentJsonTopology.nodeTemplates[n].name,
                lastState.currentJsonTopology.nodeTemplates[n].minInstances,
                Number(lastState.currentJsonTopology.nodeTemplates[n].maxInstances) - 1,
                lastState.currentJsonTopology.nodeTemplates[n].color,
                lastState.currentJsonTopology.nodeTemplates[n].imageUrl,
                lastState.currentJsonTopology.nodeTemplates[n].any,
                lastState.currentJsonTopology.nodeTemplates[n].documentation,
                lastState.currentJsonTopology.nodeTemplates[n].otherAttributes
              ) : nodeTemplate
            )
          }
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

