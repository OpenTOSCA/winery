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
var urlEncode_pipe_1 = require("./urlEncode.pipe");
var urlDecode_pipe_1 = require("./urlDecode.pipe");
var removeWhiteSpaces_pipe_1 = require("./removeWhiteSpaces.pipe");
var toscaTypeToCamelCase_pipe_1 = require("./toscaTypeToCamelCase.pipe");
var toscaTypeToReadableName_pipe_1 = require("./toscaTypeToReadableName.pipe");
var WineryPipesModule = (function () {
    function WineryPipesModule() {
    }
    return WineryPipesModule;
}());
WineryPipesModule = __decorate([
    core_1.NgModule({
        imports: [],
        exports: [
            toscaTypeToCamelCase_pipe_1.ToscaTypeToCamelCase,
            toscaTypeToReadableName_pipe_1.ToscaTypeToReadableNamePipe,
            removeWhiteSpaces_pipe_1.RemoveWhiteSpacesPipe,
            urlDecode_pipe_1.UrlDecodePipe,
            urlEncode_pipe_1.UrlEncodePipe
        ],
        declarations: [
            toscaTypeToCamelCase_pipe_1.ToscaTypeToCamelCase,
            toscaTypeToReadableName_pipe_1.ToscaTypeToReadableNamePipe,
            removeWhiteSpaces_pipe_1.RemoveWhiteSpacesPipe,
            urlDecode_pipe_1.UrlDecodePipe,
            urlEncode_pipe_1.UrlEncodePipe,
        ],
        providers: [],
    })
], WineryPipesModule);
exports.WineryPipesModule = WineryPipesModule;
//# sourceMappingURL=wineryPipes.module.js.map