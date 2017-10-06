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
var capOrReqDef_component_1 = require("../../instance/nodeTypes/capabilityOrRequirementDefinitions/capOrReqDef.component");
var common_1 = require("@angular/common");
var nodeTypeRouter_module_1 = require("./nodeTypeRouter.module");
var implementations_module_1 = require("../../instance/sharedComponents/implementations/implementations.module");
var winery_modal_module_1 = require("../../wineryModalModule/winery.modal.module");
var winerySpinnerWithInfinity_module_1 = require("../../winerySpinnerWithInfinityModule/winerySpinnerWithInfinity.module");
var wineryEditor_module_1 = require("../../wineryEditorModule/wineryEditor.module");
var ng2_select_1 = require("ng2-select");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var wineryQNameSelector_module_1 = require("../../wineryQNameSelector/wineryQNameSelector.module");
var wineryTable_module_1 = require("../../wineryTableModule/wineryTable.module");
var forms_1 = require("@angular/forms");
var visualAppearance_module_1 = require("../../instance/sharedComponents/visualAppearance/visualAppearance.module");
var instanceStates_module_1 = require("../../instance/sharedComponents/instanceStates/instanceStates.module");
var propertiesDefinition_module_1 = require("../../instance/sharedComponents/propertiesDefinition/propertiesDefinition.module");
var inheritance_module_1 = require("../../instance/sharedComponents/inheritance/inheritance.module");
var wineryReadme_module_1 = require("../../wineryReadmeModule/wineryReadme.module");
var wineryLicense_module_1 = require("../../wineryLicenseModule/wineryLicense.module");
var NodeTypeModule = (function () {
    function NodeTypeModule() {
    }
    return NodeTypeModule;
}());
NodeTypeModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            visualAppearance_module_1.VisualAppearanceModule,
            instanceStates_module_1.InstanceStatesModule,
            propertiesDefinition_module_1.PropertiesDefinitionModule,
            inheritance_module_1.InheritanceModule,
            implementations_module_1.ImplementationsModule,
            ng2_select_1.SelectModule,
            winerySpinnerWithInfinity_module_1.SpinnerWithInfinityModule,
            wineryLoader_module_1.WineryLoaderModule,
            wineryQNameSelector_module_1.WineryQNameSelectorModule,
            wineryTable_module_1.WineryTableModule,
            winery_modal_module_1.WineryModalModule,
            wineryEditor_module_1.WineryEditorModule,
            nodeTypeRouter_module_1.NodeTypeRouterModule,
            wineryReadme_module_1.WineryReadmeModule,
            wineryLicense_module_1.WineryLicenseModule
        ],
        exports: [],
        declarations: [capOrReqDef_component_1.CapOrReqDefComponent],
        providers: [],
    })
], NodeTypeModule);
exports.NodeTypeModule = NodeTypeModule;
//# sourceMappingURL=nodeType.module.js.map