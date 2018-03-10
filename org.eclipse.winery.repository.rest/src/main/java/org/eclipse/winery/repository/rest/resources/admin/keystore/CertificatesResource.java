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
import javax.ws.rs.core.Response;
import java.io.InputStream;

public class CertificatesResource extends AbstractKeystoreEntityResource {
    public CertificatesResource(KeystoreManager keystoreManager) {
        super(keystoreManager);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCertificatesList() {
        // TODO
        return Response.noContent().build();
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadExistingCertificate(@FormDataParam("alias") String alias, 
                                              @FormDataParam("certificate") InputStream certificate) {
        // TODO
        return Response.noContent().build();
    }

    @GET
    @Path("{alias}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCertificateInfo(@PathParam("alias") String alias) {
        // TODO
        return Response.noContent().build();
    }
}
