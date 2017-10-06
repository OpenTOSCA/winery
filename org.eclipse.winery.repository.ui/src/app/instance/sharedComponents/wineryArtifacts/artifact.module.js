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
var artifact_component_1 = require("./artifact.component");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var wineryTable_module_1 = require("../../../wineryTableModule/wineryTable.module");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var forms_1 = require("@angular/forms");
var wineryQNameSelector_module_1 = require("../../../wineryQNameSelector/wineryQNameSelector.module");
var wineryComponentExists_module_1 = require("../../../wineryComponentExists/wineryComponentExists.module");
var wineryUploader_module_1 = require("../../../wineryUploader/wineryUploader.module");
var WineryArtifactModule = (function () {
    function WineryArtifactModule() {
    }
    return WineryArtifactModule;
}());
WineryArtifactModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            router_1.RouterModule,
            wineryComponentExists_module_1.WineryComponentExistsModule,
            wineryTable_module_1.WineryTableModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryQNameSelector_module_1.WineryQNameSelectorModule,
            wineryUploader_module_1.WineryUploaderModule,
            forms_1.FormsModule,
        ],
        exports: [artifact_component_1.WineryArtifactComponent],
        declarations: [
            artifact_component_1.WineryArtifactComponent,
        ]
    })
], WineryArtifactModule);
exports.WineryArtifactModule = WineryArtifactModule;
//# sourceMappingURL=artifact.module.js.map