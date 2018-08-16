/*******************************************************************************
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
 *******************************************************************************/

package org.eclipse.winery.repository.rest.resources.apidata;

import org.eclipse.winery.repository.rest.datatypes.select2.Select2DataItem;

enum ValidEndingsTypeEnum {
    EVERYTHING, NODETYPE, REQTYPE, CAPTYPE;
}

public class ValidEndingsApiDataSet {
    public ValidEndingsTypeEnum validEndingsSelectionType;
    public Select2DataItem validDataSet;

    public ValidEndingsApiDataSet() {
    }

    public ValidEndingsApiDataSet(String type, Select2DataItem validDataSet) {
        switch (type) {
            case "everything":
                this.validEndingsSelectionType = ValidEndingsTypeEnum.EVERYTHING;
                break;
            case "nodeType":
                this.validEndingsSelectionType = ValidEndingsTypeEnum.NODETYPE;
                break;
            case "reqType":
                this.validEndingsSelectionType = ValidEndingsTypeEnum.REQTYPE;
                break;
            case "capType":
                this.validEndingsSelectionType = ValidEndingsTypeEnum.CAPTYPE;
                break;
            default:
                this.validEndingsSelectionType = ValidEndingsTypeEnum.EVERYTHING;
                break;
        }
        this.validDataSet = validDataSet;
    }
}
