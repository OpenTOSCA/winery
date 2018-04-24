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
import org.eclipse.winery.repository.security.csar.SecurityProcessor;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityInformation;
import org.eclipse.winery.repository.security.csar.datatypes.KeyType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

public class SecretKeyResource extends AbstractKeystoreEntityResource {
    public SecretKeyResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets secret key as base64-encoded string or as binary")
    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM})
    public Response getSecretKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        String preparedAlias = prepareAlias(alias);
        if (!this.keystoreManager.entityExists(preparedAlias)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        try {
            if (!asFile) {
                KeyEntityInformation key = this.keystoreManager.loadKeyAsText(preparedAlias, KeyType.SECRET);
                return Response.ok().entity(key).build();
            }
            else {
                byte[] key = keystoreManager.loadKeyAsByteArray(preparedAlias, KeyType.SECRET);
                StreamingOutput stream = keyToStreamingOutput(key);
                return Response.ok(stream).header("content-disposition","attachment; filename = " + preparedAlias + ".key").build();
            }
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }

    @ApiOperation(value = "Deletes resource using its alias")
    @DELETE
    public Response deleteEntity(@PathParam("alias") String alias) {
        String preparedAlias = prepareAlias(alias);
        if (!this.keystoreManager.entityExists(preparedAlias))
            return Response.status(Response.Status.NOT_FOUND).build();
        try {
            this.keystoreManager.deleteKeystoreEntry(preparedAlias);
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
        return Response.noContent().build();
    }
    
}