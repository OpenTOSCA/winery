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
var section_component_1 = require("../../section/section.component");
var section_resolver_1 = require("../../section/section.resolver");
var instance_component_1 = require("../../instance/instance.component");
var instance_resolver_1 = require("../../instance/instance.resolver");
var editXML_component_1 = require("../../instance/sharedComponents/editXML/editXML.component");
var documentation_component_1 = require("../../instance/sharedComponents/documentation/documentation.component");
var enums_1 = require("../../wineryInterfaces/enums");
var visualAppearance_component_1 = require("../../instance/sharedComponents/visualAppearance/visualAppearance.component");
var instanceStates_component_1 = require("../../instance/sharedComponents/instanceStates/instanceStates.component");
var interfaces_component_1 = require("../../instance/sharedComponents/interfaces/interfaces.component");
var implementations_component_1 = require("../../instance/sharedComponents/implementations/implementations.component");
var inheritance_component_1 = require("../../instance/sharedComponents/inheritance/inheritance.component");
var propertiesDefinition_component_1 = require("../../instance/sharedComponents/propertiesDefinition/propertiesDefinition.component");
var validSourcesAndTargets_component_1 = require("../../instance/relationshipTypes/validSourcesAndTargets/validSourcesAndTargets.component");
var wineryReadme_component_1 = require("../../wineryReadmeModule/wineryReadme.component");
var wineryLicense_component_1 = require("../../wineryLicenseModule/wineryLicense.component");
var toscaType = enums_1.ToscaTypes.RelationshipType;
var relationshipTypeRoutes = [
    { path: toscaType, component: section_component_1.SectionComponent, resolve: { resolveData: section_resolver_1.SectionResolver } },
    { path: toscaType + '/:namespace', component: section_component_1.SectionComponent, resolve: { resolveData: section_resolver_1.SectionResolver } },
    {
        path: toscaType + '/:namespace/:localName',
        component: instance_component_1.InstanceComponent,
        resolve: { resolveData: instance_resolver_1.InstanceResolver },
        children: [
            { path: 'readme', component: wineryReadme_component_1.WineryReadmeComponent },
            { path: 'license', component: wineryLicense_component_1.WineryLicenseComponent },
            { path: 'visualappearance', component: visualAppearance_component_1.VisualAppearanceComponent },
            { path: 'instancestates', component: instanceStates_component_1.InstanceStatesComponent },
            { path: 'sourceinterfaces', component: interfaces_component_1.InterfacesComponent },
            { path: 'targetinterfaces', component: interfaces_component_1.InterfacesComponent },
            { path: 'validsourcesandtargets', component: validSourcesAndTargets_component_1.ValidSourcesAndTargetsComponent },
            { path: 'implementations', component: implementations_component_1.ImplementationsComponent },
            { path: 'propertiesdefinition', component: propertiesDefinition_component_1.PropertiesDefinitionComponent },
            { path: 'inheritance', component: inheritance_component_1.InheritanceComponent },
            { path: 'documentation', component: documentation_component_1.DocumentationComponent },
            { path: 'xml', component: editXML_component_1.EditXMLComponent },
            { path: '', redirectTo: 'visualappearance', pathMatch: 'full' }
        ]
    }
];
var RelationshipTypeRouterModule = (function () {
    function RelationshipTypeRouterModule() {
    }
    return RelationshipTypeRouterModule;
}());
RelationshipTypeRouterModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(relationshipTypeRoutes),
        ],
        exports: [
            router_1.RouterModule
        ],
        providers: [
            section_resolver_1.SectionResolver,
            instance_resolver_1.InstanceResolver
        ],
    })
], RelationshipTypeRouterModule);
exports.RelationshipTypeRouterModule = RelationshipTypeRouterModule;
//# sourceMappingURL=relationshipTypeRouter.module.js.map