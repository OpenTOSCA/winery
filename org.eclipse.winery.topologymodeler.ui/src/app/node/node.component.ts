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
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
  OnInit,
  Output
} from '@angular/core';
import {ButtonsStateModel} from '../models/buttonsState.model';
import { TNodeTemplate } from '../ttopology-template';

@Component({
  selector: 'winery-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent implements OnInit, AfterViewInit, DoCheck {
  public items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  public accordionGroupPanel = 'accordionGroupPanel';
  public customClass = 'customClass';
  connectorEndpointVisible = false;
  startTime;
  endTime;
  longpress = false;
  makeSelectionVisible = false;
  @Input() title: string;
  @Input() left: number;
  @Input() top: number;
  @Output() sendId: EventEmitter<string>;
  @Output() askForRepaint: EventEmitter<string>;
  @Input() nodeColor: string;
  @Input() nodeImageUrl: string;
  @Output() addNodeToDragSelection: EventEmitter<string>;
  @Output() checkIfNodeInSelection: EventEmitter<string>;
  @Input() selectedNodes: Array<TNodeTemplate> = [];
  @Input() navbarButtonsState: ButtonsStateModel;
  differSelectedNodes: any;

  public addItem(): void {
    this.items.push(`Items ${this.items.length + 1}`);
  }

  constructor(differsSelectedNodes: IterableDiffers) {
    this.sendId = new EventEmitter();
    this.askForRepaint = new EventEmitter();
    this.addNodeToDragSelection = new EventEmitter();
    this.checkIfNodeInSelection = new EventEmitter();
    this.differSelectedNodes = differsSelectedNodes.find([]).create(null);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.sendId.emit(this.title);
  }

  ngDoCheck(): void {
    const selectedNodes = this.differSelectedNodes.diff(this.selectedNodes);
    if (selectedNodes) {
      selectedNodes.forEachAddedItem(r => {
          if (this.title === r.item.id) {
            this.makeSelectionVisible = true;
          }
        }
      );
      selectedNodes.forEachRemovedItem(r => {
          if (this.title === r.item.id) {
            this.makeSelectionVisible = false;
          }
        }
      );
    }
  }

  private repaint() {
    setTimeout(() => this.askForRepaint.emit(), 1);
  }

  trackTimeOfMouseDown(): void {
    this.startTime = new Date().getTime();
  }

  trackTimeOfMouseUp(): void {
    this.endTime = new Date().getTime();
    this.testTimeDifference();
  }

  private testTimeDifference(): void {
    if ((this.endTime - this.startTime) < 250) {
      this.longpress = false;
    } else if (this.endTime - this.startTime >= 300) {
      this.longpress = true;
    }
  }

  showConnectorEndpoint($event): void {
    $event.stopPropagation();
    if ($event.ctrlKey) {
      this.addNodeToDragSelection.emit(this.title);
      this.makeSelectionVisible = !this.makeSelectionVisible;
    } else {
      (this.longpress) ? $event.preventDefault() : this.connectorEndpointVisible = !this.connectorEndpointVisible;
      this.checkIfNodeInSelection.emit(this.title);
    }
  }
}
