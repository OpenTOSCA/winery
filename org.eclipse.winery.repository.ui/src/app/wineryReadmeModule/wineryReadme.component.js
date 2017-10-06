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
var wineryReadme_service_1 = require("./wineryReadme.service");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var instance_service_1 = require("../instance/instance.service");
var WineryReadmeComponent = (function () {
    function WineryReadmeComponent(service, notify, sharedData) {
        this.service = service;
        this.notify = notify;
        this.sharedData = sharedData;
        this.loading = true;
        this.readmeContent = '';
        this.initialReadmeContent = '';
        this.isEditable = false;
        this.readmeAvailable = true;
        this.toscaType = this.sharedData.toscaComponent.toscaType;
    }
    WineryReadmeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getData().subscribe(function (data) {
            _this.readmeContent = data;
            _this.initialReadmeContent = data;
        }, function (error) { return _this.handleMissingReadme(); });
    };
    WineryReadmeComponent.prototype.saveReadmeFile = function () {
        var _this = this;
        this.service.save(this.readmeContent).subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
    };
    WineryReadmeComponent.prototype.cancelEdit = function () {
        this.isEditable = false;
        this.readmeContent = this.initialReadmeContent;
    };
    WineryReadmeComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    WineryReadmeComponent.prototype.handleMissingReadme = function () {
        this.loading = false;
        this.readmeAvailable = false;
    };
    WineryReadmeComponent.prototype.handleSave = function () {
        this.notify.success('Successfully saved README.md');
    };
    return WineryReadmeComponent;
}());
WineryReadmeComponent = __decorate([
    core_1.Component({
        templateUrl: 'wineryReadme.component.html',
        styleUrls: ['wineryReadme.component.css'],
        providers: [wineryReadme_service_1.ReadmeService]
    }),
    __metadata("design:paramtypes", [wineryReadme_service_1.ReadmeService, wineryNotification_service_1.WineryNotificationService, instance_service_1.InstanceService])
], WineryReadmeComponent);
exports.WineryReadmeComponent = WineryReadmeComponent;
//# sourceMappingURL=wineryReadme.component.js.map