/*******************************************************************************
 * Copyright (c) 2012-2020 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.repository.rest.resources.entitytypes.artifacttypes;

import java.util.List;
import java.util.SortedSet;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.eclipse.winery.common.ids.definitions.ArtifactTemplateId;
import org.eclipse.winery.common.ids.definitions.ArtifactTypeId;
import org.eclipse.winery.model.tosca.TArtifactType;
import org.eclipse.winery.model.tosca.TExtensibleElements;
import org.eclipse.winery.repository.exceptions.RepositoryCorruptException;
import org.eclipse.winery.repository.rest.RestUtils;
import org.eclipse.winery.repository.rest.datatypes.select2.Select2OptGroup;
import org.eclipse.winery.repository.rest.resources.entitytypes.EntityTypeResource;

public class ArtifactTypeResource extends EntityTypeResource {

    public ArtifactTypeResource(ArtifactTypeId id) {
        super(id);
    }

    /**
     * @return the file extensions associated with this artifact type. May be null (used in YAML mode)
     */
    @GET
    @Path("/fileextensions")
    public List<String> getAssociatedFileExtensions() {
        return ((TArtifactType) this.getDefinitions().getElement()).getFileExtensions();
    }

    @PUT
    @Path("/fileextensions")
    public Response setAssociatedFileExtensions(List<String> fileExtensions) {
        ((TArtifactType) this.getDefinitions().getElement()).setFileExtensions(fileExtensions);
        return RestUtils.persist(this);
    }

    /**
     * @return the file mime type associated with this artifact type. May be null (used in YAML mode)
     */
    @GET
    @Path("/mimetype")
    public String getAssociatedMimeType() {
        return ((TArtifactType) this.getDefinitions().getElement()).getMimeType();
    }

    @PUT
    @Path("/mimetype")
    public Response setAssociatedMimeType(String mimeType) {
        ((TArtifactType) this.getDefinitions().getElement()).setMimeType(mimeType);
        return RestUtils.persist(this);
    }

    @Override
    protected TExtensibleElements createNewElement() {
        return new TArtifactType();
    }

    @Override
    public SortedSet<Select2OptGroup> getListOfAllInstances() {
        try {
            return this.getListOfAllInstances(ArtifactTemplateId.class);
        } catch (RepositoryCorruptException e) {
            throw new WebApplicationException(e);
        }
    }

    @Path("templates/")
    public TemplatesOfOneArtifactTypeResource getImplementations() {
        return new TemplatesOfOneArtifactTypeResource((ArtifactTypeId) this.id);
    }
}
