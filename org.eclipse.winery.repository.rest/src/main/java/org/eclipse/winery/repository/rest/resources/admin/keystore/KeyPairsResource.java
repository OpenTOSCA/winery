/********************************************************************************
 * Copyright (c) 2018-2019 Contributors to the Eclipse Foundation
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

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.util.Collection;
import java.util.Objects;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.eclipse.winery.repository.security.csar.SecureCSARConstants;
import org.eclipse.winery.security.KeystoreManager;
import org.eclipse.winery.security.SecurityProcessor;
import org.eclipse.winery.security.datatypes.DistinguishedName;
import org.eclipse.winery.security.datatypes.KeyPairInformation;
import org.eclipse.winery.security.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.security.exceptions.GenericSecurityProcessorException;
import org.eclipse.winery.security.support.enums.AsymmetricEncryptionAlgorithmEnum;

import com.sun.jersey.multipart.FormDataParam;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class KeyPairsResource extends AbstractKeyPairResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(KeyPairsResource.class);

    public KeyPairsResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        super(keystoreManager, securityProcessor);
    }

    @ApiOperation(value = "Gets the list of keypairs from the keystore")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<KeyPairInformation> getKeyPairsList() {
        try {
            return this.keystoreManager.getKeyPairs();
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
                                 @FormDataParam("setAsMaster") String setMasterKey,
                                 @Context UriInfo uriInfo) {
        
        if (!this.parametersAreNonNull(algorithm, distinguishedName)
            && !this.parametersAreNonNull(privateKeyInputStream, certificatesInputStream)) {
            throw new WebApplicationException(
                Response.status(Response.Status.BAD_REQUEST)
                    .entity("Some parameters are missing!")
                    .type(MediaType.TEXT_PLAIN)
                    .build()
            );
        }

        try {
            Certificate certificate;
            PrivateKey privateKey;

            if (this.parametersAreNonNull(algorithm, distinguishedName)) {
                DistinguishedName dn = new DistinguishedName(distinguishedName);
                KeyPair keypair = this.securityProcessor.generateKeyPair(AsymmetricEncryptionAlgorithmEnum.findKey(algorithm, keySize));
                privateKey = keypair.getPrivate();
                certificate = this.securityProcessor.generateSelfSignedX509Certificate(keypair, dn);
            } else {
                privateKey = this.securityProcessor.getPKCS8PrivateKeyFromInputStream(AsymmetricEncryptionAlgorithmEnum.findAnyByName(algorithm), privateKeyInputStream);
                Certificate[] cert = this.securityProcessor.getX509Certificates(certificatesInputStream);

                if (Objects.nonNull(cert) && cert.length > 0) {
                    certificate = cert[0];
                } else {
                    throw new WebApplicationException(
                        Response.status(Response.Status.BAD_REQUEST)
                            .entity("Provided certificates cannot be processed")
                            .type(MediaType.TEXT_PLAIN)
                            .build()
                    );
                }
            }
            
            String alias = determineAlias(setMasterKey, certificate.getPublicKey());
            KeyPairInformation entity = this.storeKeyPair(alias, privateKey, certificate);

            URI uri = uriInfo.getAbsolutePathBuilder().path(alias).build();
            return Response.created(uri).entity(entity).build();
        } catch (GenericSecurityProcessorException | GenericKeystoreManagerException | IllegalArgumentException | IOException |
            NoSuchAlgorithmException e) {
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

    private KeyPairInformation storeKeyPair(String alias, PrivateKey privateKey, Certificate certificate) throws
        GenericKeystoreManagerException, WebApplicationException {
        // we want to change the master key pair
        if (alias.equalsIgnoreCase(SecureCSARConstants.MASTER_SIGNING_KEYNAME)) {
            String newName = this.renameOldMaster();

            if (!Objects.isNull(newName))
                LOGGER.info("The old master signing keypair was renamed to: " + newName);
        }

        return this.keystoreManager.storeKeyPair(alias, privateKey, certificate);
    }

    private String determineAlias(String setMasterKey, PublicKey publicKey) throws IOException, NoSuchAlgorithmException {
        String alias;
        if (Objects.nonNull(setMasterKey)) {
            alias = SecureCSARConstants.MASTER_SIGNING_KEYNAME;
        } else {
            alias = this.generateUniqueAlias(publicKey);
        }

        return alias;
    }
}