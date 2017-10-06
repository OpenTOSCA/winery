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
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var instance_service_1 = require("../../instance.service");
var configuration_1 = require("../../../configuration");
var ArtifactSourceService = (function () {
    function ArtifactSourceService(http, sharedData) {
        this.http = http;
        this.sharedData = sharedData;
        this.path = configuration_1.backendBaseURL + this.sharedData.path + '/source/';
        this.pathToFiles = configuration_1.backendBaseURL + this.sharedData.path + '/files/';
    }
    ArtifactSourceService.prototype.getFiles = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(this.path, options)
            .map(function (res) { return res.json(); });
    };
    ArtifactSourceService.prototype.getFile = function (file) {
        var headers = new http_1.Headers({ 'Accept': 'text/plain' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(this.path + file.name, options)
            .map(function (res) { return res.text(); });
    };
    Object.defineProperty(ArtifactSourceService.prototype, "uploadUrl", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    ArtifactSourceService.prototype.deleteFile = function (fileToRemove) {
        return this.http.delete(configuration_1.hostURL + fileToRemove.deleteUrl);
    };
    ArtifactSourceService.prototype.postToSources = function (data) {
        var headers = new http_1.Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.path + data.getFileName(), data, options)
            .map(function (res) { return res.json(); });
    };
    ArtifactSourceService.prototype.postToFiles = function (data) {
        var headers = new http_1.Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.pathToFiles + data.getFileName(), data, options)
            .map(function (res) { return res.json(); });
    };
    return ArtifactSourceService;
}());
ArtifactSourceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        instance_service_1.InstanceService])
], ArtifactSourceService);
exports.ArtifactSourceService = ArtifactSourceService;
var FilesApiData = (function () {
    function FilesApiData() {
    }
    return FilesApiData;
}());
exports.FilesApiData = FilesApiData;
//# sourceMappingURL=artifactSource.service.js.map