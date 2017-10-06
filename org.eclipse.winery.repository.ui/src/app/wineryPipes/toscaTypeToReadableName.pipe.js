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
var utils_1 = require("../wineryUtils/utils");
var ToscaTypeToReadableNamePipe = (function () {
    function ToscaTypeToReadableNamePipe() {
    }
    ToscaTypeToReadableNamePipe.prototype.transform = function (value, args) {
        if (value) {
            return utils_1.Utils.getToscaTypeNameFromToscaType(value);
        }
        else {
            return '';
        }
    };
    return ToscaTypeToReadableNamePipe;
}());
ToscaTypeToReadableNamePipe = __decorate([
    core_1.Pipe({
        name: 'toscaTypeToReadableName'
    })
], ToscaTypeToReadableNamePipe);
exports.ToscaTypeToReadableNamePipe = ToscaTypeToReadableNamePipe;
//# sourceMappingURL=toscaTypeToReadableName.pipe.js.map