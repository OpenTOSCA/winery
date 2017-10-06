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
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var wineryMarkdown_component_1 = require("./wineryMarkdown.component");
var angular2_markdown_1 = require("angular2-markdown");
var WineryMarkdownModule = (function () {
    function WineryMarkdownModule() {
    }
    return WineryMarkdownModule;
}());
WineryMarkdownModule = __decorate([
    core_1.NgModule({
        imports: [
            forms_1.FormsModule,
            platform_browser_1.BrowserModule,
            angular2_markdown_1.MarkdownModule.forRoot(),
        ],
        exports: [wineryMarkdown_component_1.WineryMarkdownComponent],
        declarations: [wineryMarkdown_component_1.WineryMarkdownComponent],
        providers: [],
    })
], WineryMarkdownModule);
exports.WineryMarkdownModule = WineryMarkdownModule;
//# sourceMappingURL=wineryMarkdown.module.js.map