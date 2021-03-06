/*******************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.repository.rest.resources.entitytypes.policytypes;

import org.eclipse.winery.repository.rest.resources.AbstractResourceTest;

import org.junit.jupiter.api.Test;

public class PolicyTypesResourceTest extends AbstractResourceTest {

    @Test
    public void getAllVisualAppearance() throws Exception {
        this.setRevisionTo("4656a0abe19b8720c28273461c84d2ddd09ef868");
        this.assertGet("policytypes/allvisualappearancedata",
            "entitytypes/policytypes/allvisualappearance.json");
    }
}
