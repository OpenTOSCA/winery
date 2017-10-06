"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
 *     Lukas Harzenetter - initial API and implementation
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ng2_file_upload_1 = require("ng2-file-upload");
require("rxjs/add/operator/map");
var util_1 = require("util");
var configuration_1 = require("../configuration");
var SectionService = (function () {
    function SectionService(http) {
        this.http = http;
        this.fileUploader = new ng2_file_upload_1.FileUploader({ url: configuration_1.backendBaseURL + '/' });
    }
    Object.defineProperty(SectionService.prototype, "uploader", {
        get: function () {
            return this.fileUploader;
        },
        enumerable: true,
        configurable: true
    });
    SectionService.prototype.getSectionData = function (resourceType) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        if (util_1.isNullOrUndefined(resourceType)) {
            resourceType = this.path;
        }
        return this.http.get(configuration_1.backendBaseURL + resourceType + '/', options)
            .map(function (res) { return res.json(); });
    };
    SectionService.prototype.createComponent = function (newComponentName, newComponentNamespace, newComponentSelectedType) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var saveObject;
        if (!util_1.isNullOrUndefined(newComponentSelectedType)) {
            saveObject = { localname: newComponentName, namespace: newComponentNamespace, type: newComponentSelectedType };
        }
        else {
            saveObject = { localname: newComponentName, namespace: newComponentNamespace };
        }
        return this.http.post(configuration_1.backendBaseURL + this.path + '/', JSON.stringify(saveObject), options);
    };
    SectionService.prototype.setPath = function (path) {
        this.path = '/' + path;
    };
    return SectionService;
}());
SectionService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], SectionService);
exports.SectionService = SectionService;
//# sourceMappingURL=section.service.js.map