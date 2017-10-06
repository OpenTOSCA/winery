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
var forms_1 = require("@angular/forms");
var wineryLicense_component_1 = require("./wineryLicense.component");
var wineryPipes_module_1 = require("../wineryPipes/wineryPipes.module");
var common_1 = require("@angular/common");
var platform_browser_1 = require("@angular/platform-browser");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var WineryLicenseModule = (function () {
    function WineryLicenseModule() {
    }
    return WineryLicenseModule;
}());
WineryLicenseModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            platform_browser_1.BrowserModule,
            wineryPipes_module_1.WineryPipesModule,
            ngx_bootstrap_1.BsDropdownModule.forRoot()
        ],
        exports: [
            wineryLicense_component_1.WineryLicenseComponent
        ],
        declarations: [wineryLicense_component_1.WineryLicenseComponent],
        providers: [],
    })
], WineryLicenseModule);
exports.WineryLicenseModule = WineryLicenseModule;
//# sourceMappingURL=wineryLicense.module.js.map