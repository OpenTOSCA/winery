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
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var enums_1 = require("../../wineryInterfaces/enums");
var section_component_1 = require("../../section/section.component");
var section_resolver_1 = require("../../section/section.resolver");
var instance_resolver_1 = require("../../instance/instance.resolver");
var instance_component_1 = require("../../instance/instance.component");
var listDefinedTypesAndElements_component_1 = require("../../instance/imports/listDefinedTypesAndElements.component");
var toscaType = enums_1.ToscaTypes.Imports;
var importRoutes = [
    { path: toscaType, component: section_component_1.SectionComponent, resolve: { resolveData: section_resolver_1.SectionResolver } },
    // namespace is only used for reuse of the {@link SectionComponent} instead of importType.
    { path: toscaType + '/:xsdSchemaType', component: section_component_1.SectionComponent, resolve: { resolveData: section_resolver_1.SectionResolver } },
    { path: toscaType + '/:xsdSchemaType/:namespace', component: section_component_1.SectionComponent, resolve: { resolveData: section_resolver_1.SectionResolver } },
    {
        path: toscaType + '/:xsdSchemaType/:namespace/:localName',
        component: instance_component_1.InstanceComponent,
        resolve: { resolveData: instance_resolver_1.InstanceResolver },
        children: [
            { path: 'alldeclaredelementslocalnames', component: listDefinedTypesAndElements_component_1.ListDefinedTypesAndElementsComponent },
            { path: 'alldefinedtypeslocalnames', component: listDefinedTypesAndElements_component_1.ListDefinedTypesAndElementsComponent },
            { path: '', redirectTo: 'alldeclaredelementslocalnames', pathMatch: 'full' }
        ]
    }
];
var ImportRouterModule = (function () {
    function ImportRouterModule() {
    }
    return ImportRouterModule;
}());
ImportRouterModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(importRoutes)
        ],
        exports: [router_1.RouterModule],
    })
], ImportRouterModule);
exports.ImportRouterModule = ImportRouterModule;
//# sourceMappingURL=importRouting.module.js.map