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
var requiredCapabilityType_service_1 = require("./requiredCapabilityType.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var RequiredCapabilityTypeComponent = (function () {
    function RequiredCapabilityTypeComponent(notify, service) {
        this.notify = notify;
        this.service = service;
        this.loading = true;
    }
    RequiredCapabilityTypeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getRequiredCapabilityTypeData()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.notify.error(error); });
    };
    RequiredCapabilityTypeComponent.prototype.changedCapType = function (event) {
        this.selectedCapType = event.value;
    };
    RequiredCapabilityTypeComponent.prototype.save = function () {
        var _this = this;
        if (this.selectedCapType === '(none)') {
            this.service.delete()
                .subscribe(function () { return _this.notify.success('Successfully removed required Capability-Type!'); }, function (error) { return _this.notify.error(error); });
        }
        else {
            this.service.save(this.selectedCapType)
                .subscribe(function () { return _this.notify.success('Successfully saved required Capability-Type!'); }, function (error) { return _this.notify.error(error); });
        }
    };
    RequiredCapabilityTypeComponent.prototype.handleData = function (data) {
        this.loading = false;
        this.requiredCapTypeData = data;
    };
    return RequiredCapabilityTypeComponent;
}());
RequiredCapabilityTypeComponent = __decorate([
    core_1.Component({
        templateUrl: 'requiredCapabilityType.component.html',
        providers: [
            requiredCapabilityType_service_1.RequiredCapabilityTypeService
        ]
    }),
    __metadata("design:paramtypes", [wineryNotification_service_1.WineryNotificationService, requiredCapabilityType_service_1.RequiredCapabilityTypeService])
], RequiredCapabilityTypeComponent);
exports.RequiredCapabilityTypeComponent = RequiredCapabilityTypeComponent;
//# sourceMappingURL=requiredCapabilityType.component.js.map