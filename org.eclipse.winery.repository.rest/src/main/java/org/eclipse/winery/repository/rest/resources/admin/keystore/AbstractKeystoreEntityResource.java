/********************************************************************************
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

package org.eclipse.winery.repository.rest.resources.admin.keystore;

import org.eclipse.winery.repository.security.csar.KeystoreManager;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

public abstract class AbstractKeystoreEntityResource {
    protected final KeystoreManager keystoreManager;

    protected AbstractKeystoreEntityResource(KeystoreManager keystoreManager) {
        this.keystoreManager = keystoreManager;
    }

    @DELETE
    @Path("{alias}")
    public Response deleteEntity(@PathParam("alias") String alias) {
        // TODO: handle deletion of the keystore entity
        return Response.ok().build();
    }
}
