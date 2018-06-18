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
import { DifferenceStates } from './ToscaDiff';
export declare class AbstractTTemplate {
    documentation: any;
    any: any;
    otherAttributes: any;
    constructor(documentation?: any, any?: any, otherAttributes?: any);
}
/**
 * This is the datamodel for node Templates and relationship templates
 */
export declare class TTopologyTemplate extends AbstractTTemplate {
    nodeTemplates: Array<TNodeTemplate>;
    relationshipTemplates: Array<TRelationshipTemplate>;
}
/**
 * This is the datamodel for node Templates
 */
export declare class TNodeTemplate extends AbstractTTemplate {
    properties: any;
    id: string;
    type: string;
    name: string;
    minInstances: number;
    maxInstances: number;
    color: string;
    imageUrl: string;
    x: string;
    y: string;
    capabilities: any;
    requirements: any;
    deploymentArtifacts: any;
    policies: any;
    private _state;
    constructor(properties: any, id: string, type: string, name: string, minInstances: number, maxInstances: number, color: string, imageUrl: string, documentation?: any, any?: any, otherAttributes?: any, x?: string, y?: string, capabilities?: any, requirements?: any, deploymentArtifacts?: any, policies?: any, _state?: DifferenceStates);
    /**
     * needed for the winery redux reducer,
     * updates a specific attribute and returns a whole new node template
     * @param indexOfUpdatedAttribute: index of the to be updated attribute in the constructor
     * @param updatedValue: the new value
     *
     * @return nodeTemplate: a new node template with the updated value
     */
    generateNewNodeTemplateWithUpdatedAttribute(updatedAttribute: string, updatedValue: any): TNodeTemplate;
    state: DifferenceStates;
}
/**
 * This is the datamodel for the Entity Types
 */
export declare class EntityType {
    id: string;
    qName: string;
    name: string;
    namespace: string;
    color: string;
    full: any;
    constructor(id: string, qName: string, name: string, namespace: string, color?: string, full?: any);
}
/**
 * This is the datamodel for relationship templates
 */
export declare class TRelationshipTemplate extends AbstractTTemplate {
    sourceElement: {
        ref: string;
    };
    targetElement: {
        ref: string;
    };
    name: string;
    id: string;
    type: string;
    state: DifferenceStates;
    constructor(sourceElement: {
        ref: string;
    }, targetElement: {
        ref: string;
    }, name?: string, id?: string, type?: string, documentation?: any, any?: any, otherAttributes?: any, state?: DifferenceStates);
    /**
     * needed for the winery redux reducer,
     * updates a specific attribute and returns the whole new relationship template
     * @param indexOfUpdatedAttribute: index of the to be updated attribute in the constructor
     * @param updatedValue: the new value
     *
     * @return relTemplate: a new relationship template with the updated value
     */
    generateNewRelTemplateWithUpdatedAttribute(updatedAttribute: string, updatedValue: any): TRelationshipTemplate;
}
/**
 * This is the datamodel for the style of nodes and relationships
 */
export declare class Visuals {
    color: string;
    nodeTypeId: string;
    localName: string;
    imageUrl: string;
    constructor(color: string, nodeTypeId: string, localName?: string, imageUrl?: string);
}
