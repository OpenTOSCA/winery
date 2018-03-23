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
import org.eclipse.winery.repository.security.csar.datatypes.CertificateInformation;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityInformation;
import org.eclipse.winery.repository.security.csar.datatypes.KeyType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

public class KeyPairResource extends AbstractKeystoreEntityResource {
    public KeyPairResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets the keypair by its alias")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getKeyPairInfo(@PathParam("alias") String alias) {
        try {
            String preparedAlias = prepareAlias(alias);
            return Response.ok()
                .entity(this.keystoreManager.loadKeyPairAsText(preparedAlias))
                .build();
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }

    @ApiOperation(value = "Gets the private key of a keypair")
    @GET
    @Path("privatekey")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM})
    public Response getPrivateKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        String preparedAlias = prepareAlias(alias);
        try {
            if (!asFile) {
                KeyEntityInformation key = this.keystoreManager.loadKeyAsText(preparedAlias, KeyType.PRIVATE);
                return Response.ok().entity(key).build();
            }
            else {
                byte[] key = keystoreManager.loadKeyAsByteArray(preparedAlias, KeyType.PRIVATE);
                StreamingOutput stream = keyToStreamingOutput(key);
                return Response.ok(stream).header("content-disposition","attachment; filename = " + preparedAlias + "." + KeyType.PRIVATE + ".key").build();
            }
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }

    @ApiOperation(value = "Gets the public key of a keypair")
    @GET
    @Path("publickey")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM})
    public Response getPublicKeyInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        String preparedAlias = prepareAlias(alias);
        try {
            if (!asFile) {
                KeyEntityInformation key = this.keystoreManager.loadKeyAsText(preparedAlias, KeyType.PUBLIC);
                return Response.ok().entity(key).build();
            }
            else {
                byte[] key = keystoreManager.loadKeyAsByteArray(preparedAlias, KeyType.PUBLIC);
                StreamingOutput stream = keyToStreamingOutput(key);
                return Response.ok(stream).header("content-disposition","attachment; filename = " + preparedAlias + "." + KeyType.PUBLIC + ".key").build();
            }
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }

    @ApiOperation(value = "Gets certificates of a keypair")
    @GET
    @Path("certificates")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_OCTET_STREAM})
    public Response getCertificateInfo(@PathParam("alias") String alias, @QueryParam("toFile") boolean asFile) {
        String preparedAlias = prepareAlias(alias);
        try {
            if (!asFile) {
                CertificateInformation certInfo = this.keystoreManager.loadCertificateAsText(preparedAlias);
                return Response.ok().entity(certInfo).build();
            }
            else {
                byte[] cert = keystoreManager.loadCertificateAsByteArray(preparedAlias);
                StreamingOutput stream = keyToStreamingOutput(cert);
                return Response.ok(stream).header("content-disposition","attachment; filename = " + preparedAlias + ".der").build();
            }
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }
    
}
