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

package org.eclipse.winery.repository.yaml;

import javax.xml.namespace.QName;

import org.eclipse.winery.common.configuration.RepositoryConfigurationObject;
import org.eclipse.winery.model.ids.definitions.ServiceTemplateId;
import org.eclipse.winery.model.tosca.TRelationshipTemplate;
import org.eclipse.winery.model.tosca.TServiceTemplate;
import org.eclipse.winery.repository.TestWithGitBackedRepository;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class YamlRepositoryIntegrationTests extends TestWithGitBackedRepository {

    public YamlRepositoryIntegrationTests() {
        super(RepositoryConfigurationObject.RepositoryProvider.YAML);
    }

    @Test
    public void retrieveInitialServiceTemplate() throws Exception {
        this.setRevisionTo("bab12e7a8ca7af1c0a0ce186c81bab3899ab989b");

        assertEquals(10, repository.getAllDefinitionsChildIds().size());
        TServiceTemplate element = repository.getElement(
            new ServiceTemplateId(QName.valueOf("{example.org.tosca.servicetemplates}demo_w1-wip1"))
        );

        assertNotNull(element);
        assertNotNull(element.getTopologyTemplate());
        assertEquals(3, element.getTopologyTemplate().getNodeTemplateOrRelationshipTemplate().size());
        assertNotNull(element.getTopologyTemplate().getNodeTemplate("compute_w1-wip1_0"));
        assertNotNull(element.getTopologyTemplate().getNodeTemplate("software_w1-wip1_0"));

        TRelationshipTemplate relation = element.getTopologyTemplate().getRelationshipTemplate("con_hostedOn_0");
        assertNotNull(relation);
        assertEquals("software_w1-wip1_0", relation.getSourceElement().getRef().getId());
        assertEquals("compute_w1-wip1_0", relation.getTargetElement().getRef().getId());
    }
}
