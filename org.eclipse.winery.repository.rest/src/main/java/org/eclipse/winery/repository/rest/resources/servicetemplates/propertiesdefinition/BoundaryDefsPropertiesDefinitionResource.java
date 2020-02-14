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

package org.eclipse.winery.repository.rest.resources.servicetemplates.propertiesdefinition;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.winery.model.tosca.TServiceTemplate;
import org.eclipse.winery.model.tosca.kvproperties.WinerysPropertiesDefinition;
import org.eclipse.winery.model.tosca.utils.ModelUtilities;
import org.eclipse.winery.repository.backend.BackendUtils;
import org.eclipse.winery.repository.backend.NamespaceManager;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.rest.RestUtils;
import org.eclipse.winery.repository.rest.resources.apiData.PropertiesDefinitionEnum;
import org.eclipse.winery.repository.rest.resources.apiData.PropertiesDefinitionResourceApiData;
import org.eclipse.winery.repository.rest.resources.entitytypes.properties.PropertiesDefinitionResource;
import org.eclipse.winery.repository.rest.resources.servicetemplates.ServiceTemplateResource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BoundaryDefsPropertiesDefinitionResource extends PropertiesDefinitionResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(BoundaryDefsPropertiesDefinitionResource.class);

    private final ServiceTemplateResource parentRes;
    private final WinerysPropertiesDefinition wpd;

    public BoundaryDefsPropertiesDefinitionResource(ServiceTemplateResource res) {
        this.parentRes = res;
        this.wpd = res.getElement().getWinerysPropertiesDefinition();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PropertiesDefinitionResourceApiData getJson() {
        TServiceTemplate.PropertiesDefinition definition = this.parentRes.getServiceTemplate().getPropertiesDefinition();
        return new PropertiesDefinitionResourceApiData(definition, this.wpd);
    }

    @DELETE
    public Response clearPropertiesDefinition() {
        TServiceTemplate st = this.parentRes.getServiceTemplate();
        st.setPropertiesDefinition(null);
        if (Objects.nonNull(st.getBoundaryDefinitions())) {
            if (Stream.of(
                st.getBoundaryDefinitions().getPolicies(),
                st.getBoundaryDefinitions().getCapabilities(),
                st.getBoundaryDefinitions().getPropertyConstraints(),
                st.getBoundaryDefinitions().getRequirements(),
                st.getBoundaryDefinitions().getInterfaces())
                .allMatch(Objects::isNull)) {
                st.setBoundaryDefinitions(null);
            } else {
                st.getBoundaryDefinitions().setProperties(null);
            }
        }
        ModelUtilities.removeWinerysPropertiesDefinition(this.parentRes.getServiceTemplate());
        return RestUtils.persist(this.parentRes);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response onJsonPost(PropertiesDefinitionResourceApiData data) {
        TServiceTemplate st = this.parentRes.getServiceTemplate();

        if (data.selectedValue == PropertiesDefinitionEnum.Element || data.selectedValue == PropertiesDefinitionEnum.Type) {
            if (Objects.nonNull(st.getBoundaryDefinitions())) {
                st.getBoundaryDefinitions().setProperties(null);
            }
            // first of all, remove Winery's Properties definition (if it exists)
            ModelUtilities.removeWinerysPropertiesDefinition(st);
            // replace old properties definition by new one
            TServiceTemplate.PropertiesDefinition def = new TServiceTemplate.PropertiesDefinition();

            if (data.propertiesDefinition.getElement() != null) {
                def.setElement(data.propertiesDefinition.getElement());
            } else if (data.propertiesDefinition.getType() != null) {
                def.setType(data.propertiesDefinition.getType());
            } else {
                return Response.status(Response.Status.BAD_REQUEST).entity("Wrong data submitted!").build();
            }

            st.setPropertiesDefinition(def);
            List<String> errors = new ArrayList<>();
            BackendUtils.deriveWPD(st, errors);
            // currently the errors are just logged
            for (String error : errors) {
                LOGGER.debug(error);
            }
            BackendUtils.initializeProperties(RepositoryFactory.getRepository(), st);

            return RestUtils.persist(this.parentRes);
        } else if (data.selectedValue == PropertiesDefinitionEnum.Custom) {
            // clear current properties definition
            st.setPropertiesDefinition(null);

            if (!data.winerysPropertiesDefinition.getPropertyDefinitionKVList().getPropertyDefinitionKVs().isEmpty()) {
                // create winery properties definition and persist it
                ModelUtilities.replaceWinerysPropertiesDefinition(st, data.winerysPropertiesDefinition);
                String namespace = data.winerysPropertiesDefinition.getNamespace();
                NamespaceManager namespaceManager = RepositoryFactory.getRepository().getNamespaceManager();
                if (!namespaceManager.hasPermanentProperties(namespace)) {
                    namespaceManager.addPermanentNamespace(namespace);
                }

                BackendUtils.initializeProperties(RepositoryFactory.getRepository(), st);
            }
            else {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Empty KV Properties Definition is not allowed!")
                    .build();
            }

            return RestUtils.persist(this.parentRes);
        }

        return Response.status(Response.Status.BAD_REQUEST).entity("Wrong data submitted!").build();
    }
}
