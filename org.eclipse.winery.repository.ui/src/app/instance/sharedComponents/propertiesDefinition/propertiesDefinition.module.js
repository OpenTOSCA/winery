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
 *     Lukas Harzenetter - initial API and implementation
 */
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ng2_select_1 = require("ng2-select");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var wineryNamespaceSelector_module_1 = require("../../../wineryNamespaceSelector/wineryNamespaceSelector.module");
var wineryDuplicateValidator_module_1 = require("../../../wineryValidators/wineryDuplicateValidator.module");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var wineryTable_module_1 = require("../../../wineryTableModule/wineryTable.module");
var propertiesDefinition_component_1 = require("./propertiesDefinition.component");
var PropertiesDefinitionModule = (function () {
    function PropertiesDefinitionModule() {
    }
    return PropertiesDefinitionModule;
}());
PropertiesDefinitionModule = __decorate([
    core_1.NgModule({
        imports: [
            ngx_bootstrap_1.TabsModule.forRoot(),
            ng2_select_1.SelectModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            wineryLoader_module_1.WineryLoaderModule,
            common_1.CommonModule,
            wineryNamespaceSelector_module_1.WineryNamespaceSelectorModule,
            winery_modal_module_1.WineryModalModule,
            wineryTable_module_1.WineryTableModule,
            wineryDuplicateValidator_module_1.WineryDuplicateValidatorModule,
        ],
        exports: [],
        declarations: [
            propertiesDefinition_component_1.PropertiesDefinitionComponent,
        ],
        providers: [],
    })
], PropertiesDefinitionModule);
exports.PropertiesDefinitionModule = PropertiesDefinitionModule;
//# sourceMappingURL=propertiesDefinition.module.js.map