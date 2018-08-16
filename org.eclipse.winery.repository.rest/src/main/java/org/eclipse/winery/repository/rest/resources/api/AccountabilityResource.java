/*******************************************************************************
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

package org.eclipse.winery.repository.rest.resources.api;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import javax.xml.namespace.QName;

import org.eclipse.winery.accountability.AccountabilityManager;
import org.eclipse.winery.accountability.AccountabilityManagerFactory;
import org.eclipse.winery.accountability.exceptions.AccountabilityException;
import org.eclipse.winery.accountability.model.FileProvenanceElement;
import org.eclipse.winery.accountability.model.ModelProvenanceElement;
import org.eclipse.winery.accountability.model.authorization.AuthorizationInfo;
import org.eclipse.winery.accountability.model.authorization.AuthorizationNode;
import org.eclipse.winery.common.Util;
import org.eclipse.winery.common.ids.definitions.ServiceTemplateId;
import org.eclipse.winery.common.version.VersionUtils;
import org.eclipse.winery.repository.backend.RepositoryFactory;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AccountabilityResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(AccountabilityResource.class);

    private final AccountabilityManager accountabilityManager;
    private final String provenanceId;

    AccountabilityResource(String provenanceId) throws AccountabilityException {
        Properties props = RepositoryFactory.getRepository().getAccountabilityConfigurationManager().properties;
        accountabilityManager = AccountabilityManagerFactory.getAccountabilityManager(props);

        this.provenanceId = Util.URLdecode(provenanceId);
        LOGGER.info("AccountabilityManager process identifier: " + provenanceId);
    }

    @GET
    @Path("fileHistory")
    @Produces(MediaType.APPLICATION_JSON)
    public List<FileProvenanceElement> getFileHistory(@QueryParam("fileId") String fileId)
        throws ExecutionException, InterruptedException {
        ServiceTemplateId serviceTemplateId = new ServiceTemplateId(new QName(provenanceId));
        String qNameWithComponentVersionOnly = VersionUtils.getQNameWithComponentVersionOnly(serviceTemplateId);
        Objects.requireNonNull(fileId);
//        if ("TOSCA-Metadata/TOSCA.meta".equals(fileId)) {
//            return accountabilityManager
//                .getHistory(qNameWithComponentVersionOnly)
//                .get();
//        } else {
        String fileIdDecoded = Util.URLdecode(fileId);

        return accountabilityManager
            .getHistory(qNameWithComponentVersionOnly, fileIdDecoded)
            .exceptionally(error -> null)
            .get();
        //}
    }

    @GET
    @Path("modelHistory")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ModelProvenanceElement> getModelHistory()
        throws ExecutionException, InterruptedException {
        ServiceTemplateId serviceTemplateId = new ServiceTemplateId(new QName(provenanceId));
        String qNameWithComponentVersionOnly = VersionUtils.getQNameWithComponentVersionOnly(serviceTemplateId);

        return accountabilityManager
            .getHistory(qNameWithComponentVersionOnly)
            .exceptionally(error -> null)
            .get();
    }

    @GET
    @Path("authenticate")
    @Produces(MediaType.APPLICATION_JSON)
    public List<AuthorizationNode> getAuthentication(@QueryParam("participantAddress") String participantAddress) throws ExecutionException, InterruptedException {
        AuthorizationInfo authorizationInfo = accountabilityManager
            .getAuthorization(provenanceId)
            .exceptionally(error -> null)
            .get();

        if (Objects.nonNull(authorizationInfo)) {
            return authorizationInfo
                .getAuthorizationLineage(participantAddress)
                .orElseGet(ArrayList::new);
        }

        return new ArrayList<>();
    }

    @POST
    @Path("authorize")
    @Consumes(MediaType.APPLICATION_JSON)
    public String addParticipant(AuthorizationNode participant) throws ExecutionException, InterruptedException {
        return accountabilityManager
            .authorize(Util.URLdecode(Util.URLdecode(provenanceId)), participant.getAddress(), participant.getIdentity())
            .exceptionally(error -> null)
            .get();
    }

    @GET
    @Path("downloadFile")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFileFromImmutableStorage(@QueryParam("address") String address, @QueryParam("filename") String filename) {
        StreamingOutput fileStream = output -> {
            try {
                byte[] data = accountabilityManager.retrieveState(address).get();
                output.write(data);
                output.flush();
            } catch (Exception e) {
                throw new WebApplicationException(e);
            }
        };
        return Response
            .ok(fileStream, MediaType.APPLICATION_OCTET_STREAM)
            .header("content-disposition", "attachment; filename = " + filename)
            .build();
    }

    @GET
    @Path("retrieveFile")
    @Produces(MediaType.TEXT_PLAIN)
    public Response retrieveFileFromImmutableStorage(@QueryParam("address") String address) {
        try {
            byte[] data = accountabilityManager.retrieveState(address).get();
            String fileAsString = IOUtils.toString(data, Charset.defaultCharset().toString());

            return Response
                .ok(fileAsString, MediaType.TEXT_PLAIN)
                .build();
        } catch (IOException | InterruptedException | ExecutionException e) {
            LOGGER.error("Cannot retrieve file ({}) from immutable storage. Reason: {}", address, e.getMessage());

            return Response.serverError().build();
        }
    }
}
