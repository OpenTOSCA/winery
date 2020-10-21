/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
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
 *******************************************************************************/

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../../redux/store/winery.store';
import { WineryActions } from '../../redux/actions/winery.actions';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
    selector: 'winery-properties-kv',
    templateUrl: './kv-properties.component.html',
    styleUrls: ['./kv-properties.component.css']
})
export class KvPropertiesComponent implements OnInit, OnDestroy {
    @Input() nodeId: string;
    @Input() properties: any;
    @Input() readonly: boolean;
    @Input() nodeData: any;

    @Output() updateProperty: EventEmitter<any> = new EventEmitter<any>();

    invalidNodeProperties: any = {};
    kvPatternMap: any;
    kvDescriptionMap: any;
    checkEnabled: boolean;

    propertiesSubject: Subject<any> = new Subject<any>();
    subscriptions: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<IWineryState>,
                private actions: WineryActions) {
    }

    ngOnInit(): void {
        if (this.properties) {
            this.initKVDescriptionMap();
            this.initKVPatternMap();
        }

        this.subscriptions.push(this.ngRedux.select(state => state.topologyRendererState.buttonsState.checkNodePropertiesButton)
            .subscribe(checked => {
                this.checkEnabled = checked;
                if (this.checkEnabled) {
                    this.checkAllProperties();
                } else {
                    this.invalidNodeProperties = {};
                    this.ngRedux.dispatch(this.actions.setNodePropertyValidity(this.nodeId, true));
                }
            }));

        this.subscriptions.push(this.propertiesSubject.pipe(
            distinctUntilChanged(),
        ).subscribe(property => {
            if (this.checkEnabled) {
                this.checkProperty(property.key, property.value);
            }
            this.updateProperty.emit({key: property.key, value: property.value});
        }));
    }

    initKVDescriptionMap() {
        this.kvDescriptionMap = {};
        try {
            const propertyDefinitionKVList =
                this.nodeData.entityType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any[0].propertyDefinitionKVList;
            propertyDefinitionKVList.forEach(prop => {
                this.kvDescriptionMap[prop.key] = prop['description'];
            });
        } catch (e) {
        }
    }

    initKVPatternMap() {
        this.kvPatternMap = {};
        try {
            const propertyDefinitionKVList =
                this.nodeData.entityType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any[0].propertyDefinitionKVList;
            propertyDefinitionKVList.forEach(prop => {
                this.kvPatternMap[prop.key] = prop['pattern'];
            });
        } catch (e) {
        }
    }

    hasError(key: string): boolean {
        return !!this.invalidNodeProperties[key];
    }

    checkForErrors() {
        if (Object.keys(this.invalidNodeProperties).length > 0) {
            this.ngRedux.dispatch(this.actions.setNodePropertyValidity(this.nodeId, false));
        } else {
            this.ngRedux.dispatch(this.actions.setNodePropertyValidity(this.nodeId, true));
        }
    }

    checkAllProperties() {
        Object.keys(this.properties).forEach(key => {
            this.checkProperty(key, this.properties[key]);
        });
        this.checkForErrors();
    }

    checkProperty(key: string, value: string) {
        try {
            delete this.invalidNodeProperties[key];
            if (value && this.kvPatternMap[key]) {
                if (!(value.startsWith('get_input:') || value.startsWith('get_property:'))) {
                    const pattern = this.kvPatternMap[key];
                    if (!new RegExp(pattern).test(value)) {
                        this.invalidNodeProperties[key] = pattern;
                    }
                }
            }
        } catch (e) {

        } finally {
            this.checkForErrors();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
