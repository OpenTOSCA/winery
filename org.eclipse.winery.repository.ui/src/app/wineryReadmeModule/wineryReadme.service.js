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
var instance_service_1 = require("../instance/instance.service");
var configuration_1 = require("../configuration");
var ReadmeService = (function () {
    function ReadmeService(http, sharedData) {
        this.http = http;
        this.sharedData = sharedData;
    }
    ReadmeService.prototype.getData = function () {
        var headers = new http_1.Headers({ 'Accept': 'text/plain' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.sharedData.path + '/README.md', options)
            .map(function (res) { return res.text(); });
    };
    ReadmeService.prototype.save = function (readmeFile) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(configuration_1.backendBaseURL + this.sharedData.path + '/README.md', readmeFile, options)
            .map(function (res) { return res.json(); });
    };
    return ReadmeService;
}());
ReadmeService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        instance_service_1.InstanceService])
], ReadmeService);
exports.ReadmeService = ReadmeService;
//# sourceMappingURL=wineryReadme.service.js.map