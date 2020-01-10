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

package org.eclipse.winery.model.tosca;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.eclipse.jdt.annotation.NonNull;

public class TTestRefinementModel extends TRefinementModel {

    private TTopologyTemplate testFragment;

    @NonNull
    @JsonIgnore
    public TTopologyTemplate getRefinementTopology() {
        if (testFragment == null) {
            testFragment = new TTopologyTemplate();
        }
        return testFragment;
    }

    public void setRefinementTopology(TTopologyTemplate refinementStructure) {
        this.testFragment = refinementStructure;
    }

    public TTopologyTemplate getTestFragment() {
        return getRefinementTopology();
    }
}
