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
import { Action, ActionCreator } from 'redux';
import { Injectable } from '@angular/core';
import { TNodeTemplate, TRelationshipTemplate } from '../../ttopology-template';

export interface SendPaletteOpenedAction extends Action {
  paletteOpened: boolean;
}

export interface SidebarStateAction extends Action {
  sidebarContents: {
    sidebarVisible: boolean,
    nodeClicked: boolean,
    id: string,
    nameTextFieldValue: string,
    type: string,
    minInstances: string,
    maxInstances: string
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

export interface UpdateRelationshipNameAction extends Action {
  relData: {
    newRelName: string,
    id: string
  };
}

/**
 * Winery Actions
 */
@Injectable()
export class WineryActions {

    static SEND_PALETTE_OPENED = 'SEND_PALETTE_OPENED';
    static SAVE_NODE_TEMPLATE = 'SAVE_NODE_TEMPLATE';
    static SAVE_RELATIONSHIP = 'SAVE_RELATIONSHIP';
    static DELETE_NODE_TEMPLATE = 'DELETE_NODE_TEMPLATE';
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

    sendPaletteOpened: ActionCreator<SendPaletteOpenedAction> =
      ((paletteOpened) => ({
        type: WineryActions.SEND_PALETTE_OPENED,
        paletteOpened: paletteOpened
      }));
    openSidebar: ActionCreator<SidebarStateAction> =
      ((newSidebarData) => ({
        type: WineryActions.OPEN_SIDEBAR,
        sidebarContents: newSidebarData.sidebarContents
      }));
    changeNodeName: ActionCreator<SidebarNodeNamechange> =
      ((nodeNames) => ({
        type: WineryActions.CHANGE_NODE_NAME,
        nodeNames: nodeNames.nodeNames
      }));
    changeMinInstances: ActionCreator<SidebarMinInstanceChanges> =
      ((minInstances) => ({
        type: WineryActions.CHANGE_MIN_INSTANCES,
        minInstances: minInstances.minInstances
      }));
    changeMaxInstances: ActionCreator<SidebarMaxInstanceChanges> =
      ((maxInstances) => ({
        type: WineryActions.CHANGE_MAX_INSTANCES,
        maxInstances: maxInstances.maxInstances
    }));
    incMinInstances: ActionCreator<IncMinInstances> =
      ((minInstances) => ({
        type: WineryActions.INC_MIN_INSTANCES,
        minInstances: minInstances.minInstances
      }));
    incMaxInstances: ActionCreator<IncMaxInstances> =
      ((maxInstances) => ({
        type: WineryActions.INC_MAX_INSTANCES,
        maxInstances: maxInstances.maxInstances
      }));
    decMinInstances: ActionCreator<DecMinInstances> =
      ((minInstances) => ({
        type: WineryActions.DEC_MIN_INSTANCES,
        minInstances: minInstances.minInstances
      }));
    decMaxInstances: ActionCreator<DecMaxInstances> =
      ((maxInstances) => ({
        type: WineryActions.DEC_MAX_INSTANCES,
        maxInstances: maxInstances.maxInstances
      }));
    saveNodeTemplate: ActionCreator<SaveNodeTemplateAction> =
      ((newNode) => ({
        type: WineryActions.SAVE_NODE_TEMPLATE,
        nodeTemplate: newNode
      }));
    saveRelationship: ActionCreator<SaveRelationshipAction> =
      ((newRelationship) => ({
        type: WineryActions.SAVE_RELATIONSHIP,
        relationshipTemplate: newRelationship
      }));
    deleteNodeTemplate: ActionCreator<DeleteNodeAction> =
      ((deletedNodeId) => ({
        type: WineryActions.DELETE_NODE_TEMPLATE,
        nodeTemplateId: deletedNodeId
      }));
    updateNodeCoordinates: ActionCreator<UpdateNodeCoordinatesAction> =
      ((currentNodeCoordinates) => ({
        type: WineryActions.UPDATE_NODE_COORDINATES,
        otherAttributes: currentNodeCoordinates
      }));
    updateRelationshipName: ActionCreator<UpdateRelationshipNameAction> =
      ((currentRelData) => ({
        type: WineryActions.UPDATE_REL_DATA,
        relData: currentRelData.relData
      }));
}
