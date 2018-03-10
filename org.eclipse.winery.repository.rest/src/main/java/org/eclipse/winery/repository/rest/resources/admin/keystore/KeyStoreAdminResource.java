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

import org.eclipse.winery.common.ids.admin.KeystoreId;
import org.eclipse.winery.repository.security.csar.JCEKSKeystoreManager;
import org.eclipse.winery.repository.security.csar.KeystoreManager;
import org.eclipse.winery.repository.rest.resources.admin.AbstractAdminResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class KeyStoreAdminResource extends AbstractAdminResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(KeyStoreAdminResource.class);
    private final KeystoreManager keystoreManager;

    public KeyStoreAdminResource() {
        super(new KeystoreId());
        // TODO: init proper KeystoreManager implementation 
        keystoreManager = new JCEKSKeystoreManager(this.configuration);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getKeystoreInfo() {
        // TODO: return the list of keystore's entities
        return Response.ok("dummy-return", MediaType.TEXT_PLAIN).build();
    }
    
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getKeystoreFile() {
        // TODO: return the list of keystore's entities
        return Response.ok("dummy-return", MediaType.APPLICATION_OCTET_STREAM).build();
    }

    @Path("keys/")
    public SecretKeysResource getSecretKeysResource() {
        return new SecretKeysResource(keystoreManager);
    }

    @Path("keypairs/")
    public KeyPairsResource getKeyPairsResource() {
        return new KeyPairsResource(keystoreManager);
    }

    @Path("certificates/")
    public CertificatesResource getCertificatesResource() {
        return new CertificatesResource(keystoreManager);
    }
    
}
