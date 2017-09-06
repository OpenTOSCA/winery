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
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ng2_table_1 = require("ng2-table");
var wineryTable_component_1 = require("./wineryTable.component");
/**
 * This module must be imported in order to use the {@link WineryTableComponent}.
 * Documentation on how to use this component can also be found at the {@link WineryTableComponent}.
 */
var WineryTableModule = (function () {
    function WineryTableModule() {
    }
    return WineryTableModule;
}());
WineryTableModule = __decorate([
    core_1.NgModule({
        imports: [
            ngx_bootstrap_1.PaginationModule.forRoot(),
            ng2_table_1.Ng2TableModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
        ],
        exports: [wineryTable_component_1.WineryTableComponent],
        declarations: [wineryTable_component_1.WineryTableComponent],
        providers: [],
    })
], WineryTableModule);
exports.WineryTableModule = WineryTableModule;
//# sourceMappingURL=wineryTable.module.js.map