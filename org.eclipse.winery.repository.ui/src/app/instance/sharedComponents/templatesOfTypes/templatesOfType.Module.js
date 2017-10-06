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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var wineryPipes_module_1 = require("../../../wineryPipes/wineryPipes.module");
var templatesOfTypes_component_1 = require("./templatesOfTypes.component");
var wineryTable_module_1 = require("../../../wineryTableModule/wineryTable.module");
var TemplatesOfTypeModule = (function () {
    function TemplatesOfTypeModule() {
    }
    return TemplatesOfTypeModule;
}());
TemplatesOfTypeModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            router_1.RouterModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryPipes_module_1.WineryPipesModule,
            wineryTable_module_1.WineryTableModule
        ],
        declarations: [
            templatesOfTypes_component_1.TemplatesOfTypeComponent
        ],
        providers: [],
    })
], TemplatesOfTypeModule);
exports.TemplatesOfTypeModule = TemplatesOfTypeModule;
//# sourceMappingURL=templatesOfType.Module.js.map