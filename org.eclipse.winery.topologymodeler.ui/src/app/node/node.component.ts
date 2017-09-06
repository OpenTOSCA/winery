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
import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonsStateModel } from '../models/buttonsState.model';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';

@Component({
  selector: 'winery-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent implements OnInit, AfterViewInit, OnChanges {
  public items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  public accordionGroupPanel = 'accordionGroupPanel';
  public customClass = 'customClass';
  connectorEndpointVisible;
  startTime;
  endTime;
  @Input() needsToBeFlashed: boolean;
  longpress = false;
  makeSelectionVisible = false;
  @Input() title: string;
  @Input() name: string;
  @Input() left: number;
  @Input() top: number;
  @Output() sendId: EventEmitter<string>;
  @Output() askForRepaint: EventEmitter<string>;
  @Input() nodeColor: string;
  @Input() nodeImageUrl: string;
  @Input() dragSource: string;
  @Input() navbarButtonsState: ButtonsStateModel;
  @Output() setDragSource: EventEmitter<any>;
  @Output() closedEndpoint: EventEmitter<string>;
  @Output() checkFocusNode: EventEmitter<any>;

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
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.sendId.emit(this.title);
  }

  private repaint($event) {
    $event.stopPropagation();
    setTimeout(() => this.askForRepaint.emit(), 1);
  }

  bindMouseMove = (ev) => {
    this.mouseMove(ev);
  }

  trackTimeOfMouseDown($event): void {
    this.startTime = new Date().getTime();
    const focusNodeData = {
      id: this.title,
      ctrlKey: $event.ctrlKey
    };
    this.checkFocusNode.emit(focusNodeData);
    try {
      if ($event.srcElement.parentElement.className !== 'accordion-toggle') {
        this.zone.runOutsideAngular(() => {
          document.getElementById(this.title).addEventListener('mousemove', this.bindMouseMove);
        });
      }
    } catch (e) {
      if ($event.target.parentElement.className !== 'accordion-toggle ') {
        this.zone.runOutsideAngular(() => {
          document.getElementById(this.title).addEventListener('mousemove', this.bindMouseMove);
        });
      }
    }
  }

  mouseMove($event): void {
    this.connectorEndpointVisible = false;
  }

  trackTimeOfMouseUp($event): void {
    document.getElementById(this.title).removeEventListener('mousemove', this.bindMouseMove);
    this.endTime = new Date().getTime();
    this.testTimeDifference($event);
  }

  ngOnChanges() {
    return true;
  }

  private testTimeDifference($event): void {
    if ((this.endTime - this.startTime) < 250) {
      if (!$event.ctrlKey) {
        try {
          if ($event.srcElement.parentElement.className === 'accordion-toggle') {
            this.connectorEndpointVisible = false;
          } else {
            this.connectorEndpointVisible = !this.connectorEndpointVisible;
          }
        } catch (e) {
          if ($event.target.parentElement.className === 'accordion-toggle') {
            console.log('hello');
            this.connectorEndpointVisible = false;
          } else {
            this.connectorEndpointVisible = !this.connectorEndpointVisible;
          }
        }
      }
      this.longpress = false;
    } else if (this.endTime - this.startTime >= 300) {
      this.longpress = true;
    }
  }

  makeSource($event): void {
    const dragSourceInfo = {
      dragSource: this.dragSource,
      nodeId: this.title
    };
    this.setDragSource.emit(dragSourceInfo);
  }

  showConnectorEndpoint($event): void {
    $event.stopPropagation();
    if ($event.ctrlKey) {
    } else {
      if (!this.longpress) {
        if (this.connectorEndpointVisible === true) {
          this.closedEndpoint.emit('set no more drag sources');
        }
      }
    }
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
          nodeId: this.title,
          nameTextFieldValue: this.name
        }
      }));
    }
  }
}
