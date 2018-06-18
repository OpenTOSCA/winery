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
import { AfterViewInit, DoCheck, ElementRef, KeyValueDiffers, NgZone, OnDestroy, OnInit, QueryList, Renderer2 } from '@angular/core';
import { JsPlumbService } from '../services/jsPlumb.service';
import { EntityType, TNodeTemplate, TRelationshipTemplate } from '../models/ttopology-template';
import { LayoutDirective } from '../layout/layout.directive';
import { WineryActions } from '../redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';
import { NodeComponent } from '../node/node.component';
import { HotkeysService } from 'angular2-hotkeys';
import { ModalDirective } from 'ngx-bootstrap';
import { GridTemplate } from '../models/gridTemplate';
import { Subscription } from 'rxjs';
import { CapabilitiesModalData } from '../models/capabilitiesModalData';
import { RequirementsModalData } from '../models/requirementsModalData';
import { NodeIdAndFocusModel } from '../models/nodeIdAndFocusModel';
import { ToggleModalDataModel } from '../models/toggleModalDataModel';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../services/backend.service';
import { EntityTypesModel } from '../models/entityTypesModel';
import { ExistsService } from '../services/exists.service';
import { ModalVariantAndState } from './entities-modal/modal-model';
import { ImportTopologyModalData } from '../models/importTopologyModalData';
import { ImportTopologyService } from '../services/import-topology.service';
import { ReqCapService } from '../services/req-cap.service';
import { SplitMatchTopologyService } from '../services/split-match-topology.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { DragSource } from '../models/DragSource';
export declare class CanvasComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    private jsPlumbService;
    private eref;
    private layoutDirective;
    private ngRedux;
    private actions;
    private topologyRendererActions;
    private zone;
    private hotkeysService;
    private renderer;
    private alert;
    private differs;
    private backendService;
    private importTopologyService;
    private existsService;
    private splitMatchService;
    private reqCapService;
    private errorHandler;
    nodeComponentChildren: QueryList<NodeComponent>;
    KVTextareas: QueryList<any>;
    xmlTextareas: QueryList<any>;
    child: ElementRef;
    selection: ElementRef;
    capabilitiesModal: ModalDirective;
    requirementsModal: ModalDirective;
    importTopologyModal: ModalDirective;
    readonly: boolean;
    entityTypes: EntityTypesModel;
    relationshipTypes: Array<EntityType>;
    diffMode: boolean;
    readonly draggingThreshold: number;
    readonly newNodePositionOffsetX: number;
    readonly newNodePositionOffsetY: number;
    allNodeTemplates: Array<TNodeTemplate>;
    allRelationshipTemplates: Array<TRelationshipTemplate>;
    navbarButtonsState: ButtonsStateModel;
    selectedNodes: Array<TNodeTemplate>;
    currentModalData: any;
    dragSourceActive: boolean;
    event: any;
    currentType: string;
    selectedRelationshipType: EntityType;
    nodeChildrenIdArray: Array<string>;
    nodeChildrenArray: Array<NodeComponent>;
    jsPlumbBindConnection: boolean;
    newNode: TNodeTemplate;
    paletteOpened: boolean;
    newJsPlumbInstance: any;
    gridTemplate: GridTemplate;
    allNodesIds: Array<string>;
    dragSourceInfos: DragSource;
    longPress: boolean;
    startTime: number;
    endTime: number;
    subscriptions: Array<Subscription>;
    unbindMouseActions: Array<Function>;
    capabilities: CapabilitiesModalData;
    requirements: RequirementsModalData;
    importTopologyData: ImportTopologyModalData;
    indexOfNewNode: number;
    targetNodes: Array<string>;
    differ: any;
    scrollOffset: number;
    modalData: ModalVariantAndState;
    showCurrentRequirement: boolean;
    showCurrentCapability: boolean;
    showDefaultProperties: boolean;
    hideNavBarAndPalette: boolean;
    allIds: Array<String>;
    duplicateId: boolean;
    private longPressing;
    constructor(jsPlumbService: JsPlumbService, eref: ElementRef, layoutDirective: LayoutDirective, ngRedux: NgRedux<IWineryState>, actions: WineryActions, topologyRendererActions: TopologyRendererActions, zone: NgZone, hotkeysService: HotkeysService, renderer: Renderer2, alert: ToastrService, differs: KeyValueDiffers, backendService: BackendService, importTopologyService: ImportTopologyService, existsService: ExistsService, splitMatchService: SplitMatchTopologyService, reqCapService: ReqCapService, errorHandler: ErrorHandlerService);
    /**
     * Needed for the optimal user experience when dragging a selection box.
     * Upon detecting a long mouse down the navbar and the palette fade out for maximum dragging space.
     * Resets the values.
     */
    onMouseUp(): void;
    /**
     * Needed for the optimal user experience when dragging a selection box.
     * Upon detecting a long mouse down the navbar and the palette fade out for maximum dragging space.
     * Sets the values upon detecting a long mouse down press.
     */
    onMouseDown(event: any): void;
    /**
     * Gets called if nodes get deleted, created, or node attributes are updated and calls the
     * correct handler.
     * @param currentNodes  List of all displayed nodes.
     */
    updateNodes(currentNodes: Array<TNodeTemplate>): void;
    /**
     * Executed when a node is short clicked triggering the sidebar, focusing on the name input field and
     * upon unfocusing the input field blurs away
     * @param currentNodeData - holds the node id and a focus boolean value which determines the marking or unmarking
     *     of the node
     */
    toggleMarkNode(currentNodeData: NodeIdAndFocusModel): void;
    /**
     * Setter for PaletteState, triggered by a redux store change and getting latest value
     * @param currentPaletteOpened
     */
    setPaletteState(currentPaletteOpened: boolean): void;
    /**
     * Gets all ID's of the topology template and saves them in an array
     */
    private getAllIds();
    /**
     * Checks if the id is already in the array, if not the id is added
     */
    private setId(idOfElement);
    /**
     * This modal handler gets triggered by the node component
     * @param currentNodeData - this holds the corresponding node template information and the information which modal
     *     to show
     */
    toggleModalHandler(currentNodeData: ToggleModalDataModel): void;
    /**
     * This function sets the capability default KV properties
     */
    setDefaultCapKVProperties(): void;
    /**
     * This function sets the requirement default KV properties
     */
    setDefaultReqKVProperties(): void;
    /**
     * This function sets the capability default XML properties
     */
    setDefaultCapXMLProperties(): void;
    /**
     * This function sets the requirement default XML properties
     */
    setDefaultReqXMLProperties(): void;
    /**
     * This function sets the node's KV properties
     * @param any type : the element type, e.g. capabilityType, requirementType etc.
     * @returns newKVProperties     KV Properties as Object
     */
    setKVProperties(type: any): any;
    /**
     * Gets called from the modal to update all the capability data
     */
    updateCaps(): void;
    /**
     * Gets called from the modal to update all the requirement data
     */
    updateReqs(): void;
    getHostUrl(): string;
    /**
     * Saves a capability template to the model and gets pushed into the Redux store of the application
     */
    saveCapabilityToModel(): void;
    /**
     * Auto-completes other capability relevant values when a capability name has been selected in the modal
     */
    onChangeCapDefinitionName(capName: string): void;
    /**
     * saves the typed in capability id from the modal
     */
    onChangeCapId(capId: string): void;
    /**
     * Deletes a capability from the winery store
     */
    deleteCapability(): void;
    /**
     * Saves a requirement template to the model and gets pushed into the Redux store of the application
     */
    saveRequirementsToModel(): void;
    /**
     * Auto-completes other requirement relevant values when a requirement name has been selected in the modal
     */
    onChangeReqDefinitionName(reqName: string): void;
    /**
     * saves the typed in requirement id from the modal
     */
    onChangeReqId(reqId: string): void;
    /**
     * Deletes a requirement from the winery store
     */
    deleteRequirement(): void;
    /**
     * Resets the requirements modal data
     */
    resetRequirements(): void;
    /**
     * Closes the requirements modal
     */
    closeAndResetRequirements(): void;
    /**
     * Resets the capabilities modal data
     */
    resetCapabilities(): void;
    /**
     * Closes the capabilities modal
     */
    closeAndResetCapabilities(): void;
    /**
     * New nodes can be dragged directly from the palette,
     * adds the node to the internal representation
     * @param event  The html event.
     */
    moveNewNode(event: any): void;
    /**
     * Repositions the new node and repaints the screen
     * @param $event  The html event.
     */
    positionNewNode(): void;
    /**
     * Gets called if relationships get created, loaded from the server/ a JSON, deleted or updated and calls the
     * correct handler.
     * @param currentRelationships  List of all displayed relationships.
     */
    updateRelationships(currentRelationships: Array<TRelationshipTemplate>): void;
    /**
     * Handler for new relations, adds it to the internal representation
     * @param currentRelationships  List of all displayed relations.
     */
    handleNewRelationship(currentRelationships: Array<TRelationshipTemplate>): void;
    /**
     * Implements some checks if name of relation gets updated
     * @param currentRelationships  List of all displayed relations.
     */
    updateRelName(currentRelationships: Array<TRelationshipTemplate>): void;
    /**
     * Handler for the layout buttons.
     * @param currentButtonsState  Representation of all possible buttons.
     */
    setButtonsState(currentButtonsState: ButtonsStateModel): void;
    /**
     * Reacts on selection of a topology template in the import topology modal
     */
    onChangeTopologyTemplate(selectedTopologyTemplateId: string): void;
    /**
     * Closes the import Topology modal
     */
    closeImportTopology(): void;
    /**
     * REST Call to the backend to get the selected topology
     * After a window reload, the topology is added
     */
    importTopology(): void;
    /**
     * Revalidates the offsets and other data of the container in the DOM.
     */
    revalidateContainer(): void;
    /**
     * Updates the internal representation of all nodes with the actual dom information.
     */
    updateAllNodes(): void;
    /**
     * Matches coordinates from the DOM elements with the internal representation.
     * @param nodeTemplate  Node Element (DOM).
     */
    setNewCoordinates(nodeTemplate: any): void;
    /**
     * Updates the internal representation of the selected nodes with the actual dom information
     */
    updateSelectedNodes(): void;
    /**
     * Paints new relationships between nodes
     * @param newRelationship
     */
    paintRelationship(newRelationship: TRelationshipTemplate): void;
    /**
     * Resets and (re)paints all jsplumb elements
     * @param newRelationship
     */
    manageRelationships(newRelationship: TRelationshipTemplate): void;
    /**
     * Resets JSPlumb drag source which marks the area where a connection can be dragged from
     * @param nodeId
     */
    resetDragSource(nodeId: string): void;
    /**
     * Upon clicking on a node template the connector endpoint/area from which connections can be dragged, is toggled
     * and the connector endpoints from the other node templates are closed, so only the connector endpoint from the
     * node template which was clicked on is visible
     * @param nodeId
     */
    toggleClosedEndpoint(nodeId: string): void;
    /**
     * Sets drag source which marks the area where a connection can be dragged from and binds to the connections
     * listener
     * @param dragSourceInfo
     */
    setDragSource(dragSourceInfo: DragSource): void;
    /**
     * Handler for the DEL-Key - removes a node and resets everything associated with that deleted node
     * @param event Keyboard event.
     */
    handleDeleteKeyEvent(event: KeyboardEvent): void;
    /**
     * Removes the selected Nodes from JSPlumb and internally.
     */
    clearSelectedNodes(): void;
    /**
     * Creates a new selection box and removes the old selections.
     * @param $event
     */
    showSelectionRange($event: any): void;
    /**
     * Opens the selection box
     * @param $event
     */
    openSelector($event: any): void;
    /**
     * Selects the elements that are within the selection box.
     * @param $event
     */
    selectElements($event: any): void;
    /**
     * If the window gets scrolled, the HTML component where nodes can be
     * placed on gets extended.
     * @param $event
     */
    adjustGrid($event: any): void;
    /**
     * Hides the Sidebar on the right.
     */
    hideSidebar(): void;
    /**
     * Handler for Keyboard actions
     * @param focusNodeData
     */
    handleNodeClickedActions(focusNodeData: any): void;
    /**
     * Checks if array 'Nodes' contains 'id'.
     * @param nodes
     * @param id
     * @returns Boolean True if 'Nodes' contains 'id'.
     */
    arrayContainsNode(nodes: any[], id: string): boolean;
    /**
     * Removes the drag source from JSPlumb which marks the area where connections can be dragged from
     */
    unbindDragSource(): void;
    /**
     * Unbinds the JsPlumb connection listener which triggers every time a relationship is dragged from the dragSource
     */
    unbindConnection(): void;
    /**
     * Removes the marked-styling from all connections.
     */
    unmarkConnections(): void;
    /**
     * Registers relationship (connection) types in JSPlumb (Color, strokewidth etc.)
     * @param relType
     */
    assignRelTypes(relType: EntityType): void;
    /**
     * Lifecycle hook
     */
    ngOnInit(): void;
    /**
     * Angular lifecycle event.
     */
    ngDoCheck(): void;
    /**
     * sets the selectedRelationshipType emitted from a node and replaces spaces from it.
     * @param currentType
     */
    setSelectedRelationshipType(currentType: EntityType): void;
    /**
     * Removes an element from JSPlumb.
     * @param id
     */
    removeElement(id: string): void;
    /**
     * Tells JSPlumb to make a node draggable with the node id emitted from the corresponding node
     * @param nodeId
     */
    activateNewNode(nodeId: string): void;
    /**
     * Removes the dragSource of a node which marks the area where a connection can be dragged from
     */
    removeDragSource(): void;
    /**
     * Tracks the time of mousedown, this is necessary
     * to decide whether a drag or a click is initiated
     * and resets dragSource, clears selectedNodes and unbinds the connection listener.
     * @param $event  The HTML event.
     */
    trackTimeOfMouseDown(): void;
    /**
     * Tracks the time of mouseup, this is necessary
     * to decide whether a drag or a click is initiated.
     * @param $event  The HTML event.
     */
    trackTimeOfMouseUp(): void;
    /**
     * Lifecycle event
     */
    ngAfterViewInit(): void;
    /**
     * Lifecycle event
     */
    ngOnDestroy(): void;
    /**
     * Handler for new nodes, binds them on mousemove and mouseup events
     * @param currentNodes  List of all displayed nodes.
     */
    private handleNewNode(currentNodes);
    /**
     * Handler for deleted nodes, removes the node from the internal representation
     * @param currentNodes  List of all displayed nodes.
     */
    private handleDeletedNodes(currentNodes);
    /**
     * Gets called if node is updated, implements some checks.
     * @param currentNodes  List of all displayed nodes.
     */
    private updateNodeAttributes(currentNodes);
    /**
     * Sets the sidebar up for a new node, makes it visible, sets a type and adds a click listener to this relationship
     * @param conn            The JSPlumb connection
     * @param newRelationship The new relationship internally
     */
    private handleRelSideBar(conn, newRelationship);
    /**
     * Unbind all mouse actions
     */
    private unbindAll();
    /**
     * Checks if DOM element is completely in the selection box.
     * @param selectionArea The selection box
     * @param object        The DOM element.
     */
    private isObjectInSelection(selectionArea, object);
    /**
     * Handler for the CTRL Key, adds or removes
     * elements to the current selection
     * @param nodeId
     */
    private handleCtrlKeyNodePress(nodeId);
    /**
     * Clickhandler for Nodes, selects the clicked node.
     * @param nodeId
     */
    private handleNodePressActions(nodeId);
    /**
     * Enhances the selection internally and for JSPlumb.
     * @param nodeId
     */
    private enhanceDragSelection(nodeId);
    /**
     * Getter for Node by ID
     * @param Nodes
     * @param id
     */
    private getNodeByID(nodes, id);
    /**
     * Binds to the JsPlumb connections listener which triggers every time a relationship is dragged from the dragSource
     * and pushes the new connection to the redux store
     */
    private bindConnection();
    /**
     * Handles the new node by binding to mouse move and mouse up actions
     */
    private bindNewNode();
    /**
     * Checks whether it was a drag or a click.
     */
    private determineDragOrClick();
    private layoutTopology();
}
