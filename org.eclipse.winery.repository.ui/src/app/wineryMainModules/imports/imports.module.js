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
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var section_module_1 = require("../../section/section.module");
var importRouting_module_1 = require("./importRouting.module");
var listDefinedTypesAndElements_component_1 = require("../../instance/imports/listDefinedTypesAndElements.component");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var wineryTable_module_1 = require("../../wineryTableModule/wineryTable.module");
var ImportModule = (function () {
    function ImportModule() {
    }
    return ImportModule;
}());
ImportModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            section_module_1.SectionModule,
            importRouting_module_1.ImportRouterModule,
            wineryLoader_module_1.WineryLoaderModule,
            wineryTable_module_1.WineryTableModule
        ],
        declarations: [
            listDefinedTypesAndElements_component_1.ListDefinedTypesAndElementsComponent
        ]
    })
], ImportModule);
exports.ImportModule = ImportModule;
//# sourceMappingURL=imports.module.js.map