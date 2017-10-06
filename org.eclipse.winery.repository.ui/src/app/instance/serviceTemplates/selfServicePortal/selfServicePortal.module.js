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
 *
 * Contributors:
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var selfServicePortal_component_1 = require("./selfServicePortal.component");
var selfServicePortalDescription_component_1 = require("./selfServicePortalDescription.component");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var imageUpload_component_1 = require("./imageUpload.component");
var selfServicePortalImages_component_1 = require("./selfServicePortalImages.component");
var selfServicePortalOptions_component_1 = require("./selfServicePortalOptions.component");
var wineryTable_module_1 = require("../../../wineryTableModule/wineryTable.module");
var wineryUploader_module_1 = require("../../../wineryUploader/wineryUploader.module");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var wineryEditor_module_1 = require("../../../wineryEditorModule/wineryEditor.module");
var editXML_module_1 = require("../../sharedComponents/editXML/editXML.module");
var SelfServicePortalModule = (function () {
    function SelfServicePortalModule() {
    }
    return SelfServicePortalModule;
}());
SelfServicePortalModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            router_1.RouterModule,
            wineryEditor_module_1.WineryEditorModule,
            wineryUploader_module_1.WineryUploaderModule,
            wineryTable_module_1.WineryTableModule,
            wineryLoader_module_1.WineryLoaderModule,
            editXML_module_1.WineryEditXMLModule
        ],
        exports: [],
        declarations: [
            selfServicePortal_component_1.SelfServicePortalComponent,
            selfServicePortalDescription_component_1.SelfServiceDescriptionComponent,
            imageUpload_component_1.ImageUploadComponent,
            selfServicePortalImages_component_1.SelfServicePortalImagesComponent,
            selfServicePortalOptions_component_1.SelfServicePortalOptionsComponent,
        ],
        providers: [],
    })
], SelfServicePortalModule);
exports.SelfServicePortalModule = SelfServicePortalModule;
//# sourceMappingURL=selfServicePortal.module.js.map