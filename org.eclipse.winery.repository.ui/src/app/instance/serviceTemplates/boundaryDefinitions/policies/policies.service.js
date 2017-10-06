"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var wineryComponent_1 = require("../../../../wineryInterfaces/wineryComponent");
var configuration_1 = require("../../../../configuration");
var PoliciesService = (function () {
    function PoliciesService(http, route) {
        this.http = http;
        this.route = route;
        this.path = configuration_1.backendBaseURL + this.route.url;
    }
    PoliciesService.prototype.getPolicies = function () {
        return this.get(this.path);
    };
    PoliciesService.prototype.getPolicyTypes = function () {
        return this.get('/policytypes?grouped=angularSelect');
    };
    PoliciesService.prototype.getPolicyTemplatesForType = function (pT) {
        var qName = pT.id.slice(1).split('}');
        return this.get('/policytypes/' + encodeURIComponent(encodeURIComponent(qName[0])) + '/' + qName[1] + '/instances');
    };
    PoliciesService.prototype.postPolicy = function (xml) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/xml' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.path, xml, options);
    };
    PoliciesService.prototype.deletePolicy = function (id) {
        return this.http.delete(this.path + '/' + id);
    };
    PoliciesService.prototype.get = function (p) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(p, options)
            .map(function (res) { return res.json(); });
    };
    return PoliciesService;
}());
PoliciesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], PoliciesService);
exports.PoliciesService = PoliciesService;
var WineryPolicy = (function (_super) {
    __extends(WineryPolicy, _super);
    function WineryPolicy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WineryPolicy;
}(wineryComponent_1.WineryComponent));
exports.WineryPolicy = WineryPolicy;
//# sourceMappingURL=policies.service.js.map