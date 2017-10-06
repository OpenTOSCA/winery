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
var util_1 = require("util");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var instance_service_1 = require("../../instance.service");
var inheritance_service_1 = require("./inheritance.service");
var InheritanceComponent = (function () {
    function InheritanceComponent(sharedData, service, notify) {
        this.sharedData = sharedData;
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.openSuperClassLink = '';
    }
    InheritanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getInheritanceData()
            .subscribe(function (data) { return _this.handleInheritanceData(data); }, function (error) { return _this.handleError(error); });
        this.service.getAvailableSuperClasses()
            .subscribe(function (data) { return _this.handleSuperClassData(data); }, function (error) { return _this.handleError(error); });
        this.toscaType = this.sharedData.toscaComponent.toscaType;
    };
    InheritanceComponent.prototype.onSelectedValueChanged = function (value) {
        this.inheritanceApiData.derivedFrom = value.id;
        this.setButtonLink();
    };
    InheritanceComponent.prototype.saveToServer = function () {
        var _this = this;
        this.loading = true;
        this.service.saveInheritanceData(this.inheritanceApiData)
            .subscribe(function (data) { return _this.handlePutResponse(data); }, function (error) { return _this.handleError(error); });
    };
    InheritanceComponent.prototype.handleInheritanceData = function (inheritance) {
        this.inheritanceApiData = inheritance;
        this.initialActiveItem = [{ 'id': this.inheritanceApiData.derivedFrom, 'text': this.inheritanceApiData.derivedFrom.split('}').pop() }];
        if (!util_1.isNullOrUndefined(this.availableSuperClasses)) {
            this.loading = false;
        }
    };
    InheritanceComponent.prototype.handleSuperClassData = function (superClasses) {
        this.availableSuperClasses = superClasses;
        if (!util_1.isNullOrUndefined(this.inheritanceApiData)) {
            this.loading = false;
        }
    };
    InheritanceComponent.prototype.handlePutResponse = function (response) {
        this.loading = false;
        this.notify.success('Saved changes', 'Success');
    };
    InheritanceComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error.toString(), 'Error');
    };
    InheritanceComponent.prototype.setButtonLink = function () {
        if (util_1.isNullOrUndefined(this.inheritanceApiData.derivedFrom)) {
            this.inheritanceApiData.derivedFrom = '(none)';
        }
        var parts = this.inheritanceApiData.derivedFrom.split('}');
        // can be '(none)'
        if (parts.length > 1) {
            var namespace = parts[0].slice(1);
            var name_1 = parts[1];
            this.openSuperClassLink = '/' + 'nodetypes' + '/' + encodeURIComponent(encodeURIComponent(namespace)) + '/' + name_1;
        }
    };
    return InheritanceComponent;
}());
__decorate([
    core_1.ViewChild('derivedFromSelector'),
    __metadata("design:type", Object)
], InheritanceComponent.prototype, "aboutModal", void 0);
InheritanceComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-inheritance',
        templateUrl: 'inheritance.component.html',
        providers: [inheritance_service_1.InheritanceService],
    }),
    __metadata("design:paramtypes", [instance_service_1.InstanceService,
        inheritance_service_1.InheritanceService,
        wineryNotification_service_1.WineryNotificationService])
], InheritanceComponent);
exports.InheritanceComponent = InheritanceComponent;
//# sourceMappingURL=inheritance.component.js.map