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
 *     Lukas Balzer, Nicole Keppler - initial API and implementation
 */
var core_1 = require("@angular/core");
var tag_service_1 = require("./tag.service");
var tagsAPIData_1 = require("./tagsAPIData");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var util_1 = require("util");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var TagComponent = (function () {
    function TagComponent(service, noteService) {
        this.service = service;
        this.noteService = noteService;
        this.loading = false;
        this.tagsData = [];
        this.newTag = new tagsAPIData_1.TagsAPIData();
        this.columns = [
            { title: 'id', name: 'id', sort: true },
            { title: 'name', name: 'name', sort: true },
            { title: 'value', name: 'value', sort: true },
        ];
    }
    TagComponent.prototype.ngOnInit = function () {
        this.getTagsData();
    };
    TagComponent.prototype.onCellSelected = function (event) {
        this.selectedCell = event;
    };
    TagComponent.prototype.onRemoveClick = function () {
        if (util_1.isNullOrUndefined(this.selectedCell)) {
            this.noteService.error('no cell selected!');
        }
        else {
            this.confirmDeleteModal.show();
        }
    };
    TagComponent.prototype.onAddClick = function () {
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.tagsData, 'name');
        this.newTag = new tagsAPIData_1.TagsAPIData();
        this.addModal.show();
    };
    TagComponent.prototype.getTagsData = function () {
        var _this = this;
        this.service.getTagsData().subscribe(function (data) { return _this.handleTagsData(data); }, function (error) { return _this.handleError(error); });
    };
    TagComponent.prototype.addNewTag = function () {
        var _this = this;
        this.service.postTag(this.newTag).subscribe(function (data) { return _this.handleSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    TagComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.service.removeTagData(this.selectedCell).subscribe(function (data) { return _this.handleRemoveSuccess(); }, function (error) { return _this.handleError(error); });
    };
    TagComponent.prototype.handleSuccess = function (data) {
        this.newTag.id = data;
        this.tagsData.push(this.newTag);
        this.noteService.success('Added new Tag');
    };
    TagComponent.prototype.handleRemoveSuccess = function () {
        this.selectedCell = null;
        this.getTagsData();
        this.noteService.success('Removed Tag');
    };
    TagComponent.prototype.handleTagsData = function (data) {
        this.tagsData = data;
        this.loading = false;
    };
    TagComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.noteService.error('Action caused an error:\n', error);
    };
    return TagComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], TagComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], TagComponent.prototype, "addModal", void 0);
TagComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-tag',
        templateUrl: 'tag.component.html',
        providers: [tag_service_1.TagService, wineryNotification_service_1.WineryNotificationService]
    }),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        wineryNotification_service_1.WineryNotificationService])
], TagComponent);
exports.TagComponent = TagComponent;
//# sourceMappingURL=tag.component.js.map