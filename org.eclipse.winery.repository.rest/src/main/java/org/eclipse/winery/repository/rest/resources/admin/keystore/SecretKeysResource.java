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

import com.sun.jersey.multipart.FormDataParam;
import io.swagger.annotations.ApiOperation;
import org.eclipse.winery.repository.security.csar.KeystoreManager;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.io.InputStream;
import java.net.URI;
import java.util.Collection;
import java.util.Objects;
import java.util.stream.Stream;

public class SecretKeysResource extends AbstractKeystoreEntityResource {
    
    public SecretKeysResource(KeystoreManager keystoreManager) {
        super(keystoreManager);
    }

    @ApiOperation(value = "Gets the list of secret keys")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<KeyEntityType> getSecretKeysList(@QueryParam("withKeyEncoded") boolean withKeyEncoded) {
        return keystoreManager.getSecretKeysList(withKeyEncoded);
    }

    @ApiOperation(value = "Generates a new or stores an existing secret key")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response storeSecretKey(@FormDataParam("alias") String alias,
                                   @FormDataParam("algo") String algo,
                                   @DefaultValue("-1") @FormDataParam("keySize") int keySize,
                                   @FormDataParam("keyFile") InputStream uploadedInputStream,
                                   @Context UriInfo uriInfo) {
        alias = alias.trim();
        if (this.keystoreManager.entityExists(alias))
            throw new WebApplicationException(
                Response.status(Response.Status.CONFLICT)
                    .entity("Key with specified alias already exists")
                    .type(MediaType.TEXT_PLAIN)
                    .build()
            );
        try {
            if (!Stream.of(alias, algo).anyMatch(Objects::isNull)) {
                KeyEntityType entity;
                if (uploadedInputStream == null) {
                    entity = keystoreManager.generateSecretKeyEntry(alias, algo, keySize);
                }
                else {
                    entity = keystoreManager.storeSecretKey(alias, algo, uploadedInputStream);
                }
                URI uri = uriInfo.getAbsolutePathBuilder().path(entity.getAlias()).build();
                return Response.created(uri).entity(entity).build();
            }
            else
                throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                        .entity("Insufficient number of parameters in the request")
                        .type(MediaType.TEXT_PLAIN)
                        .build()
                );
        }
        catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(Response.serverError().entity(e.getMessage()).build());
        }
    }
    
    @ApiOperation(value = "Deletes all secret keys from the keystore")
    @DELETE
    public Response deleteAll() {
        try {
            keystoreManager.deleteAllSecretKeys();
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
        return Response.noContent().build();
    }
    
    @Path("{alias}")
    public SecretKeyResource getSecretKeyResource() { return new SecretKeyResource(keystoreManager); }
    
}
