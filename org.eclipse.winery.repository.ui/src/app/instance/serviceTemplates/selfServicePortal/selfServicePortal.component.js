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
var selfServicePortal_service_1 = require("./selfServicePortal.service");
var router_1 = require("@angular/router");
var instance_service_1 = require("../../instance.service");
var SelfServicePortalComponent = (function () {
    function SelfServicePortalComponent(service, iService, route) {
        var _this = this;
        this.service = service;
        this.iService = iService;
        this.route = route;
        this.route.url.subscribe(function (data) { return _this.urlSegment = data[0].path; });
    }
    SelfServicePortalComponent.prototype.ngOnInit = function () {
        this.service.setPath(this.iService.path + '/' + this.urlSegment + '/');
    };
    return SelfServicePortalComponent;
}());
SelfServicePortalComponent = __decorate([
    core_1.Component({
        selector: 'winery-self-service-portal',
        templateUrl: 'selfServicePortal.component.html',
        providers: [selfServicePortal_service_1.SelfServicePortalService]
    }),
    __metadata("design:paramtypes", [selfServicePortal_service_1.SelfServicePortalService,
        instance_service_1.InstanceService,
        router_1.ActivatedRoute])
], SelfServicePortalComponent);
exports.SelfServicePortalComponent = SelfServicePortalComponent;
//# sourceMappingURL=selfServicePortal.component.js.map