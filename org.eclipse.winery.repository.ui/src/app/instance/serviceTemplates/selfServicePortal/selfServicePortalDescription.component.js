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
var selfServicePortal_service_1 = require("./selfServicePortal.service");
var util_1 = require("util");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var SelfServiceDescriptionComponent = (function () {
    function SelfServiceDescriptionComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
    }
    SelfServiceDescriptionComponent.prototype.ngOnInit = function () {
        if (!util_1.isNullOrUndefined(this.service.selfServiceData)) {
            this.data = this.service.selfServiceData;
            this.loading = false;
        }
        else {
            this.getSelfServiceData();
        }
    };
    SelfServiceDescriptionComponent.prototype.getSelfServiceData = function () {
        var _this = this;
        this.service.getSelfServiceData().subscribe(function (data) { return _this.handleData(); }, function (error) { return _this.notify.error(error.toString()); });
    };
    SelfServiceDescriptionComponent.prototype.save = function () {
        var _this = this;
        this.service.saveName(this.data.displayName).subscribe(function (dataName) {
            _this.handleSuccess('Saved name');
            _this.service.saveDescription(_this.data.description).subscribe(function () { return _this.handleSuccess('Saved description'); }, function (error) { return _this.handleError(error.toString()); });
        }, function (error) { return _this.handleError(error.toString()); });
    };
    SelfServiceDescriptionComponent.prototype.handleData = function () {
        this.data = this.service.selfServiceData;
        this.loading = false;
        // this.notify.success('');
    };
    SelfServiceDescriptionComponent.prototype.handleSuccess = function (message) {
        this.notify.success(message);
    };
    SelfServiceDescriptionComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString());
    };
    return SelfServiceDescriptionComponent;
}());
SelfServiceDescriptionComponent = __decorate([
    core_1.Component({
        selector: 'winery-self-service-portal-description',
        templateUrl: 'selfServicePortalDescription.component.html'
    }),
    __metadata("design:paramtypes", [selfServicePortal_service_1.SelfServicePortalService,
        wineryNotification_service_1.WineryNotificationService])
], SelfServiceDescriptionComponent);
exports.SelfServiceDescriptionComponent = SelfServiceDescriptionComponent;
//# sourceMappingURL=selfServicePortalDescription.component.js.map