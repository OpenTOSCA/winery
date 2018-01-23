/********************************************************************************
 * Copyright (c) 2017 Contributors to the Eclipse Foundation
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

export class AbstractTTemplate {
    constructor (public documentation?: any,
                 public any?: any,
                 public otherAttributes?: any) {
    }
}

/**
 * This is the datamodel for node Templates and relationship templates
 */
export class TTopologyTemplate extends AbstractTTemplate {
    nodeTemplates: Array<TNodeTemplate> = [];
    relationshipTemplates: Array<TRelationshipTemplate> = [];
}

/**
 * This is the datamodel for node Templates
 */
export class TNodeTemplate extends AbstractTTemplate {
    constructor (public properties: any,
                 public id: string,
                 public type: string,
                 public name: string,
                 public minInstances: number,
                 public maxInstances: number,
                 public color: string,
                 public imageUrl: string,
                 documentation?: any,
                 any?: any,
                 otherAttributes?: any,
                 public x?: string,
                 public y?: string,
                 public capabilities?: any,
                 public requirements?: any,
                 public deploymentArtifacts?: any,
                 public policies?: any,
                 public targetLocations?: any) {
        super(documentation, any, otherAttributes);
    }

    /**
     * needed for the winery redux reducer,
     * updates a specific attribute and returns a whole new node template
     * @param indexOfUpdatedAttribute: index of the to be updated attribute in the constructor
     * @param updatedValue: the new value
     *
     * @return nodeTemplate: a new node template with the updated value
     */
    generateNewNodeTemplateWithUpdatedAttribute(updatedAttribute: string, updatedValue: any): TNodeTemplate {
        const nodeTemplate = new TNodeTemplate(this.properties, this.id, this.type, this.name, this.minInstances, this.maxInstances, this.color,
                        this.imageUrl, this.documentation, this.any, this.otherAttributes, this.x, this.y, this.capabilities,
                        this.requirements, this.deploymentArtifacts, this.policies, this.targetLocations);
        if (updatedAttribute === 'otherAttributes') {
            for (const key in nodeTemplate.otherAttributes) {
                if (nodeTemplate.otherAttributes.hasOwnProperty(key)) {
                    const trimmedKey = key.substring(key.indexOf('}') + 1);
                    nodeTemplate.otherAttributes[key] = updatedValue[trimmedKey];
                }
            }
            nodeTemplate.x = updatedValue.x;
            nodeTemplate.y = updatedValue.y;
        } else if (updatedAttribute === ('minInstances') || updatedAttribute === ('maxInstances')) {
            nodeTemplate[updatedAttribute] = +updatedValue;
        } else {
            nodeTemplate[updatedAttribute] = updatedValue;
        }
        return nodeTemplate;
    }
}

/**
 * This is the datamodel for the Entity Types
 */
export class EntityType {
    constructor (public id: string,
                 public qName: string,
                 public name: string,
                 public namespace: string,
                 public color?: string) {
    }
}

/**
 * This is the datamodel for relationship templates
 */
export class TRelationshipTemplate extends AbstractTTemplate {
    /*
     get targetElement(): string {
     return this.targetElement;
     }
     get sourceElement(): string {
     return this.sourceElement;
     }
     */
    constructor (public sourceElement: { ref: string },
                 public targetElement: { ref: string },
                 public name?: string,
                 public id?: string,
                 public type?: string,
                 documentation?: any,
                 any?: any,
                 otherAttributes?: any) {
        super(documentation, any, otherAttributes);
    }

    /**
     * needed for the winery redux reducer,
     * updates a specific attribute and returns the whole new relationship template
     * @param indexOfUpdatedAttribute: index of the to be updated attribute in the constructor
     * @param updatedValue: the new value
     *
     * @return relTemplate: a new relationship template with the updated value
     */
    generateNewRelTemplateWithUpdatedAttribute(updatedAttribute: string, updatedValue: any): TRelationshipTemplate {
        const relTemplate = new TRelationshipTemplate(this.sourceElement, this.targetElement, this.name, this.id, this.type,
            this.documentation, this.any, this.otherAttributes);
        relTemplate[updatedAttribute] = updatedValue;
        return relTemplate;
    }

}

/**
 * This is the datamodel for the style of nodes and relationships
 */
export class Visuals {

    constructor (public color: string,
                 public nodeTypeId: string,
                 public localName?: string,
                 public imageUrl?: string) {
    }

    /*
     get color(): string {
     return this._color;
     }

     set color(value: string) {
     this._color = value;
     }

     get nodeTypeId(): string {
     return this._nodeTypeId;
     }

     set nodeTypeId(value: string) {
     this._nodeTypeId = value;
     }

     get localName(): string {
     this._localName = this._nodeTypeId.split('}')[1];
     return this._localName;
     }

     set localName(value: string) {
     this._localName = value;
     }

     get imageUrl(): string {
     return this._imageUrl;
     }

     set imageUrl(value: string) {
     this._imageUrl = value;
     }
     */
}