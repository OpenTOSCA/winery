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
 *     Niko Stadelmaier - add PropertyMappingsComponent
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var boundaryDefinitions_component_1 = require("./boundaryDefinitions.component");
var ng2_file_upload_1 = require("ng2-file-upload");
var router_1 = require("@angular/router");
var instance_service_1 = require("../../instance.service");
var propertyMappings_component_1 = require("./propertyMappings/propertyMappings.component");
var propertyConstraints_component_1 = require("./propertyConstraints/propertyConstraints.component");
var requirements_component_1 = require("./requirements/requirements.component");
var wineryTable_module_1 = require("../../../wineryTableModule/wineryTable.module");
var requirementsOrCapabilities_component_1 = require("./requirementsOrCapabilities/requirementsOrCapabilities.component");
var capabilities_component_1 = require("./capabilities/capabilities.component");
var wineryLoader_module_1 = require("../../../wineryLoader/wineryLoader.module");
var wineryDuplicateValidator_module_1 = require("../../../wineryValidators/wineryDuplicateValidator.module");
var policies_component_1 = require("./policies/policies.component");
var ng2_select_1 = require("ng2-select");
var editXML_component_1 = require("../../sharedComponents/editXML/editXML.component");
var editXML_module_1 = require("../../sharedComponents/editXML/editXML.module");
var interfaces_component_1 = require("../../sharedComponents/interfaces/interfaces.component");
var interfaces_module_1 = require("../../sharedComponents/interfaces/interfaces.module");
var wineryQNameSelector_module_1 = require("../../../wineryQNameSelector/wineryQNameSelector.module");
exports.boundaryDefinitionsRoutes = [
    { path: 'properties', component: editXML_component_1.EditXMLComponent },
    { path: 'propertymappings', component: propertyMappings_component_1.PropertyMappingsComponent },
    { path: 'propertyconstraints', component: propertyConstraints_component_1.PropertyConstraintsComponent },
    { path: 'requirements', component: requirements_component_1.RequirementsComponent },
    { path: 'capabilities', component: capabilities_component_1.CapabilitiesComponent },
    { path: 'policies', component: policies_component_1.PoliciesComponent },
    { path: 'interfaces', component: interfaces_component_1.InterfacesComponent },
    { path: 'xml', component: editXML_component_1.EditXMLComponent },
    { path: '', redirectTo: 'properties', pathMatch: 'full' }
];
var BoundaryDefinitionsModule = (function () {
    function BoundaryDefinitionsModule() {
    }
    return BoundaryDefinitionsModule;
}());
BoundaryDefinitionsModule = __decorate([
    core_1.NgModule({
        imports: [
            forms_1.FormsModule,
            wineryLoader_module_1.WineryLoaderModule,
            common_1.CommonModule,
            winery_modal_module_1.WineryModalModule,
            ng2_file_upload_1.FileUploadModule,
            ng2_select_1.SelectModule,
            interfaces_module_1.InterfacesModule,
            wineryTable_module_1.WineryTableModule,
            wineryDuplicateValidator_module_1.WineryDuplicateValidatorModule,
            editXML_module_1.WineryEditXMLModule,
            wineryQNameSelector_module_1.WineryQNameSelectorModule,
            router_1.RouterModule
            // RouterModule.forChild(boundaryDefinitionsRoutes),
        ],
        exports: [
            router_1.RouterModule
        ],
        declarations: [
            boundaryDefinitions_component_1.BoundaryDefinitionsComponent,
            policies_component_1.PoliciesComponent,
            propertyConstraints_component_1.PropertyConstraintsComponent,
            propertyMappings_component_1.PropertyMappingsComponent,
            requirements_component_1.RequirementsComponent,
            capabilities_component_1.CapabilitiesComponent,
            requirementsOrCapabilities_component_1.RequirementsOrCapabilitiesComponent,
        ],
        providers: [
            instance_service_1.InstanceService
        ]
    })
], BoundaryDefinitionsModule);
exports.BoundaryDefinitionsModule = BoundaryDefinitionsModule;
//# sourceMappingURL=boundaryDefinitions.module.js.map