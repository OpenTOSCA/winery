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
 * Encompasses the policies data defined by the user when using the modal
 */
export declare class PoliciesModalData {
    policyTemplates: string;
    policyTemplate: string;
    policyTemplateColor: string;
    policyTemplateId: string;
    policyTemplateName: string;
    policyTemplateNamespace: any;
    policyTemplateQName: any;
    policyTypes: string;
    policyType: string;
    policyTypeColor: string;
    policyTypeId: string;
    policyTypeName: string;
    policyTypeNamespace: any;
    policyTypeQName: any;
    policies: any;
    nodeTemplateId: string;
    constructor(policyTemplates?: string, policyTemplate?: string, policyTemplateColor?: string, policyTemplateId?: string, policyTemplateName?: string, policyTemplateNamespace?: any, policyTemplateQName?: any, policyTypes?: string, policyType?: string, policyTypeColor?: string, policyTypeId?: string, policyTypeName?: string, policyTypeNamespace?: any, policyTypeQName?: any, policies?: any, nodeTemplateId?: string);
}
export declare class TPolicy {
    name: string;
    policyRef: string;
    policyType: string;
    any: any[];
    documentation: any[];
    otherAttributes: any;
    constructor(name?: string, policyRef?: string, policyType?: string, any?: any[], documentation?: any[], otherAttributes?: any);
}
