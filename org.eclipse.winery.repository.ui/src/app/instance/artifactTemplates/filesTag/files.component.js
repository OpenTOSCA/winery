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
var files_service_1 = require("./files.service.");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var configuration_1 = require("../../../configuration");
var instance_service_1 = require("../../instance.service");
var FilesComponent = (function () {
    function FilesComponent(service, sharedData, notify) {
        this.service = service;
        this.sharedData = sharedData;
        this.notify = notify;
        this.loading = true;
        this.baseUrl = configuration_1.hostURL;
        this.filesPath = configuration_1.backendBaseURL + this.sharedData.path + '/files/zip';
    }
    FilesComponent.prototype.ngOnInit = function () {
        this.loadFiles();
        this.uploadUrl = this.service.uploadUrl;
    };
    FilesComponent.prototype.loadFiles = function () {
        var _this = this;
        this.service.getFiles()
            .subscribe(function (data) { return _this.filesList = data.files; }, function (error) { return _this.handleError(error); });
    };
    FilesComponent.prototype.deleteFile = function (file) {
        this.fileToRemove = file;
        this.removeElementModal.show();
    };
    FilesComponent.prototype.onRemoveElement = function () {
        var _this = this;
        this.loading = true;
        this.service.delete(this.fileToRemove)
            .subscribe(function (data) { return _this.handleDelete(); }, function (error) { return _this.handleError(error); });
    };
    FilesComponent.prototype.handleDelete = function () {
        this.notify.success('Successfully deleted ' + this.fileToRemove.name);
        this.fileToRemove = null;
        this.loadFiles();
    };
    FilesComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return FilesComponent;
}());
__decorate([
    core_1.ViewChild('removeElementModal'),
    __metadata("design:type", Object)
], FilesComponent.prototype, "removeElementModal", void 0);
FilesComponent = __decorate([
    core_1.Component({
        templateUrl: 'files.component.html',
        styleUrls: [
            'files.component.css'
        ],
        providers: [
            files_service_1.FilesService
        ]
    }),
    __metadata("design:paramtypes", [files_service_1.FilesService, instance_service_1.InstanceService, wineryNotification_service_1.WineryNotificationService])
], FilesComponent);
exports.FilesComponent = FilesComponent;
//# sourceMappingURL=files.component.js.map