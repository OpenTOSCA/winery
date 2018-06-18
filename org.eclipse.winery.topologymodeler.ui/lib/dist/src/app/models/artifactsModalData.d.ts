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
/**
 * Encompasses the artifacts data defined by the user when using the modal
 */
export declare class DeploymentArtifactsModalData {
    id: string;
    artifactName: string;
    artifactType: string;
    artifactTypes: string[];
    artifactTemplates: string[];
    artifactTemplateName: any;
    artifactTemplateRef: any;
    artifactTemplateNameSpace: any;
    nodeTemplateId: string;
    deploymentArtifacts: any;
    constructor(id?: string, artifactName?: string, artifactType?: string, artifactTypes?: string[], artifactTemplates?: string[], artifactTemplateName?: any, artifactTemplateRef?: any, artifactTemplateNameSpace?: any, nodeTemplateId?: string, deploymentArtifacts?: any);
}
export declare class TDeploymentArtifact {
    documentation: any[];
    any: any[];
    otherAttributes: any;
    name: string;
    artifactType: string;
    artifactRef: string;
    constructor(documentation?: any[], any?: any[], otherAttributes?: any, name?: string, artifactType?: string, artifactRef?: string);
}
