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
var core_1 = require("@angular/core");
var inheritance_component_1 = require("./inheritance.component");
var common_1 = require("@angular/common");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var forms_1 = require("@angular/forms");
var wineryQNameSelector_module_1 = require("../../../wineryQNameSelector/wineryQNameSelector.module");
var ng2_select_1 = require("ng2-select");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var InheritanceModule = (function () {
    function InheritanceModule() {
    }
    return InheritanceModule;
}());
InheritanceModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            platform_browser_1.BrowserModule,
            ng2_select_1.SelectModule,
            forms_1.FormsModule,
            common_1.CommonModule,
            router_1.RouterModule,
            winery_modal_module_1.WineryModalModule,
            wineryLoader_module_1.WineryLoaderModule,
            wineryQNameSelector_module_1.WineryQNameSelectorModule,
        ],
        exports: [inheritance_component_1.InheritanceComponent],
        declarations: [inheritance_component_1.InheritanceComponent],
        providers: [],
    })
], InheritanceModule);
exports.InheritanceModule = InheritanceModule;
//# sourceMappingURL=inheritance.module.js.map