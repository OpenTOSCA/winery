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
import org.eclipse.winery.repository.security.csar.SecurityProcessor;
import org.eclipse.winery.repository.security.csar.datatypes.KeyPairInformation;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.io.InputStream;
import java.net.URI;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.util.Collection;
import java.util.Objects;

public class KeyPairsResource extends AbstractKeystoreEntityResource {
    public KeyPairsResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets the list of keypairs from the keystore")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<KeyPairInformation> getKeyPairsList() {
        return this.keystoreManager.getKeyPairsList();
    }

    @ApiOperation(value = "Generates a new or stores an existing keypair")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response storeKeyPair(@FormDataParam("alias") String alias,
                                 @FormDataParam("algo") String algorithm,
                                 @FormDataParam("keySize") int keySize,
                                 @FormDataParam("signAlgo") String signatureAlgorithm,
                                 @FormDataParam("commonName") String commonName,
                                 @FormDataParam("orgUnit") String orgUnit,
                                 @FormDataParam("org") String org,
                                 @FormDataParam("loc") String loc,
                                 @FormDataParam("state") String state,
                                 @FormDataParam("country") String country,
                                 @FormDataParam("privateKeyFile") InputStream privateKeyInputStream,
                                 @FormDataParam("publicKeyFile") InputStream publicKeyInputStream,
                                 @FormDataParam("certificate") InputStream certificateInputStream,
                                 @Context UriInfo uriInfo) {
        this.checkAliasInsertEligibility(alias);
        try {
            if (this.parametersAreNonNull(alias, algorithm, commonName, orgUnit, org, loc, state, country)) {
                KeyPairInformation entity;
                if (this.parametersAreNonNull(privateKeyInputStream, publicKeyInputStream) || this.parametersAreNonNull(privateKeyInputStream, certificateInputStream)) {
                    PrivateKey privateKey = this.securityProcessor.getPKCS8PrivateKeyFromInputStream(algorithm, privateKeyInputStream);
                    if (Objects.nonNull(certificateInputStream)) {
                        Certificate cert = this.securityProcessor.getX509CertificateFromInputStream(certificateInputStream); 
                        entity = this.keystoreManager.storeKeyPair(alias, privateKey, cert);
                    }
                    else {
                        PublicKey publicKey = this.securityProcessor.getX509EncodedPublicKeyFromInputStream(algorithm, publicKeyInputStream);
                        KeyPair keypair = new KeyPair(publicKey, privateKey);
                        Certificate selfSignedCert = this.securityProcessor.generateSelfSignedCertificate(
                            keypair, signatureAlgorithm, commonName, orgUnit, org, loc, state, country
                        );
                        entity = this.keystoreManager.storeKeyPair(alias, keypair, selfSignedCert);
                    }
                }
                else {
                    KeyPair keypair = this.securityProcessor.generateKeyPair(algorithm, keySize);
                    Certificate selfSignedCert = this.securityProcessor.generateSelfSignedCertificate(
                        keypair, signatureAlgorithm, commonName, orgUnit, org, loc, state, country
                    );
                    entity = this.keystoreManager.storeKeyPair(alias, keypair, selfSignedCert);
                }
                URI uri = uriInfo.getAbsolutePathBuilder().path(alias).build();
                return Response.created(uri).entity(entity).build();
            }
            else {
                throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                        .entity("some parameters are missing")
                        .type(MediaType.TEXT_PLAIN)
                        .build()
                );
            }
        }
        catch (Exception e) {
            throw new WebApplicationException(Response.serverError().entity(e.getMessage()).build());
        }       
    }

    @Path("{alias}")
    public KeyPairResource getKeyPairResource() {
        return new KeyPairResource(keystoreManager, securityProcessor);
    }
    
    @ApiOperation(value = "Deletes all keypairs from the keystore")
    @DELETE
    public Response deleteAll() {
        try {
            keystoreManager.deleteAllKeyPairs();
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
        return Response.noContent().build();
    }
}
