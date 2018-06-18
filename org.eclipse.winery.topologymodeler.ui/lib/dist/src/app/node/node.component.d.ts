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
import { AfterViewInit, Component, ComponentRef, DoCheck, ElementRef, EventEmitter, KeyValueDiffers, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';
import { EntityType, TNodeTemplate } from '../models/ttopology-template';
import { BackendService } from '../services/backend.service';
import { GroupedNodeTypeModel } from '../models/groupedNodeTypeModel';
/**
 * Every node has its own component and gets created dynamically.
 */
export declare class NodeComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
    private zone;
    private $ngRedux;
    private actions;
    elRef: ElementRef;
    private backendService;
    private renderer;
    private differs;
    items: string[];
    accordionGroupPanel: string;
    customClass: string;
    visibilityState: string;
    connectorEndpointVisible: boolean;
    startTime: any;
    endTime: any;
    longpress: boolean;
    makeSelectionVisible: boolean;
    setFlash: boolean;
    setMaxFlash: boolean;
    setMinFlash: boolean;
    policyTypes: any;
    policyTemplates: any;
    artifactTypes: any;
    removeZIndex: any;
    propertyDefinitionType: string;
    readonly: boolean;
    entityTypes: any;
    dragSource: string;
    navbarButtonsState: ButtonsStateModel;
    sendId: EventEmitter<string>;
    askForRepaint: EventEmitter<string>;
    setDragSource: EventEmitter<any>;
    closedEndpoint: EventEmitter<string>;
    handleNodeClickedActions: EventEmitter<any>;
    updateSelectedNodes: EventEmitter<string>;
    sendSelectedRelationshipType: EventEmitter<EntityType>;
    askForRemoval: EventEmitter<string>;
    unmarkConnections: EventEmitter<string>;
    saveNodeRequirements: EventEmitter<any>;
    sendPaletteStatus: EventEmitter<any>;
    sendNodeData: EventEmitter<any>;
    relationshipTypes: Array<EntityType>;
    nodeTemplate: TNodeTemplate;
    previousPosition: any;
    currentPosition: any;
    nodeRef: ComponentRef<Component>;
    unbindMouseMove: Function;
    currentNodeId: string;
    hostURL: string;
    flashTimer: number;
    parentEl: string;
    differ: any;
    constructor(zone: NgZone, $ngRedux: NgRedux<IWineryState>, actions: WineryActions, elRef: ElementRef, backendService: BackendService, renderer: Renderer2, differs: KeyValueDiffers);
    /**
     *  Parse the localName of the NodeType
     */
    readonly nodeTypeLocalName: string;
    addItem(): void;
    /**
     * This function determines which kind of properties the nodeType embodies.
     * We have 3 possibilities: none, XML element, or Key value pairs.
     */
    findOutPropertyDefinitionTypeForProperties(type: string, groupedNodeTypes: Array<GroupedNodeTypeModel>): void;
    /**
     * Angular lifecycle event.
     */
    ngOnInit(): void;
    /**
     * Angular lifecycle event.
     */
    ngDoCheck(): void;
    /**
     * Triggered when opening a modal to send node data to the canvas for handling the addition of modal data.
     */
    sendToggleAction(nodeData: any): void;
    /**
     * Angular lifecycle event.
     */
    ngAfterViewInit(): void;
    /**
     * Stops the event propagation to the canvas etc. and repaints.
     */
    repaint($event: any): void;
    /**
     * Sets the current type of a node.
     */
    passCurrentType($event: any): void;
    /**
     * Handler for mousedown events, toggles visibility of node attributes
     */
    mouseDownHandler($event: any): void;
    /**
     * If a node is moved, this saves the current position of the node into the store.
     */
    mouseMove($event: any): void;
    /**
     * Checks if it was a click or a drag operation on the node.
     */
    mouseUpHandler($event: any): void;
    /**
     * CSS flash effect.
     */
    flash(flashType: string): void;
    /**
     * If it was a click operation, close the connector endpoints for relations
     */
    closeConnectorEndpoints($event: any): void;
    /**
     * Creates a dragoperation for nodes
     */
    makeSource($event: any): void;
    /**
     * Only display the sidebar if the click is no longpress (drag)
     */
    openSidebar($event: any): void;
    /**
     * Navigates to the corresponding node type in the management UI
     *  $event
     */
    linkType($event: any): void;
    /**
     * Displays a box of the whole text if the text doesn't fit in the original element
     */
    isEllipsisActive(cell: any): boolean;
    /**
     * Angular lifecycle event.
     */
    ngOnDestroy(): void;
    /**
     * Checks if it was a click or a drag operation on the node.
     *  $event
     */
    private testTimeDifference($event);
}
