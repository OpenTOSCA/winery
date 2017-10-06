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
var plansApiData_1 = require("./plansApiData");
var plans_service_1 = require("./plans.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var util_1 = require("util");
var selectData_1 = require("../../../wineryInterfaces/selectData");
var wineryUploader_component_1 = require("../../../wineryUploader/wineryUploader.component");
var parameters_1 = require("../../../wineryInterfaces/parameters");
var configuration_1 = require("../../../configuration");
var instance_service_1 = require("../../instance.service");
var bpmn4tosca = 'http://www.opentosca.org/bpmn4tosca';
var PlansComponent = (function () {
    function PlansComponent(notify, sharedData, service) {
        this.notify = notify;
        this.sharedData = sharedData;
        this.service = service;
        this.loading = true;
        this.embeddedPlansColumns = [
            { title: 'Precondition', name: 'precondition', sort: true },
            { title: 'Name', name: 'name', sort: true },
            { title: 'Type', name: 'planType', sort: true },
            { title: 'Language', name: 'planLanguage', sort: true }
        ];
        this.linkedPlansColumns = [
            { title: 'Precondition', name: 'precondition', sort: true },
            { title: 'Name', name: 'name', sort: true },
            { title: 'Type', name: 'planType', sort: true },
            { title: 'Language', name: 'planLanguage', sort: true },
            { title: 'Reference', name: 'planModelReference.reference', sort: true }
        ];
        this.plansApiData = null;
        this.linkedPlans = null;
        this.enableEditButton = false;
        this.selectedPlanType = new selectData_1.SelectData();
        this.selectedPlanLanguage = new selectData_1.SelectData();
        this.newPlan = new plansApiData_1.PlansApiData();
        this.fileDropped = false;
        this.showArchiveUpload = true;
    }
    PlansComponent.prototype.ngOnInit = function () {
        this.getPlanTypesData();
        this.uploaderUrl = this.service.path + 'addarchive/';
    };
    // region ########## Callbacks ##########
    // region ########## Table ##########
    PlansComponent.prototype.onAddPlanType = function () {
        this.refreshPlanLanguages();
        this.refreshPlanTypes();
        this.newPlan = new plansApiData_1.PlansApiData();
        this.fileToUpload = null;
        this.fileDropped = false;
        this.showArchiveUpload = true;
    };
    PlansComponent.prototype.onEditPlan = function (plan) {
        var bpmnUrl = configuration_1.workflowModelerURL
            + '?repositoryURL=' + encodeURIComponent(configuration_1.backendBaseURL + '/')
            + '&namespace=' + encodeURIComponent(this.sharedData.toscaComponent.namespace)
            + '&id=' + this.sharedData.toscaComponent.localName
            + '&plan=' + plan.name;
        window.open(bpmnUrl, '_blank');
    };
    PlansComponent.prototype.onRemovePlan = function (plan) {
        this.elementToRemove = plan;
        this.confirmDeleteModal.show();
    };
    PlansComponent.prototype.onEditPlanIOParameters = function (selectedType) {
        this.newPlan = selectedType;
        if (util_1.isNullOrUndefined(this.newPlan.inputParameters)) {
            this.newPlan.inputParameters = new parameters_1.InputParameters();
        }
        if (util_1.isNullOrUndefined(this.newPlan.outputParameters)) {
            this.newPlan.outputParameters = new parameters_1.OutputParameters();
        }
        this.ioModal.show();
    };
    PlansComponent.prototype.onCellSelected = function (plan) {
        var selected = plan.row;
        this.enableEditButton = selected.planLanguage.includes(bpmn4tosca);
    };
    // endregion
    // region ########## Add Modal ##########
    PlansComponent.prototype.addPlan = function () {
        var _this = this;
        this.newPlan.planLanguage = this.selectedPlanLanguage.id;
        this.newPlan.planType = this.selectedPlanType.id;
        this.service.addPlan(this.newPlan)
            .subscribe(function () { return _this.handlePlanCreated(); }, function (error) { return _this.handleError(error); });
    };
    PlansComponent.prototype.refreshPlanTypes = function () {
        var _this = this;
        this.service.getPlanTypes()
            .subscribe(function (data) { return _this.handlePlanTypes(data); }, function (error) { return _this.handleError(error); });
    };
    PlansComponent.prototype.refreshPlanLanguages = function () {
        var _this = this;
        this.service.getPlanLanguages()
            .subscribe(function (data) { return _this.handlePlanLanguages(data); }, function (error) { return _this.handleError(error); });
    };
    PlansComponent.prototype.planLanguageSelected = function (event) {
        if (event.id.includes(bpmn4tosca)) {
            this.fileDropped = true;
            this.showArchiveUpload = false;
        }
        else if (!util_1.isNullOrUndefined(this.fileToUpload)) {
            this.fileDropped = true;
            this.showArchiveUpload = true;
        }
        else {
            this.fileDropped = false;
            this.showArchiveUpload = true;
        }
        this.selectedPlanLanguage = event;
    };
    PlansComponent.prototype.planTypeSelected = function (event) {
        this.selectedPlanType = event;
    };
    PlansComponent.prototype.onFileDropped = function (event) {
        this.fileDropped = true;
        this.fileToUpload = event;
    };
    // endregion
    // region ######### IOParameter Modal #########
    PlansComponent.prototype.editPlan = function () {
        var _this = this;
        this.service.updatePlan(this.newPlan)
            .subscribe(function () { return _this.handlePlanSaved(); }, function (error) { return _this.handleError(error); });
    };
    // endregion
    // region ########## Remove Modal ##########
    PlansComponent.prototype.deletePlan = function () {
        var _this = this;
        this.loading = true;
        this.service.deletePlan(this.elementToRemove.id)
            .subscribe(function () {
            _this.notify.success('Successfully deleted plan ' + _this.elementToRemove.name);
            _this.getPlanTypesData();
        }, function (error) { return _this.handleError(error); });
    };
    PlansComponent.prototype.getPlanTypesData = function () {
        var _this = this;
        this.service.getPlansData()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    // endregion
    // endregion
    // region ########## Private Methods ##########
    PlansComponent.prototype.handleData = function (data) {
        this.plansApiData = data;
        this.loading = false;
    };
    PlansComponent.prototype.handlePlanTypes = function (types) {
        this.planTypes = types;
        this.selectedPlanType = util_1.isNullOrUndefined(types[0]) ? new selectData_1.SelectData() : types[0];
        if (!util_1.isNullOrUndefined(this.planLanguages)) {
            this.loading = false;
            this.addPlanModal.show();
        }
    };
    PlansComponent.prototype.handlePlanLanguages = function (languages) {
        this.planLanguages = languages;
        this.selectedPlanLanguage = util_1.isNullOrUndefined(languages[0]) ? new selectData_1.SelectData() : languages[0];
        if (!util_1.isNullOrUndefined(this.planTypes)) {
            this.loading = false;
            this.addPlanModal.show();
        }
    };
    PlansComponent.prototype.handlePlanCreated = function () {
        this.loading = true;
        this.uploaderUrl = this.service.path + this.newPlan.name + '/file';
        if (!this.showArchiveUpload) {
            this.handlePlanSaved();
        }
        else {
            this.uploader.upload(this.uploaderUrl);
        }
    };
    PlansComponent.prototype.handlePlanSaved = function () {
        this.loading = false;
        this.notify.success('Successfully added Plan!');
        this.getPlanTypesData();
    };
    PlansComponent.prototype.handleError = function (error) {
        this.notify.error(error);
        this.loading = false;
    };
    return PlansComponent;
}());
__decorate([
    core_1.ViewChild('addPlanModal'),
    __metadata("design:type", Object)
], PlansComponent.prototype, "addPlanModal", void 0);
__decorate([
    core_1.ViewChild('uploader'),
    __metadata("design:type", wineryUploader_component_1.WineryUploaderComponent)
], PlansComponent.prototype, "uploader", void 0);
__decorate([
    core_1.ViewChild('ioModal'),
    __metadata("design:type", Object)
], PlansComponent.prototype, "ioModal", void 0);
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", Object)
], PlansComponent.prototype, "confirmDeleteModal", void 0);
PlansComponent = __decorate([
    core_1.Component({
        selector: 'winery-plans',
        templateUrl: 'plans.component.html',
        providers: [
            plans_service_1.PlansService
        ]
    }),
    __metadata("design:paramtypes", [wineryNotification_service_1.WineryNotificationService,
        instance_service_1.InstanceService,
        plans_service_1.PlansService])
], PlansComponent);
exports.PlansComponent = PlansComponent;
//# sourceMappingURL=plans.component.js.map