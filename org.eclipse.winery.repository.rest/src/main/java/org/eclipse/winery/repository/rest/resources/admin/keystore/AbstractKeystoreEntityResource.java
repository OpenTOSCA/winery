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

import org.eclipse.winery.repository.security.csar.KeystoreManager;
import org.eclipse.winery.repository.security.csar.SecurityProcessor;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.InputStream;
import java.util.Objects;
import java.util.stream.Stream;

abstract class AbstractKeystoreEntityResource {
    protected final KeystoreManager keystoreManager;
    protected final SecurityProcessor securityProcessor;
    
    public AbstractKeystoreEntityResource(KeystoreManager keystoreManager, SecurityProcessor securityProcessor) {
        this.keystoreManager = keystoreManager;
        this.securityProcessor = securityProcessor;        
    }
    
    protected String prepareAlias(String alias) {
        return alias.trim().toLowerCase();
    }
    
    protected void checkAliasInsertEligibility(String alias) {
        if (alias == null || this.keystoreManager.entityExists(alias.trim().toLowerCase())) {
            throw new WebApplicationException(
                Response.status(Response.Status.CONFLICT)
                    .entity("Entity with the specified alias already exists")
                    .type(MediaType.TEXT_PLAIN)
                    .build()
            );
        }
    }
    
    protected boolean parametersAreNonNull(String... params) {
        return Stream.of(params).noneMatch(Objects::isNull);
    }
    
    protected boolean parametersAreNonNull(InputStream... params) {
        return Stream.of(params).noneMatch(Objects::isNull);
    }
    
    protected StreamingOutput keyToStreamingOutput(byte[] key) {
        return output -> {
            try {
                output.write(key);
                output.flush();
            } catch (Exception e) {
                throw new WebApplicationException(
                    Response.serverError().entity(e.getMessage()).type(MediaType.TEXT_PLAIN).build()
                );
            }
        };
    }
    
}
