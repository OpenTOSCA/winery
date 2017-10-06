/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Niko Stadelmaier - initial API and implementation
 *     Lukas Balzer - corrected image upload of SelfServicePortal
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
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var configuration_1 = require("../../../configuration");
var SelfServicePortalService = (function () {
    function SelfServicePortalService(http, route) {
        this.http = http;
        this.route = route;
        var path = this.route.url;
        path = path.substring(0, path.lastIndexOf('/'));
        this.url = decodeURIComponent(path);
    }
    SelfServicePortalService.prototype.getIconPath = function () {
        return configuration_1.backendBaseURL + this.url + '/icon.jpg';
    };
    SelfServicePortalService.prototype.getImagePath = function () {
        return configuration_1.backendBaseURL + this.url + '/image.jpg';
    };
    SelfServicePortalService.prototype.getSelfServiceData = function () {
        var _this = this;
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.path, options)
            .map(function (res) { return _this.selfServiceData = res.json(); });
    };
    SelfServicePortalService.prototype.saveName = function (displayName) {
        return this.saveSingleProperty({ 'displayName': displayName }, this.path + 'displayname');
    };
    SelfServicePortalService.prototype.saveDescription = function (description) {
        return this.saveSingleProperty({ 'description': description }, this.path + 'description');
    };
    SelfServicePortalService.prototype.saveSingleProperty = function (property, path) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(configuration_1.backendBaseURL + path, JSON.stringify(property), options);
    };
    SelfServicePortalService.prototype.setPath = function (path) {
        this.path = path;
    };
    return SelfServicePortalService;
}());
SelfServicePortalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], SelfServicePortalService);
exports.SelfServicePortalService = SelfServicePortalService;
//# sourceMappingURL=selfServicePortal.service.js.map