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
import { EventEmitter, OnInit } from '@angular/core';
import { IWineryState } from '../../redux/store/winery.store';
import { NgRedux } from '@angular-redux/store';
export declare class DeploymentArtifactsComponent implements OnInit {
    private $ngRedux;
    toggleModalHandler: EventEmitter<any>;
    readonly: boolean;
    currentNodeData: any;
    deploymentArtifacts: any;
    latestNodeTemplate: any;
    constructor($ngRedux: NgRedux<IWineryState>);
    /**
     * Propagates the click event to node.component, where deployment artifact modal gets opened.
     * @param $event
     */
    toggleModal($event: any): void;
    ngOnInit(): void;
}
