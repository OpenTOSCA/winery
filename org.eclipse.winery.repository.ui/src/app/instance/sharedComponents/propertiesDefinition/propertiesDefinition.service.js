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
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var configuration_1 = require("../../../configuration");
var PropertiesDefinitionService = (function () {
    function PropertiesDefinitionService(http, route) {
        this.http = http;
        this.route = route;
    }
    /**
     * Deletes all the properties definitions.
     *
     * @returns {Observable<Response>}
     */
    PropertiesDefinitionService.prototype.deletePropertiesDefinitions = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(configuration_1.backendBaseURL + this.route.url + '/', options);
    };
    /**
     * Gets the properties definitions data.
     *
     * @returns {Observable<PropertiesDefinitionsResourceApiData>}
     */
    PropertiesDefinitionService.prototype.getPropertiesDefinitionsData = function () {
        return this.sendJsonRequest('/');
    };
    /**
     * Gets the items for the select box for the XML Element.
     */
    PropertiesDefinitionService.prototype.getXsdElementDefinitions = function () {
        return this.sendJsonRequest('/element');
    };
    /**
     * Gets the items for the select box for the XML Type.
     */
    PropertiesDefinitionService.prototype.getXsdTypeDefinitions = function () {
        return this.sendJsonRequest('/type');
    };
    PropertiesDefinitionService.prototype.postPropertiesDefinitions = function (resourceApiData) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(configuration_1.backendBaseURL + this.route.url + '/', JSON.stringify(resourceApiData), options);
    };
    /**
     * Private method for DRY principle. It is used to get all kinds of data
     * for the specified sub path.
     *
     * @param requestPath string The path which is specific for each request.
     * @returns {Observable<any>}
     */
    PropertiesDefinitionService.prototype.sendJsonRequest = function (requestPath) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.route.url + requestPath, options)
            .map(function (res) { return res.json(); });
    };
    return PropertiesDefinitionService;
}());
PropertiesDefinitionService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], PropertiesDefinitionService);
exports.PropertiesDefinitionService = PropertiesDefinitionService;
//# sourceMappingURL=propertiesDefinition.service.js.map