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
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  NgZone,
  QueryList,
  ViewChildren,
  AfterViewInit,
  Renderer2, ViewChild, Input
} from '@angular/core';
import { JsPlumbService } from '../jsPlumbService';
import { JsonService } from '../jsonService/json.service';
import { TNodeTemplate, TRelationshipTemplate } from '../ttopology-template';
import { LayoutDirective } from '../layout.directive';
import { WineryActions } from '../redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';
import { NodeComponent } from '../node/node.component';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'winery-canvas',
  providers: [LayoutDirective],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(NodeComponent) nodeComponentChildren: QueryList<NodeComponent>;
  @ViewChild('nodes') child: ElementRef;
  @ViewChild('selection') selection: ElementRef;
  allNodeTemplates: Array<TNodeTemplate> = [];
  allRelationshipTemplates: Array<TRelationshipTemplate> = [];
  navbarButtonsState: ButtonsStateModel;
  selectedNodes: Array<TNodeTemplate> = [];
  newJsPlumbInstance: any;
  pageX: Number;
  pageY: Number;
  selectionActive: boolean;
  initialW: number;
  initialH: number;
  selectionWidth: number;
  selectionHeight: number;
  startTime: number;
  endTime: number;
  longPress: boolean;
  crosshair = false;
  dragSourceInfos: any;
  allNodesIds: Array<string> = [];
  nodeTemplatesSubscription;
  relationshipTemplatesSubscription;
  navBarButtonsStateSubscription;
  paletteOpenedSubscription;
  dragSourceActive = false;
  gridWidth = 100;
  gridHeight = 100;
  currentType: string;
  nodeChildrenIdArray: Array<string>;
  nodeChildrenArray: Array<NodeComponent>;
  jsPlumbConnections: Array<any> = [];
  jsPlumbBindConnection = false;
  unbindMouseMove: Function;
  unbindMouseUp: Function;
  unbindNewNodeMouseMove: Function;
  unbindNewNodeMouseUp: Function;
  newNode: TNodeTemplate;
  currentPaletteOpenedState: boolean;
  newNodeData: any;
  allRelationshipTypes: Array<string> = [];
  allRelationshipTypesColors: Array<any> = [];
  @Input() visuals;

  constructor(private jsPlumbService: JsPlumbService,
              private _eref: ElementRef,
              private _layoutDirective: LayoutDirective,
              private ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions,
              private topologyRendererActions: TopologyRendererActions,
              private zone: NgZone,
              private hotkeysService: HotkeysService,
              private renderer: Renderer2) {
    this.nodeTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.nodeTemplates)
      .subscribe(currentNodes => this.updateNodes(currentNodes));
    this.relationshipTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.relationshipTemplates)
      .subscribe(currentRelationships => this.updateRelationships(currentRelationships));
    this.navBarButtonsStateSubscription = ngRedux.select(state => state.topologyRendererState)
      .subscribe(currentButtonsState => this.setButtonsState(currentButtonsState));
    this.paletteOpenedSubscription = this.ngRedux.select(state => state.wineryState.currentPaletteOpenedState)
      .subscribe(currentPaletteOpened => this.setPaletteState(currentPaletteOpened));
    this.hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      event.stopPropagation();
      for (const node of this.allNodeTemplates) {
        this.enhanceDragSelection(node.id);
      }
      return false; // Prevent bubbling
    }));
    this.newJsPlumbInstance = this.jsPlumbService.getJsPlumbInstance();
    this.newJsPlumbInstance.setContainer('container');
  }

  /**
   * Gets called if nodes get deleted or created and calls the
   * correct handler.
   * @param currentNodes  List of all displayed nodes.
   */
  updateNodes(currentNodes: Array<TNodeTemplate>): void {
    if (currentNodes.length !== this.allNodeTemplates.length) {
      const difference = currentNodes.length - this.allNodeTemplates.length;
      if (difference === 1) {
        this.handleNewNode(currentNodes);
      } else if (difference < 1) {
        this.handleDeletedNodes(currentNodes);
      } else {
        this.allNodeTemplates = currentNodes;
      }
    } else {
      this.updateNodeAttributes(currentNodes);
    }
    this.allNodesIds = this.allNodeTemplates.map(node => node.id);
  }

  /**
   * Handler for new nodes, binds them on mousemove and mouseup events
   * @param currentNodes  List of all displayed nodes.
   */
  private handleNewNode(currentNodes: Array<TNodeTemplate>): void {
    this.unbindConnection();
    this.clearSelectedNodes();

    if (this.newNode) {
      this.resetDragSource(this.newNode.id);
    }
    this.newNode = currentNodes[currentNodes.length - 1];
    this.allNodeTemplates.push(this.newNode);
    if (this.currentPaletteOpenedState) {
      setTimeout(() => {
        this.handleNodePressActions(this.newNode.id);
        this.zone.runOutsideAngular(() => {
          this.unbindNewNodeMouseMove = this.renderer.listen(this._eref.nativeElement, 'mousemove',
            (event) => this.moveNewNode(event));
          this.unbindNewNodeMouseUp = this.renderer.listen(this._eref.nativeElement, 'mouseup',
            ($event) => this.positionNewNode($event));
        });
      }, 1);
    }
  }

  /**
   * Handler for deleted nodes, removes the node from the internal representation
   * @param currentNodes  List of all displayed nodes.
   */
  private handleDeletedNodes(currentNodes: Array<TNodeTemplate>): void {
    let deletedNode;
    for (const node of this.allNodeTemplates) {
      if (!currentNodes.map(n => n.id).includes(node.id)) {
        deletedNode = node.id;
        break;
      }
    }
    if (deletedNode) {
      const index = this.allNodeTemplates.map(node => node.id).indexOf(deletedNode);
      this.allNodeTemplates.splice(index, 1);
    }
  }

  /**
   * Gets called if node is updated, implements some checks.
   * @param currentNodes  List of all displayed nodes.
   */
  private updateNodeAttributes(currentNodes: Array<TNodeTemplate>): void {
    for (let i = 0; i < this.allNodeTemplates.length; i++) {
      const node = currentNodes.find(el => el.id === this.allNodeTemplates[i].id);
      if (node) {
        if (this.allNodeTemplates[i].name !== node.name) {
          const nodeId = this.nodeChildrenIdArray.indexOf(this.allNodeTemplates[i].id);
          this.nodeChildrenArray[nodeId].nodeAttributes.name = node.name;
          this.nodeChildrenArray[nodeId].flash();
          this.allNodeTemplates[i].name = node.name;
        } else if (this.allNodeTemplates[i].minInstances !== node.minInstances) {
          const nodeId = this.nodeChildrenIdArray.indexOf(this.allNodeTemplates[i].id);
          this.allNodeTemplates[i].minInstances = node.minInstances;
          this.nodeChildrenArray[nodeId].flashMin();
        } else if (this.allNodeTemplates[i].maxInstances !== node.maxInstances) {
          const nodeId = this.nodeChildrenIdArray.indexOf(this.allNodeTemplates[i].id);
          this.allNodeTemplates[i].maxInstances = node.maxInstances;
          this.nodeChildrenArray[nodeId].flashMax();
        }
      }
    }
  }

  /**
   * New nodes can be dragged directly from the palette,
   * adds the node to the internal representation
   * @param event  The html event.
   */
  moveNewNode(event): void {
    event.preventDefault();
    const indexOfNewNode = this.allNodeTemplates.map(node => node.id).indexOf(this.newNode.id);
    this.newNodeData = {
      id: this.newNode.id,
      x: event.clientX - 108,
      y: event.clientY - 30
    };
    this.allNodeTemplates[indexOfNewNode].x = this.newNodeData.x;
    this.allNodeTemplates[indexOfNewNode].y = this.newNodeData.y;
  }

  /**
   * Repositions the new node and repaints the screen
   * @param $event  The html event.
   */
  positionNewNode($event): void {
    this.updateSelectedNodes('Position new Node');
    this.unbindNewNodeMouseMove();
    this.unbindNewNodeMouseUp();
    this.newJsPlumbInstance.revalidate(this.newNode.id);
    this.repaintJsPlumb();
  }

  /**
   * Setter for PaletteState
   * @param currentPaletteOpened
   */
  setPaletteState(currentPaletteOpened: boolean): void {
    this.currentPaletteOpenedState = currentPaletteOpened;
  }

  /**
   * Gets called if relationships get deleted or created and calls the
   * correct handler.
   * @param currentRelationships  List of all displayed relationships.
   */
  updateRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
    if (currentRelationships.length !== this.allRelationshipTemplates.length) {
      const difference = currentRelationships.length - this.allRelationshipTemplates.length;
      if (difference === 1) {
        this.handleNewRelationship(currentRelationships);
      } else if (difference < 1) {
        this.handleDeletedRelationships(currentRelationships);
      } else {
        this.handleLoadedRelationships(currentRelationships);
      }
    } else {
      this.updateRelName(currentRelationships);
    }
  }

  /**
   * Handler for new relations, adds it to the internal representation
   * @param currentRelationships  List of all displayed relations.
   */
  handleNewRelationship(currentRelationships: Array<TRelationshipTemplate>): void {
    const newRel = currentRelationships[currentRelationships.length - 1];
    this.allRelationshipTemplates.push(newRel);
    this.manageRelationships(newRel);
  }

  /**
   * Handler for deleted relations, removes it from the internal representation
   * @param currentRelationships  List of all displayed relations.
   */
  handleDeletedRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
    for (const rel of this.allRelationshipTemplates) {
      if (!currentRelationships.map(con => con.id).includes(rel.id)) {
        const deletedRel = rel.id;
        const index = this.allRelationshipTemplates.map(con => con.id).indexOf(deletedRel);
        this.allRelationshipTemplates.splice(index, 1);
      }
    }
  }

  /**
   * Handles relationships internally (store)
   * @param currentRelationships  List of all displayed relations.
   */
  handleLoadedRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
    this.allRelationshipTemplates = currentRelationships;
    this.allRelationshipTemplates.map(rel => !this.allRelationshipTypes.includes(rel.type) ?
      this.allRelationshipTypes.push(rel.type) : null);
    setTimeout(() => {
      if (this.allRelationshipTemplates.length > 0) {
        for (const relationship of this.allRelationshipTemplates) {
          this.manageRelationships(relationship);
        }
      }
    }, 1);
  }

  /**
   * Implements some checks if name of relation gets updated
   * @param currentRelationships  List of all displayed relations.
   */
  updateRelName(currentRelationships: Array<TRelationshipTemplate>): void {
    for (const rel of this.allRelationshipTemplates) {
      const conn = currentRelationships.find(el => el.id === rel.id);
      if (conn) {
        if (rel.name !== conn.name) {
          rel.name = conn.name;
        }
      }
    }
  }

  /**
   * Handler for the layout buttons.
   * @param currentButtonsState  Representation of all possible buttons.
   */
  setButtonsState(currentButtonsState: ButtonsStateModel): void {
    this.navbarButtonsState = currentButtonsState;
    setTimeout(() => this.repaintJsPlumb(), 1);
    const alignmentButtonLayout = this.navbarButtonsState.buttonsState.layoutButton;
    const alignmentButtonAlignH = this.navbarButtonsState.buttonsState.alignHButton;
    const alignmentButtonAlignV = this.navbarButtonsState.buttonsState.alignVButton;
    if (alignmentButtonLayout) {
      this._layoutDirective.layoutNodes(this.allNodeTemplates, this.allRelationshipTemplates, this.newJsPlumbInstance);
      this.ngRedux.dispatch(this.topologyRendererActions.executeLayout());
      setTimeout(() => this.updateAllNodes(), 1000);
    } else if (alignmentButtonAlignH) {
      if (this.selectedNodes.length >= 1) {
        this._layoutDirective.alignHorizontal(this.selectedNodes, this.newJsPlumbInstance);
        setTimeout(() => this.updateSelectedNodes('Update selected nodes'), 1000);
      } else {
        this._layoutDirective.alignHorizontal(this.allNodeTemplates, this.newJsPlumbInstance);
        setTimeout(() => this.updateAllNodes(), 1000);
      }
      this.ngRedux.dispatch(this.topologyRendererActions.executeAlignH());
    } else if (alignmentButtonAlignV) {
      if (this.selectedNodes.length >= 1) {
        this._layoutDirective.alignVertical(this.selectedNodes, this.newJsPlumbInstance);
        setTimeout(() => this.updateSelectedNodes('Update selected nodes'), 1000);
      } else {
        this._layoutDirective.alignVertical(this.allNodeTemplates, this.newJsPlumbInstance);
        setTimeout(() => this.updateAllNodes(), 1000);
      }
      this.ngRedux.dispatch(this.topologyRendererActions.executeAlignV());
    }
  }

  /**
   * Updates the internal representation of all nodes with the actual dom information.
   */
  updateAllNodes(): void {
    if (this.allNodeTemplates.length > 0) {
      for (const nodeTemplate of this.child.nativeElement.children) {
        this.setNewCoordinates(nodeTemplate);
      }
    }
  }

  /**
   * Matches coordinates from the DOM elements with the internal representation.
   * @param nodeTemplate  Node Element (DOM).
   */
  setNewCoordinates(nodeTemplate: any): void {
    const index = this.allNodeTemplates.map(node => node.id).indexOf(nodeTemplate.firstChild.id);
    const nodeCoordinates = {
      id: nodeTemplate.firstChild.id,
      x: nodeTemplate.firstChild.offsetLeft,
      y: nodeTemplate.firstChild.offsetTop
    };
    this.allNodeTemplates[index].x = nodeCoordinates.x;
    this.allNodeTemplates[index].y = nodeCoordinates.y;
    this.ngRedux.dispatch(this.actions.updateNodeCoordinates(nodeCoordinates));
  }

  /**
   * Updates the internal representation of the selected nodes with the actual dom information
   * @param $event  The HTML event.
   */
  updateSelectedNodes($event): void {
    if (this.selectedNodes.length > 0) {
      for (const nodeTemplate of this.child.nativeElement.children) {
        if (this.selectedNodes.map(node => node.id).includes(nodeTemplate.firstChild.id)) {
          this.setNewCoordinates(nodeTemplate);
        }
      }
    }
  }

  /**
   * Paints new relationships between nodes
   * @param newRelationship
   */
  paintRelationship(newRelationship: TRelationshipTemplate) {
    const allJsPlumbRelationships = this.newJsPlumbInstance.getAllConnections();
    if (!allJsPlumbRelationships.map(rel => rel.id).includes(newRelationship.id)) {
      const conn = this.newJsPlumbInstance.connect({
        source: newRelationship.sourceElement,
        target: newRelationship.targetElement,
        overlays: [['Arrow', {width: 15, length: 15, location: 1, id: 'arrow', direction: 1}],
          ['Label', {
            label: newRelationship.type,
            id: 'label',
            labelStyle: {
              font: '11px Roboto, sans-serif',
              color: '#FAFAFA',
              fill: '#303030',
              borderStyle: '#424242',
              borderWidth: 1,
              padding: '3px'
            }
          }]
        ],
      });
      this.handleRelSideBar(conn, newRelationship);
    }
  }

  /**
   * Sets the sidebar up for a new node, makes it visible.
   * @param conn            The JSPlumb connection
   * @param newRelationship The new relationship internally
   */
  private handleRelSideBar(conn, newRelationship: any): void {
    conn.id = newRelationship.id;
    conn.setType(newRelationship.type);
    const me = this;
    conn.bind('click', rel => {
      this.clearSelectedNodes();
      this.newJsPlumbInstance.select().removeType('marked');
      const currentRel = me.allRelationshipTemplates.find(con => con.id === rel.id);
      me.ngRedux.dispatch(this.actions.openSidebar({
        sidebarContents: {
          sidebarVisible: true,
          nodeClicked: false,
          id: currentRel.id,
          nameTextFieldValue: currentRel.name,
          type: currentRel.type
        }
      }));
      conn.addType('marked');
    });
  }

  /**
   * Resets and (re)paints all jsplumb elements
   * @param newRelationship
   */
  manageRelationships(newRelationship: TRelationshipTemplate): void {
    this.paintRelationship(newRelationship);
    this.resetDragSource('reset previous drag source');
    this.repaintJsPlumb();
  }

  /**
   * Resets JSPlumb drag source.
   * @param nodeId
   */
  resetDragSource(nodeId: string): void {
    if (this.dragSourceInfos) {
      if (this.dragSourceInfos.nodeId !== nodeId) {
        this.newJsPlumbInstance.removeAllEndpoints(this.dragSourceInfos.dragSource);
        if (this.dragSourceInfos.dragSource) {
          if (this.newJsPlumbInstance.isSource(this.dragSourceInfos.dragSource)) {
            this.newJsPlumbInstance.unmakeSource(this.dragSourceInfos.dragSource);
          }
        }
        const indexOfNode = this.nodeChildrenIdArray.indexOf(this.dragSourceInfos.nodeId);
        if (this.nodeChildrenArray[indexOfNode]) {
          this.nodeChildrenArray[indexOfNode].connectorEndpointVisible = false;
          this.repaintJsPlumb();
        }
        this.dragSourceActive = false;
        this.dragSourceInfos = null;
      }
    }
  }

  /**
   * Cleanup after dragging operation - sets the endpoints invisible
   * @param nodeId
   */
  closedEndpoint(nodeId: string): void {
    const node = this.nodeChildrenArray.find((nodeTemplate => nodeTemplate.nodeAttributes.id === nodeId));
    node.connectorEndpointVisible = !node.connectorEndpointVisible;
    if (node.connectorEndpointVisible === true) {
      this.dragSourceActive = false;
      this.resetDragSource(nodeId);
      for (const currentNode of this.nodeChildrenArray) {
        if (currentNode.nodeAttributes.id !== nodeId) {
          if (currentNode.connectorEndpointVisible === true) {
            currentNode.connectorEndpointVisible = false;
          }
        }
      }
    }
  }

  /**
   * Start dragging operation
   * @param dragSourceInfo
   */
  setDragSource(dragSourceInfo: any): void {
    if (!this.dragSourceActive) {
      this.newJsPlumbInstance.makeSource(dragSourceInfo.dragSource, {
        connectorOverlays: [
          ['Arrow', {location: 1}],
        ],
      });
      this.dragSourceInfos = dragSourceInfo;
      this.newJsPlumbInstance.makeTarget(this.allNodesIds);
      this.dragSourceActive = true;
      this.bindConnection();
    }
  }

  /**
   * Handler for the DEL-Key - removes a node
   * @param event Keyboard event.
   */
  @HostListener('document:keydown.delete', ['$event'])
  handleDeleteKeyEvent(event: KeyboardEvent) {
    this.unbindConnection();
    if (this.selectedNodes.length > 0) {
      for (const node of this.nodeChildrenArray) {
        if (node.makeSelectionVisible === true) {
          this.newJsPlumbInstance.deleteConnectionsForElement(node.nodeAttributes.id);
          this.newJsPlumbInstance.removeAllEndpoints(node.nodeAttributes.id);
          this.newJsPlumbInstance.removeFromAllPosses(node.nodeAttributes.id);
          if (node.connectorEndpointVisible === true) {
            if (this.newJsPlumbInstance.isSource(node.dragSource)) {
              this.newJsPlumbInstance.unmakeSource(node.dragSource);
            }
          }
          this.ngRedux.dispatch(this.actions.deleteNodeTemplate(node.nodeAttributes.id));
        }
      }
      this.hideSidebar();
      this.selectedNodes.length = 0;
    }
  }

  /**
   * Removes the selected Nodes from JSPlumb and internally.
   */
  clearSelectedNodes(): void {
    if (this.selectedNodes.length > 0) {
      for (const node of this.nodeChildrenArray) {
        if (this.selectedNodes.find(selectedNode => selectedNode.id === node.nodeAttributes.id)) {
          node.makeSelectionVisible = false;
        }
      }
      this.newJsPlumbInstance.removeFromAllPosses(this.selectedNodes.map(node => node.id));
      this.selectedNodes.length = 0;
    }
  }

  /**
   * Creates a new selection box and removes the old selections.
   * @param $event
   */
  showSelectionRange($event: any) {
    this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
    this.hideSidebar();
    this.clearSelectedNodes();
    for (const node of this.nodeChildrenArray) {
      node.makeSelectionVisible = false;
    }
    this.selectionActive = true;
    this.pageX = $event.pageX;
    this.pageY = $event.pageY;
    this.initialW = $event.pageX;
    this.initialH = $event.pageY;
    this.zone.runOutsideAngular(() => {
      this.unbindMouseMove = this.renderer.listen(this._eref.nativeElement, 'mousemove', (event) => this.openSelector(event));
      this.unbindMouseUp = this.renderer.listen(this._eref.nativeElement, 'mouseup', (event) => this.selectElements(event));
    });
  }

  /**
   * Opens the selection box
   * @param $event
   */
  openSelector($event: any) {
    this.selectionWidth = Math.abs(this.initialW - $event.pageX);
    this.selectionHeight = Math.abs(this.initialH - $event.pageY);
    if ($event.pageX <= this.initialW && $event.pageY >= this.initialH) {
      this.pageX = $event.pageX;
    } else if ($event.pageY <= this.initialH && $event.pageX >= this.initialW) {
      this.pageY = $event.pageY;
    } else if ($event.pageY < this.initialH && $event.pageX < this.initialW) {
      this.pageX = $event.pageX;
      this.pageY = $event.pageY;
    }
  }

  /**
   * Selects the elements that are within the selection box.
   * @param $event
   */
  selectElements($event: any) {
    const aElem = this.selection.nativeElement;
    for (const node of this.child.nativeElement.children) {
      const bElem = node.firstChild;
      const result = this.isObjectInSelection(aElem, bElem);
      if (result === true) {
        this.enhanceDragSelection(node.firstChild.id);
      }
    }
    this.unbindMouseMove();
    this.unbindMouseUp();
    this.selectionActive = false;
    this.selectionWidth = 0;
    this.selectionHeight = 0;
    // This is just a hack for firefox, the same code is in the click listener
    if (this._eref.nativeElement.contains($event.target) && this.longPress === false) {
      this.newJsPlumbInstance.removeFromAllPosses(this.selectedNodes.map(node => node.id));
      this.clearSelectedNodes();
      if ($event.clientX > 200) {
        this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
      }
    }
  }

  /**
   * If the window gets scrolled, the HTML component where nodes can be
   * placed on gets extended.
   * @param $event
   */
  @HostListener('window:scroll', ['event'])
  adjustGrid($event) {
    this.gridWidth = window.innerWidth;
    this.gridHeight = window.innerHeight;
  }

  /**
   * Getter for the offset of any DOM element.
   * @param el  The DOM element.
   */
  private getOffset(el: any) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {top: _y, left: _x};
  }

  /**
   * Checks if DOM element is completely in the selection box.
   * @param selectionArea The selection box
   * @param object        The DOM element.
   */
  private isObjectInSelection(selectionArea, object): boolean {
    const selectionRect = selectionArea.getBoundingClientRect();
    return (
      ((selectionRect.top + selectionRect.height) > (object.offsetTop + object.offsetHeight)) &&
      (selectionRect.top < (object.offsetTop)) &&
      ((selectionRect.left + selectionArea.getBoundingClientRect().width) > (object.offsetLeft + object.offsetWidth)) &&
      (selectionRect.left < (object.offsetLeft))
    );
  }

  /**
   * Hides the Sidebar on the right.
   */
  hideSidebar() {
    this.ngRedux.dispatch(this.actions.openSidebar({
      sidebarContents: {
        sidebarVisible: false,
        nodeClicked: false,
        id: '',
        nameTextFieldValue: '',
        type: ''
      }
    }));
  }


  /**
   * Handler for the CTRL Key, adds or removes
   * elements to the current selection
   * @param nodeId
   */
  private handleCtrlKeyNodePress(nodeId: string): void {
    if (this.jsPlumbBindConnection === true) {
      this.unbindConnection();
    }
    if (!this.arrayContainsNode(this.selectedNodes, nodeId)) {
      this.enhanceDragSelection(nodeId);
      for (const node of this.nodeChildrenArray) {
        const nodeIndex = this.selectedNodes.map(selectedNode => selectedNode.id).indexOf(node.nodeAttributes.id);
        if (this.selectedNodes[nodeIndex] === undefined) {
          node.makeSelectionVisible = false;
          this.unbindConnection();
        }
        if (node.connectorEndpointVisible === true) {
          node.connectorEndpointVisible = false;
          this.resetDragSource('reset previous drag source');
        }
      }
    } else {
      this.newJsPlumbInstance.removeFromAllPosses(nodeId);
      const nodeIndex = this.nodeChildrenArray.map(node => node.nodeAttributes.id).indexOf(nodeId);
      this.nodeChildrenArray[nodeIndex].makeSelectionVisible = false;
      const selectedNodeIndex = this.selectedNodes.map(node => node.id).indexOf(nodeId);
      this.selectedNodes.splice(selectedNodeIndex, 1);
    }
  }

  /**
   * Handler for Keyboard actions
   * @param focusNodeData
   */
  handleNodeClickedActions(focusNodeData: any): void {
    if (focusNodeData.ctrlKey) {
      this.handleCtrlKeyNodePress(focusNodeData.id);
    } else {
      this.handleNodePressActions(focusNodeData.id);
    }
  }

  /**
   * Clickhandler for Nodes, selects the clicked node.
   * @param nodeId
   */
  private handleNodePressActions(nodeId: string): void {
    for (const node of this.nodeChildrenArray) {
      if (node.nodeAttributes.id === nodeId) {
        node.makeSelectionVisible = true;
      } else if (!this.arrayContainsNode(this.selectedNodes, node.nodeAttributes.id)) {
        node.makeSelectionVisible = false;
        this.resetDragSource(nodeId);
      }
    }
    this.unbindConnection();
    if (this.selectedNodes.length === 1 && this.selectedNodes.find(node => node.id !== nodeId)) {
      this.clearSelectedNodes();
    }
    if (this.selectedNodes.length === 0) {
      this.enhanceDragSelection(nodeId);
    }
    if (!this.arrayContainsNode(this.selectedNodes, nodeId)) {
      this.clearSelectedNodes();
    }
  }

  /**
   * Checks if array 'Nodes' contains 'id'.
   * @param Nodes
   * @param id
   * @returns Boolean True if 'Nodes' contains 'id'.
   */
  public arrayContainsNode(Nodes: any[], id: string): boolean {
    if (Nodes !== null && Nodes.length > 0) {
      for (const node of Nodes) {
        if (node.id === id) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Enhances the selection internally and for JSPlumb.
   * @param nodeId
   */
  private enhanceDragSelection(nodeId: string) {
    if (!this.arrayContainsNode(this.selectedNodes, nodeId)) {
      this.selectedNodes.push(this.getNodeByID(this.allNodeTemplates, nodeId));
      this.newJsPlumbInstance.addToPosse(nodeId, 'dragSelection');
      for (const node of this.nodeChildrenArray) {
        if (this.selectedNodes.find(selectedNode => selectedNode.id === node.nodeAttributes.id)) {
          if (node.makeSelectionVisible === false) {
            node.makeSelectionVisible = true;
          }
        }
      }
    }
  }

  /**
   * Getter for Node by ID
   * @param Nodes
   * @param id
   */
  private getNodeByID(Nodes: Array<TNodeTemplate>, id: string) {
    if (Nodes !== null && Nodes.length > 0) {
      for (const node of Nodes) {
        if (node.id === id) {
          return node;
        }
      }
    }
  }

  /**
   * Removes the drag source from JSPlumb, removes connection.
   */
  unbindDragSource(): void {
    if (this.dragSourceInfos) {
      this.newJsPlumbInstance.removeAllEndpoints(this.dragSourceInfos.dragSource);
      if (this.dragSourceInfos.dragSource) {
        if (this.newJsPlumbInstance.isSource(this.dragSourceInfos.dragSource)) {
          this.newJsPlumbInstance.unmakeSource(this.dragSourceInfos.dragSource);
        }
      }
      this.dragSourceActive = false;
    }
  }

  /**
   * Removes a connection between nodes
   */
  unbindConnection(): void {
    if (this.jsPlumbBindConnection === true) {
      this.newJsPlumbInstance.unbind('connection');
      this.jsPlumbBindConnection = false;
      this.unbindDragSource();
    }
  }

  /**
   * Creates a connection between nodes in JSPlumb and internally.
   */
  bindConnection(): void {
    if (this.jsPlumbBindConnection === false) {
      this.jsPlumbBindConnection = true;
      this.newJsPlumbInstance.bind('connection', info => {
        this.jsPlumbConnections.push(info.connection);
        const sourceElement = info.source.offsetParent.offsetParent.id;
        const targetElement = info.targetId;
        const relationshipId = `${sourceElement}_${this.currentType}_${targetElement}`;
        const relTypeExists = this.allRelationshipTemplates.map(rel => {
          return rel.id;
        }).includes(this.currentType);
        if (relTypeExists === false && this.currentType && sourceElement !== targetElement) {
          const newRelationship = new TRelationshipTemplate(
            sourceElement,
            targetElement,
            undefined,
            relationshipId,
            this.currentType
          );
          this.ngRedux.dispatch(this.actions.saveRelationship(newRelationship));
        }
        this.unbindConnection();
        this.repaintJsPlumb();
      });
    }
  }

  /**
   * Removes styling from a selected connection.
   * @param unmarkMessage
   */
  unmarkConnections(unmarkMessage: string) {
    this.newJsPlumbInstance.select().removeType('marked');
  }

  /**
   * Adds styling to all nodes
   */
  assignVisuals() {
    for (const node of this.allNodeTemplates) {
      for (const visual of this.visuals) {
        if (node.id === visual.localName || node.id.startsWith(visual.localName + '_')) {
          node.color = visual.color;
          if (visual.hasOwnProperty('imageUrl')) {
            node.imageUrl = visual.imageUrl;
          }
        }
      }
    }
  }

  /**
   * Registers relationship (connection) types in JSPlumb (Color, strokewidth etc.)
   * @param unmarkMessage
   */
  assignRelTypes(): void {
    if (this.allRelationshipTypes.length > 0) {
      this.newJsPlumbInstance.registerConnectionType('marked', {paintStyle: {stroke: 'red', strokeWidth: 5 }});
      for (const rel of this.allRelationshipTypes) {
        const color = '#' + (0x1000000 + Math.floor(Math.random() * 0x1000000)).toString(16).substr(1);
        this.allRelationshipTypesColors.push({
          type: rel,
          color: color
        });
        this.newJsPlumbInstance.registerConnectionType(
          rel, {
            paintStyle: {
              stroke: color,
              strokeWidth: 2
            },
            hoverPaintStyle: {stroke: 'red', strokeWidth: 5}
          });
      }
    }
  }

  /**
   * Lifecycle hook
   */
  ngOnInit() {
    this.assignVisuals();
    this.assignRelTypes();
  }

  /**
   * Replaces spaces from the currentType.
   * @param currentType
   */
  sendCurrentType(currentType: string) {
    this.currentType = currentType.replace(' ', '');
  }

  /**
   * Removes an element from JSPlumb.
   * @param id
   */
  removeElement(id: string) {
    this.newJsPlumbInstance.remove(id);
    this.repaintJsPlumb();
  }

  /**
   * Repaints JSPlumb after 1ms
   */
  repaintJsPlumb() {
    setTimeout(() => this.newJsPlumbInstance.repaintEverything(), 1);
  }

  /**
   * Tells JSPlumb to make a node draggable
   * @param nodeId
   */
  makeDraggable(nodeId: string): void {
    this.newJsPlumbInstance.draggable(nodeId);
  }

  /**
   * Removes a connection between nodes
   */
  removeDragSource(): void {
    for (const node of this.nodeChildrenArray) {
      if (node.dragSource) {
        if (this.newJsPlumbInstance.isSource(node.dragSource)) {
          this.newJsPlumbInstance.unmakeSource(node.dragSource);
        }
        node.connectorEndpointVisible = false;
      }
    }
  }

  /**
   * Tracks the time of mousedown, this is necessary
   * to decide wether a drag or a click is initiated.
   * @param $event  The HTML event.
   */
  trackTimeOfMouseDown($event: any): void {
    this.newJsPlumbInstance.select().removeType('marked');
    this.repaintJsPlumb();
    this.crosshair = true;
    this.removeDragSource();
    this.clearSelectedNodes();
    this.unbindConnection();
    this.startTime = new Date().getTime();
  }

  /**
   * Tracks the time of mouseup, this is necessary
   * to decide wether a drag or a click is initiated.
   * @param $event  The HTML event.
   */
  trackTimeOfMouseUp($event: any): void {
    this.crosshair = false;
    this.endTime = new Date().getTime();
    this.testTimeDifference();
  }
  /**
   * Checks wether it was a drag or a click.
   */
  private testTimeDifference(): void {
    if ((this.endTime - this.startTime) < 300) {
      this.longPress = false;
    } else if (this.endTime - this.startTime >= 300) {
      this.longPress = true;
    }
  }

  /**
   * Lifecycle event
   */
  ngAfterViewInit() {
    this.nodeChildrenArray = this.nodeComponentChildren.toArray();
    this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.nodeAttributes.id);
    this.nodeComponentChildren.changes.subscribe(children => {
      this.nodeChildrenArray = children.toArray();
      this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.nodeAttributes.id);
    });
  }
  /**
   * Lifecycle event
   */
  ngOnDestroy() {
    this.nodeTemplatesSubscription.unsubscribe();
    this.relationshipTemplatesSubscription.unsubscribe();
    this.navBarButtonsStateSubscription.unsubscribe();
    this.paletteOpenedSubscription.unsubscribe();
  }
}
