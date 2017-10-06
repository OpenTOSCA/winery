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
var artifactTemplateRouter_module_1 = require("./artifactTemplateRouter.module");
var files_component_1 = require("../../instance/artifactTemplates/filesTag/files.component");
var properties_component_1 = require("../../instance/sharedComponents/properties/properties.component");
var winery_modal_module_1 = require("../../wineryModalModule/winery.modal.module");
var wineryTable_module_1 = require("../../wineryTableModule/wineryTable.module");
var wineryUploader_module_1 = require("../../wineryUploader/wineryUploader.module");
var common_1 = require("@angular/common");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var artifactSource_component_1 = require("../../instance/artifactTemplates/artifactSource/artifactSource.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var wineryEditor_module_1 = require("../../wineryEditorModule/wineryEditor.module");
var wineryDuplicateValidator_module_1 = require("../../wineryValidators/wineryDuplicateValidator.module");
var wineryReadme_module_1 = require("../../wineryReadmeModule/wineryReadme.module");
var wineryLicense_module_1 = require("../../wineryLicenseModule/wineryLicense.module");
var ArtifactTemplateModule = (function () {
    function ArtifactTemplateModule() {
    }
    return ArtifactTemplateModule;
}());
ArtifactTemplateModule = __decorate([
    core_1.NgModule({
        imports: [
            http_1.HttpModule,
            common_1.CommonModule,
            forms_1.FormsModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryTable_module_1.WineryTableModule,
            wineryUploader_module_1.WineryUploaderModule,
            ngx_bootstrap_1.TabsModule,
            wineryEditor_module_1.WineryEditorModule,
            wineryDuplicateValidator_module_1.WineryDuplicateValidatorModule,
            artifactTemplateRouter_module_1.ArtifactTemplateRouterModule,
            wineryReadme_module_1.WineryReadmeModule,
            wineryLicense_module_1.WineryLicenseModule
        ],
        declarations: [
            files_component_1.FilesComponent,
            artifactSource_component_1.ArtifactSourceComponent,
            properties_component_1.PropertiesComponent,
        ]
    })
], ArtifactTemplateModule);
exports.ArtifactTemplateModule = ArtifactTemplateModule;
//# sourceMappingURL=artifactTemplate.module.js.map