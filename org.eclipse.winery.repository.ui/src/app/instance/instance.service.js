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
var configuration_1 = require("../configuration");
var enums_1 = require("../wineryInterfaces/enums");
var InstanceService = (function () {
    function InstanceService(http) {
        this.http = http;
        this.topologyTemplate = null;
    }
    /**
     * Get the submenu for the given resource type for displaying a component instance.
     * TODO: instead of string[], use objects which contain displayName and url fragment
     *
     * @returns string[] containing all menus for each resource type.
     */
    InstanceService.prototype.getSubMenuByResource = function () {
        var subMenu;
        switch (this.toscaComponent.toscaType) {
            case enums_1.ToscaTypes.NodeType:
                subMenu = ['README', 'LICENSE', 'Visual Appearance', 'Instance States', 'Interfaces', 'Implementations',
                    'Requirement Definitions', 'Capability Definitions', 'Properties Definition',
                    'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.ServiceTemplate:
                subMenu = ['README', 'LICENSE', 'Topology Template', 'Plans', 'Selfservice Portal',
                    'Boundary Definitions', 'Tags', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.RelationshipType:
                subMenu = ['README', 'LICENSE', 'Visual Appearance', 'Instance States', 'Source Interfaces', 'Target Interfaces',
                    'Valid Sources and Targets', 'Implementations', 'Properties Definition',
                    'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.ArtifactType:
                subMenu = ['README', 'LICENSE', 'Properties Definition', 'Inheritance', 'Templates', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.ArtifactTemplate:
                subMenu = ['README', 'LICENSE', 'Files', 'Source', 'Properties', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.RequirementType:
                subMenu = ['README', 'LICENSE', 'Required Capability Type', 'Properties Definition', 'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.CapabilityType:
                subMenu = ['README', 'LICENSE', 'Properties Definition', 'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.NodeTypeImplementation:
                subMenu = ['README', 'LICENSE', 'Implementation Artifacts', 'Deployment Artifacts', 'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.RelationshipTypeImplementation:
                subMenu = ['README', 'LICENSE', 'Implementation Artifacts', 'Inheritance', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.PolicyType:
                subMenu = ['README', 'LICENSE', 'Language', 'Applies To', 'Properties Definition', 'Inheritance', 'Templates', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.PolicyTemplate:
                subMenu = ['README', 'LICENSE', 'Properties', 'Documentation', 'XML'];
                break;
            case enums_1.ToscaTypes.Imports:
                subMenu = ['All Declared Elements Local Names', 'All Defined Types Local Names'];
                break;
            default:
                subMenu = ['Namespaces', 'Repository', 'Plan Languages', 'Plan Types', 'Constraint Types', 'Log'];
        }
        return subMenu;
    };
    /**
     * Set the shared data for the children. The path to the actual component is also generated.
     */
    InstanceService.prototype.setSharedData = function (toscaComponent) {
        var _this = this;
        this.toscaComponent = toscaComponent;
        // In order to have always the base path of this instance, create the path here
        // instead of getting it from the router, because there might be some child routes included.
        this.path = '/' + this.toscaComponent.toscaType + '/'
            + encodeURIComponent(encodeURIComponent(this.toscaComponent.namespace)) + '/'
            + this.toscaComponent.localName;
        if (this.toscaComponent.toscaType === enums_1.ToscaTypes.ServiceTemplate) {
            this.getTopologyTemplate()
                .subscribe(function (data) { return _this.topologyTemplate = data; }, function (error) { return _this.topologyTemplate = null; });
        }
    };
    InstanceService.prototype.deleteComponent = function () {
        return this.http.delete(configuration_1.backendBaseURL + this.path + '/');
    };
    InstanceService.prototype.getComponentData = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.path + '/', options)
            .map(function (res) { return res.json(); });
    };
    InstanceService.prototype.getTopologyTemplate = function () {
        var headers = new http_1.Headers({ 'Accept': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(configuration_1.backendBaseURL + this.path + '/topologytemplate/', options)
            .map(function (res) { return res.json(); });
    };
    return InstanceService;
}());
InstanceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], InstanceService);
exports.InstanceService = InstanceService;
//# sourceMappingURL=instance.service.js.map