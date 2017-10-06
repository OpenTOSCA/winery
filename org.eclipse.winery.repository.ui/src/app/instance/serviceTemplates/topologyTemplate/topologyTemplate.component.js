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
 *     Lukas Harzenetter - initial API and implementation
 */
var core_1 = require("@angular/core");
var instance_service_1 = require("../../instance.service");
var configuration_1 = require("../../../configuration");
var platform_browser_1 = require("@angular/platform-browser");
var TopologyTemplateComponent = (function () {
    function TopologyTemplateComponent(sanitizer, sharedData) {
        this.sanitizer = sanitizer;
        this.sharedData = sharedData;
        this.loading = true;
    }
    TopologyTemplateComponent.prototype.ngOnInit = function () {
        var uiURL = encodeURIComponent(window.location.origin);
        this.templateUrl = this.sanitizer.bypassSecurityTrustResourceUrl(configuration_1.backendBaseURL + this.sharedData.path + '/topologytemplate/?view&uiURL=' + uiURL);
        this.editorUrl = configuration_1.backendBaseURL + '-topologymodeler/'
            + '?repositoryURL=' + encodeURIComponent(configuration_1.backendBaseURL)
            + '&uiURL=' + uiURL
            + '&ns=' + encodeURIComponent(this.sharedData.toscaComponent.namespace)
            + '&id=' + this.sharedData.toscaComponent.localName;
    };
    return TopologyTemplateComponent;
}());
TopologyTemplateComponent = __decorate([
    core_1.Component({
        templateUrl: 'topologyTemplate.component.html'
    }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer, instance_service_1.InstanceService])
], TopologyTemplateComponent);
exports.TopologyTemplateComponent = TopologyTemplateComponent;
//# sourceMappingURL=topologyTemplate.component.js.map