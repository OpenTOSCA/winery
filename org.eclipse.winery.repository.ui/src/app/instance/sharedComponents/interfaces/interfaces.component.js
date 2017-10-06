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
 *     Niko Stadelmaier, Lukas Harzenetter - initial API and implementation
 *     Oliver Kopp - quick fix to enable IA generation
 */
var core_1 = require("@angular/core");
var util_1 = require("util");
var configuration_1 = require("../../../configuration");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var existService_1 = require("../../../wineryUtils/existService");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var instance_service_1 = require("../../instance.service");
var generateArtifactApiData_1 = require("./generateArtifactApiData");
var interfaces_service_1 = require("./interfaces.service");
var interfacesApiData_1 = require("./interfacesApiData");
var parameters_1 = require("../../../wineryInterfaces/parameters");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var forms_1 = require("@angular/forms");
var wineryComponentExists_component_1 = require("../../../wineryComponentExists/wineryComponentExists.component");
var enums_1 = require("../../../wineryInterfaces/enums");
var utils_1 = require("../../../wineryUtils/utils");
var InterfacesComponent = (function () {
    function InterfacesComponent(service, notify, sharedData, existService) {
        this.service = service;
        this.notify = notify;
        this.sharedData = sharedData;
        this.existService = existService;
        this.loading = false;
        this.generating = false;
        this.isServiceTemplate = false;
        this.operations = null;
        this.inputParameters = null;
        this.outputParameters = null;
        this.selectedInterface = null;
        this.selectedOperation = null;
        this.generateArtifactApiData = new generateArtifactApiData_1.GenerateArtifactApiData();
        this.createImplementation = true;
        this.createArtifactTemplate = true;
        this.implementationName = null;
        this.implementationNamespace = null;
        this.implementation = new wineryComponentExists_component_1.GenerateData();
        this.artifactTemplate = new wineryComponentExists_component_1.GenerateData();
    }
    InterfacesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getInterfaces()
            .subscribe(function (data) { return _this.handleInterfacesApiData(data); }, function (error) { return _this.handleError(error); });
        this.toscaType = this.sharedData.toscaComponent.toscaType;
        this.isServiceTemplate = this.toscaType === enums_1.ToscaTypes.ServiceTemplate;
    };
    // region ########### Template Callbacks ##########
    // region ########### Interfaces ##########
    InterfacesComponent.prototype.addInterface = function () {
        this.modalTitle = 'Interface';
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.interfacesData, 'name');
        this.addElementForm.reset();
        this.addIntOpModal.show();
    };
    InterfacesComponent.prototype.onAddInterface = function (name) {
        var tmp = new interfacesApiData_1.InterfacesApiData(name);
        this.interfacesData.push(tmp);
        this.onInterfaceSelect(tmp);
        name = null;
    };
    InterfacesComponent.prototype.onInterfaceSelect = function (selectedInterface) {
        if (selectedInterface !== this.selectedInterface) {
            this.outputParameters = null;
            this.inputParameters = null;
        }
        this.selectedInterface = selectedInterface;
        this.operations = selectedInterface.operation;
        this.selectedOperation = null;
    };
    InterfacesComponent.prototype.removeInterface = function () {
        this.modalTitle = 'Remove Interface';
        this.elementToRemove = this.selectedInterface.name;
        this.removeElementModal.show();
    };
    InterfacesComponent.prototype.onRemoveInterface = function () {
        this.interfacesData.splice(this.interfacesData.indexOf(this.selectedInterface), 1);
        this.inputParameters = null;
        this.outputParameters = null;
        this.operations = null;
        this.selectedOperation = null;
        this.selectedInterface = null;
    };
    // endregion
    // region ########## Operations ##########
    InterfacesComponent.prototype.addOperation = function () {
        this.modalTitle = 'Operation';
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.operations, 'name');
        this.addElementForm.reset();
        this.addIntOpModal.show();
    };
    InterfacesComponent.prototype.onAddOperation = function (name) {
        if (!util_1.isNullOrUndefined(this.selectedInterface)) {
            var tmp = new interfacesApiData_1.InterfaceOperationApiData(name);
            // if we are working on a target interface in servicetemplates, delete unnecessary attributes to
            // ensure data consistency with the backend.
            if (this.isServiceTemplate) {
                delete tmp.outputParameters;
                delete tmp.inputParameters;
                delete tmp.any;
                delete tmp.documentation;
                delete tmp.otherAttributes;
            }
            this.selectedInterface.operation.push(tmp);
            this.onOperationSelected(tmp);
        }
    };
    InterfacesComponent.prototype.onOperationSelected = function (selectedOperation) {
        this.selectedOperation = selectedOperation;
        if (!this.isServiceTemplate) {
            if (util_1.isNullOrUndefined(selectedOperation.inputParameters)) {
                selectedOperation.inputParameters = new parameters_1.InputParameters();
            }
            if (util_1.isNullOrUndefined(selectedOperation.outputParameters)) {
                selectedOperation.outputParameters = new parameters_1.OutputParameters();
            }
            this.inputParameters = selectedOperation.inputParameters.inputParameter;
            this.outputParameters = selectedOperation.outputParameters.outputParameter;
        }
    };
    InterfacesComponent.prototype.removeOperation = function () {
        this.modalTitle = 'Remove Operation';
        this.elementToRemove = this.selectedOperation.name;
        this.removeElementModal.show();
    };
    InterfacesComponent.prototype.onRemoveOperation = function () {
        this.operations.splice(this.operations.indexOf(this.selectedOperation), 1);
        this.inputParameters = null;
        this.outputParameters = null;
        this.selectedOperation = null;
    };
    // endregion
    // region ########## Generate Implementation ##########
    InterfacesComponent.prototype.showGenerateImplementationModal = function () {
        this.artifactTemplate.name =
            this.sharedData.toscaComponent.localName + '_' + this.selectedInterface.name.replace(/\W/g, '_') + '_IA';
        this.artifactTemplate.namespace = this.sharedData.toscaComponent.namespace;
        this.artifactTemplate.toscaType = enums_1.ToscaTypes.ArtifactTemplate;
        this.generateArtifactApiData = new generateArtifactApiData_1.GenerateArtifactApiData();
        this.generateArtifactApiData.javaPackage = this.getPackageNameFromNamespace();
        this.generateArtifactApiData.autoCreateArtifactTemplate = 'yes';
        this.generateArtifactApiData.interfaceName = this.selectedInterface.name;
        // enable autogenreation of the implementation artifact
        // currently works for node types only, not for relationship types
        this.generateArtifactApiData.autoGenerateIA = 'yes';
        this.implementation.name = this.sharedData.toscaComponent.localName + '_impl';
        this.implementation.namespace = this.sharedData.toscaComponent.namespace;
        this.implementation.toscaType = utils_1.Utils.getImplementationOrTemplateOfType(this.toscaType);
        this.generateImplModal.show();
    };
    InterfacesComponent.prototype.generateImplementationArtifact = function () {
        this.generating = true;
        this.generateArtifactApiData.artifactName = this.generateArtifactApiData.artifactTemplateName;
        if (this.toscaType !== enums_1.ToscaTypes.NodeType) {
            delete this.generateArtifactApiData.autoGenerateIA;
        }
        // Save the current interfaces & operations first in order to prevent inconsistencies.
        this.save();
    };
    // endregion
    // region ########## Generate Lifecycle Interface ##########
    InterfacesComponent.prototype.generateLifecycleInterface = function () {
        var lifecycle = new interfacesApiData_1.InterfacesApiData('http://opentosca.org/interfaces/lifecycle');
        lifecycle.operation.push(new interfacesApiData_1.InterfaceOperationApiData('install'));
        lifecycle.operation.push(new interfacesApiData_1.InterfaceOperationApiData('configure'));
        lifecycle.operation.push(new interfacesApiData_1.InterfaceOperationApiData('start'));
        lifecycle.operation.push(new interfacesApiData_1.InterfaceOperationApiData('stop'));
        lifecycle.operation.push(new interfacesApiData_1.InterfaceOperationApiData('uninstall'));
        this.interfacesData.push(lifecycle);
    };
    InterfacesComponent.prototype.containsDefaultLifecycle = function () {
        if (util_1.isNullOrUndefined(this.interfacesData)) {
            return false;
        }
        var lifecycleId = this.interfacesData.findIndex(function (value) {
            return value.name.endsWith('http://www.example.com/interfaces/lifecycle');
        });
        return lifecycleId !== -1;
    };
    // endregion
    // region ######### Checker ##########
    InterfacesComponent.prototype.checkImplementationExists = function () {
        var _this = this;
        if (!this.implementationNamespace.endsWith('/')) {
            this.existService.check(configuration_1.backendBaseURL + '/'
                + utils_1.Utils.getTypeOfTemplateOrImplementation(this.toscaType)
                + encodeURIComponent(encodeURIComponent(this.implementationNamespace)) + '/'
                + this.implementationName + '/').subscribe(function (data) { return _this.createImplementation = false; }, function (error) { return _this.createImplementation = true; });
        }
    };
    InterfacesComponent.prototype.checkArtifactTemplateExists = function () {
        var _this = this;
        if (!this.generateArtifactApiData.artifactTemplateNamespace.endsWith('/')) {
            this.existService.check(configuration_1.backendBaseURL + '/artifacttemplates/'
                + encodeURIComponent(encodeURIComponent(this.generateArtifactApiData.artifactTemplateNamespace)) + '/'
                + this.generateArtifactApiData.artifactTemplateName + '/').subscribe(function (data) { return _this.createArtifactTemplate = false; }, function (error) { return _this.createArtifactTemplate = true; });
        }
    };
    // endregion
    InterfacesComponent.prototype.onRemoveElement = function () {
        switch (this.modalTitle) {
            case 'Remove Operation':
                this.onRemoveOperation();
                break;
            case 'Remove Interface':
                this.onRemoveInterface();
                break;
            default:
                this.notify.error('Couldn\'t remove element!');
        }
    };
    InterfacesComponent.prototype.save = function () {
        var _this = this;
        this.loading = true;
        this.service.save(this.interfacesData)
            .subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
    };
    // endregion
    // region ########## Private Methods ##########
    InterfacesComponent.prototype.handleInterfacesApiData = function (data) {
        this.interfacesData = data;
        this.loading = false;
    };
    InterfacesComponent.prototype.handleSave = function () {
        var _this = this;
        this.loading = false;
        this.notify.success('Changes saved!');
        // If there is a generation of implementations in progress, generate those now.
        if (this.generating) {
            if (this.implementation.createComponent) {
                this.service.createImplementation(this.implementation.name, this.implementation.namespace)
                    .subscribe(function (data) { return _this.handleGeneratedImplementation(data); }, function (error) { return _this.handleError(error); });
            }
            else if (!this.implementation.createComponent && this.artifactTemplate.createComponent) {
                this.handleGeneratedImplementation();
            }
            else {
                this.generating = false;
            }
        }
    };
    InterfacesComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.generating = false;
        this.notify.error(error.toString());
    };
    InterfacesComponent.prototype.getPackageNameFromNamespace = function () {
        // to only get the relevant information, without the 'http://'
        var namespaceArray = this.sharedData.toscaComponent.namespace.split('/').slice(2);
        var domainArray = namespaceArray[0].split('.');
        var javaPackage = '';
        for (var i = domainArray.length - 1; i >= 0; i--) {
            if (javaPackage.length > 0) {
                javaPackage += '.';
            }
            javaPackage += domainArray[i];
        }
        for (var i = 1; i < namespaceArray.length; i++) {
            javaPackage += '.' + namespaceArray[i];
        }
        return javaPackage;
    };
    InterfacesComponent.prototype.handleGeneratedImplementation = function (data) {
        var _this = this;
        if (this.artifactTemplate.createComponent) {
            this.generateArtifactApiData.artifactTemplateName = this.generateArtifactApiData.artifactName = this.artifactTemplate.name;
            this.generateArtifactApiData.artifactTemplateNamespace = this.artifactTemplate.namespace;
            this.service.createArtifactTemplate(this.implementation.name, this.implementation.namespace, this.generateArtifactApiData)
                .subscribe(function (response) { return _this.handleGeneratedArtifact(response); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.generating = false;
            this.generateImplModal.hide();
        }
        if (!util_1.isNullOrUndefined(data)) {
            this.notify.success('Successfully created Implementation!');
        }
    };
    InterfacesComponent.prototype.handleGeneratedArtifact = function (response) {
        var message = '';
        if (this.toscaType === enums_1.ToscaTypes.NodeType) {
            message = 'It\'s available for download at ' +
                '<a style="color: black;" href="' + response.headers.get('Location') + '">'
                + this.implementation.name
                + ' source</a>.';
        }
        this.generating = false;
        this.generateImplModal.hide();
        this.notify.success(message, 'Successfully created Artifact!', { enableHTML: true });
    };
    return InterfacesComponent;
}());
__decorate([
    core_1.ViewChild('addIntOpModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InterfacesComponent.prototype, "addIntOpModal", void 0);
__decorate([
    core_1.ViewChild('removeElementModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InterfacesComponent.prototype, "removeElementModal", void 0);
__decorate([
    core_1.ViewChild('addElementForm'),
    __metadata("design:type", forms_1.NgForm)
], InterfacesComponent.prototype, "addElementForm", void 0);
__decorate([
    core_1.ViewChild('generateImplModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InterfacesComponent.prototype, "generateImplModal", void 0);
InterfacesComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-interfaces',
        templateUrl: 'interfaces.component.html',
        styleUrls: [
            'interfaces.component.css'
        ],
        providers: [
            interfaces_service_1.InterfacesService
        ],
    }),
    __metadata("design:paramtypes", [interfaces_service_1.InterfacesService, wineryNotification_service_1.WineryNotificationService,
        instance_service_1.InstanceService, existService_1.ExistService])
], InterfacesComponent);
exports.InterfacesComponent = InterfacesComponent;
//# sourceMappingURL=interfaces.component.js.map