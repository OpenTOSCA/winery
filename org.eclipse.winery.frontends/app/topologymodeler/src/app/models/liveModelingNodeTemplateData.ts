/*******************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
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

import { NodeTemplateInstanceStates } from './enums';

export class LiveModelingNodeTemplateData {

    static initial(id: string) {
        return new this(id, NodeTemplateInstanceStates.INITIAL);
    }

    constructor(
        public id?: string,
        public state?: NodeTemplateInstanceStates
    ) {
    }

    get color() {
        switch (this.state) {
            case NodeTemplateInstanceStates.INITIAL:
                return 'blue';
            case NodeTemplateInstanceStates.STARTED:
                return 'green';
            case NodeTemplateInstanceStates.STOPPED:
                return 'red';
            default:
                return '';
        }
    }
}