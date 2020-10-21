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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'winery-properties-xml',
    templateUrl: './xml-properties.component.html',
    styleUrls: ['./xml-properties.component.css']
})

export class XmlPropertiesComponent implements OnInit, OnDestroy {
    @Input() properties: any;
    @Input() readonly: boolean;

    @Output() updateProperty: EventEmitter<any> = new EventEmitter<any>();

    propertiesSubject: Subject<any> = new Subject<any>();
    subscriptions: Array<Subscription> = [];

    constructor() {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.propertiesSubject.pipe(
            distinctUntilChanged(),
        ).subscribe(property => {
            this.updateProperty.emit(property);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
