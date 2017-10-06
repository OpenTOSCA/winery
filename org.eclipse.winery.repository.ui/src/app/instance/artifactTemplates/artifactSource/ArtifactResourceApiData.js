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
var ArtifactResourceApiData = (function () {
    function ArtifactResourceApiData() {
        this.fileName = '';
        this.content = '';
    }
    ArtifactResourceApiData.prototype.getFileName = function () {
        return this.fileName;
    };
    ArtifactResourceApiData.prototype.getContent = function () {
        return this.content;
    };
    ArtifactResourceApiData.prototype.setFileName = function (fileName) {
        this.fileName = fileName;
    };
    ArtifactResourceApiData.prototype.setContent = function (content) {
        this.content = content;
    };
    return ArtifactResourceApiData;
}());
exports.ArtifactResourceApiData = ArtifactResourceApiData;
//# sourceMappingURL=ArtifactResourceApiData.js.map