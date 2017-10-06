"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
var enums_1 = require("../wineryInterfaces/enums");
var Utils = (function () {
    function Utils() {
    }
    /**
     * Generates a random alphanumeric string of the given length.
     *
     * @param length The length of the generated string. Defaults to 64.
     * @returns A random, alphanumeric string.
     */
    Utils.generateRandomString = function (length) {
        if (length === void 0) { length = 64; }
        var elements = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var state = '';
        for (var iterator = 0; iterator < length; iterator++) {
            state += elements.charAt(Math.floor(Math.random() * elements.length));
        }
        return state;
    };
    Utils.getToscaTypeFromString = function (value) {
        switch (value) {
            case enums_1.ToscaTypes.ServiceTemplate:
                return enums_1.ToscaTypes.ServiceTemplate;
            case enums_1.ToscaTypes.NodeType:
                return enums_1.ToscaTypes.NodeType;
            case enums_1.ToscaTypes.RelationshipType:
                return enums_1.ToscaTypes.RelationshipType;
            case enums_1.ToscaTypes.ArtifactType:
                return enums_1.ToscaTypes.ArtifactType;
            case enums_1.ToscaTypes.ArtifactTemplate:
                return enums_1.ToscaTypes.ArtifactTemplate;
            case enums_1.ToscaTypes.RequirementType:
                return enums_1.ToscaTypes.RequirementType;
            case enums_1.ToscaTypes.CapabilityType:
                return enums_1.ToscaTypes.CapabilityType;
            case enums_1.ToscaTypes.NodeTypeImplementation:
                return enums_1.ToscaTypes.NodeTypeImplementation;
            case enums_1.ToscaTypes.RelationshipTypeImplementation:
                return enums_1.ToscaTypes.RelationshipTypeImplementation;
            case enums_1.ToscaTypes.PolicyType:
                return enums_1.ToscaTypes.PolicyType;
            case enums_1.ToscaTypes.PolicyTemplate:
                return enums_1.ToscaTypes.PolicyTemplate;
            case enums_1.ToscaTypes.Imports:
                return enums_1.ToscaTypes.Imports;
            default:
                return enums_1.ToscaTypes.Admin;
        }
    };
    Utils.getToscaTypeNameFromToscaType = function (value, plural) {
        if (plural === void 0) { plural = false; }
        var type;
        switch (value) {
            case enums_1.ToscaTypes.ServiceTemplate:
                type = 'Service Template';
                break;
            case enums_1.ToscaTypes.NodeType:
                type = 'Node Type';
                break;
            case enums_1.ToscaTypes.RelationshipType:
                type = 'Relationship Type';
                break;
            case enums_1.ToscaTypes.ArtifactType:
                type = 'Artifact Type';
                break;
            case enums_1.ToscaTypes.ArtifactTemplate:
                type = 'Artifact Template';
                break;
            case enums_1.ToscaTypes.RequirementType:
                type = 'Requirement Type';
                break;
            case enums_1.ToscaTypes.CapabilityType:
                type = 'Capability Type';
                break;
            case enums_1.ToscaTypes.NodeTypeImplementation:
                type = 'Node Type Implementation';
                break;
            case enums_1.ToscaTypes.RelationshipTypeImplementation:
                type = 'Relationship Type Implementation';
                break;
            case enums_1.ToscaTypes.PolicyType:
                type = 'Policy Type';
                break;
            case enums_1.ToscaTypes.PolicyTemplate:
                type = 'Policy Template';
                break;
            case enums_1.ToscaTypes.Imports:
                type = 'XSD Import';
                break;
            default:
                type = 'Admin';
        }
        if (value !== enums_1.ToscaTypes.Admin && plural) {
            type += 's';
        }
        return type;
    };
    Utils.getTypeOfTemplateOrImplementation = function (value) {
        switch (value) {
            case enums_1.ToscaTypes.ArtifactTemplate:
                return enums_1.ToscaTypes.ArtifactType;
            case enums_1.ToscaTypes.NodeTypeImplementation:
                return enums_1.ToscaTypes.NodeType;
            case enums_1.ToscaTypes.RelationshipTypeImplementation:
                return enums_1.ToscaTypes.RelationshipType;
            case enums_1.ToscaTypes.PolicyTemplate:
                return enums_1.ToscaTypes.PolicyType;
            default:
                return null;
        }
    };
    Utils.getImplementationOrTemplateOfType = function (value) {
        switch (value) {
            case enums_1.ToscaTypes.NodeType:
                return enums_1.ToscaTypes.NodeTypeImplementation;
            case enums_1.ToscaTypes.RelationshipType:
                return enums_1.ToscaTypes.RelationshipTypeImplementation;
            case enums_1.ToscaTypes.PolicyType:
                return enums_1.ToscaTypes.PolicyTemplate;
            case enums_1.ToscaTypes.ArtifactType:
                return enums_1.ToscaTypes.ArtifactTemplate;
            default:
                return null;
        }
    };
    Utils.getNameFromQname = function (qName) {
        return qName.split('}').pop();
    };
    Utils.getNamespaceAndLocalNameFromQName = function (qname) {
        var i = qname.indexOf('}');
        var res = {
            namespace: qname.substr(1, i - 1),
            localname: qname.substr(i + 1)
        };
        return res;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map