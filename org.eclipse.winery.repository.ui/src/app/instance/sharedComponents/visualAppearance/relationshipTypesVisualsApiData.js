/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Lukas Balzer - initial API and implementation
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelationshipTypesVisualsApiData = (function () {
    function RelationshipTypesVisualsApiData(data, create) {
        this.sourceArrowHead = data.sourceArrowHead;
        this.targetArrowHead = data.targetArrowHead;
        this.dash = data.dash;
        this.color = data.color;
        this.hoverColor = data.hoverColor;
        if (create) {
            this.boolData = new DataInfo();
        }
    }
    return RelationshipTypesVisualsApiData;
}());
exports.RelationshipTypesVisualsApiData = RelationshipTypesVisualsApiData;
var DataInfo = (function () {
    function DataInfo() {
        this.sourceArrowHeadSelected = false;
        this.targetArrowHeadSelected = false;
        this.dashSelected = false;
    }
    return DataInfo;
}());
exports.DataInfo = DataInfo;
//# sourceMappingURL=relationshipTypesVisualsApiData.js.map