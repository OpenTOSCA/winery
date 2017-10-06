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
 *     Niko Stadelmaier - add admin component
 */
var core_1 = require("@angular/core");
var instance_component_1 = require("./instance.component");
var instanceHeader_component_1 = require("./instanceHeader/instanceHeader.component");
var wineryLoader_module_1 = require("../wineryLoader/wineryLoader.module");
var winery_modal_module_1 = require("../wineryModalModule/winery.modal.module");
var wineryPipes_module_1 = require("../wineryPipes/wineryPipes.module");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var propertyRename_component_1 = require("./instanceHeader/propertyRename/propertyRename.component");
var forms_1 = require("@angular/forms");
var InstanceModule = (function () {
    function InstanceModule() {
    }
    return InstanceModule;
}());
InstanceModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            router_1.RouterModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryPipes_module_1.WineryPipesModule,
            forms_1.FormsModule
        ],
        exports: [instance_component_1.InstanceComponent],
        declarations: [
            instance_component_1.InstanceComponent,
            instanceHeader_component_1.InstanceHeaderComponent,
            propertyRename_component_1.PropertyRenameComponent
        ],
        providers: [],
    })
], InstanceModule);
exports.InstanceModule = InstanceModule;
//# sourceMappingURL=instance.module.js.map