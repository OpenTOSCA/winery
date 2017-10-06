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
var rxjs_1 = require("rxjs");
var instance_service_1 = require("../../instance.service");
var configuration_1 = require("../../../configuration");
var util_1 = require("util");
var utils_1 = require("../../../wineryUtils/utils");
var InterfacesService = (function () {
    function InterfacesService(http, route, sharedData) {
        this.http = http;
        this.route = route;
        this.sharedData = sharedData;
        this.path = configuration_1.backendBaseURL + this.route.url + '/';
        this.setImplementationsUrl();
    }
    InterfacesService.prototype.getInterfaces = function (url, relationshipInterfaces) {
        if (relationshipInterfaces === void 0) { relationshipInterfaces = false; }
        if (util_1.isNullOrUndefined(url)) {
            return this.get(this.path + '/?noId=true')
                .map(function (res) { return res.json(); });
        }
        else if (relationshipInterfaces) {
            return this.getRelationshipInterfaces(url);
        }
        else {
            return this.get(url + '/interfaces/')
                .map(function (res) { return res.json(); });
        }
    };
    InterfacesService.prototype.save = function (interfacesData) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.path, JSON.stringify(interfacesData), options);
    };
    InterfacesService.prototype.createImplementation = function (implementationName, implementationNamespace) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.setImplementationsUrl();
        return this.http.post(configuration_1.backendBaseURL + '/' + this.implementationsUrl, JSON.stringify({
            localname: implementationName,
            namespace: implementationNamespace,
            type: '{' + this.sharedData.toscaComponent.namespace + '}' + this.sharedData.toscaComponent.localName
        }), options);
    };
    InterfacesService.prototype.createArtifactTemplate = function (implementationName, implementationNamespace, generateArtifactApiData) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.setImplementationsUrl();
        return this.http.post(configuration_1.backendBaseURL + '/' + this.implementationsUrl
            + encodeURIComponent(encodeURIComponent(implementationNamespace)) + '/'
            + implementationName + '/implementationartifacts/', JSON.stringify(generateArtifactApiData), options);
    };
    InterfacesService.prototype.getRelationshipInterfaces = function (url) {
        return rxjs_1.Observable
            .forkJoin(this.get(configuration_1.backendBaseURL + url + '/targetinterfaces/').map(function (res) { return res.json(); }), this.get(configuration_1.backendBaseURL + url + '/sourceinterfaces/').map(function (res) { return res.json(); })).map(function (res) {
            for (var _i = 0, _a = res[1]; _i < _a.length; _i++) {
                var i = _a[_i];
                res[0].push(i);
            }
            return res[0];
        });
    };
    InterfacesService.prototype.get = function (url) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(url, options);
    };
    /**
     * Because <code>this.sharedData.toscaComponent</code> can be null on initialisation, we need to get the URL
     * shortly before we use it again.
     */
    InterfacesService.prototype.setImplementationsUrl = function () {
        if (util_1.isNullOrUndefined(this.implementationsUrl) && !util_1.isNullOrUndefined(this.sharedData.toscaComponent)) {
            this.implementationsUrl = utils_1.Utils.getImplementationOrTemplateOfType(this.sharedData.toscaComponent.toscaType) + '/';
        }
    };
    return InterfacesService;
}());
InterfacesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router, instance_service_1.InstanceService])
], InterfacesService);
exports.InterfacesService = InterfacesService;
//# sourceMappingURL=interfaces.service.js.map