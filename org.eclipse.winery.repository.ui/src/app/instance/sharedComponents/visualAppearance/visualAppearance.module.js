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
 *     Lukas Balzer - initial API and implementation
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var visualAppearance_component_1 = require("./visualAppearance.component");
var wineryUploader_module_1 = require("../../../wineryUploader/wineryUploader.module");
/**
 * An angular module for displaying the visualApperances for both the nodeTypes and the relationshipTypes
 * therefore an instance of {@link NodeTypesVisualsApiData} or {@link RelationshipTypesVisualsApiData} is loaded from the backend
 */
var VisualAppearanceModule = (function () {
    function VisualAppearanceModule() {
    }
    return VisualAppearanceModule;
}());
VisualAppearanceModule = __decorate([
    core_1.NgModule({
        imports: [
            ngx_bootstrap_1.TabsModule.forRoot(),
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            wineryLoader_module_1.WineryLoaderModule,
            common_1.CommonModule,
            winery_modal_module_1.WineryModalModule,
            wineryUploader_module_1.WineryUploaderModule
        ],
        exports: [],
        declarations: [
            visualAppearance_component_1.VisualAppearanceComponent,
        ]
    })
], VisualAppearanceModule);
exports.VisualAppearanceModule = VisualAppearanceModule;
//# sourceMappingURL=visualAppearance.module.js.map