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
import org.eclipse.winery.repository.security.csar.KeystoreManager;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;

public class SecretKeysResource extends AbstractKeystoreEntityResource {
    
    public SecretKeysResource(KeystoreManager keystoreManager) {
        super(keystoreManager);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSecretKeysList() {
        // TODO
        return Response.noContent().build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response generateSecretKey(@FormParam("alias") String alias,
                                      @FormParam("algo") String algo,
                                      @FormParam("keySize") int keySize) {
        this.keystoreManager.generateSecretKeyEntry(alias, algo, keySize);
        return Response.ok().build();
    }
    
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadExistingSecretKey(@FormDataParam("alias") String alias,
                                            @FormDataParam("keyFile") InputStream uploadedInputStream) {
        // TODO
        return Response.noContent().build();
    }

    @GET
    @Path("{alias}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSecretKeyInfo(@PathParam("alias") String alias) {
        // TODO
        return Response.noContent().build();
    }

    @GET
    @Path("{alias}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getSecretKeyFile(@PathParam("alias") String alias) {
        // TODO
        return Response.noContent().build();
    }

    @PUT
    @Path("{alias}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response replaceSecretKey(@PathParam("alias") String alias) {
        // TODO
        return Response.noContent().build();
    }
}
