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
 * Copyright (c) -2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Nicole Keppler - initial API and implementation
 */
var http_1 = require("@angular/http");
var instance_service_1 = require("../../instance.service");
var core_1 = require("@angular/core");
var configuration_1 = require("../../../configuration");
var util_1 = require("util");
var ValidService = (function () {
    function ValidService(http, sharedData) {
        this.http = http;
        this.sharedData = sharedData;
        this.path = configuration_1.backendBaseURL + this.sharedData.path + '/validsourcesandtargets/';
    }
    ValidService.prototype.getValidEndingsData = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(this.path, options)
            .map(function (res) { return res.json(); });
    };
    ValidService.prototype.getSelectorData = function (resourceType) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        if (util_1.isNullOrUndefined(resourceType)) {
            resourceType = this.path;
        }
        return this.http.get(configuration_1.backendBaseURL + resourceType + '/', options)
            .map(function (res) { return res.json(); });
    };
    ValidService.prototype.saveValidEndings = function (validEndingsData) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(this.path, JSON.stringify(validEndingsData), options);
    };
    return ValidService;
}());
ValidService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        instance_service_1.InstanceService])
], ValidService);
exports.ValidService = ValidService;
//# sourceMappingURL=validSourcesAndTargets.service.js.map