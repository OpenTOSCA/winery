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

package org.eclipse.winery.repository.rest.resources.admin.keypermissions;

import io.swagger.annotations.ApiOperation;
import org.eclipse.winery.repository.security.csar.PartnerACListProcessor;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

public class KeyExchangePartnerResource {
    
    private PartnerACListProcessor aclProcessor;
    
    public KeyExchangePartnerResource(@PathParam("partnerName") String partnerName) { }
    
    @ApiOperation(value = "Gets existing access control rules")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPartnerACL(@PathParam("partnerName") String partnerName,
                                  @Context UriInfo uriInfo) {
        if (!PartnerACListProcessor.partnerACLExists(partnerName)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        aclProcessor = new PartnerACListProcessor(partnerName);
        
        return Response.ok(aclProcessor.getCurrentConfigurations()).type(MediaType.APPLICATION_JSON).build();
    }
    
    @ApiOperation(value = "Adds a new access control rule")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPartnerACLRule(@PathParam("partnerName") String partnerName, @FormParam("policyId") String policyId, @FormParam("accessRule") String accessRule) {
        if (!PartnerACListProcessor.partnerACLExists(partnerName)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        aclProcessor = new PartnerACListProcessor(partnerName);
        if (aclProcessor.addPolicyConfig(policyId, accessRule)) {
            return Response.noContent().build();
        }
        else {
            return Response.serverError().entity("Error saving access control rule").type(MediaType.TEXT_PLAIN).build();
        }                
    }

    @ApiOperation(value = "Updates an access control rule")
    @PUT
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePartnerACLRule(@PathParam("partnerName") String partnerName, @FormParam("policyId") String policyId, @FormParam("accessRule") String accessRule) {
        if (!PartnerACListProcessor.partnerACLExists(partnerName)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        aclProcessor = new PartnerACListProcessor(partnerName);
        if (aclProcessor.updatePolicyConfig(policyId, accessRule)) {
            return Response.noContent().build();
        }
        else {
            return Response.serverError().entity("Error saving access control rule").type(MediaType.TEXT_PLAIN).build();
        }
    }

    @ApiOperation(value = "Deletes an access control rule")
    @DELETE
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePartnerACLRule(@PathParam("partnerName") String partnerName, @FormParam("policyId") String policyId) {
        if (!PartnerACListProcessor.partnerACLExists(partnerName)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        aclProcessor = new PartnerACListProcessor(partnerName);
        if (aclProcessor.deletePolicyConfig(policyId)) {
            return Response.noContent().build();
        }
        else {
            return Response.serverError().entity("Error saving access control rule").type(MediaType.TEXT_PLAIN_TYPE).build();
        }
    }
    
}
