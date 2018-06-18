/********************************************************************************
 * Copyright (c) 2017-2018 Contributors to the Eclipse Foundation
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
 ********************************************************************************/
export declare enum align {
    Horizontal = "Horizontal",
    Vertical = "Vertical",
}
export declare enum definitionType {
    CapabilityDefinitions = "/capabilitydefinitions/",
    RequirementDefinitions = "/requirementdefinitions/",
}
export declare enum urlElement {
    NodeTypeURL = "/nodetypes/",
    RequirementTypeURL = "/requirementtypes/",
    CapabilityTypeURL = "/capabilitytypes/",
    RelationshipTypeURL = "/relationshiptypes/",
    ReadMe = "/readme",
    ServiceTemplates = "/servicetemplates/",
    Winery = "/winery",
    TopologyTemplate = "/topologytemplate/",
}
export declare enum toscaEntity {
    Requirements = "Requirements",
    Capabilities = "Capabilities",
}
export declare enum toggleModalType {
    Requirements = "REQUIREMENTS",
    Capabilities = "CAPABILITIES",
    DeploymentArtifacts = "DEPLOYMENT_ARTIFACTS",
    Policies = "POLICIES",
}
export declare enum PropertyDefinitionType {
    NONE = "NONE",
    KV = "KV",
    XML = "XML",
}
