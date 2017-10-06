/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
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
var core_1 = require("@angular/core");
var artifactSource_service_1 = require("./artifactSource.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryEditor_component_1 = require("../../../wineryEditorModule/wineryEditor.component");
var ArtifactResourceApiData_1 = require("./ArtifactResourceApiData");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var configuration_1 = require("../../../configuration");
var instance_service_1 = require("../../instance.service");
var ArtifactSourceComponent = (function () {
    function ArtifactSourceComponent(service, notify, sharedData) {
        this.service = service;
        this.notify = notify;
        this.sharedData = sharedData;
        this.loading = true;
        this.baseUrl = configuration_1.hostURL;
        this.selectedFile = null;
        this.srcPath = configuration_1.backendBaseURL + this.sharedData.path + '/source/zip';
    }
    ArtifactSourceComponent.prototype.ngOnInit = function () {
        this.loadFiles();
        this.uploadUrl = this.service.uploadUrl;
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.filesList, 'name');
    };
    ArtifactSourceComponent.prototype.loadFiles = function () {
        var _this = this;
        this.loading = true;
        this.service.getFiles()
            .subscribe(function (data) { return _this.handleLoadFiles(data.files); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.editFile = function (file) {
        var _this = this;
        if (this.selectedFile == null || (file.name !== this.selectedFile.name && this.checkFileChanges())) {
            this.service.getFile(file)
                .subscribe(function (data) { return _this.handleEditorChange(file, data); }, function (error) { return _this.handleError(error); });
        }
    };
    ArtifactSourceComponent.prototype.saveEditorContent = function () {
        var _this = this;
        if (this.fileContent != null && this.fileContent !== this.editor.getData()) {
            this.fileContent = this.editor.getData();
            var fileAPI = new ArtifactResourceApiData_1.ArtifactResourceApiData();
            fileAPI.setContent(this.fileContent);
            fileAPI.setFileName(this.selectedFile.name);
            this.service.postToSources(fileAPI)
                .subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
        }
    };
    ArtifactSourceComponent.prototype.copyAllSrc = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var name_1 = this_1.filesList[i].name;
            this_1.service.getFile(this_1.filesList[i])
                .subscribe(function (data) { return _this.pushToFiles(name_1, data); }, function (error) { return _this.handleError(error); });
        };
        var this_1 = this;
        for (var i = 0; i < this.filesList.length; i++) {
            _loop_1(i);
        }
    };
    ArtifactSourceComponent.prototype.openRenameDialog = function () {
        this.renameFileName = this.selectedFile.name;
        this.renameFileModal.show();
    };
    ArtifactSourceComponent.prototype.renameSelection = function () {
        var _this = this;
        var apiData = new ArtifactResourceApiData_1.ArtifactResourceApiData();
        apiData.setFileName(this.renameFileName);
        apiData.setContent(this.fileContent);
        this.service.postToSources(apiData)
            .subscribe(function (data) { return _this.onRename(); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.undoFileChanges = function () {
        this.editor.setData(this.fileContent);
        this.saveCurrentFileModal.hide();
    };
    ArtifactSourceComponent.prototype.onCreateNewFile = function () {
        this.newFileName = '';
        this.createNewFileModel.show();
    };
    ArtifactSourceComponent.prototype.createNewFile = function () {
        var _this = this;
        this.loading = true;
        var newFile = new ArtifactResourceApiData_1.ArtifactResourceApiData();
        newFile.setFileName(this.newFileName);
        this.service.postToSources(newFile)
            .subscribe(function (data) { return _this.handleCreate(); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.onRemoveElement = function () {
        var _this = this;
        this.loading = true;
        this.service.deleteFile(this.selectedFile)
            .subscribe(function (data) { return _this.handleDelete(); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.onRename = function () {
        var _this = this;
        this.service.deleteFile(this.selectedFile).subscribe(function (data) { return _this.handleRename(); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.checkFileChanges = function () {
        if (this.fileContent != null && this.fileContent !== this.editor.getData()) {
            this.saveCurrentFileModal.show();
            return false;
        }
        return true;
    };
    ArtifactSourceComponent.prototype.pushToFiles = function (fileName, content) {
        var _this = this;
        var apiData = new ArtifactResourceApiData_1.ArtifactResourceApiData();
        apiData.setContent(content);
        apiData.setFileName(fileName);
        this.service.postToFiles(apiData)
            .subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
    };
    ArtifactSourceComponent.prototype.handleCreate = function () {
        this.notify.success('Successfully Created ' + this.newFileName);
        this.loadFiles();
        this.loading = false;
    };
    ArtifactSourceComponent.prototype.handleEditorChange = function (file, content) {
        this.fileContent = content;
        this.selectedFile = file;
        this.editor.setData(content);
    };
    ArtifactSourceComponent.prototype.handleRename = function () {
        this.notify.success('Successfully renamed ' + this.selectedFile.name + ' to ' + this.renameFileName);
        this.selectedFile = null;
        this.renameFileName = null;
        this.loadFiles();
        this.invalidateEditor();
        this.loading = false;
    };
    ArtifactSourceComponent.prototype.handleDelete = function () {
        this.notify.success('Successfully deleted ' + this.selectedFile.name);
        this.selectedFile = null;
        this.loadFiles();
        this.invalidateEditor();
        this.loading = false;
    };
    ArtifactSourceComponent.prototype.handleSave = function () {
        this.notify.success('Successfully Saved ' + this.selectedFile.name);
    };
    ArtifactSourceComponent.prototype.handleLoadFiles = function (files) {
        this.filesList = files;
        this.loading = false;
    };
    ArtifactSourceComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    ArtifactSourceComponent.prototype.invalidateEditor = function () {
        this.editor.setData('');
        this.selectedFile = null;
        this.fileContent = null;
    };
    return ArtifactSourceComponent;
}());
__decorate([
    core_1.ViewChild('removeElementModal'),
    __metadata("design:type", Object)
], ArtifactSourceComponent.prototype, "removeElementModal", void 0);
__decorate([
    core_1.ViewChild('saveCurrentFileModal'),
    __metadata("design:type", Object)
], ArtifactSourceComponent.prototype, "saveCurrentFileModal", void 0);
__decorate([
    core_1.ViewChild('createNewFileModal'),
    __metadata("design:type", Object)
], ArtifactSourceComponent.prototype, "createNewFileModel", void 0);
__decorate([
    core_1.ViewChild('renameFileModal'),
    __metadata("design:type", Object)
], ArtifactSourceComponent.prototype, "renameFileModal", void 0);
__decorate([
    core_1.ViewChild('artifactsEditor'),
    __metadata("design:type", wineryEditor_component_1.WineryEditorComponent)
], ArtifactSourceComponent.prototype, "editor", void 0);
ArtifactSourceComponent = __decorate([
    core_1.Component({
        templateUrl: 'artifactSource.component.html',
        styleUrls: [
            'artifactSource.component.css'
        ],
        providers: [
            artifactSource_service_1.ArtifactSourceService
        ]
    }),
    __metadata("design:paramtypes", [artifactSource_service_1.ArtifactSourceService,
        wineryNotification_service_1.WineryNotificationService,
        instance_service_1.InstanceService])
], ArtifactSourceComponent);
exports.ArtifactSourceComponent = ArtifactSourceComponent;
//# sourceMappingURL=artifactSource.component.js.map