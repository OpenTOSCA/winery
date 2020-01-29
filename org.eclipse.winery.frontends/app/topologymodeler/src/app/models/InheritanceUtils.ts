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

import { EntityTypesModel } from './entityTypesModel';
import { CapabilityDefinitionModel } from './capabilityDefinitionModel';
import { RequirementDefinitionModel } from './requirementDefinitonModel';
import { EntityType, TPolicyType } from './ttopology-template';
import { QName } from './qname';

export class InheritanceUtils {

    static getCapabilityDefinitionsOfNodeType(nodeType: string, entityTypes: EntityTypesModel): CapabilityDefinitionModel[] {
        const listOfEffectiveCapabilityDefinitions: CapabilityDefinitionModel[] = [];
        const listOfBequeathingNodeTypes = this.getInheritanceAncestry(nodeType, entityTypes.unGroupedNodeTypes);
        for (const currentNodeType of listOfBequeathingNodeTypes) {
            if (currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions &&
                currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions.capabilityDefinition) {
                for (const capabilityDefinition of currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0]
                    .capabilityDefinitions.capabilityDefinition) {
                    if (!listOfEffectiveCapabilityDefinitions
                        .some(value => value.name === capabilityDefinition.name)) {
                        listOfEffectiveCapabilityDefinitions.push(capabilityDefinition);
                    }
                }
            }
        }
        return listOfEffectiveCapabilityDefinitions;
    }

    static getRequirementDefinitionsOfNodeType(nodeType: string, entityTypes: EntityTypesModel): RequirementDefinitionModel[] {
        const listOfEffectiveRequirementDefinitions: RequirementDefinitionModel[] = [];
        const listOfBequeathingNodeTypes = this.getInheritanceAncestry(nodeType, entityTypes.unGroupedNodeTypes);
        for (const currentNodeType of listOfBequeathingNodeTypes) {
            if (currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].requirementDefinitions &&
                currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].requirementDefinitions.requirementDefinition) {
                for (const requirementDefinition of currentNodeType.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0]
                    .requirementDefinitions.requirementDefinition) {
                    if (!listOfEffectiveRequirementDefinitions
                        .some(value => value.name === requirementDefinition.name)) {
                        listOfEffectiveRequirementDefinitions.push(requirementDefinition);
                    }
                }
            }
        }
        return listOfEffectiveRequirementDefinitions;
    }

    static getParent(element: EntityType, entities: EntityType[]): EntityType {
        if (this.hasParentType(element)) {
            const parentQName = element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom.type;
            return entities.find(entity => entity.qName === parentQName);
        }
        return null;
    }

    static hasParentType(element: EntityType): boolean {
        return (element && element.full
            && element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0]
            && element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom
        );
    }

    static getInheritanceAncestry(entityType: string, entityTypes: EntityType[]): EntityType[] {
        const entity = entityTypes.find(type => type.qName === entityType);
        const result = [];

        if (entity) {
            result.push(entity);
            let parent = this.getParent(entity, entityTypes);

            while (parent) {
                result.push(parent);
                parent = this.getParent(parent, entityTypes);
            }
        }

        return result;
    }

    static getDescendantsOfEntityType<T extends EntityType>(entityType: string, entityTypes: T[]): T[] {
        const listOfDescendants: T[] = [];
        listOfDescendants.push(entityTypes.find(et => et.qName === entityType));
        // Look for any entityTypes, that have the given entityType somewhere along their inheritance hierarchy.
        for (const entType of entityTypes) {
            if (entType.qName !== entityType) {
                if (this.getInheritanceAncestry(entType.qName, entityTypes).find(candidate => candidate.qName === entityType)) {
                    // Those elements are the descendants
                    listOfDescendants.push(entType);
                }
            }
        }
        return listOfDescendants;
    }

    /**
     * Gets the active set of allowed target node types for this YAML policy type
     * i.e., returns the targets array which is the lowest possible.
     * @param policyTypeQName
     * @param policyTypes
     */
    static getEffectiveTargetsOfYamlPolicyType(policyTypeQName: string, policyTypes: TPolicyType[]): string[] {
        const hierarchy = this.getInheritanceAncestry(policyTypeQName, policyTypes);
        let result = [];

        for (const type of hierarchy) {
            if ((<TPolicyType>type).targets) {
                result = (<TPolicyType>type).targets;
                break;
            }
        }

        return result;
    }

    static getEffectiveKVPropertiesOfTemplateElement(templateElementProperties: any, typeQName: string, entityTypes: EntityType[]): any {
        const typeName = new QName(typeQName).localName;
        const defaultTypeProperties = this.getDefaultPropertiesFromEntityTypes(typeName, entityTypes);
        const result = {};

        if (defaultTypeProperties && defaultTypeProperties.kvproperties) {
            Object.keys(defaultTypeProperties.kvproperties).forEach(currentPropKey => {

                if (templateElementProperties && templateElementProperties.kvproperties &&
                    Object.keys(templateElementProperties.kvproperties).some(tempPropertyKey => tempPropertyKey === currentPropKey)) {
                    result[currentPropKey] = templateElementProperties.kvproperties[currentPropKey];
                } else {
                    result[currentPropKey] = defaultTypeProperties.kvproperties[currentPropKey];
                }
            });
        }

        return { kvproperties: result };
    }

    /**
     * This function gets KV properties of a type and sets their default values
     * @param any type: the element type, e.g. capabilityType, requirementType etc.
     * @returns newKVProperties: KV Properties as Object
     */
    static getKVProperties(type: any): any {
        const newKVProperies = {};
        const kvProperties = type.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any[0].propertyDefinitionKVList;
        for (const obj of kvProperties) {
            const key = obj.key;
            let value;
            if (!obj.value && obj.defaultValue) {
                value = obj.defaultValue;
            } else if (!obj.value) {
                // TODO quick hack: set a "system" default
                value = 'N/A';
            } else {
                value = obj.value;
            }
            newKVProperies[key] = value;
        }
        return newKVProperies;
    }

    static hasKVPropDefinition(element: EntityType): boolean {
        return (element && element.full &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any.length > 0 &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any[0].propertyDefinitionKVList
        );
    }

    /**
     * Generates default properties from node types or relationshipTypes
     * The assumption appears to be that types only add new properties and never change existing ones (e.g., change type or default value)
     * todo why name not qname?
     * todo use the 'getInheritanceAncestry' method
     * @param name
     * @param entities
     * @return properties
     */
    static getDefaultPropertiesFromEntityTypes(name: string, entities: EntityType[]): any {
        for (const element of entities) {
            if (element.name === name) {
                // if propertiesDefinition is defined it's a XML property
                if (element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].propertiesDefinition
                    && element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].propertiesDefinition.element) {
                    return {
                        any: element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].propertiesDefinition.element
                    };
                } else { // otherwise KV properties or no properties at all
                    let inheritedProperties = {};
                    if (InheritanceUtils.hasParentType(element)) {
                        let parent = element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom.typeRef;
                        let continueFlag;

                        while (parent) {
                            continueFlag = false;
                            for (const parentElement of entities) {
                                if (parentElement.qName === parent) {
                                    if (InheritanceUtils.hasKVPropDefinition(parentElement)) {
                                        inheritedProperties = {
                                            ...inheritedProperties, ...InheritanceUtils.getKVProperties(parentElement)
                                        };
                                    }
                                    if (InheritanceUtils.hasParentType(parentElement)) {
                                        parent = parentElement.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom.typeRef;
                                        continueFlag = true;
                                    }
                                    break;
                                }
                            }
                            if (continueFlag) {
                                continue;
                            }
                            parent = null;
                        }
                    }

                    let typeProperties = {};
                    if (InheritanceUtils.hasKVPropDefinition(element)) {
                        typeProperties = InheritanceUtils.getKVProperties(element);
                    }

                    const mergedProperties = { ...inheritedProperties, ...typeProperties };

                    return {
                        kvproperties: { ...mergedProperties }
                    };
                }
            }
        }
    }
}
