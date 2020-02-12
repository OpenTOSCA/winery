/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.repository.rest.resources.entitytypes;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.winery.model.tosca.TInterfaceDefinition;
import org.eclipse.winery.model.tosca.TNodeType;
import org.eclipse.winery.repository.rest.RestUtils;

public class InterfaceDefinitionsResource {

    private final TopologyGraphElementEntityTypeResource parent;

    public InterfaceDefinitionsResource(TopologyGraphElementEntityTypeResource parent) {
        this.parent = parent;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<TInterfaceDefinition> get() {
        return getNodeType().getInterfaceDefinitions();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response put(List<TInterfaceDefinition> defs) {
        this.getNodeType().setInterfaceDefinitions(defs);
        return RestUtils.persist(this.parent);
    }

    private TNodeType getNodeType() {
        return ((TNodeType) this.parent.getElement());
    }
}
