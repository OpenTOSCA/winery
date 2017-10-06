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
var CapabilityOrRequirementDefinitionsService = (function () {
    function CapabilityOrRequirementDefinitionsService(http, route) {
        this.http = http;
        this.route = route;
        this.path = this.route.url;
    }
    /**
     * Gets the capability or requirements definitions data.
     *
     * @returns {Observable<CapabilityOrRequirementDefinition[]>} data
     */
    CapabilityOrRequirementDefinitionsService.prototype.getCapOrReqDefinitionsData = function () {
        return this.sendJsonRequest(this.path);
    };
    /**
     * Gets all available capability types
     * @returns {Observable<NameAndQNameApiData>}
     */
    CapabilityOrRequirementDefinitionsService.prototype.getAllCapOrReqTypes = function (types) {
        return this.sendJsonRequest('/' + types);
    };
    /**
     * Sends a GET request to get list of all constraint types
     * @returns {Observable<TypeWithShortName[]>} list of constraint types
     */
    CapabilityOrRequirementDefinitionsService.prototype.getConstraintTypes = function () {
        return this.sendJsonRequest('/admin/constrainttypes/');
    };
    ;
    /**
     * Sends a GET request to get a list of all constraints from one capability definition
     * @param capabilityDefinition of which the constraints list is to be obtained
     * @returns {Observable<Constraint[]>} list of constraints
     */
    CapabilityOrRequirementDefinitionsService.prototype.getConstraints = function (capabilityDefinition) {
        return this.sendJsonRequest(this.path + '/' + capabilityDefinition + '/constraints/');
    };
    /**
     * Sends a PUT request to update constraints data
     * @param capabilityDefinition which has the constraint
     * @param id of the constraint
     * @param data to be updated
     * @returns {Observable<string>} new id of the modified constraint
     */
    CapabilityOrRequirementDefinitionsService.prototype.updateConstraint = function (capabilityDefinition, id, data) {
        var headers = new http_1.Headers({ 'Content-Type': 'text/xml' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(configuration_1.backendBaseURL + this.path + '/' + capabilityDefinition
            + '/constraints/' + id + '/', data, options).map(function (res) { return res.text(); });
    };
    /**
     * Sends a POST request to create new constraint
     * @param capabilityDefinition which contains the new constraint
     * @param constraintData of the new constraint
     * @returns {Observable<string>} provides id of the newly created constraint
     */
    CapabilityOrRequirementDefinitionsService.prototype.createConstraint = function (capabilityDefinition, constraintData) {
        var headers = new http_1.Headers({ 'Accept': 'text/plain', 'Content-Type': 'text/xml' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(configuration_1.backendBaseURL + this.path + '/' + capabilityDefinition
            + '/constraints/', constraintData, options).map(function (res) { return res.text(); });
    };
    /**
     * Sends a DELETE request to delete a constraint
     * @param capabilityDefinition containing the constraint
     * @param id of the constraint, which is to be deleted
     * @returns {Observable<Response>}
     */
    CapabilityOrRequirementDefinitionsService.prototype.deleteConstraint = function (capabilityDefinition, id) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(configuration_1.backendBaseURL + this.path + '/' + capabilityDefinition + '/constraints/' + id + '/', options);
    };
    /**
     * Sends a POST request to add new CapabilityDefinition
     * @param capDef the CapabilityDefinition to be added
     * @returns {Observable<Response>}
     */
    CapabilityOrRequirementDefinitionsService.prototype.sendPostRequest = function (capDef) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(configuration_1.backendBaseURL + this.path + '/', capDef, options);
    };
    /**
     * Deletes a capabilityDefinition.
     *
     * @returns {Observable<Response>}
     */
    CapabilityOrRequirementDefinitionsService.prototype.deleteCapOrReqDef = function (id) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(configuration_1.backendBaseURL + this.path + '/' + id + '/', options);
    };
    /**
     * Private method for DRY principle. It is used to get all kinds of data
     * for the specified sub path.
     *
     * @param requestPath string The path which is specific for each request.
     * @returns {Observable<any>}
     */
    CapabilityOrRequirementDefinitionsService.prototype.sendJsonRequest = function (requestPath) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + requestPath, options)
            .map(function (res) { return res.json(); });
    };
    return CapabilityOrRequirementDefinitionsService;
}());
CapabilityOrRequirementDefinitionsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], CapabilityOrRequirementDefinitionsService);
exports.CapabilityOrRequirementDefinitionsService = CapabilityOrRequirementDefinitionsService;
//# sourceMappingURL=capOrReqDef.service.js.map