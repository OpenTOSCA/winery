"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var existService_1 = require("../wineryUtils/existService");
var util_1 = require("util");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var configuration_1 = require("../configuration");
/**
 * This component is for checking whether a given component already exists in the repository and displays it
 * accordingly.
 * <label>Inputs</label>
 * <ul>
 *     <li><code>generateData</code> This input of type {@link GenerateData} is mandatory and must contain all
 * necessary
 *     information for generating the url, such as the resource and resource type.
 *     </li>
 *     <li><code>modalRef</code> The modalRef is optional. You can give the reference to the modal which this component
 * is a part of. The reference is used to update the values each time the modal is shown.
 *     </li>
 * </ul>
 */
var WineryComponentExistsComponent = (function () {
    function WineryComponentExistsComponent(existService) {
        this.existService = existService;
    }
    WineryComponentExistsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!util_1.isNullOrUndefined(this.modalRef)) {
            this.modalRef.onShow.subscribe(function () { return _this.checkImplementationExists(); });
        }
    };
    WineryComponentExistsComponent.prototype.checkImplementationExists = function () {
        var _this = this;
        if (!util_1.isNullOrUndefined(this.generateData) && !util_1.isNullOrUndefined(this.generateData.toscaType)
            && !util_1.isNullOrUndefined(this.generateData.name) && this.generateData.name.length > 0) {
            this.generateData.url = configuration_1.backendBaseURL + '/'
                + this.generateData.toscaType + '/'
                + encodeURIComponent(encodeURIComponent(this.generateData.namespace)) + '/'
                + this.generateData.name + '/';
        }
        if (!this.generateData.namespace.endsWith('/')) {
            this.existService.check(this.generateData.url)
                .subscribe(function (data) { return _this.generateData.createComponent = false; }, function (error) { return _this.generateData.createComponent = true; });
        }
    };
    return WineryComponentExistsComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", GenerateData)
], WineryComponentExistsComponent.prototype, "generateData", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], WineryComponentExistsComponent.prototype, "modalRef", void 0);
WineryComponentExistsComponent = __decorate([
    core_1.Component({
        selector: 'winery-component-exists',
        templateUrl: './wineryComponentExists.component.html',
    }),
    __metadata("design:paramtypes", [existService_1.ExistService])
], WineryComponentExistsComponent);
exports.WineryComponentExistsComponent = WineryComponentExistsComponent;
var GenerateData = (function () {
    function GenerateData() {
    }
    return GenerateData;
}());
exports.GenerateData = GenerateData;
//# sourceMappingURL=wineryComponentExists.component.js.map