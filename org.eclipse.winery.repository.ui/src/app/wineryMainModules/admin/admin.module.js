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
var adminRouter_module_1 = require("./adminRouter.module");
var logger_component_1 = require("../../instance/admin/logger/logger.component");
var namespaces_component_1 = require("../../instance/admin/namespaces/namespaces.component");
var typeWithShortName_component_1 = require("../../instance/admin/typesWithShortName/typeWithShortName.component");
var winery_modal_module_1 = require("../../wineryModalModule/winery.modal.module");
var wineryTable_module_1 = require("../../wineryTableModule/wineryTable.module");
var repository_module_1 = require("../../instance/admin/repository/repository.module");
var wineryLoader_module_1 = require("../../wineryLoader/wineryLoader.module");
var common_1 = require("@angular/common");
var wineryDuplicateValidator_module_1 = require("../../wineryValidators/wineryDuplicateValidator.module");
var wineryNamespaceSelector_module_1 = require("../../wineryNamespaceSelector/wineryNamespaceSelector.module");
var forms_1 = require("@angular/forms");
var AdminModule = (function () {
    function AdminModule() {
    }
    return AdminModule;
}());
AdminModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            repository_module_1.RepositoryModule,
            wineryDuplicateValidator_module_1.WineryDuplicateValidatorModule,
            wineryLoader_module_1.WineryLoaderModule,
            winery_modal_module_1.WineryModalModule,
            wineryTable_module_1.WineryTableModule,
            wineryNamespaceSelector_module_1.WineryNamespaceSelectorModule,
            adminRouter_module_1.AdminRouterModule,
        ],
        declarations: [
            namespaces_component_1.NamespacesComponent,
            logger_component_1.LoggerComponent,
            typeWithShortName_component_1.TypeWithShortNameComponent
        ]
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map