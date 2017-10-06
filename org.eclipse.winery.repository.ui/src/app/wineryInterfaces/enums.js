/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var YesNoEnum;
(function (YesNoEnum) {
    YesNoEnum[YesNoEnum["YES"] = 'YES'] = "YES";
    YesNoEnum[YesNoEnum["NO"] = 'NO'] = "NO";
})(YesNoEnum = exports.YesNoEnum || (exports.YesNoEnum = {}));
/**
 * ToscaTypes represent the main types found in TOSCA. All of them are components reachable via
 * a main route. Additionally, <code>Admin</code> has been added because it is also a main route.
 *
 * If you add a new TOSCA Type, you also need to adjust the utils.ts file.
 * Default is assumed ToscaTypes.Admin.
 */
var ToscaTypes;
(function (ToscaTypes) {
    ToscaTypes[ToscaTypes["ServiceTemplate"] = 'servicetemplates'] = "ServiceTemplate";
    ToscaTypes[ToscaTypes["NodeType"] = 'nodetypes'] = "NodeType";
    ToscaTypes[ToscaTypes["RelationshipType"] = 'relationshiptypes'] = "RelationshipType";
    ToscaTypes[ToscaTypes["ArtifactType"] = 'artifacttypes'] = "ArtifactType";
    ToscaTypes[ToscaTypes["ArtifactTemplate"] = 'artifacttemplates'] = "ArtifactTemplate";
    ToscaTypes[ToscaTypes["RequirementType"] = 'requirementtypes'] = "RequirementType";
    ToscaTypes[ToscaTypes["CapabilityType"] = 'capabilitytypes'] = "CapabilityType";
    ToscaTypes[ToscaTypes["NodeTypeImplementation"] = 'nodetypeimplementations'] = "NodeTypeImplementation";
    ToscaTypes[ToscaTypes["RelationshipTypeImplementation"] = 'relationshiptypeimplementations'] = "RelationshipTypeImplementation";
    ToscaTypes[ToscaTypes["PolicyType"] = 'policytypes'] = "PolicyType";
    ToscaTypes[ToscaTypes["PolicyTemplate"] = 'policytemplates'] = "PolicyTemplate";
    ToscaTypes[ToscaTypes["Imports"] = 'imports'] = "Imports";
    ToscaTypes[ToscaTypes["Admin"] = 'admin'] = "Admin";
})(ToscaTypes = exports.ToscaTypes || (exports.ToscaTypes = {}));
//# sourceMappingURL=enums.js.map