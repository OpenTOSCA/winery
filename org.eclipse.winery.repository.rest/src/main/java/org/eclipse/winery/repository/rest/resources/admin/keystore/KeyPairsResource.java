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
import org.eclipse.winery.repository.security.csar.datatypes.DistinguishedName;
import org.eclipse.winery.repository.security.csar.datatypes.KeyPairInformation;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;
import org.eclipse.winery.repository.security.csar.support.SupportedDigestAlgorithm;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.io.InputStream;
import java.net.URI;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.util.Collection;

public class KeyPairsResource extends AbstractKeystoreEntityResource {
    public KeyPairsResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets the list of keypairs from the keystore")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<KeyPairInformation> getKeyPairsList() {
        try {
            return this.keystoreManager.getKeyPairsList();
        } catch (GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
            );
        }
    }

    @ApiOperation(value = "Generates a new or stores an existing keypair")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response storeKeyPair(@FormDataParam("algo") String algorithm,
                                 @FormDataParam("keySize") int keySize,
                                 @FormDataParam("dn") String distinguishedName,
                                 @FormDataParam("privateKeyFile") InputStream privateKeyInputStream,
                                 @FormDataParam("certificate") InputStream certificatesInputStream,
                                 @Context UriInfo uriInfo) {
        try {
            String alias;
            KeyPairInformation entity;
            
            if (this.parametersAreNonNull(algorithm, distinguishedName)) {
                DistinguishedName dn = new DistinguishedName(distinguishedName);
                
                KeyPair keypair = this.securityProcessor.generateKeyPair(algorithm, keySize);
                alias = securityProcessor.calculateDigest(keypair.getPrivate().getEncoded(), SupportedDigestAlgorithm.SHA256.name());
                this.checkAliasInsertEligibility(alias);
                
                Certificate[] selfSignedCert = new Certificate[]{ this.securityProcessor.generateSelfSignedCertificate(keypair, dn) };
                
                entity = this.keystoreManager.storeKeyPair(alias, keypair.getPrivate(), selfSignedCert);
                
            } else if (this.parametersAreNonNull(privateKeyInputStream, certificatesInputStream)) {
                PrivateKey privateKey = this.securityProcessor.getPKCS8PrivateKeyFromInputStream(algorithm, privateKeyInputStream);
                alias = securityProcessor.calculateDigest(privateKey.getEncoded(), SupportedDigestAlgorithm.SHA256.name());
                this.checkAliasInsertEligibility(alias);

                Certificate[] cert = this.securityProcessor.getX509CertificateChainFromInputStream(certificatesInputStream);
                entity = this.keystoreManager.storeKeyPair(alias, privateKey, cert);

            } else {
                throw new WebApplicationException(
                    Response.status(Response.Status.BAD_REQUEST)
                        .entity("some parameters are missing")
                        .type(MediaType.TEXT_PLAIN)
                        .build()
                );
            }

            URI uri = uriInfo.getAbsolutePathBuilder().path(alias).build();
            return Response.created(uri).entity(entity).build();
            
        }
        catch (WebApplicationException e) {
            throw e;
        } catch (GenericSecurityProcessorException | GenericKeystoreManagerException e) {
            throw new WebApplicationException(
                Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage())
                    .type(MediaType.TEXT_PLAIN)
                    .build()
            );
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
