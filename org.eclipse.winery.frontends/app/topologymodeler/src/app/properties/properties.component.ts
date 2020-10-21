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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { Subject, Subscription } from 'rxjs';
import { WineryActions } from '../redux/actions/winery.actions';
import { JsPlumbService } from '../services/jsPlumb.service';
import { PropertyDefinitionType } from '../models/enums';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
    selector: 'winery-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() currentNodeData: any;
    @Input() readonly: boolean;
    @Input() nodeId: string;
    key: string;
    nodeProperties: any;

    dispatchSubject: Subject<any> = new Subject<any>();
    subscriptions: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<IWineryState>,
                private actions: WineryActions,
                private jsPlumbService: JsPlumbService) {
    }

    /**
     * Angular lifecycle event.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.currentNodeData.currentValue.nodeTemplate.properties) {
            try {
                const currentProperties = changes.currentNodeData.currentValue.nodeTemplate.properties;
                if (this.currentNodeData.propertyDefinitionType === PropertyDefinitionType.KV) {
                    this.nodeProperties = currentProperties.kvproperties;
                } else if (this.currentNodeData.propertyDefinitionType === PropertyDefinitionType.XML) {
                    this.nodeProperties = currentProperties.any;
                }
            } catch (e) {
            }
        }
        // repaint jsPlumb to account for height change of the accordion
        setTimeout(() => this.jsPlumbService.getJsPlumbInstance().repaintEverything(), 1);
    }

    ngOnInit() {
        if (this.currentNodeData.nodeTemplate.properties) {
            try {
                const currentProperties = this.currentNodeData.nodeTemplate.properties;
                if (this.currentNodeData.propertyDefinitionType === PropertyDefinitionType.KV) {
                    this.nodeProperties = currentProperties.kvproperties;
                } else if (this.currentNodeData.propertyDefinitionType === PropertyDefinitionType.XML) {
                    this.nodeProperties = currentProperties.any;
                }
            } catch (e) {
            }
        }

        this.subscriptions.push(this.dispatchSubject.pipe(
            debounceTime(500),
        ).subscribe(_ => {
            this.dispatchRedux();
        }));
    }

    kvPropertyUpdate(event: any) {
        this.nodeProperties[event.key] = event.value;
        this.dispatchSubject.next();
    }

    xmlPropertyUpdate(event: any) {
        this.nodeProperties = event;
        this.dispatchSubject.next();
    }

    dispatchRedux() {
        this.ngRedux.dispatch(this.actions.setProperty({
            nodeProperty: {
                newProperty: this.nodeProperties,
                propertyType: this.currentNodeData.propertyDefinitionType,
                nodeId: this.currentNodeData.nodeTemplate.id
            }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
