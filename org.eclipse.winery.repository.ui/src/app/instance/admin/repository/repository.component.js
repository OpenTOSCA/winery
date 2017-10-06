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
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var repository_service_1 = require("./repository.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var configuration_1 = require("../../../configuration");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var RepositoryComponent = (function () {
    function RepositoryComponent(service, notify) {
        this.service = service;
        this.notify = notify;
    }
    RepositoryComponent.prototype.ngOnInit = function () {
        this.path = configuration_1.backendBaseURL + this.service.path + '/';
    };
    RepositoryComponent.prototype.clearRepository = function () {
        var _this = this;
        this.service.clearRepository().subscribe(function (data) { return _this.handleSuccess('Repository cleared'); }, function (error) { return _this.handleError(error); });
    };
    RepositoryComponent.prototype.handleSuccess = function (message) {
        this.notify.success(message);
    };
    RepositoryComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString());
    };
    return RepositoryComponent;
}());
__decorate([
    core_1.ViewChild('uploaderModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], RepositoryComponent.prototype, "uploaderModal", void 0);
RepositoryComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-repository',
        templateUrl: 'repository.component.html'
    }),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService,
        wineryNotification_service_1.WineryNotificationService])
], RepositoryComponent);
exports.RepositoryComponent = RepositoryComponent;
//# sourceMappingURL=repository.component.js.map