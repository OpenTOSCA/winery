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
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var configuration_1 = require("../../../configuration");
var PlansService = (function () {
    function PlansService(http, route) {
        this.http = http;
        this.route = route;
        this.path = configuration_1.backendBaseURL + this.route.url + '/';
    }
    PlansService.prototype.getPlansData = function (url) {
        return this.getJson(url ? configuration_1.backendBaseURL + url : this.path);
    };
    PlansService.prototype.getPlanTypes = function () {
        return this.getJson(configuration_1.backendBaseURL + '/admin/plantypes/?ngSelect=true');
    };
    PlansService.prototype.getPlanLanguages = function () {
        return this.getJson(configuration_1.backendBaseURL + '/admin/planlanguages/?ngSelect=true');
    };
    PlansService.prototype.addPlan = function (newPlan) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.path, JSON.stringify(newPlan), options);
    };
    PlansService.prototype.deletePlan = function (id) {
        return this.http.delete(this.path + id + '/');
    };
    PlansService.prototype.getJson = function (path) {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(path, options)
            .map(function (res) { return res.json(); });
    };
    PlansService.prototype.updatePlan = function (plan) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(this.path + plan.id + '/', JSON.stringify(plan), options);
    };
    return PlansService;
}());
PlansService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router])
], PlansService);
exports.PlansService = PlansService;
//# sourceMappingURL=plans.service.js.map