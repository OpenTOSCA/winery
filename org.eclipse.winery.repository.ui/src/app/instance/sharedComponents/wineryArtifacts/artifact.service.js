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
var router_1 = require("@angular/router");
var configuration_1 = require("../../../configuration");
var WineryArtifactService = (function () {
    function WineryArtifactService(http, route) {
        this.http = http;
        this.route = route;
    }
    WineryArtifactService.prototype.getAllArtifacts = function () {
        return this.sendJsonRequest(this.route.url);
    };
    /**
     * Deletes an artifact
     *
     * @returns {Observable<Response>}
     */
    WineryArtifactService.prototype.deleteArtifact = function (artifactName) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(configuration_1.backendBaseURL + this.route.url + '/' + artifactName + '/', options);
    };
    WineryArtifactService.prototype.createNewArtifact = function (artifact) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(configuration_1.backendBaseURL + this.route.url + '/', artifact, options);
    };
    WineryArtifactService.prototype.getInterfacesOfAssociatedType = function () {
        return this.sendJsonRequest(this.route.url + '/interfaces/');
    };
    WineryArtifactService.prototype.getAllArtifactTypes = function () {
        return this.sendJsonRequest('/artifacttypes');
    };
    WineryArtifactService.prototype.getAllArtifactTemplates = function () {
        return this.sendJsonRequest('/artifacttemplates');
    };
    /**
     * Private method for DRY principle. It is used to get all kinds of data
     * for the specified sub path.
     *
     * @param requestPath string The path which is specific for each request.
     * @returns {Observable<any>}
     */
    WineryArtifactService.prototype.sendJsonRequest = function (requestPath) {
        if (requestPath === void 0) { requestPath = ''; }
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + requestPath, options)
            .map(function (res) { return res.json(); });
    };
    return WineryArtifactService;
}());
WineryArtifactService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], WineryArtifactService);
exports.WineryArtifactService = WineryArtifactService;
//# sourceMappingURL=artifact.service.js.map