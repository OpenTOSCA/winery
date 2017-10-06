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
var capOrReqDef_service_1 = require("./capOrReqDef.service");
var capOrReqDefResourceApiData_1 = require("./capOrReqDefResourceApiData");
var CapOrReqDefTableData_1 = require("./CapOrReqDefTableData");
var router_1 = require("@angular/router");
var selectData_1 = require("../../../wineryInterfaces/selectData");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var winerySpinnerWithInfinity_component_1 = require("../../../winerySpinnerWithInfinityModule/winerySpinnerWithInfinity.component");
var CapOrReqDefComponent = (function () {
    function CapOrReqDefComponent(service, notify, router) {
        this.service = service;
        this.notify = notify;
        this.router = router;
        this.columns = [
            { title: 'Name', name: 'name' },
            { title: 'Type', name: 'type' },
            { title: 'Lower Bound', name: 'lowerBound' },
            { title: 'Upper Bound', name: 'upperBound' },
            { title: 'Constraints', name: 'constraints', sort: false },
        ];
        this.elementToRemove = null;
        this.loading = true;
        this.resourceApiData = null;
        this.tableData = [];
        this.capabilityTypesList = { classes: null };
        this.capOrReqDefToBeAdded = null;
        this.noneSelected = true;
        this.editorHeight = 200;
        this.defaultConstraintDataModel = "<tosca:Constraint xmlns:tosca=\"http://docs.oasis-open.org/tosca/ns/2011/12\">\n##\n</tosca:Constraint>\n";
        this.constraintDataModel = '';
        // data for show constraint list modal
        this.noConstraintsExistingFlag = false;
        this.loadingConstraints = true;
        this.constraintList = null;
        // data for edit specific constraint modal
        this.createNewConstraintFlag = true;
        this.constraintTypes = null;
        this.types = '';
        this.addCapOrRegModalTitle = '';
        this.capOrReqDefToBeAdded = new capOrReqDefResourceApiData_1.CapOrReqDefinition();
        this.activeTypeElement = new selectData_1.SelectData();
        this.activeTypeElement.text = '';
        this.activeTypeElement.id = '';
    }
    // region ########## Angular Callbacks ##########
    CapOrReqDefComponent.prototype.ngOnInit = function () {
        this.getCapOrReqDefinitionsResourceApiData();
        if (this.router.url.includes('capabilitydefinitions')) {
            this.types = 'capabilitytypes';
            this.addCapOrRegModalTitle = 'Add Capability Definition';
        }
        else {
            this.types = 'requirementtypes';
            this.addCapOrRegModalTitle = 'Add Requirement Definition';
        }
        this.getAllCapOrReqTypes(this.types);
    };
    // endregion
    // region ########## Table Callbacks ##########
    CapOrReqDefComponent.prototype.onSelectedValueChanged = function (value) {
        this.capOrReqDefToBeAdded.type = value;
        this.noneSelected = this.capOrReqDefToBeAdded.type === '(none)';
    };
    /**
     * Called after cell of table is selected
     * @param data of the selected cell
     */
    CapOrReqDefComponent.prototype.onCellSelected = function (data) {
        switch (data.column) {
            case 'constraints': {
                for (var _i = 0, _a = this.resourceApiData.capOrRegDefinitionsList; _i < _a.length; _i++) {
                    var capOrRegDefinition = _a[_i];
                    if (data.row.name === capOrRegDefinition.name) {
                        this.getConstraints(capOrRegDefinition);
                        this.getConstraintTypes();
                        this.editConstraints(capOrRegDefinition);
                    }
                }
                break;
            }
            case 'type': {
                for (var _b = 0, _c = this.tableData; _b < _c.length; _b++) {
                    var entry = _c[_b];
                    if (data.row.name === entry.name) {
                        this.router.navigate([entry.typeUri]);
                    }
                }
                break;
            }
            default: {
                // EXTRA: add cell highlighting
                break;
            }
        }
    };
    CapOrReqDefComponent.prototype.capOrReqTypeToHref = function (type) {
        var name = type.split('}').pop();
        var namespaceEncoded = encodeURIComponent(encodeURIComponent(type.substring(type.lastIndexOf('{') + 1, type.lastIndexOf('}'))));
        var absoluteURL = '/#/' + this.types + '/' + namespaceEncoded + '/' + name;
        return '<a href="' + absoluteURL + '">' + name + '</a>';
    };
    CapOrReqDefComponent.prototype.getTypeURI = function (type) {
        var name = type.split('}').pop();
        var namespaceEncoded = encodeURIComponent(type.substring(type.lastIndexOf('{') + 1, type.lastIndexOf('}')));
        return '/' + this.types + '/' + namespaceEncoded + '/' + name;
    };
    CapOrReqDefComponent.prototype.prepareTableData = function (apidata) {
        this.tableData = [];
        for (var _i = 0, _a = apidata.capOrRegDefinitionsList; _i < _a.length; _i++) {
            var entry = _a[_i];
            var name_1 = entry.name;
            var lowerBound = entry.lowerBound;
            var upperBound = entry.upperBound === 'unbounded' ? '∞' : entry.upperBound;
            var type = this.capOrReqTypeToHref(util_1.isNullOrUndefined(entry.capabilityType)
                === false ? entry.capabilityType : entry.requirementType);
            var constraint = '<button class="btn btn-xs" style="pointer-events: none;">Constraint...</button>';
            var typeUri = this.getTypeURI(util_1.isNullOrUndefined(entry.capabilityType)
                === false ? entry.capabilityType : entry.requirementType);
            this.tableData.push(new CapOrReqDefTableData_1.CapOrRegDefinitionsTableData(name_1, type, lowerBound, upperBound, constraint, typeUri));
        }
        this.handleSuccess();
    };
    /**
     * Opens show constraint list dialog of selected capability definition
     * @param capDefinition to which the constraints are to be displayed
     */
    CapOrReqDefComponent.prototype.editConstraints = function (capDefinition) {
        if (util_1.isNullOrUndefined(this.constraintList)) {
            this.noConstraintsExistingFlag = true;
            this.activeCapOrRegDefinition = capDefinition;
        }
        else {
            this.noConstraintsExistingFlag = false;
            this.activeCapOrRegDefinition = capDefinition;
        }
        this.editConModal.show();
    };
    /**
     * Event called if other constraint types are selected
     * @param value of the active selected constraint type
     */
    CapOrReqDefComponent.prototype.constraintTypeSelected = function (value) {
        this.activeTypeElement = value;
    };
    /**
     * handler for clicks on remove button
     * @param capOrReqDefinition which is to be deleted
     */
    CapOrReqDefComponent.prototype.onRemoveClick = function (capOrReqDefinition) {
        if (util_1.isNullOrUndefined(capOrReqDefinition)) {
            return;
        }
        else {
            this.elementToRemove = capOrReqDefinition;
            this.confirmDeleteModal.show();
        }
    };
    /**
     * handler for clicks on the add button
     */
    CapOrReqDefComponent.prototype.onAddClick = function () {
        this.addModal.show();
    };
    // endregion
    // region ########## Modal Callbacks ##########
    /**
     * Adds a Capability to the table and model
     *
     */
    CapOrReqDefComponent.prototype.addCapability = function () {
        this.addModal.hide();
        this.capOrReqDefToBeAdded.lowerBound = this.lowerBoundSpinner.value;
        if (this.upperBoundSpinner.value === '∞') {
            this.capOrReqDefToBeAdded.upperBound = 'unbounded';
        }
        else {
            this.capOrReqDefToBeAdded.upperBound = this.upperBoundSpinner.value;
        }
        this.addNewCapability(this.capOrReqDefToBeAdded);
    };
    CapOrReqDefComponent.prototype.removeConfirmed = function () {
        this.confirmDeleteModal.hide();
        this.deleteCapOrReqDef(this.elementToRemove);
        this.elementToRemove = null;
    };
    /**
     * Open edit constraint modal with selected constraint
     * If no constraint is selected a new constraint is created
     * @param constraint to be edited
     */
    CapOrReqDefComponent.prototype.openEditConstraintModal = function (constraint) {
        var _this = this;
        var re = /\#\#/;
        var xmlDef = /<\?xml.*>\n/;
        var constraintTypeElement = null;
        var constraintEditorContent = this.defaultConstraintDataModel;
        if (!util_1.isNullOrUndefined(constraint)) {
            this.activeConstraint = constraint;
            this.createNewConstraintFlag = false;
            constraintEditorContent = this.defaultConstraintDataModel.replace(re, constraint.any).replace(xmlDef, '');
            constraintTypeElement = this.constraintTypeItems.filter(function (item) { return item.id === _this.activeConstraint.constraintType; })[0];
        }
        else {
            this.activeConstraint = new capOrReqDefResourceApiData_1.Constraint();
            this.createNewConstraintFlag = true;
            constraintEditorContent = this.defaultConstraintDataModel.replace(re, ' \n');
        }
        // check if constraint type exists and is defined
        if (util_1.isNullOrUndefined(constraintTypeElement)) {
            constraintTypeElement = new selectData_1.SelectData();
            constraintTypeElement.text = '';
            constraintTypeElement.id = '';
            this.notify.warning('Please select a valid constraint type!');
        }
        this.constraintDataModel = constraintEditorContent;
        this.activeTypeElement = constraintTypeElement;
        this.editNewConModal.show();
    };
    /**
     * Delete selected constraint and return to constraint list modal
     * @param constraint to be deleted
     */
    CapOrReqDefComponent.prototype.deleteSelectedConstraint = function (constraint) {
        for (var _i = 0, _a = this.constraintList; _i < _a.length; _i++) {
            var con = _a[_i];
            if (con === constraint) {
                var index1 = this.constraintList.indexOf(name);
                this.constraintList.splice(index1, 1);
                if (this.constraintList.length === 0) {
                    this.noConstraintsExistingFlag = true;
                }
                this.deleteConstraint(this.activeCapOrRegDefinition, constraint);
            }
        }
    };
    /**
     *  Method to refresh constraint type selection
     *  to prevent select failures -> select is set to empty selection
     */
    CapOrReqDefComponent.prototype.refreshConstraintTypeSelector = function () {
        var _this = this;
        this.getConstraintTypes();
        var constraintTypeElement = this.constraintTypeItems
            .filter(function (item) { return item.id === _this.activeConstraint.constraintType; })[0];
        if (util_1.isNullOrUndefined(constraintTypeElement)) {
            this.activeTypeElement = new selectData_1.SelectData();
            this.activeTypeElement.text = '';
            this.activeTypeElement.id = '';
            this.notify.warning('No valid constraint type is selected');
        }
        else {
            this.activeTypeElement = constraintTypeElement;
        }
    };
    /**
     * Callback to update selected constraint
     */
    CapOrReqDefComponent.prototype.updateSelectedConstraint = function () {
        var reStart = /(<tosca:Constraint.*")/i;
        var constraintData = this.editor.getData().replace(reStart, '$1' + ' constraintType="' + this.activeTypeElement.id + '"');
        this.activeConstraint.constraintType = this.activeTypeElement.id;
        this.updateConstraint(this.activeCapOrRegDefinition, this.activeConstraint, constraintData);
    };
    /**
     * Callback to create current constraint
     */
    CapOrReqDefComponent.prototype.createSelectedConstraint = function () {
        var reStart = /(<tosca:Constraint.*")/i;
        var constraintData = this.editor.getData().replace(reStart, '$1' + ' constraintType="' + this.activeTypeElement.id + '"');
        this.createConstraint(this.activeCapOrRegDefinition, constraintData);
    };
    // endregion
    // region ########## Service Callbacks ##########
    CapOrReqDefComponent.prototype.deleteConstraint = function (capabilityOrRequirementDefinition, constraint) {
        var _this = this;
        this.service.deleteConstraint(capabilityOrRequirementDefinition.name, constraint.id)
            .subscribe(function (data) { return _this.handleDeleteConstraint(); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.updateConstraint = function (capabilityOrRequirementDefinition, constraint, constraintData) {
        var _this = this;
        this.service.updateConstraint(capabilityOrRequirementDefinition.name, constraint.id, constraintData)
            .subscribe(function (data) { return _this.handleUpdateConstraint(data); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.createConstraint = function (capabilityOrRequirementDefinition, constraintData) {
        var _this = this;
        this.service.createConstraint(capabilityOrRequirementDefinition.name, constraintData)
            .subscribe(function (data) { return _this.handleCreateConstraint(data); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.getConstraints = function (capabilityOrRequirementDefinition) {
        var _this = this;
        this.loadingConstraints = true;
        this.service.getConstraints(capabilityOrRequirementDefinition.name).subscribe(function (data) { return _this.handleGetConstraints(data); }, function (error) { return _this.handleError(error.toString()); });
    };
    CapOrReqDefComponent.prototype.handleUpdateConstraint = function (data) {
        this.notify.success('Constraint Updated!');
        this.activeConstraint.id = data;
        this.editNewConModal.hide();
    };
    CapOrReqDefComponent.prototype.handleCreateConstraint = function (data) {
        this.notify.success('Constraint Created!');
        this.activeConstraint.id = data;
        this.editNewConModal.hide();
        this.getConstraints(this.activeCapOrRegDefinition);
        this.editConModal.show();
    };
    CapOrReqDefComponent.prototype.handleGetConstraints = function (data) {
        this.constraintList = data;
        this.noConstraintsExistingFlag = util_1.isNullOrUndefined(data) || data.length === 0;
        this.loadingConstraints = false;
    };
    CapOrReqDefComponent.prototype.handleDeleteConstraint = function () {
        this.notify.success('Constraint deleted!');
        this.getConstraints(this.activeCapOrRegDefinition);
    };
    CapOrReqDefComponent.prototype.getConstraintTypes = function () {
        var _this = this;
        this.service.getConstraintTypes().subscribe(function (data) { return _this.handleConstraintTypeData(data); }, function (error) { return _this.handleError(error.toString()); });
    };
    CapOrReqDefComponent.prototype.addNewCapability = function (capOrReqDef) {
        var _this = this;
        this.loading = true;
        this.service.sendPostRequest(capOrReqDef).subscribe(function (data) { return _this.handlePostResponse(); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.getCapOrReqDefinitionsResourceApiData = function () {
        var _this = this;
        this.loading = true;
        this.service.getCapOrReqDefinitionsData().subscribe(function (data) { return _this.handleCapabilityDefinitionsData(data); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.handleCapabilityDefinitionsData = function (data) {
        this.resourceApiData = new capOrReqDefResourceApiData_1.CapOrRegDefinitionsResourceApiData();
        this.resourceApiData.capOrRegDefinitionsList = data;
        this.prepareTableData(this.resourceApiData);
    };
    ;
    CapOrReqDefComponent.prototype.getAllCapOrReqTypes = function (types) {
        var _this = this;
        this.service.getAllCapOrReqTypes(types).subscribe(function (data) { return _this.handleCapOrReqTypesData(data); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.handlePostResponse = function () {
        var notification = '';
        if (this.types === 'capabilitytypes') {
            notification = 'New Capability added!';
        }
        else {
            notification = 'New Requirement added!';
        }
        this.notify.success(notification);
        this.getCapOrReqDefinitionsResourceApiData();
    };
    CapOrReqDefComponent.prototype.handleCapOrReqTypesData = function (data) {
        this.capabilityTypesList.classes = data;
        this.handleSuccess();
    };
    CapOrReqDefComponent.prototype.handleConstraintTypeData = function (data) {
        this.constraintTypes = data;
        this.constraintTypeItems = [];
        for (var _i = 0, _a = this.constraintTypes; _i < _a.length; _i++) {
            var entry = _a[_i];
            var item = new selectData_1.SelectData();
            item.id = entry.type;
            item.text = entry.shortName;
            this.constraintTypeItems.push(item);
        }
    };
    CapOrReqDefComponent.prototype.deleteCapOrReqDef = function (elementToRemove) {
        var _this = this;
        this.service.deleteCapOrReqDef(elementToRemove.name)
            .subscribe(function (data) { return _this.handleCapOrReqDelete(); }, function (error) { return _this.handleError(error); });
    };
    CapOrReqDefComponent.prototype.handleCapOrReqDelete = function () {
        var notification = '';
        if (this.types === 'capabilitytypes') {
            notification = 'Capability deleted!';
        }
        else {
            notification = 'Requirement deleted!';
        }
        this.notify.success(notification);
        this.getCapOrReqDefinitionsResourceApiData();
    };
    /**
     * Set loading to false and show success notification.
     */
    CapOrReqDefComponent.prototype.handleSuccess = function () {
        this.loading = false;
    };
    /**
     * Sets loading to false and shows error notification.
     *
     * @param error notification to be shown
     */
    CapOrReqDefComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return CapOrReqDefComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CapOrReqDefComponent.prototype, "types", void 0);
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], CapOrReqDefComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], CapOrReqDefComponent.prototype, "addModal", void 0);
__decorate([
    core_1.ViewChild('editConModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], CapOrReqDefComponent.prototype, "editConModal", void 0);
__decorate([
    core_1.ViewChild('editNewConModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], CapOrReqDefComponent.prototype, "editNewConModal", void 0);
__decorate([
    core_1.ViewChild('lowerBoundSpinner'),
    __metadata("design:type", winerySpinnerWithInfinity_component_1.SpinnerWithInfinityComponent)
], CapOrReqDefComponent.prototype, "lowerBoundSpinner", void 0);
__decorate([
    core_1.ViewChild('upperBoundSpinner'),
    __metadata("design:type", winerySpinnerWithInfinity_component_1.SpinnerWithInfinityComponent)
], CapOrReqDefComponent.prototype, "upperBoundSpinner", void 0);
__decorate([
    core_1.ViewChild('editor'),
    __metadata("design:type", Object)
], CapOrReqDefComponent.prototype, "editor", void 0);
CapOrReqDefComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-cap-or-req-definitions',
        templateUrl: 'capOrReqDef.html',
        styleUrls: ['capOrReqDef.style.css'],
        providers: [
            capOrReqDef_service_1.CapabilityOrRequirementDefinitionsService
        ]
    }),
    __metadata("design:paramtypes", [capOrReqDef_service_1.CapabilityOrRequirementDefinitionsService,
        wineryNotification_service_1.WineryNotificationService,
        router_1.Router])
], CapOrReqDefComponent);
exports.CapOrReqDefComponent = CapOrReqDefComponent;
//# sourceMappingURL=capOrReqDef.component.js.map