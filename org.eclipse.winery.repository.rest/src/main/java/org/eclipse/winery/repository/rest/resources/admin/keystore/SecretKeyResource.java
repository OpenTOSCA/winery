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

import io.swagger.annotations.ApiOperation;
import org.eclipse.winery.repository.security.csar.KeystoreManager;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Base64;

public class SecretKeyResource extends AbstractKeystoreEntityResource {
    public SecretKeyResource(KeystoreManager keystoreManager) {
        super(keystoreManager);
    }

    @ApiOperation(value = "Gets secret key as base64-encoded string or as binary")
    @GET
    @Produces({MediaType.TEXT_PLAIN, MediaType.APPLICATION_OCTET_STREAM})
    public Response getSecretKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        if (!asFile)
            return Response.ok(Base64.getEncoder().encodeToString(this.keystoreManager.loadSecretKey(alias).getEncoded())).build();
        else
            // TODO
            return Response.ok().build();
    }

    @ApiOperation(value = "Deletes resource using its alias")
    @DELETE
    public Response deleteEntity(@PathParam("alias") String alias) {
        if (this.keystoreManager.deleteKeystoreEntry(alias))
            return Response.ok().build();
        else
            throw new WebApplicationException(
                Response.status(Response.Status.BAD_REQUEST)
                    .entity("some parameters are missing")
                    .build()
            );
    }
    
}
