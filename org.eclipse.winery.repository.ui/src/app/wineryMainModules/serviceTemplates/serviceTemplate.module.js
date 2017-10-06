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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var serviceTemplateRouter_module_1 = require("./serviceTemplateRouter.module");
var topologyTemplate_component_1 = require("../../instance/serviceTemplates/topologyTemplate/topologyTemplate.component");
var plans_component_1 = require("../../instance/serviceTemplates/plans/plans.component");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var winery_modal_module_1 = require("../../wineryModalModule/winery.modal.module");
var wineryIoParameters_module_1 = require("../../wineryIoParameter/wineryIoParameters.module");
var wineryUploader_module_1 = require("../../wineryUploader/wineryUploader.module");
var ng2_select_1 = require("ng2-select");
var forms_1 = require("@angular/forms");
var wineryTable_module_1 = require("../../wineryTableModule/wineryTable.module");
var instance_module_1 = require("../../instance/instance.module");
var selfServicePortal_module_1 = require("../../instance/serviceTemplates/selfServicePortal/selfServicePortal.module");
var boundaryDefinitions_module_1 = require("../../instance/serviceTemplates/boundaryDefinitions/boundaryDefinitions.module");
var tag_module_1 = require("../../instance/serviceTemplates/tag/tag.module");
var documentation_module_1 = require("../../instance/sharedComponents/documentation/documentation.module");
var wineryReadme_module_1 = require("../../wineryReadmeModule/wineryReadme.module");
var wineryLicense_module_1 = require("../../wineryLicenseModule/wineryLicense.module");
var ServiceTemplateModule = (function () {
    function ServiceTemplateModule() {
    }
    return ServiceTemplateModule;
}());
ServiceTemplateModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            ng2_select_1.SelectModule,
            instance_module_1.InstanceModule,
            selfServicePortal_module_1.SelfServicePortalModule,
            boundaryDefinitions_module_1.BoundaryDefinitionsModule,
            tag_module_1.TagModule,
            documentation_module_1.DocumentationModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryIoParameters_module_1.WineryIoParameterModule,
            wineryUploader_module_1.WineryUploaderModule,
            wineryTable_module_1.WineryTableModule,
            serviceTemplateRouter_module_1.ServiceTemplateRouterModule,
            wineryReadme_module_1.WineryReadmeModule,
            wineryLicense_module_1.WineryLicenseModule
        ],
        declarations: [
            topologyTemplate_component_1.TopologyTemplateComponent,
            plans_component_1.PlansComponent,
        ]
    })
], ServiceTemplateModule);
exports.ServiceTemplateModule = ServiceTemplateModule;
//# sourceMappingURL=serviceTemplate.module.js.map