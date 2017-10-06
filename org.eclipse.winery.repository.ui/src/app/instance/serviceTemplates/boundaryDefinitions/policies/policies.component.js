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
var policies_service_1 = require("./policies.service");
var wineryNotification_service_1 = require("../../../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var util_1 = require("util");
var wineryDuplicateValidator_directive_1 = require("../../../../wineryValidators/wineryDuplicateValidator.directive");
var ng2_select_1 = require("ng2-select");
var editXML_component_1 = require("../../../sharedComponents/editXML/editXML.component");
var PoliciesComponent = (function () {
    function PoliciesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.loadingTemplate = false;
        this.policies = [];
        this.newPolicy = new policies_service_1.WineryPolicy();
        this.policyTypes = [];
        this.policyTemplates = [];
        this.activePolicyType = new ng2_select_1.SelectItem('');
        this.activePolicyTemplate = new ng2_select_1.SelectItem('');
        this.columnsArray = [
            { title: 'Name', name: 'name' },
            { title: 'Type', name: 'policyType' },
            { title: 'Template', name: 'policyRef' }
        ];
        this.policyXml = '<Policy xsi:nil="true" xmlns="http://docs.oasis-open.org/tosca/ns/2011/12"'
            + ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n</Policy>';
    }
    PoliciesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.service.getPolicies()
            .subscribe(function (data) { return _this.handlePolicies(data); }, function (error) { return _this.handleError(error); });
        this.service.getPolicyTypes()
            .subscribe(function (data) { return _this.policyTypes = data; }, function (error) { return _this.handlePolicyTypesError(error); });
    };
    PoliciesComponent.prototype.add = function () {
        if (!util_1.isNullOrUndefined(this.policyTypes[0])) {
            this.newPolicy = new policies_service_1.WineryPolicy();
            this.validator = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.policies, 'name');
            this.activePolicyType = this.policyTypes[0].children[0];
            this.activePolicyTemplate = new ng2_select_1.SelectItem('');
            this.xmlEditor.setEditorContent(this.policyXml);
            this.addModal.show();
            this.loadTemplates();
        }
        else {
            this.notify.warning('Please create a Policy Type first.', 'No Policy Types');
        }
    };
    PoliciesComponent.prototype.selected = function (item) {
        this.selectedCell = item;
    };
    PoliciesComponent.prototype.remove = function () {
        if (!util_1.isNullOrUndefined(this.selectedCell)) {
            this.confirmDeleteModal.show();
        }
        else {
            this.notify.warning('You need to select a row to remove!', 'Nothing selected');
        }
    };
    /**
     * Because the user is used to work with XML to apply more functionality to a specific policy,
     * we work with XML here too.
     */
    PoliciesComponent.prototype.addConfirmed = function () {
        var _this = this;
        var xml = this.xmlEditor.getEditorContent();
        var list = xml.split('>');
        list[0] += ' name="' + this.newPolicy.name + '"';
        var pType = this.activePolicyType.id.slice(1).split('}');
        list[0] += ' xmlns:ns10="' + pType[0] + '" '
            + 'policyType="ns10:' + pType[1] + '"';
        if (this.activePolicyTemplate.id !== '') {
            var pTemp = this.activePolicyTemplate.id.slice(1).split('}');
            list[0] += ' xmlns:ns11="' + pTemp[0] + '" '
                + 'policyRef="ns11:' + pTemp[1] + '"';
        }
        xml = list[0] + '>';
        // Append the missing '>' to complete the xml again.
        // Because there is an empty part at the last position, ignore the last item in the list.
        for (var i = 1; i < list.length - 1; i++) {
            xml += list[i] + '>';
        }
        this.service.postPolicy(xml)
            .subscribe(function (data) { return _this.handleSaveDelete('added'); }, function (error) { return _this.handleError(error); });
    };
    PoliciesComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.service.deletePolicy(this.selectedCell.id)
            .subscribe(function (data) { return _this.handleSaveDelete('deleted'); }, function (error) { return _this.handleError(error); });
    };
    PoliciesComponent.prototype.policyTypeSelected = function (data) {
        this.activePolicyType = data;
        this.loadTemplates();
    };
    PoliciesComponent.prototype.policyTemplateSelected = function (data) {
        this.activePolicyTemplate = data;
    };
    PoliciesComponent.prototype.loadTemplates = function () {
        var _this = this;
        this.loadingTemplate = true;
        this.service.getPolicyTemplatesForType(this.activePolicyType)
            .subscribe(function (d) { return _this.handleTemplates(d); }, function (error) { return _this.handleError(error); });
    };
    PoliciesComponent.prototype.handlePolicies = function (data) {
        this.loading = false;
        this.policies = data;
    };
    PoliciesComponent.prototype.handleTemplates = function (data) {
        this.policyTemplates = data;
        this.activePolicyTemplate = new ng2_select_1.SelectItem('');
        this.loadingTemplate = false;
    };
    PoliciesComponent.prototype.handleSaveDelete = function (type) {
        this.loading = false;
        this.notify.success('Successfully ' + type + ' policy!', type);
        this.ngOnInit();
    };
    PoliciesComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    PoliciesComponent.prototype.handlePolicyTypesError = function (error) {
        if (error.status === 404) {
            // warns the user if there are nor policy types available -> send warning now
            this.add();
        }
        else {
            this.handleError(error);
        }
    };
    return PoliciesComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PoliciesComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PoliciesComponent.prototype, "addModal", void 0);
__decorate([
    core_1.ViewChild('xmlEditor'),
    __metadata("design:type", editXML_component_1.EditXMLComponent)
], PoliciesComponent.prototype, "xmlEditor", void 0);
PoliciesComponent = __decorate([
    core_1.Component({
        templateUrl: 'policies.component.html',
        providers: [
            policies_service_1.PoliciesService
        ]
    }),
    __metadata("design:paramtypes", [policies_service_1.PoliciesService, wineryNotification_service_1.WineryNotificationService])
], PoliciesComponent);
exports.PoliciesComponent = PoliciesComponent;
//# sourceMappingURL=policies.component.js.map