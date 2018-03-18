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

import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataParam;
import io.swagger.annotations.ApiOperation;
import org.eclipse.winery.repository.security.csar.KeystoreManager;
import org.eclipse.winery.repository.security.csar.SecurityProcessor;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.security.KeyPair;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

public class KeyPairsResource extends AbstractKeystoreEntityResource {
    public KeyPairsResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets the list of keypairs from the keystore")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getKeyPairsList() {
        for (KeyPair kp : this.keystoreManager.getKeyPairsList()) {
            
        }
        return Response.noContent().build();
    }

    @ApiOperation(value = "Generates a new or stores an existing keypair")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response storeKeyPair(@FormDataParam("alias") String alias,
                                 @FormDataParam("cn") String commonName,
                                 @FormDataParam("ou") String orgUnit,
                                 @FormDataParam("o") String org,
                                 @FormDataParam("l") String loc,
                                 @FormDataParam("s") String state,
                                 @FormDataParam("c") String country,
                                 @FormDataParam("privateKeyFile") InputStream privateKey, 
                                 @FormDataParam("publicKeyFile") InputStream publicKey, 
                                 @FormDataParam("certificatesChain") List<FormDataBodyPart> certificates) {
        
        if (Stream.of(alias, commonName, org, loc, state, country).anyMatch(Objects::isNull))
            throw new WebApplicationException(
                Response.status(Response.Status.BAD_REQUEST)
                    .entity("some parameters are missing")
                    .build()
            );
        
        if (privateKey != null && publicKey != null) {
            // TODO: store existing keypair
            for (FormDataBodyPart imageData : certificates) {
                // TODO: process certificates
                imageData.getValueAs(InputStream.class);
            }
        }
        else {
            // TODO generate new keypair
        }
        
        return Response.noContent().build();
    }

    @ApiOperation(value = "Gets the keypair by its alias")
    @GET
    @Path("{alias}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getKeyPairInfo(@PathParam("alias") String alias) {
        // TODO
        return Response.noContent().build();
    }

    @ApiOperation(value = "Gets the private key of a keypair")
    @GET
    @Path("{alias}/privatekey")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPrivateKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        // TODO
        return Response.noContent().build();
    }

    @ApiOperation(value = "Gets the public key of a keypair")
    @GET
    @Path("{alias}/publickey")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPublicKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        // TODO
        return Response.noContent().build();
    }

    @ApiOperation(value = "Gets certificates of a keypair")
    @GET
    @Path("{alias}/certificates")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCertificateChainInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        // TODO
        return Response.noContent().build();
    }
}
