/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Lukas Harzenetter, Niko Stadelmaier - initial API and implementation
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PropertiesDefinitionEnum;
(function (PropertiesDefinitionEnum) {
    PropertiesDefinitionEnum[PropertiesDefinitionEnum["Custom"] = 'Custom'] = "Custom";
    PropertiesDefinitionEnum[PropertiesDefinitionEnum["Element"] = 'Element'] = "Element";
    PropertiesDefinitionEnum[PropertiesDefinitionEnum["Type"] = 'Type'] = "Type";
    PropertiesDefinitionEnum[PropertiesDefinitionEnum["None"] = 'None'] = "None";
})(PropertiesDefinitionEnum = exports.PropertiesDefinitionEnum || (exports.PropertiesDefinitionEnum = {}));
var PropertiesDefinitionKVElement = (function () {
    function PropertiesDefinitionKVElement() {
        this.key = null;
        this.type = null;
    }
    return PropertiesDefinitionKVElement;
}());
exports.PropertiesDefinitionKVElement = PropertiesDefinitionKVElement;
var PropertiesDefinition = (function () {
    function PropertiesDefinition() {
        this.element = null;
        this.type = null;
    }
    return PropertiesDefinition;
}());
exports.PropertiesDefinition = PropertiesDefinition;
var WinerysPropertiesDefinition = (function () {
    function WinerysPropertiesDefinition() {
        this.namespace = null;
        this.elementName = null;
        this.propertyDefinitionKVList = [];
        this.isDerivedFromXSD = false;
    }
    return WinerysPropertiesDefinition;
}());
exports.WinerysPropertiesDefinition = WinerysPropertiesDefinition;
//# sourceMappingURL=propertiesDefinitionsResourceApiData.js.map