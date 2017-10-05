/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Josip Ledic - initial API and implementation, Refactoring to use Redux instead
 *     Thommy Zelenik - implementation, Refactoring
 */
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';

/**
 * Every node has its own component and gets created dynamically.
 */
@Component({
  selector: 'winery-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent implements OnInit, AfterViewInit, OnDestroy {
  public items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  public accordionGroupPanel = 'accordionGroupPanel';
  public customClass = 'customClass';
  connectorEndpointVisible = false;
  startTime;
  endTime;
  longpress = false;
  makeSelectionVisible = false;
  setFlash = false;
  setMaxFlash = false;
  setMinFlash = false;
  @Input() nodeAttributes: any;
  @Input() needsToBeFlashed: boolean;
  @Input() dragSource: string;
  @Input() navbarButtonsState: ButtonsStateModel;
  @Output() sendId: EventEmitter<string>;
  @Output() askForRepaint: EventEmitter<string>;
  @Output() setDragSource: EventEmitter<any>;
  @Output() closedEndpoint: EventEmitter<string>;
  @Output() handleNodeClickedActions: EventEmitter<any>;
  @Output() updateSelectedNodes: EventEmitter<string>;
  @Output() sendCurrentType: EventEmitter<string>;
  @Output() askForRemoval: EventEmitter<string>;
  @Output() unmarkConnections: EventEmitter<string>;
  @Input() makeNewNodeSelectionVisible: any;
  previousPosition: any;
  currentPosition: any;
  @Input() allRelationshipTypesColors: Array<string>;
  nodeRef: ComponentRef<Component>;
  unbindMouseMove: Function;

  public addItem(): void {
    this.items.push(`Items ${this.items.length + 1}`);
  }

  constructor(private zone: NgZone,
              private $ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions,
              private elRef: ElementRef,
              private renderer: Renderer2) {
    this.sendId = new EventEmitter();
    this.askForRepaint = new EventEmitter();
    this.setDragSource = new EventEmitter();
    this.closedEndpoint = new EventEmitter();
    this.handleNodeClickedActions = new EventEmitter();
    this.updateSelectedNodes = new EventEmitter();
    this.sendCurrentType = new EventEmitter();
    this.askForRemoval = new EventEmitter();
    this.unmarkConnections = new EventEmitter();
  }

  /**
   * Angular lifecycle event.
   */
  ngOnInit() {
  }

  /**
   * Angular lifecycle event.
   */
  ngAfterViewInit(): void {
    this.sendId.emit(this.nodeAttributes.id);
  }

  /**
   * Stops the event propagation to the canvas etc. and repaints.
   * @param $event
   */
  repaint($event) {
    $event.stopPropagation();
    setTimeout(() => this.askForRepaint.emit('Repaint'), 1);
  }

  /**
   * Sets the current type of a node.
   * @param $event
   */
  passCurrentType($event): void {
    $event.stopPropagation();
    $event.preventDefault();
    let currentType: string;
    try {
      currentType = $event.srcElement.innerText.replace(/\n/g, '').replace(/\s+/g, '');
    } catch (e) {
      currentType = $event.target.innerText.replace(/\n/g, '').replace(/\s+/g, '');
    }
    this.sendCurrentType.emit(currentType);
  }

  /**
   * Handler for mousedown events, toggles visibility of node attributes
   * @param $event
   */
  mouseDownHandler($event): void {
    this.unmarkConnections.emit('unmark');
    this.startTime = new Date().getTime();
    this.repaint(new Event('repaint'));
    const focusNodeData = {
      id: this.nodeAttributes.id,
      ctrlKey: $event.ctrlKey
    };
    this.handleNodeClickedActions.emit(focusNodeData);
    let parentEl;
    try {
      parentEl = $event.srcElement.parentElement.className;
    } catch (e) {
      parentEl = $event.target.parentElement.className;
    }
    if (parentEl !== 'accordion-toggle') {
      const offsetLeft = this.elRef.nativeElement.firstChild.offsetLeft;
      const offsetTop = this.elRef.nativeElement.firstChild.offsetTop;
      this.previousPosition = {
        x: offsetLeft,
        y: offsetTop
      };
      this.zone.runOutsideAngular(() => {
        this.unbindMouseMove = this.renderer.listen(this.elRef.nativeElement, 'mousemove', (event) => this.mouseMove(event));
      });
    }
  }

  /**
   * If a node is moved, this saves the current position of the node into the store.
   * @param $event
   */
  mouseMove($event): void {
    const offsetLeft = this.elRef.nativeElement.querySelector('#' + this.nodeAttributes.id).offsetLeft;
    const offsetTop = this.elRef.nativeElement.querySelector('#' + this.nodeAttributes.id).offsetTop;
    this.currentPosition = {
      id: this.nodeAttributes.id,
      x: offsetLeft,
      y: offsetTop
    };
  }

  /**
   * Checks if it was a click or a drag operation on the node.
   * @param $event
   */
  mouseUpHandler($event): void {
    // mouseup
    this.endTime = new Date().getTime();
    this.testTimeDifference($event);
    if (this.previousPosition !== undefined && this.currentPosition !== undefined) {
      const differenceY = this.previousPosition.y - this.currentPosition.y;
      const differenceX = this.previousPosition.x - this.currentPosition.x;
      if (Math.abs(differenceX) > 2 || Math.abs(differenceY) > 2) {
        this.unbindMouseMove();
        this.updateSelectedNodes.emit('Update selectedNodes');
      }
    }
  }

  /**
   * CSS flash effect.
   */
  flash(): void {
    this.setFlash = true;
    setTimeout(() => this.setFlash = false, 1000);
  }

  /**
   * CSS flash effect.
   */
  flashMin(): void {
    this.setMinFlash = true;
    setTimeout(() => this.setMinFlash = false, 1000);
  }

  /**
   * CSS flash effect.
   */
  flashMax(): void {
    this.setMaxFlash = true;
    setTimeout(() => this.setMaxFlash = false, 1000);
  }

  /**
   * If it was a click operation, close the connector endpoints for relations
   * @param $event
   */
  closeConnectorEndpoints($event): void {
    $event.stopPropagation();
    if (!this.longpress && !$event.ctrlKey) {
      this.closedEndpoint.emit(this.nodeAttributes.id);
      this.repaint(new Event('repaint'));
    }
  }

  /**
   * Checks if it was a click or a drag operation on the node.
   * @param $event
   */
  private testTimeDifference($event): void {
    if ((this.endTime - this.startTime) < 200) {
      this.longpress = false;
    } else if (this.endTime - this.startTime >= 200) {
      this.longpress = true;
    }
  }

  /**
   * Creates a dragoperation for nodes
   * @param $event
   */
  makeSource($event): void {
    const dragSourceInfo = {
      dragSource: this.dragSource,
      nodeId: this.nodeAttributes.id
    };
    this.setDragSource.emit(dragSourceInfo);
  }

  /**
   * Only display the sidebar if the click is no longpress (drag)
   * @param $event
   */
  // Only display the sidebar if the click is no longpress
  openSidebar($event): void {
    $event.stopPropagation();
    // close sidebar when longpressing a node template
    if (this.longpress) {
      this.$ngRedux.dispatch(this.actions.openSidebar({
        sidebarContents: {
          sidebarVisible: false,
          nodeClicked: true,
          id: '',
          nameTextFieldValue: '',
          type: '',
          minInstances: -1,
          maxInstances: -1
        }
      }));
    } else {
      let type;
      const id = this.nodeAttributes.id;
      if (id.includes('_')) {
        type = id.substring(0, id.indexOf('_'));
      } else {
        type = id;
      }
      this.$ngRedux.dispatch(this.actions.openSidebar({
        sidebarContents: {
          sidebarVisible: true,
          nodeClicked: true,
          id: this.nodeAttributes.id,
          nameTextFieldValue: this.nodeAttributes.name,
          type: type,
          minInstances: this.nodeAttributes.minInstances,
          maxInstances: this.nodeAttributes.maxInstances
        }
      }));
    }
  }

  /**
   * Angular lifecycle event.
   */
  ngOnDestroy(): void {
    this.askForRemoval.emit(this.nodeAttributes.id);
    if (this.nodeRef) {
      this.nodeRef.destroy();
    }
  }
}
