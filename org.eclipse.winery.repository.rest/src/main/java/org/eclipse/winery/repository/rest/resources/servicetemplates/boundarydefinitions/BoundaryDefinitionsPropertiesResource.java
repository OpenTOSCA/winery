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

package org.eclipse.winery.repository.rest.resources.servicetemplates.boundarydefinitions;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.winery.model.tosca.TBoundaryDefinitions;
import org.eclipse.winery.model.tosca.TServiceTemplate;
import org.eclipse.winery.model.tosca.kvproperties.WinerysPropertiesDefinition;
import org.eclipse.winery.model.tosca.utils.ModelUtilities;
import org.eclipse.winery.repository.backend.BackendUtils;
import org.eclipse.winery.repository.rest.RestUtils;
import org.eclipse.winery.repository.rest.resources._support.AbstractComponentInstanceResource;
import org.eclipse.winery.repository.rest.resources.servicetemplates.ServiceTemplateResource;

import io.github.adr.embedded.ADR;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.w3c.dom.Document;

public class BoundaryDefinitionsPropertiesResource {
    
    private AbstractComponentInstanceResource res;
    private TServiceTemplate template;

    public BoundaryDefinitionsPropertiesResource(AbstractComponentInstanceResource res) {
        this.template = ((ServiceTemplateResource) res).getServiceTemplate();
        this.res = res;
    }

    @GET
    @Produces( {MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response getProperties() {
        WinerysPropertiesDefinition wpd = template.getWinerysPropertiesDefinition();
        TBoundaryDefinitions.Properties props = this.template.getBoundaryDefinitions().getProperties();
        if (wpd == null) {
            // no Winery special treatment, just return the XML properties
            if (props == null) {
                return Response.ok().type(MediaType.APPLICATION_XML).build();
            } else {
                try {
                    @ADR(6)
                    String xmlAsString = BackendUtils.getXMLAsString(TBoundaryDefinitions.Properties.class, props, true);
                    return Response
                        .ok()
                        .entity(xmlAsString)
                        .type(MediaType.APPLICATION_XML)
                        .build();
                } catch (Exception e) {
                    throw new WebApplicationException(e);
                }
            }
        } else {
            Map<String, String> kvProperties = this.template.getBoundaryDefinitions().getProperties().getKVProperties();
            return Response.ok().entity(kvProperties).type(MediaType.APPLICATION_JSON).build();
        }
    }

    /*
     * The well-formedness of the XML element is done using the framework. If you see <code>[Fatal Error] :1:19: The
     * prefix "tosca" for element "tosca:properties" is not bound.</code> in the console, it is an indicator that the XML element is not well-formed.
     */
    @PUT
    @Consumes( {MediaType.APPLICATION_XML, MediaType.TEXT_XML})
    @ApiOperation(value = "saves properties of boundary definitions", notes = "Models the user-defined properties. The property mappings go into a separate resource propertymappings.")
    public Response putProperties(@ApiParam(value = "Stored properties. The XSD allows a single element only. Therefore, we go for the contained element") Document doc) {
        TBoundaryDefinitions.Properties properties = ModelUtilities.getProperties(this.template.getBoundaryDefinitions());
        properties.setAny(doc.getDocumentElement());
        return RestUtils.persist(res);
    }

    @PUT
    @Consumes( {MediaType.APPLICATION_JSON})
    @ApiOperation(value = "saves properties of boundary definitions", notes = "Models the user-defined properties. The property mappings go into a separate resource propertymappings.")
    public Response putCustomProperties(@ApiParam(value = "Stored properties. The XSD allows a single element only. Therefore, we go for the contained element") Map<String, String> props) {
        this.template.getBoundaryDefinitions().getProperties().setKVProperties(props);
        return RestUtils.persist(res);
    }
}
