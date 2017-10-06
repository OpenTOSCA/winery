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
 */
var core_1 = require("@angular/core");
var wineryLicense_service_1 = require("./wineryLicense.service");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var instance_service_1 = require("../instance/instance.service");
var wineryLicense_enum_1 = require("./wineryLicense.enum");
var WineryLicenseComponent = (function () {
    function WineryLicenseComponent(service, notify, sharedData) {
        this.service = service;
        this.notify = notify;
        this.sharedData = sharedData;
        this.licenseText = '';
        this.intialLicenseText = '';
        this.licenseAvailable = true;
        this.licenseType = '';
        this.loading = true;
        this.isEditable = false;
        this.toscaType = this.sharedData.toscaComponent.toscaType;
        this.options = Object.keys(wineryLicense_enum_1.LicenseEnum).map(function (key) { return wineryLicense_enum_1.LicenseEnum[key]; });
    }
    WineryLicenseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getData().subscribe(function (data) {
            _this.licenseText = data;
            _this.intialLicenseText = data;
        }, function (error) { return _this.handleMissingLicense(); });
    };
    WineryLicenseComponent.prototype.saveLicenseFile = function () {
        var _this = this;
        this.service.save(this.licenseText).subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
    };
    WineryLicenseComponent.prototype.dropdownAction = function (item) {
        this.licenseType = item;
        this.licenseText = wineryLicense_enum_1.WineryLicense.getLicense(this.licenseType);
    };
    WineryLicenseComponent.prototype.cancelEdit = function () {
        this.licenseText = this.intialLicenseText;
        this.isEditable = false;
    };
    WineryLicenseComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    WineryLicenseComponent.prototype.handleMissingLicense = function () {
        this.loading = false;
        this.licenseAvailable = false;
    };
    WineryLicenseComponent.prototype.handleSave = function () {
        this.notify.success('Successfully saved LICENSE');
    };
    return WineryLicenseComponent;
}());
WineryLicenseComponent = __decorate([
    core_1.Component({
        templateUrl: 'wineryLicense.component.html',
        styleUrls: ['wineryLicense.component.css'],
        providers: [wineryLicense_service_1.WineryLicenseService]
    }),
    __metadata("design:paramtypes", [wineryLicense_service_1.WineryLicenseService, wineryNotification_service_1.WineryNotificationService, instance_service_1.InstanceService])
], WineryLicenseComponent);
exports.WineryLicenseComponent = WineryLicenseComponent;
//# sourceMappingURL=wineryLicense.component.js.map