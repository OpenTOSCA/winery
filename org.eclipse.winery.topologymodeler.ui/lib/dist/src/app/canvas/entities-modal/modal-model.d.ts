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
export declare class ModalVariantAndState {
    modalVariant: ModalVariant;
    modalVisible: boolean;
    modalTitle: string;
}
export declare enum ModalVariant {
    Policies = "policies",
    DeploymentArtifacts = "deployment_artifacts",
    Other = "other",
    None = "none",
}
/**
 * Encompasses the variety of values that are displayed inside and entered into the modal.
 */
export declare class DeploymentArtifactOrPolicyModalData {
    nodeTemplateId: string;
    id: string;
    modalName: string;
    modalType: string;
    artifactTypes: string[];
    policyTypes: string[];
    modalTemplate: any;
    artifactTemplates: string[];
    policyTemplates: string[];
    modalTemplateName: any;
    modalTemplateRef: any;
    modalTemplateNameSpace: any;
    namespaces: string[];
    constructor(nodeTemplateId?: string, id?: string, modalName?: string, modalType?: string, artifactTypes?: string[], policyTypes?: string[], modalTemplate?: any, artifactTemplates?: string[], policyTemplates?: string[], modalTemplateName?: any, modalTemplateRef?: any, modalTemplateNameSpace?: any, namespaces?: string[]);
}
