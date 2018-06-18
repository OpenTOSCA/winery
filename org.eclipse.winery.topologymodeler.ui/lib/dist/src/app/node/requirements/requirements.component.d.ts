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
import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EntityTypesModel } from '../../models/entityTypesModel';
import { TNodeTemplate } from '../../models/ttopology-template';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../../redux/store/winery.store';
import { Subscription } from 'rxjs';
import { RequirementModel } from '../../models/requirementModel';
export declare class RequirementsComponent implements OnInit, OnChanges, OnDestroy {
    private ngRedux;
    toggleModalHandler: EventEmitter<any>;
    readonly: boolean;
    currentNodeData: any;
    requirements: any[];
    requirementsExist: boolean;
    entityTypes: EntityTypesModel;
    nodeTemplate: TNodeTemplate;
    subscription: Subscription;
    currentRequirement: RequirementModel;
    constructor(ngRedux: NgRedux<IWineryState>);
    /**
     * Gets called if nodes representation in the store changes
     */
    updateReqs(): void;
    /**
     * Angular lifecycle event.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Propagates the click event to node.component, where requirements modal gets opened.
     * @param $event
     */
    toggleModal($event: any): void;
    ngOnInit(): void;
    /**
     * Lifecycle event
     */
    ngOnDestroy(): void;
}
