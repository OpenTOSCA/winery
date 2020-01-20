/********************************************************************************
 * Copyright (c) 2018-2019 Contributors to the Eclipse Foundation
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
import { EntityType, TNodeTemplate, TRelationshipTemplate, TTopologyTemplate } from './ttopology-template';
import { QName } from './qname';
import { DifferenceStates, ToscaDiff, VersionUtils } from './ToscaDiff';
import { Visuals } from './visuals';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';
import { CapabilityDefinitionModel } from './capabilityDefinitionModel';
import { EntityTypesModel } from './entityTypesModel';
import { CapabilityModel } from './capabilityModel';

export class TopologyTemplateUtil {

    static HORIZONTAL_OFFSET_FOR_NODES_WITHOUT_COORDINATES = 350;
    static VERTICAL_OFFSET_FOR_NODES_WITHOUT_COORDINATES = 200;

    static createTNodeTemplateFromObject(node: TNodeTemplate, nodeVisuals: Visuals[],
                                         isYaml: boolean, types: EntityTypesModel, state?: DifferenceStates): TNodeTemplate {
        const nodeVisualsObject = this.getNodeVisualsForNodeTemplate(node.type, nodeVisuals, state);
        let properties;
        if (node.properties) {
            properties = node.properties;
        }

        let nameSpace: string;
        let targetLocationKey: string;
        let providerKey: string;
        let regionKey: string;
        let otherAttributes;
        for (const key in node.otherAttributes) {
            if (node.otherAttributes.hasOwnProperty(key)) {
                nameSpace = key.substring(key.indexOf('{'), key.indexOf('}') + 1);
                if (nameSpace) {
                    if (key.substring(key.indexOf('}') + 1) === 'location') {
                        targetLocationKey = key;
                    }
                    if (key.substring(key.indexOf('}') + 1) === 'provider') {
                        providerKey = key;
                    }
                    if (key.substring(key.indexOf('}') + 1) === 'region') {
                        regionKey = key;
                    }
                    otherAttributes = {
                        [nameSpace + 'location']: node.otherAttributes[targetLocationKey],
                        [nameSpace + 'provider']: node.otherAttributes[providerKey],
                        [nameSpace + 'region']: node.otherAttributes[regionKey],
                        [nameSpace + 'x']: node.x,
                        [nameSpace + 'y']: node.y
                    };
                } else if (key === 'location') {
                    targetLocationKey = 'location';
                }
            }
        }

        // for Yaml, we add missing capabilities, find their types, and fix their ids, we also fix requirement ids (to avoid duplicates)
        if (isYaml) {
            if (!types) {
                // todo ensure entity types model is always available. See TopologyTemplateUtil.updateTopologyTemplate
                console.error('The required entity types model is not available! Unexpected behavior');
            }
            // look for missing capabilities and add them
            const capDefs = this.getCapabilityDefinitionsOfNodeType(node.type, types);

            if (!node.capabilities || !node.capabilities.capability) {
                node.capabilities = { capability: [] };
            }
            capDefs.forEach(def => {
                const capAssignments = node.capabilities.capability.filter(capAssignment => capAssignment.name === def.name);
                let cap;

                if (capAssignments.length > 0) {
                    cap = capAssignments[0];
                } else {
                    cap = CapabilityModel.fromCapabilityDefinitionModel(def);
                    node.capabilities.capability.push(cap);
                }

                cap.id = `${node.id}_${cap.name}`;
            });

            if (node.requirements && node.requirements.requirement) {
                node.requirements.requirement.forEach(req => req.id = `${node.id}_${req.name}`);
            }
        }

        return new TNodeTemplate(
            properties ? properties : {},
            node.id,
            node.type,
            node.name,
            node.minInstances,
            node.maxInstances,
            nodeVisualsObject,
            node.documentation ? node.documentation : [],
            node.any ? node.any : [],
            otherAttributes,
            node.x,
            node.y,
            node.capabilities ? node.capabilities : {},
            node.requirements ? node.requirements : {},
            node.deploymentArtifacts ? node.deploymentArtifacts : {},
            node.policies ? node.policies : {},
            state
        );
    }

    static getCapabilityDefinitionsOfNodeType(nodeType: string, entityTypes: EntityTypesModel): CapabilityDefinitionModel[] {
        const allNodeTypes = [];
        entityTypes.groupedNodeTypes.forEach(group => group.children.forEach(nt => allNodeTypes.push(nt)));
        const match = allNodeTypes
            .filter(nt => nt.id === nodeType)
            .filter(nt =>
                nt.full &&
                nt.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation &&
                nt.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation.length > 0 &&
                nt.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions &&
                nt.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions.capabilityDefinition &&
                nt.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions.capabilityDefinition.length > 0
            );

        if (match && match.length > 0) {
            return match[0].full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].capabilityDefinitions.capabilityDefinition;
        }

        return [];
    }

    static createTRelationshipTemplateFromObject(relationship: TRelationshipTemplate, state?: DifferenceStates) {
        return new TRelationshipTemplate(
            relationship.sourceElement,
            relationship.targetElement,
            relationship.name,
            relationship.id,
            relationship.type,
            relationship.properties,
            relationship.documentation,
            relationship.any,
            relationship.otherAttributes,
            state,
            relationship.policies
        );
    }

    static getNodeVisualsForNodeTemplate(nodeType: string, nodeVisuals: Visuals[], state?: DifferenceStates): Visuals {
        for (const visual of nodeVisuals) {
            const qName = new QName(visual.typeId);
            const localName = qName.localName;
            if (localName === new QName(nodeType).localName) {
                const color = !state ? visual.color : VersionUtils.getElementColorByDiffState(state);
                return <Visuals>{
                    color: color,
                    typeId: nodeType,
                    imageUrl: visual.imageUrl,
                    pattern: visual.pattern
                };
            }
        }
    }

    static initNodeTemplates(nodeTemplateArray: Array<TNodeTemplate>, nodeVisuals: Visuals[], isYaml: boolean, types: EntityTypesModel,
                             topologyDifferences?: [ToscaDiff, TTopologyTemplate]): Array<TNodeTemplate> {
        const nodeTemplates: TNodeTemplate[] = [];
        if (nodeTemplateArray.length > 0) {
            nodeTemplateArray.forEach((node, index) => {
                const offset = 10 * index;
                if (!node.x || !node.y) {
                    node.x = this.HORIZONTAL_OFFSET_FOR_NODES_WITHOUT_COORDINATES + offset;
                    node.y = this.VERTICAL_OFFSET_FOR_NODES_WITHOUT_COORDINATES + offset;
                }
                const state = topologyDifferences ? DifferenceStates.UNCHANGED : null;
                nodeTemplates.push(
                    TopologyTemplateUtil.createTNodeTemplateFromObject(node, nodeVisuals, isYaml, types, state)
                );
            });
        }

        return nodeTemplates;
    }

    /**
     * Generates default properties from node types or relationshipTypes
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
                    if (this.hasParentType(element)) {
                        let parent = element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom.typeRef;
                        let continueFlag;

                        while (parent) {
                            continueFlag = false;
                            for (const parentElement of entities) {
                                if (parentElement.qName === parent) {
                                    if (this.hasKVPropDefinition(parentElement)) {
                                        inheritedProperties = {
                                            ...inheritedProperties, ...TopologyTemplateUtil.setKVProperties(parentElement)
                                        };
                                    }
                                    if (this.hasParentType(parentElement)) {
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
                    if (this.hasKVPropDefinition(element)) {
                        typeProperties = TopologyTemplateUtil.setKVProperties(element);
                    }

                    const mergedProperties = { ...inheritedProperties, ...typeProperties };

                    return {
                        kvproperties: { ...mergedProperties }
                    };
                }
            }
        }
    }

    static hasKVPropDefinition(element: EntityType): boolean {
        return (element && element.full &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any.length > 0 &&
            element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].any[0].propertyDefinitionKVList
        );
    }

    static hasParentType(element: EntityType): boolean {
        return (element && element.full
            && element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0]
            && element.full.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0].derivedFrom
        );
    }

    /**
     * This function sets KV properties
     * @param any type: the element type, e.g. capabilityType, requirementType etc.
     * @returns newKVProperties: KV Properties as Object
     */
    static setKVProperties(type: any): any {
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

    static initRelationTemplates(relationshipTemplateArray: Array<TRelationshipTemplate>,
                                 topologyDifferences?: [ToscaDiff, TTopologyTemplate]): Array<TRelationshipTemplate> {
        const relationshipTemplates: TRelationshipTemplate[] = [];
        if (relationshipTemplateArray.length > 0) {
            relationshipTemplateArray.forEach(relationship => {
                const state = topologyDifferences ? DifferenceStates.UNCHANGED : null;
                relationshipTemplates.push(
                    TopologyTemplateUtil.createTRelationshipTemplateFromObject(relationship, state)
                );
            });
        }

        return relationshipTemplates;
    }

    static updateTopologyTemplate(ngRedux: NgRedux<IWineryState>, wineryActions: WineryActions, topology: TTopologyTemplate, isYaml: boolean) {
        const wineryState = ngRedux.getState().wineryState;

        // Required because if the palette is open, the last node inserted will be bound to the mouse movement.
        ngRedux.dispatch(wineryActions.sendPaletteOpened(false));

        wineryState.currentJsonTopology.nodeTemplates
            .forEach(
                node => ngRedux.dispatch(wineryActions.deleteNodeTemplate(node.id))
            );
        wineryState.currentJsonTopology.relationshipTemplates
            .forEach(
                relationship => ngRedux.dispatch(wineryActions.deleteRelationshipTemplate(relationship.id))
            );

        TopologyTemplateUtil.initNodeTemplates(topology.nodeTemplates, wineryState.nodeVisuals, isYaml, null)
            .forEach(
                node => ngRedux.dispatch(wineryActions.saveNodeTemplate(node))
            );
        TopologyTemplateUtil.initRelationTemplates(topology.relationshipTemplates)
            .forEach(
                relationship => ngRedux.dispatch(wineryActions.saveRelationship(relationship))
            );
    }
}
