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
import { Component, ElementRef, HostListener, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { JsPlumbService } from '../jsPlumbService';
import { JsonService } from '../jsonService/json.service';
import { TNodeTemplate, TRelationshipTemplate } from '../ttopology-template';
import { LayoutDirective } from '../layout.directive';
import { WineryActions } from '../redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { TopologyRendererActions } from '../redux/actions/topologyRenderer.actions';

@Component({
  selector: 'winery-canvas',
  providers: [LayoutDirective],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  allNodeTemplates: Array<TNodeTemplate> = [];
  allRelationshipTemplates: Array<TRelationshipTemplate> = [];
  relationshipTemplates: Array<TRelationshipTemplate> = [];
  nodeTypes: any[] = [];
  selectedNodes: Array<TNodeTemplate> = [];
  navbarButtonsState: ButtonsStateModel;
  topologymodeler;
  newJsPlumbInstance: any;
  visuals: any[];
  nodeSelected = false;
  pageX: Number;
  pageY: Number;
  selectionActive: boolean;
  initialW: number;
  initialH: number;
  selectionWidth: number;
  selectionHeight: number;
  callOpenSelector: boolean;
  callSelectItems: boolean;
  offsetY = 0;
  offsetX = 102;
  startTime: number;
  endTime: number;
  longPress: boolean;
  crosshair = false;
  differPressedNavBarButton: any;
  enhanceGrid: number;
  nodeTemplatesSubscription;
  gridSubscription;
  relationshipTemplatesSubscription;
  navBarButtonsStateSubscription;

  constructor(private jsPlumbService: JsPlumbService, private jsonService: JsonService, private _eref: ElementRef,
              private _layoutDirective: LayoutDirective,
              differsPressedNavBarButton: KeyValueDiffers,
              private ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions,
              private topologyRendererActions: TopologyRendererActions) {
    this.nodeTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.nodeTemplates)
      .subscribe(currentNodes => this.addNewNode(currentNodes));
    this.relationshipTemplatesSubscription = this.ngRedux.select(state => state.wineryState.currentJsonTopology.relationshipTemplates)
      .subscribe(currentRelationships => this.addNewRelationship(currentRelationships));
    this.gridSubscription = this.ngRedux.select(state => state.wineryState.currentPaletteOpenedState)
      .subscribe(currentPaletteOpened => this.updateGridState(currentPaletteOpened));
    this.navBarButtonsStateSubscription = ngRedux.select(state => state.topologyRendererState)
      .subscribe(currentButtonsState => this.setButtonsState(currentButtonsState));
  }

  addNewNode(currentNodes: Array<TNodeTemplate>): void {
    if (currentNodes.length > 0) {
      this.allNodeTemplates = currentNodes;
    }
  }

  addNewRelationship(currentRelationships: Array<TRelationshipTemplate>): void {
    // const newRelationship = currentRelationships[currentRelationships.length - 1];
    if (currentRelationships.length > 0) {
      this.allRelationshipTemplates = currentRelationships;
      this.allRelationshipTemplates.map(relationship => {
        setTimeout(() => this.displayRelationships(relationship), 1);
      });
    }
  }

  updateGridState(currentPaletteOpenedState: boolean) {
    if (currentPaletteOpenedState !== true) {
      this.enhanceGrid = 0;
      this.offsetX = 0;
    } else {
      this.offsetX = -200;
      this.enhanceGrid = 200;
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
    const sourceElement = newRelationship.sourceElement;
    const targetElement = newRelationship.targetElement;
    this.newJsPlumbInstance.connect({
      source: sourceElement,
      target: targetElement,
      overlays: [['Arrow', {width: 15, length: 15, location: 1, id: 'arrow', direction: 1}],
        ['Label', {
          label: '(Hosted On)',
          id: 'label',
          labelStyle: {font: 'bold 18px/30px Courier New, monospace'}
        }]
      ],
    });
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    if (this._eref.nativeElement.contains($event.target) && this.longPress === false) {
      this.newJsPlumbInstance.removeFromAllPosses(this.getStringIds(this.selectedNodes));
      this.clearArray(this.selectedNodes);
      if ($event.clientX > 200) {
        this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
      }
    }
  }

  clearArray(array: any[]): void {
    array.length = 0;
    // TODO hostlistener on click klappt nur auf nodes in firefox?
  }

  @HostListener('mousedown', ['$event'])
  showSelectionRange($event) {
    if (($event.pageY - this.offsetY) > 0) {
      this.selectionActive = true;
      this.pageX = $event.pageX + this.offsetX;
      this.pageY = $event.pageY - this.offsetY;
      this.initialW = $event.pageX;
      this.initialH = $event.pageY;
      this.callOpenSelector = true;
      this.callSelectItems = true;
    }
    this.crosshair = true;
  }

  @HostListener('mousemove', ['$event'])
  openSelector($event) {
    if (this.callOpenSelector) {
      this.selectionWidth = Math.abs(this.initialW - $event.pageX);
      this.selectionHeight = Math.abs(this.initialH - $event.pageY);
      if ($event.pageX <= this.initialW && $event.pageY >= this.initialH) {
        this.pageX = $event.pageX + this.offsetX;
      } else if ($event.pageY <= this.initialH && $event.pageX >= this.initialW) {
        this.pageY = $event.pageY - this.offsetY;
      } else if ($event.pageY < this.initialH && $event.pageX < this.initialW) {
        this.pageX = $event.pageX + this.offsetX;
        this.pageY = $event.pageY - this.offsetY;
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  selectElements($event) {
    if (this.callSelectItems) {
      this.callOpenSelector = false;
      this.callSelectItems = false;
      for (const node of this.allNodeTemplates) {
        const aElem = document.getElementById('selection');
        const bElem = document.getElementById(node.id);
        const result = this.doObjectsCollide(aElem, bElem);
        if (result === true) {
          this.enhanceDragSelection(node.id);
        }
      }
      this.crosshair = false;
      this.selectionActive = false;
      this.selectionWidth = 0;
      this.selectionHeight = 0;
    }
    // This is just a hack for firefox, the same code is in the click listener
    if (this._eref.nativeElement.contains($event.target) && this.longPress === false) {
      this.newJsPlumbInstance.removeFromAllPosses(this.getStringIds(this.selectedNodes));
      this.clearArray(this.selectedNodes);
      if ($event.clientX > 200) {
        this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
      }
    }
  }

  private getStringIds(Nodes: Array<TNodeTemplate>) {
    const nodeIds: String[] = [];
    for (const node of Nodes) {
      nodeIds.push(node.id);
    }
    return nodeIds;
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

  repaintJsPlumb() {
    this.newJsPlumbInstance.repaintEverything();
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

  ngOnInit() {
    this.newJsPlumbInstance = this.jsPlumbService.getJsPlumbInstance();
    this.newJsPlumbInstance.setContainer('container');
    this.visuals = this.jsonService.getVisuals();
    this.assignVisuals();
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

  makeDraggable($event): void {
    this.newJsPlumbInstance.draggable($event);
  }

  checkIfNodeInSelection($event): void {
    if (this.arrayContainsNode(this.selectedNodes, $event) === false) {
      this.newJsPlumbInstance.removeFromAllPosses(this.getStringIds(this.selectedNodes));
      this.clearArray(this.selectedNodes);
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

  addNodeToDragSelection($event): void {
    this.enhanceDragSelection($event);
  }

  trackTimeOfMouseDown(e: Event): void {
    this.startTime = new Date().getTime();
  }

  trackTimeOfMouseUp(e: Event): void {
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

  ngOnDestroy() {
    this.nodeTemplatesSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
    this.relationshipTemplatesSubscription.unsubscribe();
    this.navBarButtonsStateSubscription.unsubscribe();
  }
}
