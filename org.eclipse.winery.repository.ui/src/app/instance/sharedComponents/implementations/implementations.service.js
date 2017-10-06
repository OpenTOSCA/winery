/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 whichääboth accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Nicole Keppler, Lukas Balzer - initial API and Implementation
 *
 */
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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var configuration_1 = require("../../../configuration");
var ImplementationService = (function () {
    function ImplementationService(http, route) {
        this.http = http;
        this.route = route;
        if (this.route.url.includes('/relationshiptypes/')) {
            this.implementationType = '/relationshiptypeimplementations/';
        }
        else {
            this.implementationType = '/nodetypeimplementations/';
        }
    }
    ImplementationService.prototype.getImplementationData = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.route.url + '/', options)
            .map(function (res) { return res.json(); });
    };
    ImplementationService.prototype.getAllNamespaces = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + '/admin/namespaces', options)
            .map(function (res) { return res.json(); });
    };
    ImplementationService.prototype.postImplementation = function (implApiData) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(configuration_1.backendBaseURL + this.implementationType, JSON.stringify(implApiData), options);
    };
    ImplementationService.prototype.deleteImplementations = function (implToDelete) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var pathAddition = this.implementationType
            + encodeURIComponent(encodeURIComponent(implToDelete.namespace)) + '/'
            + implToDelete.localname + '/';
        return this.http.delete(configuration_1.backendBaseURL + pathAddition, options);
    };
    return ImplementationService;
}());
ImplementationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], ImplementationService);
exports.ImplementationService = ImplementationService;
//# sourceMappingURL=implementations.service.js.map