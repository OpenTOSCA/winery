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
 *     Lukas Balzer - initial API and implementation
 */
var core_1 = require("@angular/core");
var util_1 = require("util");
var propertyConstraints_service_1 = require("./propertyConstraints.service");
var propertyConstraintApiData_1 = require("./propertyConstraintApiData");
var wineryDuplicateValidator_directive_1 = require("../../../../wineryValidators/wineryDuplicateValidator.directive");
var wineryNotification_service_1 = require("../../../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var PropertyConstraintsComponent = (function () {
    function PropertyConstraintsComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.loadCount = 0;
        this.propertyConstraints = [];
        this.newConstraint = new propertyConstraintApiData_1.PropertyConstraintApiData();
        this.constraintTypes = [];
        this.columns = [
            { title: 'Service Template Property', name: 'property', sort: true },
            { title: 'Constraint Type', name: 'constraintType', sort: true },
            { title: 'Constraint', name: 'fragments', sort: true }
        ];
    }
    PropertyConstraintsComponent.prototype.ngOnInit = function () {
        this.getConstraints();
        this.getConstraintTypes();
    };
    // region ######## table methods ########
    PropertyConstraintsComponent.prototype.onCellSelected = function (data) {
        if (!util_1.isNullOrUndefined(data)) {
            this.selectedCell = data.row;
        }
    };
    PropertyConstraintsComponent.prototype.onAddClick = function () {
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.propertyConstraints, 'property');
        this.newConstraint = new propertyConstraintApiData_1.PropertyConstraintApiData();
        this.addModal.show();
    };
    PropertyConstraintsComponent.prototype.addNewConstraint = function () {
        var _this = this;
        this.addLoad();
        this.service.postConstraint(this.newConstraint).subscribe(function (data) { return _this.handlePostResponse(data); }, function (error) { return _this.handleError(error); });
    };
    PropertyConstraintsComponent.prototype.onRemoveClick = function (data) {
        if (util_1.isNullOrUndefined(data)) {
            return;
        }
        else {
            this.confirmDeleteModal.show();
        }
    };
    PropertyConstraintsComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.confirmDeleteModal.hide();
        this.addLoad();
        this.service.deleteConstraints(this.selectedCell).subscribe(function (data) { return _this.handleDeleteResponse(data); }, function (error) { return _this.handleError(error); });
    };
    PropertyConstraintsComponent.prototype.getConstraintTypes = function () {
        var _this = this;
        this.addLoad();
        this.service.getConstraintTypes().subscribe(function (data) { return _this.handleConstraintsData(data); }, function (error) { return _this.handleError(error); });
    };
    PropertyConstraintsComponent.prototype.getConstraints = function () {
        var _this = this;
        this.addLoad();
        this.service.getConstraints().subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    PropertyConstraintsComponent.prototype.handlePostResponse = function (data) {
        this.decreaseLoad();
        if (data.ok) {
            this.getConstraints();
            this.notify.success('Created new Property Constraint');
        }
        else {
            this.notify.error('Failed to create Property Constraint');
        }
    };
    PropertyConstraintsComponent.prototype.handleDeleteResponse = function (data) {
        this.decreaseLoad();
        if (data.ok) {
            this.getConstraints();
            this.notify.success('Deleted Property Constraint');
        }
        else {
            this.notify.error('Failed to delete Property Constraint');
        }
    };
    PropertyConstraintsComponent.prototype.handleData = function (data) {
        this.propertyConstraints = data;
        for (var i = 0; i < data.length; i++) {
            this.propertyConstraints[i].fragments = '[Not implemented yet]';
        }
        this.decreaseLoad();
    };
    PropertyConstraintsComponent.prototype.handleConstraintsData = function (data) {
        this.constraintTypes = data;
        this.decreaseLoad();
    };
    PropertyConstraintsComponent.prototype.handleError = function (error) {
        this.decreaseLoad();
        this.notify.error('Action caused an error:\n', error);
    };
    PropertyConstraintsComponent.prototype.addLoad = function () {
        this.loadCount++;
        this.loading = true;
    };
    PropertyConstraintsComponent.prototype.decreaseLoad = function () {
        this.loadCount--;
        if (this.loadCount <= 0) {
            this.loading = false;
            this.loadCount = 0;
        }
    };
    return PropertyConstraintsComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyConstraintsComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyConstraintsComponent.prototype, "addModal", void 0);
PropertyConstraintsComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-boundary-properties',
        templateUrl: 'propertyConstraints.component.html',
        providers: [
            propertyConstraints_service_1.PropertyConstraintsService
        ]
    }),
    __metadata("design:paramtypes", [propertyConstraints_service_1.PropertyConstraintsService,
        wineryNotification_service_1.WineryNotificationService])
], PropertyConstraintsComponent);
exports.PropertyConstraintsComponent = PropertyConstraintsComponent;
//# sourceMappingURL=propertyConstraints.component.js.map