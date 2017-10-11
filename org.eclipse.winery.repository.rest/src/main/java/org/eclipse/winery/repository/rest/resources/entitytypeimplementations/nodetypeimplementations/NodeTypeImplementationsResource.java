/*******************************************************************************
 * Copyright (c) 2012-2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *******************************************************************************/
package org.eclipse.winery.repository.rest.resources.entitytypeimplementations.nodetypeimplementations;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.eclipse.winery.repository.rest.resources.AbstractComponentsWithTypeReferenceResource;

import io.swagger.annotations.Api;

@Api(tags = "Node Type Implementations")
public class NodeTypeImplementationsResource extends AbstractComponentsWithTypeReferenceResource<NodeTypeImplementationResource> {
	@Path("{namespace}/{id}/")
	public NodeTypeImplementationResource getComponentInstaceResource(@PathParam("namespace") String namespace, @PathParam("id") String id) {
		return this.getComponentInstaceResource(namespace, id, true);
	}

}
