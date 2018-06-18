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
import { Reducer } from 'redux';
import { WineryState } from '../reducers/winery.reducer';
import { TopologyRendererState } from '../reducers/topologyRenderer.reducer';
/**
 * The topology modeler has one store for all data.
 */
export interface IWineryState {
    topologyRendererState: TopologyRendererState;
    wineryState: WineryState;
}
export declare const INITIAL_IWINERY_STATE: IWineryState;
export declare const rootReducer: Reducer<IWineryState>;
