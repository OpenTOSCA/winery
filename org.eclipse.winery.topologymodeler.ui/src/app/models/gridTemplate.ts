/********************************************************************************
 * Copyright (c) 2017 Contributors to the Eclipse Foundation
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

/**
 * Attributes of the grid, which includes the selection box
 */
export class GridTemplate {
    constructor(public gridDimension: number,
                public selectionActive?: boolean,
                public crosshair?: boolean,
                public pageX?: number,
                public pageY?: number,
                public initialW?: number,
                public initialH?: number,
                public selectionWidth?: number,
                public selectionHeight?: number) { }
}
