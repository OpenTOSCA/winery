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
var util_1 = require("util");
var configuration_1 = require("../configuration");
var ToscaComponent = (function () {
    function ToscaComponent(toscaType, namespace, localName, xsdSchemaType) {
        if (xsdSchemaType === void 0) { xsdSchemaType = null; }
        this.toscaType = toscaType;
        this.namespace = namespace;
        this.localName = localName;
        this.xsdSchemaType = xsdSchemaType;
        this.path = '/' + this.toscaType;
        if (!util_1.isNullOrUndefined(this.namespace)) {
            this.path += '/' + encodeURIComponent(encodeURIComponent(this.namespace));
            if (!util_1.isNullOrUndefined(this.localName)) {
                this.path += '/' + this.localName;
                this.xmlPath = configuration_1.backendBaseURL + this.path;
                this.csarPath = this.xmlPath + '/?csar';
            }
        }
    }
    return ToscaComponent;
}());
exports.ToscaComponent = ToscaComponent;
//# sourceMappingURL=toscaComponent.js.map