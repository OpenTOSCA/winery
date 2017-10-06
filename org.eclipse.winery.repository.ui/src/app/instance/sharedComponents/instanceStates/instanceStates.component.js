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
var instanceStates_service_1 = require("./instanceStates.service");
var InstanceStateApiData_1 = require("./InstanceStateApiData");
var util_1 = require("util");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var InstanceStatesComponent = (function () {
    function InstanceStatesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.elementToRemove = null;
        this.selectedCell = null;
        this.newStateData = new InstanceStateApiData_1.InstanceStateApiData('');
        this.columns = [
            { title: 'Name', name: 'state', sort: false },
        ];
    }
    InstanceStatesComponent.prototype.ngOnInit = function () {
        this.getInstanceStatesApiData();
    };
    // region ######## table methods ########
    InstanceStatesComponent.prototype.onCellSelected = function (data) {
        if (!util_1.isNullOrUndefined(data)) {
            this.selectedCell = new InstanceStateApiData_1.InstanceStateApiData(data.row.state);
        }
    };
    InstanceStatesComponent.prototype.onRemoveClick = function (data) {
        if (util_1.isNullOrUndefined(data)) {
            return;
        }
        else {
            this.elementToRemove = new InstanceStateApiData_1.InstanceStateApiData(data.state);
            this.confirmDeleteModal.show();
        }
    };
    InstanceStatesComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.confirmDeleteModal.hide();
        this.service.deleteState(this.elementToRemove)
            .subscribe(function (data) { return _this.handleDeleteResponse(data); }, function (error) { return _this.handleError(error); });
        this.elementToRemove = null;
    };
    // endregion
    // region ######## event handler ########
    InstanceStatesComponent.prototype.onAddClick = function () {
        this.newStateData = new InstanceStateApiData_1.InstanceStateApiData('');
        this.addModal.show();
    };
    InstanceStatesComponent.prototype.addProperty = function () {
        var _this = this;
        this.loading = true;
        if (this.newStateData.state !== '') {
            this.service.addPropertyData(this.newStateData)
                .subscribe(function (data) { return _this.handleAddResponse(data); }, function (error) { return _this.handleError(error); });
        }
    };
    // endregion
    // region ######## private methods ########
    InstanceStatesComponent.prototype.getInstanceStatesApiData = function () {
        var _this = this;
        this.service.getInstanceStates()
            .subscribe(function (data) { return _this.handleInstanceStateData(data); }, function (error) { return _this.handleError(error); });
    };
    InstanceStatesComponent.prototype.handleInstanceStateData = function (instanceStates) {
        this.instanceStates = instanceStates;
        this.loading = false;
    };
    InstanceStatesComponent.prototype.handleAddResponse = function (data) {
        this.loading = true;
        if (data.status === 204) {
            this.getInstanceStatesApiData();
            this.notify.success('Successfully saved Instance State');
        }
        else if (data.status === 406) {
            this.handleError('Post request not acceptable due to empty state');
        }
    };
    InstanceStatesComponent.prototype.handleDeleteResponse = function (data) {
        this.loading = true;
        if (data.status === 204) {
            this.getInstanceStatesApiData();
        }
        else {
            this.handleError(data);
        }
    };
    InstanceStatesComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return InstanceStatesComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InstanceStatesComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InstanceStatesComponent.prototype, "addModal", void 0);
InstanceStatesComponent = __decorate([
    core_1.Component({
        templateUrl: 'instanceStates.component.html',
        providers: [instanceStates_service_1.InstanceStateService]
    }),
    __metadata("design:paramtypes", [instanceStates_service_1.InstanceStateService, wineryNotification_service_1.WineryNotificationService])
], InstanceStatesComponent);
exports.InstanceStatesComponent = InstanceStatesComponent;
//# sourceMappingURL=instanceStates.component.js.map