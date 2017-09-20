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
  Renderer2, ViewChild
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
  visuals: any[];
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
  makeNewNodeSelectionVisible: any;
  newNodeData: any;
  allRelationshipTypes: Array<string> = [];
  allRelationshipTypesColors: Array<any> = [];

  constructor(private jsPlumbService: JsPlumbService,
              private jsonService: JsonService,
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
    console.log(this.newJsPlumbInstance);
  }

  updateNodes(currentNodes: Array<TNodeTemplate>): void {
    if (currentNodes.length !== this.allNodeTemplates.length) {
      if (currentNodes.length > this.allNodeTemplates.length) {
        this.allNodeTemplates = currentNodes;
        this.allNodesIds = this.allNodeTemplates.map(node => node.id);
        this.newNode = currentNodes[currentNodes.length - 1];
        this.unbindConnection();
        this.clearSelectedNodes();
        this.resetDragSource(this.newNode.id);
        this.repaintConnections();
        if (this.currentPaletteOpenedState) {
          // this.addNewNodeToDragSelection(this.newNode.id, currentNodes);
          this.makeNewNodeSelectionVisible = {
            id: this.newNode.id,
          };
          this.zone.runOutsideAngular(() => {
            this.unbindNewNodeMouseMove = this.renderer.listen(this._eref.nativeElement, 'mousemove',
              (event) => this.moveNewNode(event));
            this.unbindNewNodeMouseUp = this.renderer.listen(this._eref.nativeElement, 'mouseup',
              ($event) => this.positionNewNode($event));
          });
          this.enhanceDragSelection(this.newNode.id);
        }
      }
      this.allNodeTemplates = currentNodes;
      this.allNodesIds = this.allNodeTemplates.map(node => node.id);
    } else {
      for (let i = 0; i < this.allNodeTemplates.length; i++) {
        const node = currentNodes.find(el => el.id === this.allNodeTemplates[i].id);
        if (node) {
          if (this.allNodeTemplates[i].name !== node.name) {
            const nodeId = this.nodeChildrenIdArray.indexOf(this.allNodeTemplates[i].id);
            this.nodeChildrenArray[nodeId].nodeAttributes.name = node.name;
            this.nodeChildrenArray[nodeId].flash();
            this.allNodeTemplates[i].name = node.name;
          }
        }
      }
    }
  }

  moveNewNode(event): void {
    event.preventDefault();
    const indexOfNewNode = this.allNodeTemplates.map(node => node.id).indexOf(this.newNode.id);
    this.newNodeData = {
      id: this.newNode.id,
      x: event.clientX - 100,
      y: event.clientY - 30
    };
    this.allNodeTemplates[indexOfNewNode].otherAttributes.x = this.newNodeData.x;
    this.allNodeTemplates[indexOfNewNode].otherAttributes.y = this.newNodeData.y;
  }

  positionNewNode($event): void {
    this.updateAllNodes('Position new Node');
    this.unbindNewNodeMouseMove();
    this.unbindNewNodeMouseUp();
  }

  setPaletteState(currentPaletteOpened: boolean): void {
    this.currentPaletteOpenedState = currentPaletteOpened;
  }

  repaintConnections(): void {
    if (this.newJsPlumbInstance) {
      this.newJsPlumbInstance.deleteEveryConnection();
      for (const relationship of this.allRelationshipTemplates) {
        setTimeout(() => this.paintRelationship(relationship), 1);
      }
      // console.log(this.newJsPlumbInstance.getAllConnections());
      // console.log(this.allRelationshipTemplates);
      this.repaintJsPlumb();
    }
  }

  updateRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
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


  setButtonsState(currentButtonsState: ButtonsStateModel): void {
    this.navbarButtonsState = currentButtonsState;
    setTimeout(() => this.repaintJsPlumb(), 1);
    const alignmentButtonLayout = this.navbarButtonsState.buttonsState.layoutButton;
    const alignmentButtonAlignH = this.navbarButtonsState.buttonsState.alignHButton;
    const alignmentButtonAlignV = this.navbarButtonsState.buttonsState.alignVButton;
    if (alignmentButtonLayout) {
      this._layoutDirective.layoutNodes(this.allNodeTemplates, this.allRelationshipTemplates, this.newJsPlumbInstance);
      this.ngRedux.dispatch(this.topologyRendererActions.executeLayout());
    } else if (alignmentButtonAlignH) {
      if (this.selectedNodes.length >= 1) {
        this._layoutDirective.alignHorizontal(this.selectedNodes, this.newJsPlumbInstance);
      } else {
        this._layoutDirective.alignHorizontal(this.allNodeTemplates, this.newJsPlumbInstance);
      }
      this.ngRedux.dispatch(this.topologyRendererActions.executeAlignH());
    } else if (alignmentButtonAlignV) {
      if (this.selectedNodes.length >= 1) {
        this._layoutDirective.alignVertical(this.selectedNodes, this.newJsPlumbInstance);
      } else {
        this._layoutDirective.alignVertical(this.allNodeTemplates, this.newJsPlumbInstance);
      }
      this.ngRedux.dispatch(this.topologyRendererActions.executeAlignV());
    }
  }

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
  }


  manageRelationships(newRelationship: TRelationshipTemplate): void {
    this.paintRelationship(newRelationship);
    this.resetDragSource('reset previous drag source');
    this.repaintJsPlumb();
  }

  resetDragSource(nodeId: string): void {
    if (this.dragSourceInfos) {
      if (this.dragSourceInfos.nodeId !== nodeId) {
        this.newJsPlumbInstance.removeAllEndpoints(this.dragSourceInfos.dragSource);
        if (this.dragSourceInfos.dragSource) {
          if (this.newJsPlumbInstance.isSource(this.dragSourceInfos.dragSource)) {
            console.log('unmakeSource');
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

  @HostListener('document:keydown.delete', ['$event'])
  handleDeleteKeyEvent(event: KeyboardEvent) {
    this.unbindConnection();
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
    this.selectedNodes.length = 0;
    const allConnections = this.newJsPlumbInstance.getAllConnections();
    for (const rel of allConnections) {
      if (rel.hasType('marked')) {
        this.newJsPlumbInstance.deleteConnection(rel);
        const connectionIndex = this.allRelationshipTemplates.map(con => con.id).indexOf(rel.id);
        this.allRelationshipTemplates.splice(connectionIndex, 1);
      }
    }
    this.hideSidebar();
  }

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

  @HostListener('window:scroll', ['event'])
  adjustGrid($event) {
    this.gridWidth = window.innerWidth;
    this.gridHeight = window.innerHeight;
  }

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

  private isObjectInSelection(selectionArea, object): boolean {
    const selectionRect = selectionArea.getBoundingClientRect();
    return (
      ((selectionRect.top + selectionRect.height) > (object.offsetTop + object.offsetHeight)) &&
      (selectionRect.top < (object.offsetTop)) &&
      ((selectionRect.left + selectionArea.getBoundingClientRect().width) > (object.offsetLeft + object.offsetWidth)) &&
      (selectionRect.left < (object.offsetLeft))
    );
  }

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

  checkFocusNode(focusNodeData: any): void {
    if (focusNodeData.ctrlKey) {
      if (this.jsPlumbBindConnection === true) {
        this.unbindConnection();
      }
      if (!this.arrayContainsNode(this.selectedNodes, focusNodeData.id)) {
        this.enhanceDragSelection(focusNodeData.id);
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
        this.newJsPlumbInstance.removeFromAllPosses(focusNodeData.id);
        const nodeIndex = this.nodeChildrenArray.map(node => node.nodeAttributes.id).indexOf(focusNodeData.id);
        this.nodeChildrenArray[nodeIndex].makeSelectionVisible = false;
        const selectedNodeIndex = this.selectedNodes.map(node => node.id).indexOf(focusNodeData.id);
        this.selectedNodes.splice(selectedNodeIndex, 1);
      }
    } else {
      for (const node of this.nodeChildrenArray) {
        if (node.nodeAttributes.id === focusNodeData.id) {
          node.makeSelectionVisible = true;
        } else if (!this.arrayContainsNode(this.selectedNodes, node.nodeAttributes.id)) {
          node.makeSelectionVisible = false;
          this.resetDragSource(focusNodeData.id);
        }
      }
      this.unbindConnection();
      if (this.selectedNodes.length === 1 && this.selectedNodes.find(node => node.id !== focusNodeData.id)) {
        this.clearSelectedNodes();
      }
      if (this.selectedNodes.length === 0) {
        this.enhanceDragSelection(focusNodeData.id);
      }
      if (!this.arrayContainsNode(this.selectedNodes, focusNodeData.id)) {
        this.clearSelectedNodes();
      }
    }
  }

  updateAllNodes($event): void {
    if (this.selectedNodes.length > 0) {
      for (const nodeTemplate of this.child.nativeElement.children) {
        const draggedNode = this.selectedNodes.find(node => node.id === nodeTemplate.firstChild.id);
        if (draggedNode) {
          const index = this.allNodeTemplates.map(node => node.id).indexOf(nodeTemplate.firstChild.id);
          const nodeCoordinates = {
            id: nodeTemplate.firstChild.id,
            x: nodeTemplate.firstChild.offsetLeft,
            y: nodeTemplate.firstChild.offsetTop
          };
          this.allNodeTemplates[index].otherAttributes.x = nodeCoordinates.x;
          this.allNodeTemplates[index].otherAttributes.y = nodeCoordinates.y;
          this.ngRedux.dispatch(this.actions.updateNodeCoordinates(nodeCoordinates));
        }
      }
    }
  }

  private arrayContainsNode(Nodes: any[], id: string): boolean {
    if (Nodes !== null && Nodes.length > 0) {
      for (const node of Nodes) {
        if (node.id === id) {
          return true;
        }
      }
    }
    return false;
  }

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

  private getNodeByID(Nodes: Array<TNodeTemplate>, id: string) {
    if (Nodes !== null && Nodes.length > 0) {
      for (const node of Nodes) {
        if (node.id === id) {
          return node;
        }
      }
    }
  }

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

  unbindConnection(): void {
    if (this.jsPlumbBindConnection === true) {
      this.newJsPlumbInstance.unbind('connection');
      this.jsPlumbBindConnection = false;
      this.unbindDragSource();
    }
  }

  bindConnection(): void {
    if (this.jsPlumbBindConnection === false) {
      this.jsPlumbBindConnection = true;
      this.newJsPlumbInstance.bind('connection', info => {
        this.jsPlumbConnections.push(info.connection);
        const sourceElement = info.source.offsetParent.offsetParent.id;
        const targetElement = info.targetId;
        const relationshipId = `${sourceElement}_${this.currentType}_${targetElement}`;
        const relTypeExists = this.allRelationshipTemplates.map(rel => rel.id).includes(relationshipId);
        if (relTypeExists === false) {
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

  unmarkConnections(unmarkMessage: string) {
    this.newJsPlumbInstance.select().removeType('marked');
  }

  assignVisuals() {
    for (const node of this.allNodeTemplates) {
      for (const visual of this.visuals) {
        // console.log('node.id = ' + node.id);
        // console.log('visual = ' + JSON.stringify(visual));
        if (node.id === visual.localName || node.id.startsWith(visual.localName + '_')) {
          node.color = visual.color;
          if (visual.hasOwnProperty('imageUrl')) {
            node.imageUrl = visual.imageUrl;
          }
        }
      }
    }
  }

  assignRelTypes(): void {
    if (this.allRelationshipTypes.length > 0) {
      this.newJsPlumbInstance.registerConnectionType('marked', {paintStyle: {stroke: 'red', strokeWidth: 5 }});
      for (const rel of this.allRelationshipTypes) {
        const color = '#' + (0x1000000 + Math.floor(Math.random() * 0x1000000)).toString(16).substr(1);
        this.allRelationshipTypesColors.push({
          type: rel,
          color: '0 0 2px ' + color
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

  ngOnInit() {
    this.visuals = this.jsonService.getVisuals();
    this.assignVisuals();
    this.assignRelTypes();
  }


  sendCurrentType(currentType: string) {
    this.currentType = currentType.replace(' ', '');
  }

  removeElement(id: string) {
    this.newJsPlumbInstance.remove(id);
    this.repaintJsPlumb();
  }

  repaintJsPlumb() {
    setTimeout(() => this.newJsPlumbInstance.repaintEverything(), 1);
  }

  makeDraggable(nodeId: string): void {
    this.newJsPlumbInstance.draggable(nodeId);
  }

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


  trackTimeOfMouseDown($event: any): void {
    this.newJsPlumbInstance.select().removeType('marked');
    this.crosshair = true;
    this.removeDragSource();
    this.clearSelectedNodes();
    this.unbindConnection();
    this.startTime = new Date().getTime();
  }

  trackTimeOfMouseUp($event: any): void {
    this.crosshair = false;
    this.endTime = new Date().getTime();
    this.testTimeDifference();
  }

  private testTimeDifference(): void {
    if ((this.endTime - this.startTime) < 300) {
      this.longPress = false;
    } else if (this.endTime - this.startTime >= 300) {
      this.longPress = true;
    }
  }

  ngAfterViewInit() {
    this.nodeChildrenArray = this.nodeComponentChildren.toArray();
    this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.nodeAttributes.id);
    this.nodeComponentChildren.changes.subscribe(children => {
      this.nodeChildrenArray = children.toArray();
      this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.nodeAttributes.id);
    });
  }

  ngOnDestroy() {
    this.nodeTemplatesSubscription.unsubscribe();
    this.relationshipTemplatesSubscription.unsubscribe();
    this.navBarButtonsStateSubscription.unsubscribe();
    this.paletteOpenedSubscription.unsubscribe();
  }
}
