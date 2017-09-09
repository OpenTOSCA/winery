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
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';
import { TRelationshipTemplate } from '../ttopology-template';

@Component({
  selector: 'winery-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  public items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  public accordionGroupPanel = 'accordionGroupPanel';
  public customClass = 'customClass';
  connectorEndpointVisible = false;
  startTime;
  endTime;
  longpress = false;
  makeSelectionVisible = false;
  setFlash = false;
  @Input() nodeAttributes: any;
  @Input() needsToBeFlashed: boolean;
  @Input() dragSource: string;
  @Input() navbarButtonsState: ButtonsStateModel;
  @Output() sendId: EventEmitter<string>;
  @Output() askForRepaint: EventEmitter<string>;
  @Output() setDragSource: EventEmitter<any>;
  @Output() closedEndpoint: EventEmitter<string>;
  @Output() checkFocusNode: EventEmitter<any>;
  @Output() updateAllNodes: EventEmitter<string>;
  previousPosition: any;
  currentPosition: any;
  @Input() relationshipTemplates: Array<TRelationshipTemplate>;
  relationshipTypes = [];

  public addItem(): void {
    this.items.push(`Items ${this.items.length + 1}`);
  }

  constructor(private zone: NgZone,
              private $ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions) {
    this.sendId = new EventEmitter();
    this.askForRepaint = new EventEmitter();
    this.setDragSource = new EventEmitter();
    this.closedEndpoint = new EventEmitter();
    this.checkFocusNode = new EventEmitter();
    this.updateAllNodes = new EventEmitter();
  }

  ngOnInit() {
    this.relationshipTemplates.map(rt => !this.relationshipTypes.includes(rt.type) ? this.relationshipTypes.push(rt.type) : null);
  }

  ngAfterViewInit(): void {
    this.sendId.emit(this.nodeAttributes.id);
  }

  private repaint($event) {
    $event.stopPropagation();
    setTimeout(() => this.askForRepaint.emit(), 1);
  }

  bindMouseMove = (ev) => {
    this.mouseMove(ev);
  }

  mouseDownHandler($event): void {
    this.startTime = new Date().getTime();
    this.repaint(new Event('repaint'));
    const focusNodeData = {
      id: this.nodeAttributes.id,
      ctrlKey: $event.ctrlKey
    };
    this.checkFocusNode.emit(focusNodeData);
    if ($event.srcElement.parentElement.className !== 'accordion-toggle') {
      this.previousPosition = {
        left: document.getElementById(this.nodeAttributes.id).offsetLeft,
        top: document.getElementById(this.nodeAttributes.id).offsetTop
      };
      this.zone.runOutsideAngular(() => {
        document.getElementById(this.nodeAttributes.id).addEventListener('mousemove', this.bindMouseMove);
      });
    }
  }

  mouseMove($event): void {
    this.currentPosition = {
      left: document.getElementById(this.nodeAttributes.id).offsetLeft,
      top: document.getElementById(this.nodeAttributes.id).offsetTop
    };
    if (this.previousPosition.left !== this.currentPosition.left ||
        this.previousPosition.top !== this.currentPosition.top) {
    }
  }

  mouseUpHandler($event): void {
    // mouseup
    document.getElementById(this.nodeAttributes.id).removeEventListener('mousemove', this.bindMouseMove);
    this.endTime = new Date().getTime();
    this.testTimeDifference($event);
    if (this.previousPosition !== undefined && this.currentPosition !== undefined) {
      if (this.previousPosition.left !== this.currentPosition.left ||
        this.previousPosition.top !== this.currentPosition.top) {
        this.updateAllNodes.emit(this.nodeAttributes.id);
      }
    }
  }

  flash(): void {
    this.setFlash = true;
    setTimeout(() => this.setFlash = false, 1000);
  }

  private testTimeDifference($event): void {
    if ((this.endTime - this.startTime) < 250) {
      if (!$event.ctrlKey) {
        this.closedEndpoint.emit(this.nodeAttributes.id);
      }
      this.longpress = false;
    } else if (this.endTime - this.startTime >= 300) {
      this.longpress = true;
    }
  }

  makeSource($event): void {
    const dragSourceInfo = {
      dragSource: this.dragSource,
      nodeId: this.nodeAttributes.id
    };
    this.setDragSource.emit(dragSourceInfo);
  }

  // Only display the sidebar if the click is no longpress
  openSidebar($event): void {
    $event.stopPropagation();
    // close sidebar when longpressing a node template
    if (this.longpress) {
      this.$ngRedux.dispatch(this.actions.openSidebar({
        sidebarContents: {
          sidebarVisible: false,
          nodeId: '',
          nameTextFieldValue: ''
        }
      }));
    } else {
      this.$ngRedux.dispatch(this.actions.openSidebar({
        sidebarContents: {
          sidebarVisible: true,
          nodeId: this.nodeAttributes.id,
          nameTextFieldValue: this.nodeAttributes.name
        }
      }));
    }
  }
}
