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
import { QName } from '../../../../model/qName';
import { KeyValueItem } from '../../../../model/keyValueItem';

export class YamlProperty {
    name: String;
    type: QName;
    description: String;
    required: boolean;
    defaultValue: any;
    status: string;
    constraints: YamlPropertyConstraint[];
}

export class YamlPropertyConstraint implements KeyValueItem {
    key: string;
    value: any;
    list: String[];
}
