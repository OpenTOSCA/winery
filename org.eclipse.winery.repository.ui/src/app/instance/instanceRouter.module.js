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
 *
 * Contributors:
 *     Lukas Harzenetter - initial API and implementation
 *     Niko Stadelmaier - add admin component
 *     Lukas Balzer - added boundary definitions component
 */
var core_1 = require("@angular/core");
var instance_component_1 = require("./instance.component");
var editXML_component_1 = require("./sharedComponents/editXML/editXML.component");
var visualAppearance_component_1 = require("./sharedComponents/visualAppearance/visualAppearance.component");
var documentation_component_1 = require("./sharedComponents/documentation/documentation.component");
var inheritance_component_1 = require("./sharedComponents/inheritance/inheritance.component");
var interfaces_component_1 = require("./sharedComponents/interfaces/interfaces.component");
var implementations_component_1 = require("./sharedComponents/implementations/implementations.component");
var instanceStates_component_1 = require("./sharedComponents/instanceStates/instanceStates.component");
var propertiesDefinition_component_1 = require("./sharedComponents/propertiesDefinition/propertiesDefinition.component");
var instance_resolver_1 = require("./instance.resolver");
var appliesTo_component_1 = require("./policyTypes/appliesTo/appliesTo.component");
var language_component_1 = require("./policyTypes/language/language.component");
var topologyTemplate_component_1 = require("./serviceTemplates/topologyTemplate/topologyTemplate.component");
var plans_component_1 = require("./serviceTemplates/plans/plans.component");
var boundaryDefinitions_component_1 = require("./serviceTemplates/boundaryDefinitions/boundaryDefinitions.component");
var boundaryDefinitions_module_1 = require("./serviceTemplates/boundaryDefinitions/boundaryDefinitions.module");
var validSourcesAndTargets_component_1 = require("./relationshipTypes/validSourcesAndTargets/validSourcesAndTargets.component");
var files_component_1 = require("./artifactTemplates/filesTag/files.component");
var properties_component_1 = require("./sharedComponents/properties/properties.component");
var requiredCapabilityType_component_1 = require("./requirementTypes/requiredCapabilityType/requiredCapabilityType.component");
var logger_component_1 = require("./admin/logger/logger.component");
var namespaces_component_1 = require("./admin/namespaces/namespaces.component");
var repository_component_1 = require("./admin/repository/repository.component");
var tag_component_1 = require("./serviceTemplates/tag/tag.component");
var router_1 = require("@angular/router");
var selfServicePortalRouter_module_1 = require("./serviceTemplates/selfServicePortal/selfServicePortalRouter.module");
var selfServicePortal_component_1 = require("./serviceTemplates/selfServicePortal/selfServicePortal.component");
var capOrReqDef_component_1 = require("./nodeTypes/capabilityOrRequirementDefinitions/capOrReqDef.component");
var artifact_component_1 = require("./sharedComponents/wineryArtifacts/artifact.component");
var typeWithShortName_component_1 = require("./admin/typesWithShortName/typeWithShortName.component");
var instanceRoutes = [
    {
        path: 'admin',
        component: instance_component_1.InstanceComponent,
        resolve: { resolveData: instance_resolver_1.InstanceResolver },
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
    {
        path: ':section/:namespace/:instanceId',
        component: instance_component_1.InstanceComponent,
        resolve: { resolveData: instance_resolver_1.InstanceResolver },
        children: [
            { path: 'appliesto', component: appliesTo_component_1.AppliesToComponent },
            {
                path: 'boundarydefinitions',
                component: boundaryDefinitions_component_1.BoundaryDefinitionsComponent,
                children: boundaryDefinitions_module_1.boundaryDefinitionsRoutes
            },
            { path: 'capabilitydefinitions', component: capOrReqDef_component_1.CapOrReqDefComponent },
            { path: 'deploymentartifacts', component: artifact_component_1.WineryArtifactComponent },
            { path: 'documentation', component: documentation_component_1.DocumentationComponent },
            { path: 'files', component: files_component_1.FilesComponent },
            { path: 'implementationartifacts', component: artifact_component_1.WineryArtifactComponent },
            { path: 'implementations', component: implementations_component_1.ImplementationsComponent },
            { path: 'inheritance', component: inheritance_component_1.InheritanceComponent },
            { path: 'instancestates', component: instanceStates_component_1.InstanceStatesComponent },
            { path: 'interfaces', component: interfaces_component_1.InterfacesComponent },
            { path: 'language', component: language_component_1.LanguageComponent },
            { path: 'plans', component: plans_component_1.PlansComponent },
            { path: 'properties', component: properties_component_1.PropertiesComponent },
            { path: 'propertiesdefinition', component: propertiesDefinition_component_1.PropertiesDefinitionComponent },
            { path: 'requiredcapabilitytype', component: requiredCapabilityType_component_1.RequiredCapabilityTypeComponent },
            { path: 'requirementdefinitions', component: capOrReqDef_component_1.CapOrReqDefComponent },
            { path: 'selfserviceportal', component: selfServicePortal_component_1.SelfServicePortalComponent, children: selfServicePortalRouter_module_1.selfServiceRoutes },
            { path: 'sourceinterfaces', component: interfaces_component_1.InterfacesComponent },
            { path: 'targetinterfaces', component: interfaces_component_1.InterfacesComponent },
            { path: 'tags', component: tag_component_1.TagComponent },
            { path: 'topologytemplate', component: topologyTemplate_component_1.TopologyTemplateComponent },
            { path: 'validsourcesandtargets', component: validSourcesAndTargets_component_1.ValidSourcesAndTargetsComponent },
            { path: 'visualappearance', component: visualAppearance_component_1.VisualAppearanceComponent },
            { path: 'xml', component: editXML_component_1.EditXMLComponent }
        ]
    }
];
var InstanceRouterModule = (function () {
    function InstanceRouterModule() {
    }
    return InstanceRouterModule;
}());
InstanceRouterModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(instanceRoutes)
        ],
        exports: [
            router_1.RouterModule
        ],
        providers: [
            instance_resolver_1.InstanceResolver
        ],
    })
], InstanceRouterModule);
exports.InstanceRouterModule = InstanceRouterModule;
//# sourceMappingURL=instanceRouter.module.js.map