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
var requirementTypeRouter_module_1 = require("./requirementTypeRouter.module");
var requiredCapabilityType_component_1 = require("../../instance/requirementTypes/requiredCapabilityType/requiredCapabilityType.component");
var common_1 = require("@angular/common");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var wineryQNameSelector_module_1 = require("../../wineryQNameSelector/wineryQNameSelector.module");
var wineryReadme_module_1 = require("../../wineryReadmeModule/wineryReadme.module");
var wineryLicense_module_1 = require("../../wineryLicenseModule/wineryLicense.module");
var RequirementTypeModule = (function () {
    function RequirementTypeModule() {
    }
    return RequirementTypeModule;
}());
RequirementTypeModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            wineryLoader_module_1.WineryLoaderModule,
            wineryQNameSelector_module_1.WineryQNameSelectorModule,
            requirementTypeRouter_module_1.RequirementTypeRouterModule,
            wineryReadme_module_1.WineryReadmeModule,
            wineryLicense_module_1.WineryLicenseModule
        ],
        declarations: [
            requiredCapabilityType_component_1.RequiredCapabilityTypeComponent
        ]
    })
], RequirementTypeModule);
exports.RequirementTypeModule = RequirementTypeModule;
//# sourceMappingURL=requirementType.module.js.map