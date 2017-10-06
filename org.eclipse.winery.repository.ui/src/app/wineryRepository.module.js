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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var notFound_component_1 = require("./404/notFound.component");
var header_component_1 = require("./header/header.component");
var wineryLoader_module_1 = require("./wineryLoader/wineryLoader.module");
var wineryNotification_module_1 = require("./wineryNotificationModule/wineryNotification.module");
var wineryNotificationOptions_1 = require("./wineryNotificationModule/wineryNotificationOptions");
var other_component_1 = require("./other/other.component");
var section_module_1 = require("./section/section.module");
var animations_1 = require("@angular/platform-browser/animations");
var wineryRepository_component_1 = require("./wineryRepository.component");
var wineryRepositoryRouting_module_1 = require("./wineryRepositoryRouting.module");
var existService_1 = require("./wineryUtils/existService");
var wineryOAuth_component_1 = require("./header/wineryOauth/wineryOAuth.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var nodeType_module_1 = require("./wineryMainModules/nodeTypes/nodeType.module");
var serviceTemplate_module_1 = require("./wineryMainModules/serviceTemplates/serviceTemplate.module");
var relationshipType_module_1 = require("./wineryMainModules/relationshipTypes/relationshipType.module");
var winery_modal_module_1 = require("./wineryModalModule/winery.modal.module");
var artifactType_module_1 = require("./wineryMainModules/artifactTypes/artifactType.module");
var admin_module_1 = require("./wineryMainModules/admin/admin.module");
var policyType_module_1 = require("./wineryMainModules/policyTypes/policyType.module");
var requirementType_module_1 = require("./wineryMainModules/requirementTypes/requirementType.module");
var artifactTemplate_module_1 = require("./wineryMainModules/artictTemplates/artifactTemplate.module");
var capabilityType_module_1 = require("./wineryMainModules/capabilityTypes/capabilityType.module");
var nodeTypeImplementation_module_1 = require("./wineryMainModules/nodeTypeImplementations/nodeTypeImplementation.module");
var relationshipTypeImplementation_module_1 = require("./wineryMainModules/relationshipTypeImplementations/relationshipTypeImplementation.module");
var policyTemplate_module_1 = require("./wineryMainModules/policyTemplates/policyTemplate.module");
var imports_module_1 = require("./wineryMainModules/imports/imports.module");
var wineryGitLog_component_1 = require("./wineryGitLog/wineryGitLog.component");
var templatesOfType_Module_1 = require("./instance/sharedComponents/templatesOfTypes/templatesOfType.Module");
var WineryRepositoryModule = (function () {
    function WineryRepositoryModule() {
    }
    return WineryRepositoryModule;
}());
WineryRepositoryModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            common_1.CommonModule,
            animations_1.BrowserAnimationsModule,
            wineryLoader_module_1.WineryLoaderModule,
            ng2_toastr_1.ToastModule.forRoot(),
            wineryNotification_module_1.WineryNotificationModule.forRoot(),
            section_module_1.SectionModule,
            winery_modal_module_1.WineryModalModule,
            ngx_bootstrap_1.TooltipModule.forRoot(),
            templatesOfType_Module_1.TemplatesOfTypeModule,
            serviceTemplate_module_1.ServiceTemplateModule,
            nodeType_module_1.NodeTypeModule,
            relationshipType_module_1.RelationshipTypeModule,
            artifactType_module_1.ArtifactTypeModule,
            admin_module_1.AdminModule,
            policyType_module_1.PolicyTypeModule,
            requirementType_module_1.RequirementTypeModule,
            artifactTemplate_module_1.ArtifactTemplateModule,
            capabilityType_module_1.CapabilityTypeModule,
            nodeTypeImplementation_module_1.NodeTypeImplementationModule,
            relationshipTypeImplementation_module_1.RelationshipTypeImplementationModule,
            policyTemplate_module_1.PolicyTemplateModule,
            imports_module_1.ImportModule,
            wineryRepositoryRouting_module_1.WineryRepositoryRoutingModule,
        ],
        declarations: [
            header_component_1.HeaderComponent,
            notFound_component_1.NotFoundComponent,
            other_component_1.OtherComponent,
            wineryRepository_component_1.WineryRepositoryComponent,
            wineryOAuth_component_1.WineryOAuthComponent,
            wineryGitLog_component_1.WineryGitLogComponent
        ],
        providers: [
            { provide: ng2_toastr_1.ToastOptions, useClass: wineryNotificationOptions_1.WineryCustomOption },
            existService_1.ExistService
        ],
        bootstrap: [wineryRepository_component_1.WineryRepositoryComponent]
    })
], WineryRepositoryModule);
exports.WineryRepositoryModule = WineryRepositoryModule;
//# sourceMappingURL=wineryRepository.module.js.map