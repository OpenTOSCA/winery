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
  Component, ElementRef, HostListener, Inject, KeyValueDiffers, OnDestroy, OnInit, NgZone,
  QueryList, ViewChildren,
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
import {NodeComponent} from "../node/node.component";

@Component({
  selector: 'winery-canvas',
  providers: [LayoutDirective],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChildren(NodeComponent) nodeComponentChildren: QueryList<NodeComponent>;
  allNodeTemplates: Array<TNodeTemplate> = [];
  allRelationshipTemplates: Array<TRelationshipTemplate> = [];
  navbarButtonsState: ButtonsStateModel;
  selectedNodes: Array<TNodeTemplate> = [];
  newJsPlumbInstance: any;
  visuals: any[];
  nodeSelected = false;
  nodeArrayEmpty = false;
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
  differPressedNavBarButton: any;
  marginLeft: number;
  dragSourceInfos: any;
  allNodesIds: Array<string> = [];
  nodeTemplatesSubscription;
  relationshipTemplatesSubscription;
  navBarButtonsStateSubscription;
  marginTop: number;
  dragSourceActive = false;
  endpointContainer: string;
  gridWidth = 100;
  gridHeight = 100;
  nodeChildrenIdArray: Array<string>;
  nodeChildrenArray: Array<NodeComponent>;

  constructor(private jsPlumbService: JsPlumbService, private jsonService: JsonService, private _eref: ElementRef,
              private _layoutDirective: LayoutDirective,
              differsPressedNavBarButton: KeyValueDiffers,
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
    this.allNodeTemplates = currentNodes;
    this.allNodesIds = this.allNodeTemplates.map(node => node.id);
  }

  updateRelationships(currentRelationships: Array<TRelationshipTemplate>): void {
    if (currentRelationships.length > 0) {
      if (currentRelationships.length > this.allRelationshipTemplates.length) {
        const newRelationship = currentRelationships[currentRelationships.length - 1];
        this.allRelationshipTemplates.push(newRelationship);
        setTimeout(() => this.displayRelationships(newRelationship), 1);
      } else if (currentRelationships.length <= this.allRelationshipTemplates.length) {
        this.allRelationshipTemplates = currentRelationships;
        if (this.allRelationshipTemplates.length === 1) {
          const newRelationship = currentRelationships[currentRelationships.length - 1];
          setTimeout(() => this.displayRelationships(newRelationship), 1);
        }
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
    if (this.dragSourceInfos) {
      if (this.newJsPlumbInstance.isSource(this.dragSourceInfos.dragSource)) {
        this.newJsPlumbInstance.unmakeSource(this.dragSourceInfos.dragSource);
      }
      this.newJsPlumbInstance.removeAllEndpoints(this.dragSourceInfos.dragSource);
      this.dragSourceActive = false;
      const indexOfNode = this.nodeChildrenIdArray.indexOf(this.dragSourceInfos.nodeId);
      this.nodeChildrenArray[indexOfNode].connectorEndpointVisible = false;
      this.dragSourceInfos = null;
    }
  }

  closedEndpoint($event): void {
    this.dragSourceActive = false;
  }

  setDragSource($event): void {
   if (!this.dragSourceActive) {
      this.newJsPlumbInstance.makeSource($event.dragSource, {
        connectorOverlays: [
          ['Arrow', {location: 1}],
        ],
      });
      this.dragSourceInfos = $event;
      this.newJsPlumbInstance.makeTarget(this.allNodesIds);
      this.dragSourceActive = true;
    }
  }

  @HostListener('document:keydown.delete', ['$event'])
  handleDeleteKeyEvent(event: KeyboardEvent) {
    for (const node of this.nodeChildrenArray) {
      if (node.makeSelectionVisible === true) {
        this.newJsPlumbInstance.removeAllEndpoints(node.title);
        if (this.newJsPlumbInstance.isSource(node.dragSource)) {
          this.newJsPlumbInstance.unmakeSource(node.dragSource);
          console.log(node.dragSource);
        }
        this.ngRedux.dispatch(this.actions.deleteNodeTemplate(node.title));
      }
    }
  }

  
  clearSelectedNodes(): void {
    for (const node of this.nodeChildrenArray) {
      if (this.selectedNodes.find(selectedNode => selectedNode.id === node.title)) {
        node.makeSelectionVisible = false;
      }
    }
    this.newJsPlumbInstance.removeFromAllPosses(this.selectedNodes.map(node => node.id));
    this.selectedNodes.length = 0;
  }

  showSelectionRange($event) {
    console.log($event);
    this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
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

  openSelector($event) {
    console.log('mouseMove');
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

  selectElements($event) {
    console.log('mouseUp');
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

  private getOffset(el) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {top: _y, left: _x};
  }

  doObjectsCollide(a, b): boolean {
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

  checkFocusNode($event): void {
    if ($event.ctrlKey) {
      if (!this.arrayContainsNode(this.selectedNodes, $event.id)) {
        this.enhanceDragSelection($event.id);
        for (const node of this.nodeChildrenArray) {
          const nodeIndex = this.selectedNodes.map(node => node.id).indexOf(node.title);
          if (this.selectedNodes[nodeIndex] === undefined) {
            node.makeSelectionVisible = false;
          }
        }
      } else {
        this.newJsPlumbInstance.removeFromAllPosses($event.id);
        const nodeIndex = this.nodeChildrenArray.map(node => node.title).indexOf($event.id);
        this.nodeChildrenArray[nodeIndex].makeSelectionVisible = false;
        const selectedNodeIndex = this.selectedNodes.map(node => node.id).indexOf($event.id);
        this.selectedNodes.splice(selectedNodeIndex, 1);
      }
    } else {
      for (const node of this.nodeChildrenArray) {
        if (node.title === $event.id) {
          node.makeSelectionVisible = true;
        } else if (!this.arrayContainsNode(this.selectedNodes, node.title)) {
          node.makeSelectionVisible = false;
        }
      }
      if (!this.arrayContainsNode(this.selectedNodes, $event.id)) {
        this.clearSelectedNodes();
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

  private enhanceDragSelection(id: string) {
    this.newJsPlumbInstance.addToPosse(id, 'dragSelection');
    if (!this.arrayContainsNode(this.selectedNodes, id)) {
      this.selectedNodes.push(this.getNodeByID(this.allNodeTemplates, id));
      for (const node of this.nodeChildrenArray) {
        if (this.selectedNodes.find(selectedNode => selectedNode.id === node.title)) {
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

  makeDraggable($event): void {
    this.newJsPlumbInstance.draggable($event);
  }

  trackTimeOfMouseDown($event): void {
    this.startTime = new Date().getTime();
  }

  trackTimeOfMouseUp($event): void {
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
    this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.title);
    this.nodeComponentChildren.changes.subscribe(children => {
      this.nodeChildrenArray = children.toArray();
      this.nodeChildrenIdArray = this.nodeChildrenArray.map(node => node.title);
    });
  }

  ngOnDestroy() {
    this.nodeTemplatesSubscription.unsubscribe();
    this.relationshipTemplatesSubscription.unsubscribe();
    this.navBarButtonsStateSubscription.unsubscribe();
  }
}
