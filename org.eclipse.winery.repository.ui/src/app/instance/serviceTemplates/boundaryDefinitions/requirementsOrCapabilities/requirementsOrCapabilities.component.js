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
var requirementsOrCapabilitiesApiData_1 = require("./requirementsOrCapabilitiesApiData");
var requirementsOrCapabilities_service_1 = require("./requirementsOrCapabilities.service");
var wineryNotification_service_1 = require("../../../../wineryNotificationModule/wineryNotification.service");
var util_1 = require("util");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var RequirementsOrCapabilitiesComponent = (function () {
    function RequirementsOrCapabilitiesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.singleItem = '';
        this.title = '';
        this.columns = [
            { title: 'Name', name: 'name', sort: true },
            { title: 'Reference', name: 'ref', sort: true },
        ];
        this.loading = true;
        this.edit = false;
        this.reqOrCapToBeAdded = new requirementsOrCapabilitiesApiData_1.RequirementOrCapability();
    }
    RequirementsOrCapabilitiesComponent.prototype.ngOnInit = function () {
        this.getRequirementsOrCapabilities();
    };
    // region ########## Template Callbacks ##########
    RequirementsOrCapabilitiesComponent.prototype.onCellSelected = function (selectedItem) {
        this.currentSelected = selectedItem.row;
    };
    RequirementsOrCapabilitiesComponent.prototype.onAddClick = function () {
        this.addOrChange = 'Add ';
        this.currentSelected = null;
        this.addReqOrCapModal.show();
    };
    RequirementsOrCapabilitiesComponent.prototype.onEditClick = function (reqOrCap) {
        if (!util_1.isNullOrUndefined(reqOrCap)) {
            this.addOrChange = 'Change ';
            this.edit = true;
            this.reqOrCapToBeAdded.name = reqOrCap.name;
            this.reqOrCapToBeAdded.ref = reqOrCap.ref;
            this.currentSelected = reqOrCap;
            this.addReqOrCapModal.show();
        }
        else {
            return;
        }
    };
    RequirementsOrCapabilitiesComponent.prototype.onDeleteClick = function () {
        if (!util_1.isNullOrUndefined(this.currentSelected)) {
            this.confirmDeleteModal.show();
        }
        else {
            return;
        }
    };
    RequirementsOrCapabilitiesComponent.prototype.onRemoveClick = function (reqOrCap) {
        if (!util_1.isNullOrUndefined(reqOrCap)) {
            this.currentSelected = reqOrCap;
            this.confirmDeleteModal.show();
        }
        else {
            return;
        }
    };
    RequirementsOrCapabilitiesComponent.prototype.cancelBtnClicked = function () {
        this.addReqOrCapModal.hide();
        this.edit = false;
    };
    RequirementsOrCapabilitiesComponent.prototype.removeConfirmed = function () {
        this.edit = false;
        this.addReqOrCapModal.hide();
        this.confirmDeleteModal.hide();
        this.deleteReqOrCap(this.currentSelected.id);
    };
    RequirementsOrCapabilitiesComponent.prototype.addConfirmed = function () {
        this.addReqOrCapModal.hide();
        this.addNewRequirementOrCapability();
    };
    RequirementsOrCapabilitiesComponent.prototype.updateConfirmed = function () {
        this.addReqOrCapModal.hide();
        this.addNewRequirementOrCapability();
    };
    // endregion
    // region ########## Private Methods ##########
    RequirementsOrCapabilitiesComponent.prototype.getRequirementsOrCapabilities = function () {
        var _this = this;
        this.loading = true;
        this.service.getRequirementsOrCapabilities().subscribe(function (data) { return _this.handleRequirementsOrCapabilitiesData(data); }, function (error) { return _this.handleError(error); });
    };
    RequirementsOrCapabilitiesComponent.prototype.handleRequirementsOrCapabilitiesData = function (data) {
        this.requirementsOrCapabilitiesList = data;
        this.requirementsOrCapabilitiesList = this.requirementsOrCapabilitiesList.map(function (obj) {
            if (obj.ref.id === null) {
                obj.ref = '';
            }
            else {
                obj.ref = obj.ref.id;
            }
            return obj;
        });
        this.loading = false;
    };
    RequirementsOrCapabilitiesComponent.prototype.handleError = function (error) {
        this.notify.error(error);
        this.loading = false;
    };
    RequirementsOrCapabilitiesComponent.prototype.addNewRequirementOrCapability = function () {
        var _this = this;
        this.loading = false;
        this.service.sendPostRequest(this.reqOrCapToBeAdded).subscribe(function (data) { return _this.handlePostResponse(); }, function (error) { return _this.handleError(error); });
    };
    RequirementsOrCapabilitiesComponent.prototype.handlePostResponse = function () {
        this.loading = false;
        if (this.edit) {
            this.deleteReqOrCap(this.currentSelected.id);
        }
        else {
            this.notify.success('new ' + this.singleItem + this.reqOrCapToBeAdded.name + ' added');
            this.getRequirementsOrCapabilities();
        }
    };
    RequirementsOrCapabilitiesComponent.prototype.deleteReqOrCap = function (id) {
        var _this = this;
        this.service.deleteCapOrReqDef(id)
            .subscribe(function (data) { return _this.handleCapOrReqDelete(); }, function (error) { return _this.handleError(error); });
    };
    RequirementsOrCapabilitiesComponent.prototype.handleCapOrReqDelete = function () {
        if (this.edit) {
            this.notify.success(this.singleItem + ' id: ' + this.currentSelected.id + ' updated');
        }
        else {
            this.notify.success(this.singleItem + ' id: ' + this.currentSelected.id + ' name: ' + this.currentSelected.name + ' deleted');
        }
        this.loading = false;
        this.currentSelected = null;
        this.edit = false;
        this.getRequirementsOrCapabilities();
    };
    return RequirementsOrCapabilitiesComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RequirementsOrCapabilitiesComponent.prototype, "singleItem", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RequirementsOrCapabilitiesComponent.prototype, "title", void 0);
__decorate([
    core_1.ViewChild('addReqOrCapModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], RequirementsOrCapabilitiesComponent.prototype, "addReqOrCapModal", void 0);
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], RequirementsOrCapabilitiesComponent.prototype, "confirmDeleteModal", void 0);
RequirementsOrCapabilitiesComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-requirements-or-capabilities',
        templateUrl: 'requirementsOrCapabilities.component.html',
        providers: [
            requirementsOrCapabilities_service_1.RequirementsOrCapabilitiesService
        ]
    }),
    __metadata("design:paramtypes", [requirementsOrCapabilities_service_1.RequirementsOrCapabilitiesService,
        wineryNotification_service_1.WineryNotificationService])
], RequirementsOrCapabilitiesComponent);
exports.RequirementsOrCapabilitiesComponent = RequirementsOrCapabilitiesComponent;
//# sourceMappingURL=requirementsOrCapabilities.component.js.map