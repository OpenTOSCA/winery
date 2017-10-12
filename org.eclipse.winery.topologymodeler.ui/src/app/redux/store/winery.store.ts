/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Thommy Zelenik - initial API and implementation
 */
import {combineReducers, Reducer} from 'redux';
import {
  WineryReducer,
  WineryState,
  INITIAL_WINERY_STATE
} from '../reducers/winery.reducer';
import {
  INITIAL_TOPOLOGY_RENDERER_STATE, TopologyRendererReducer,
  TopologyRendererState
} from '../reducers/topologyRenderer.reducer';

/**
 * The topology modeler has one store for all data.
 */
export interface IWineryState {
  topologyRendererState: TopologyRendererState;
  wineryState: WineryState;
}

export const INITIAL_IWINERY_STATE: IWineryState = {
  topologyRendererState: INITIAL_TOPOLOGY_RENDERER_STATE,
  wineryState: INITIAL_WINERY_STATE
};

export const rootReducer: Reducer<IWineryState> = combineReducers<IWineryState>({
  topologyRendererState: TopologyRendererReducer,
  wineryState: WineryReducer
});
