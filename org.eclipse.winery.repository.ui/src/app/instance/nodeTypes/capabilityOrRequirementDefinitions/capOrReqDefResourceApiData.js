"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Philipp Meyer, Tino Stadelmaier - initial API and implementation
 */
var CapabilityOrRequirementDefinition = (function () {
    function CapabilityOrRequirementDefinition() {
        this.name = null;
        this.capabilityType = null;
        this.requirementType = null;
        this.lowerBound = null;
        this.upperBound = null;
        this.constraints = null;
        this.documentation = [];
        this.any = [];
        this.otherAttributes = null;
    }
    return CapabilityOrRequirementDefinition;
}());
exports.CapabilityOrRequirementDefinition = CapabilityOrRequirementDefinition;
var CapOrReqDefinition = (function () {
    function CapOrReqDefinition() {
        this.name = null;
        this.type = null;
        this.lowerBound = null;
        this.upperBound = null;
    }
    return CapOrReqDefinition;
}());
exports.CapOrReqDefinition = CapOrReqDefinition;
var Constraint = (function () {
    function Constraint() {
        this.any = null;
        this.constraintType = null;
        this.id = null;
    }
    return Constraint;
}());
exports.Constraint = Constraint;
var Constraints = (function () {
    function Constraints() {
        this.constraint = [];
    }
    return Constraints;
}());
exports.Constraints = Constraints;
var CapabilityDefinitionPostData = (function () {
    function CapabilityDefinitionPostData() {
        this.name = null;
        this.capabilityType = null;
        this.lowerBound = null;
        this.upperBound = null;
        this.constraints = {};
    }
    return CapabilityDefinitionPostData;
}());
exports.CapabilityDefinitionPostData = CapabilityDefinitionPostData;
var CapOrRegDefinitionsResourceApiData = (function () {
    function CapOrRegDefinitionsResourceApiData() {
    }
    return CapOrRegDefinitionsResourceApiData;
}());
exports.CapOrRegDefinitionsResourceApiData = CapOrRegDefinitionsResourceApiData;
//# sourceMappingURL=capOrReqDefResourceApiData.js.map