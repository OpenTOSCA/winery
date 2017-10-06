"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var section_resolver_1 = require("../../section/section.resolver");
var instance_component_1 = require("../../instance/instance.component");
var instance_resolver_1 = require("../../instance/instance.resolver");
var enums_1 = require("../../wineryInterfaces/enums");
var repository_component_1 = require("../../instance/admin/repository/repository.component");
var typeWithShortName_component_1 = require("../../instance/admin/typesWithShortName/typeWithShortName.component");
var namespaces_component_1 = require("../../instance/admin/namespaces/namespaces.component");
var logger_component_1 = require("../../instance/admin/logger/logger.component");
var toscaType = enums_1.ToscaTypes.Admin;
var adminRoutes = [
    {
        path: toscaType,
        component: instance_component_1.InstanceComponent,
        children: [
            { path: 'namespaces', component: namespaces_component_1.NamespacesComponent },
            { path: 'repository', component: repository_component_1.RepositoryComponent },
            { path: 'planlanguages', component: typeWithShortName_component_1.TypeWithShortNameComponent },
            { path: 'plantypes', component: typeWithShortName_component_1.TypeWithShortNameComponent },
            { path: 'constrainttypes', component: typeWithShortName_component_1.TypeWithShortNameComponent },
            { path: 'log', component: logger_component_1.LoggerComponent },
            { path: '', redirectTo: 'namespaces', pathMatch: 'full' }
        ]
    },
];
var AdminRouterModule = (function () {
    function AdminRouterModule() {
    }
    return AdminRouterModule;
}());
AdminRouterModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(adminRoutes),
        ],
        exports: [
            router_1.RouterModule
        ],
        providers: [
            section_resolver_1.SectionResolver,
            instance_resolver_1.InstanceResolver
        ],
    })
], AdminRouterModule);
exports.AdminRouterModule = AdminRouterModule;
//# sourceMappingURL=adminRouter.module.js.map