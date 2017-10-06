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
 */
var core_1 = require("@angular/core");
var wineryReadme_component_1 = require("./wineryReadme.component");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var wineryLoader_module_1 = require("../wineryLoader/wineryLoader.module");
var wineryMarkdown_module_1 = require("../wineryMarkdownComponent/wineryMarkdown.module");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var wineryPipes_module_1 = require("../wineryPipes/wineryPipes.module");
var WineryReadmeModule = (function () {
    function WineryReadmeModule() {
    }
    return WineryReadmeModule;
}());
WineryReadmeModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            wineryLoader_module_1.WineryLoaderModule,
            forms_1.FormsModule,
            wineryMarkdown_module_1.WineryMarkdownModule,
            ngx_bootstrap_1.TabsModule,
            wineryPipes_module_1.WineryPipesModule
        ],
        exports: [
            wineryReadme_component_1.WineryReadmeComponent
        ],
        declarations: [wineryReadme_component_1.WineryReadmeComponent],
        providers: [],
    })
], WineryReadmeModule);
exports.WineryReadmeModule = WineryReadmeModule;
//# sourceMappingURL=wineryReadme.module.js.map