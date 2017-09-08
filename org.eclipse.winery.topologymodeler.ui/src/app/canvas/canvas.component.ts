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
  AfterViewInit
} from '@angular/core';
import {JsPlumbService} from '../jsPlumbService';
import {JsonService} from '../jsonService/json.service';
import {TNodeTemplate, TRelationshipTemplate} from '../ttopology-template';
import {LayoutDirective} from '../layout.directive';
import {WineryActions} from '../redux/actions/winery.actions';
import {NgRedux} from '@angular-redux/store';
import {IWineryState} from '../redux/store/winery.store';
import {ButtonsStateModel} from '../models/buttonsState.model';
import {TopologyRendererActions} from '../redux/actions/topologyRenderer.actions';
import {NodeComponent} from '../node/node.component';

@Component({
  selector: 'winery-canvas',
  providers: [LayoutDirective],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(NodeComponent) nodeComponentChildren: QueryList<NodeComponent>;
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
  dragSourceActive = false;
  gridWidth = 100;
  gridHeight = 100;
  nodeChildrenIdArray: Array<string>;
  nodeChildrenArray: Array<NodeComponent>;

  constructor(private jsPlumbService: JsPlumbService, private jsonService: JsonService, private _eref: ElementRef,
              private _layoutDirective: LayoutDirective,
              private ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions,
              private topologyRendererActions: TopologyRendererActions,
              private zone: NgZone) {
    this.nodeTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.nodeTemplates)
      .subscribe(currentNodes => this.updateNodes(currentNodes));
    this.relationshipTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.relationshipTemplates)
      .subscribe(currentRelationships => this.updateRelationships(currentRelationships));
    this.navBarButtonsStateSubscription = ngRedux.select(state => state.topologyRendererState)
      .subscribe(currentButtonsState => this.setButtonsState(currentButtonsState));
  }

  updateNodes(currentNodes: Array<TNodeTemplate>): void {
    if (currentNodes.length !== this.allNodeTemplates.length) {
      this.allNodeTemplates = currentNodes;
      this.allNodesIds = this.allNodeTemplates.map(node => node.id);
    } else {
      for (let i = 0; i < this.allNodeTemplates.length; i++) {
        const node = currentNodes.find(el => el.id === this.allNodeTemplates[i].id);
        if (this.allNodeTemplates[i].name !== node.name) {
          const nodeId = this.nodeChildrenIdArray.indexOf(this.allNodeTemplates[i].id);
          this.nodeChildrenArray[nodeId].nodeAttributes.name = node.name;
          this.nodeChildrenArray[nodeId].flash();
          this.allNodeTemplates[i].name = node.name;
        }
      }
    }
  }


  updateRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
    this.allRelationshipTemplates = currentRelationships;
    if (this.allRelationshipTemplates.length > 0) {
      for (const relationship of this.allRelationshipTemplates) {
        setTimeout(() => this.displayRelationships(relationship), 1);
      }
    }
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

  displayRelationships(newRelationship: TRelationshipTemplate): void {
    this.newJsPlumbInstance.connect({
      source: newRelationship.sourceElement,
      target: newRelationship.targetElement,
      overlays: [['Arrow', {width: 15, length: 15, location: 1, id: 'arrow', direction: 1}],
        ['Label', {
          label: '(Hosted On)',
          id: 'label',
          labelStyle: {font: 'bold 18px/30px Courier New, monospace'}
        }]
      ],
    });
    this.resetDragSource('reset drag source');
  }

  resetDragSource(nodeId: string): void {
    if (this.dragSourceInfos) {
      if (this.dragSourceInfos.nodeId !== nodeId) {
        if (this.newJsPlumbInstance.isSource(this.dragSourceInfos.dragSource)) {
          this.newJsPlumbInstance.unmakeSource(this.dragSourceInfos.dragSource);
        }
        this.newJsPlumbInstance.removeAllEndpoints(this.dragSourceInfos.dragSource);
        const indexOfNode = this.nodeChildrenIdArray.indexOf(this.dragSourceInfos.nodeId);
        if (this.nodeChildrenArray[indexOfNode]) {
          this.nodeChildrenArray[indexOfNode].connectorEndpointVisible = false;
        }
      }
    }
    this.dragSourceActive = false;
  }

  closedEndpoint(nodeId: string): void {
    const node = this.nodeChildrenArray.find((nodeTemplate => nodeTemplate.nodeAttributes.id === nodeId));
    node.connectorEndpointVisible = !node.connectorEndpointVisible;
    if (node.connectorEndpointVisible === true) {
      this.dragSourceActive = false;
      this.resetDragSource(nodeId);
      for (const currentNode of this.nodeChildrenArray) {
        if (currentNode.nodeAttributes.id !== nodeId) {
          currentNode.connectorEndpointVisible = false;
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
    }
  }

  @HostListener('document:keydown.delete', ['$event'])
  handleDeleteKeyEvent(event: KeyboardEvent) {
    for (const node of this.nodeChildrenArray) {
      if (node.makeSelectionVisible === true) {
        this.newJsPlumbInstance.removeAllEndpoints(node.nodeAttributes.id);
        if (node.connectorEndpointVisible === true) {
          if (this.newJsPlumbInstance.isSource(node.dragSource)) {
            this.newJsPlumbInstance.unmakeSource(node.dragSource);
          }
        }
        this.ngRedux.dispatch(this.actions.deleteNodeTemplate(node.nodeAttributes.id));
      }
    }
    this.hideSidebar();
  }


  clearSelectedNodes(): void {
    for (const node of this.nodeChildrenArray) {
      if (this.selectedNodes.find(selectedNode => selectedNode.id === node.nodeAttributes.id)) {
        node.makeSelectionVisible = false;
      }
    }
    this.newJsPlumbInstance.removeFromAllPosses(this.selectedNodes.map(node => node.id));
    this.selectedNodes.length = 0;
  }

  showSelectionRange($event: any) {
    // mousedown
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
      document.getElementById('container').addEventListener('mousemove', this.bindOpenSelector);
      document.getElementById('container').addEventListener('mouseup', this.bindSelectElements);
    });
    this.crosshair = true;
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

  bindOpenSelector = (ev) => {
    this.openSelector(ev);
  }

  bindSelectElements = (ev) => {
    this.selectElements(ev);
  }

  selectElements($event: any) {
    // mouseUp
    for (const node of this.allNodeTemplates) {
      const aElem = document.getElementById('selection');
      const bElem = document.getElementById(node.id);
      const result = this.doObjectsCollide(aElem, bElem);
      if (result === true) {
        this.enhanceDragSelection(node.id);
      }
    }
    document.getElementById('container').removeEventListener('mousemove', this.bindOpenSelector);
    document.getElementById('container').removeEventListener('mouseup', this.bindSelectElements);
    this.crosshair = false;
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

  doObjectsCollide(a: any, b: any): boolean {
    const aTop = this.getOffset(a).top;
    const aLeft = this.getOffset(a).left;
    const bTop = this.getOffset(b).top;
    const bLeft = this.getOffset(b).left;

    return !(
      ((aTop + a.getBoundingClientRect().height) < (bTop)) ||
      (aTop > (bTop + b.getBoundingClientRect().height)) ||
      ((aLeft + a.getBoundingClientRect().width) < bLeft) ||
      (aLeft > (bLeft + b.getBoundingClientRect().width))
    );
  }

  hideSidebar() {
    this.ngRedux.dispatch(this.actions.openSidebar({
      sidebarContents: {
        sidebarVisible: false,
        nodeId: '',
        nameTextFieldValue: ''
      }
    }));
  }

  checkFocusNode(focusNodeData: any): void {
    if (focusNodeData.ctrlKey) {
      if (!this.arrayContainsNode(this.selectedNodes, focusNodeData.id)) {
        this.enhanceDragSelection(focusNodeData.id);
        for (const node of this.nodeChildrenArray) {
          const nodeIndex = this.selectedNodes.map(selectedNode => selectedNode.id).indexOf(node.nodeAttributes.id);
          if (this.selectedNodes[nodeIndex] === undefined) {
            node.makeSelectionVisible = false;
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
        }
      }
      if (!this.arrayContainsNode(this.selectedNodes, focusNodeData.id)) {
        this.clearSelectedNodes();
      }
    }
  }

  updateAllNodes(nodeId: string): void {
    if (this.selectedNodes.length > 0) {
      for (const selectedNode of this.selectedNodes) {
        const draggedSelectedNodeId = document.getElementById(selectedNode.id).id;
        const draggedSelectedNodeLeft = document.getElementById(selectedNode.id).offsetLeft;
        const draggedSelectedNodeTop = document.getElementById(selectedNode.id).offsetTop;
        const draggedSelectedNode = this.allNodeTemplates.find(node => node.id === draggedSelectedNodeId);
        const nodeCoordinates = {
          id: draggedSelectedNodeId,
          x: draggedSelectedNodeLeft,
          y: draggedSelectedNodeTop
        };
        draggedSelectedNode.otherAttributes.x = draggedSelectedNodeLeft;
        draggedSelectedNode.otherAttributes.y = draggedSelectedNodeTop;
        this.ngRedux.dispatch(this.actions.updateNodeCoordinates(nodeCoordinates));
      }
    } else {
      const draggedSelectedNodeId = document.getElementById(nodeId).id;
      const draggedSelectedNodeLeft = document.getElementById(nodeId).offsetLeft;
      const draggedSelectedNodeTop = document.getElementById(nodeId).offsetTop;
      const draggedSelectedNode = this.allNodeTemplates.find(node => node.id === draggedSelectedNodeId);
      const nodeCoordinates = {
        id: draggedSelectedNodeId,
        x: draggedSelectedNodeLeft,
        y: draggedSelectedNodeTop
      };
      draggedSelectedNode.otherAttributes.x = draggedSelectedNodeLeft;
      draggedSelectedNode.otherAttributes.y = draggedSelectedNodeTop;
      this.ngRedux.dispatch(this.actions.updateNodeCoordinates(nodeCoordinates));
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
    this.newJsPlumbInstance.addToPosse(nodeId, 'dragSelection');
    if (!this.arrayContainsNode(this.selectedNodes, nodeId)) {
      this.selectedNodes.push(this.getNodeByID(this.allNodeTemplates, nodeId));
      for (const node of this.nodeChildrenArray) {
        if (this.selectedNodes.find(selectedNode => selectedNode.id === node.nodeAttributes.id)) {
          node.makeSelectionVisible = true;
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

  ngOnInit() {
    this.visuals = this.jsonService.getVisuals();
    this.assignVisuals();
    this.newJsPlumbInstance = this.jsPlumbService.getJsPlumbInstance();
    this.newJsPlumbInstance.setContainer('container');
    this.newJsPlumbInstance.bind('connection', info => {
      const sourceElement = info.source.offsetParent.offsetParent.id;
      const targetElement = info.targetId;
      const newRelationship = new TRelationshipTemplate(
        sourceElement,
        targetElement
      );
      this.ngRedux.dispatch(this.actions.saveRelationship(newRelationship));
    });
  }

  repaintJsPlumb() {
    this.newJsPlumbInstance.repaintEverything();
  }

  makeDraggable(nodeId: string): void {
    this.newJsPlumbInstance.draggable(nodeId);
  }

  trackTimeOfMouseDown($event: any): void {
    for (const node of this.nodeChildrenArray) {
      if (node.dragSource) {
        if (this.newJsPlumbInstance.isSource(node.dragSource)) {
          this.newJsPlumbInstance.unmakeSource(node.dragSource);
        }
        node.connectorEndpointVisible = false;
      }
    }
    this.startTime = new Date().getTime();
  }


  trackTimeOfMouseUp($event: any): void {
    this.endTime = new Date().getTime();
    this.testTimeDifference();
  }

  private testTimeDifference(): void {
    if ((this.endTime - this.startTime) < 250) {
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
  }
}
