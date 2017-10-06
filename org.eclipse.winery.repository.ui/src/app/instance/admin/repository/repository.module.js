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
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var repository_component_1 = require("./repository.component");
var wineryUploader_module_1 = require("../../../wineryUploader/wineryUploader.module");
var repository_service_1 = require("./repository.service");
var winery_modal_module_1 = require("../../../wineryModalModule/winery.modal.module");
var RepositoryModule = (function () {
    function RepositoryModule() {
    }
    return RepositoryModule;
}());
RepositoryModule = __decorate([
    core_1.NgModule({
        imports: [
            wineryUploader_module_1.WineryUploaderModule,
            winery_modal_module_1.WineryModalModule
        ],
        exports: [repository_component_1.RepositoryComponent],
        declarations: [repository_component_1.RepositoryComponent],
        providers: [repository_service_1.RepositoryService],
    })
], RepositoryModule);
exports.RepositoryModule = RepositoryModule;
//# sourceMappingURL=repository.module.js.map