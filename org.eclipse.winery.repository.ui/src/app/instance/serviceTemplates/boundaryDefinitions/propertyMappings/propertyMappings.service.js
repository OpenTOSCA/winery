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
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var configuration_1 = require("../../../../configuration");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Property = (function () {
    function Property() {
    }
    return Property;
}());
exports.Property = Property;
var PropertyMappingService = (function () {
    function PropertyMappingService(http, route) {
        this.http = http;
        this.route = route;
        this.path = configuration_1.backendBaseURL + this.route.url + '/';
    }
    PropertyMappingService.prototype.getPropertyMappings = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(this.path, options)
            .map(function (res) { return res.json(); });
    };
    PropertyMappingService.prototype.addPropertyMapping = function (propertyMapping) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.path, JSON.stringify(propertyMapping), options);
    };
    PropertyMappingService.prototype.removePropertyMapping = function (elementToDelete) {
        return this.http.delete(this.path + encodeURIComponent(encodeURIComponent(elementToDelete)));
    };
    PropertyMappingService.prototype.getPropertiesOfServiceTemplate = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/xml' });
        var options = new http_1.RequestOptions({ headers: headers });
        var newPath = this.path.replace('propertymappings', 'properties');
        return this.http.get(newPath + '/', options)
            .map(function (res) { return res.text(); });
    };
    PropertyMappingService.prototype.getTemplatesOfType = function (type) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + '/' + type + '/', options)
            .map(function (res) { return res.json(); });
    };
    PropertyMappingService.prototype.getTargetObjKVProperties = function (targetPath) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + '/' + targetPath + '/' + 'propertiesdefinition', options)
            .map(function (res) { return res.json(); });
    };
    return PropertyMappingService;
}());
__decorate([
    core_1.ViewChild('browseForServiceTemplatePropertyDiag'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyMappingService.prototype, "browseForServiceTemplatePropertyDiag", void 0);
PropertyMappingService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], PropertyMappingService);
exports.PropertyMappingService = PropertyMappingService;
//# sourceMappingURL=propertyMappings.service.js.map