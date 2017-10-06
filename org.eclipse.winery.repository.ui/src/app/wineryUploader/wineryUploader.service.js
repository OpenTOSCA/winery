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
 *     Niko Stadelmaier - module refactoring
 */
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var util_1 = require("util");
var WineryUploaderService = (function () {
    function WineryUploaderService() {
    }
    Object.defineProperty(WineryUploaderService.prototype, "uploader", {
        get: function () {
            return this.fileUploader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WineryUploaderService.prototype, "uploadUrl", {
        set: function (url) {
            var _this = this;
            if (util_1.isNullOrUndefined(this.fileUploader)) {
                this.fileUploader = new ng2_file_upload_1.FileUploader({ url: url });
                if (!util_1.isNullOrUndefined(this.method)) {
                    this.fileUploader.onAfterAddingFile = function (item) {
                        item.method = _this.method;
                    };
                }
            }
            else {
                this.fileUploader.setOptions({ url: url });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WineryUploaderService.prototype, "uploadMethod", {
        set: function (method) {
            var _this = this;
            this.method = method;
            if (!util_1.isNullOrUndefined(this.fileUploader)) {
                this.fileUploader.onAfterAddingFile = function (item) {
                    item.method = _this.method;
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    return WineryUploaderService;
}());
WineryUploaderService = __decorate([
    core_1.Injectable()
], WineryUploaderService);
exports.WineryUploaderService = WineryUploaderService;
//# sourceMappingURL=wineryUploader.service.js.map