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
var propertyMappings_service_1 = require("./propertyMappings.service");
var util_1 = require("util");
var wineryNotification_service_1 = require("../../../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var forms_1 = require("@angular/forms");
var instance_service_1 = require("../../../instance.service");
var utils_1 = require("../../../../wineryUtils/utils");
var ng2_select_1 = require("ng2-select");
var PropertyMappingsComponent = (function () {
    function PropertyMappingsComponent(service, notify, instanceService) {
        this.service = service;
        this.notify = notify;
        this.instanceService = instanceService;
        this.loading = true;
        this.columns = [
            { title: 'Service Template Property', name: 'serviceTemplatePropertyRef', sort: true },
            { title: 'Target', name: 'targetObjectRef', sort: true },
            { title: 'Target Property', name: 'targetPropertyRef', sort: true }
        ];
        this.currentSelectedItem = new propertyMappings_service_1.Property();
        this.addOrUpdateBtnTxt = 'Add';
        this.properties = { name: '', property: '' };
        this.templateList = [];
        this.topologyTemplate = null;
        this.targetProperties = [];
        this.targetPropertiesWrapperElement = null;
        this.initialSelectProp = [{ id: '', text: '' }];
    }
    PropertyMappingsComponent.prototype.ngOnInit = function () {
        this.getMappings();
        this.getProperties();
        this.getTopologyTemplate();
    };
    PropertyMappingsComponent.prototype.getTopologyTemplate = function () {
        var _this = this;
        this.instanceService.getTopologyTemplate().subscribe(function (data) { return _this.topologyTemplate = data; }, function (error) { return _this.notify.error('could not get topology data'); });
    };
    PropertyMappingsComponent.prototype.getProperties = function () {
        var _this = this;
        this.service.getPropertiesOfServiceTemplate().subscribe(function (data) { return _this.handleProperties(data); }, function (error) { return _this.handleError(error); });
    };
    PropertyMappingsComponent.prototype.handleProperties = function (props) {
        var parser = new DOMParser();
        this.xmlData = parser.parseFromString(props, 'application/xml');
        this.properties.name = this.xmlData.firstChild.localName;
        this.properties.property = '/*[local-name()=\'' + this.properties.name + '\']';
    };
    PropertyMappingsComponent.prototype.radioBtnSelected = function (event) {
        var selectedType = event.target.value;
        if (!util_1.isNullOrUndefined(selectedType)) {
            this.toscaType = utils_1.Utils.getToscaTypeFromString(selectedType.toLowerCase().slice(0, -1));
            this.templateList = this.getListOfTemplates(selectedType);
            this.templateSelect.selected.emit(this.templateList[0]);
            // this.initialSelectedTempalte = [this.templateList[0]];
            // this.targetObject = this.initialSelectedTempalte[0].text;
        }
    };
    PropertyMappingsComponent.prototype.getListOfTemplates = function (templateType) {
        if (!util_1.isNullOrUndefined(this.topologyTemplate[templateType])) {
            return this.topologyTemplate[templateType].map(function (template) {
                var newItem = new ng2_select_1.SelectItem('');
                newItem.id = template.id;
                newItem.text = utils_1.Utils.getNameFromQname(template.id);
                return newItem;
            });
        }
        else {
            this.notify.error('No ' + utils_1.Utils.getToscaTypeNameFromToscaType(this.toscaType) + ' available.\nTo select a ' +
                utils_1.Utils.getToscaTypeNameFromToscaType(this.toscaType) +
                ' add at least one to the topology');
        }
    };
    PropertyMappingsComponent.prototype.targetObjectSelected = function (targetObj) {
        this.targetObject = targetObj.text;
        this.currentSelectedItem.targetObjectRef = this.targetObject;
        this.getTargetProperties(targetObj);
    };
    PropertyMappingsComponent.prototype.getTargetProperties = function (targetObj) {
        var _this = this;
        var targetObjPath = utils_1.Utils.getTypeOfTemplateOrImplementation(this.toscaType) + '/' +
            encodeURIComponent(encodeURIComponent(utils_1.Utils.getNamespaceAndLocalNameFromQName(targetObj.id).namespace)) +
            '/' + this.targetObject;
        this.service.getTargetObjKVProperties(targetObjPath).subscribe(function (data) {
            _this.handleGetProperties(data);
        }, function (error) {
            _this.notify.error('Could not get Properties for selected Template.\n' + error.toString());
        });
    };
    PropertyMappingsComponent.prototype.handleGetProperties = function (propertiesDefinition) {
        if (!util_1.isNullOrUndefined(propertiesDefinition.winerysPropertiesDefinition)) {
            this.targetProperties = propertiesDefinition.winerysPropertiesDefinition.propertyDefinitionKVList.map(function (item) {
                return { id: item.key, text: item.key };
            });
            this.targetPropertiesWrapperElement = propertiesDefinition.winerysPropertiesDefinition.elementName;
            this.initialSelectProp = [this.targetProperties[0]];
            this.selectedProperty = this.initialSelectProp[0].text;
        }
        else {
            this.targetProperties = [];
            this.targetPropertiesWrapperElement = null;
            this.selectedProperty = '';
            this.currentSelectedItem.targetPropertyRef = '';
        }
    };
    PropertyMappingsComponent.prototype.targetPropertySelected = function (property) {
        console.log(property);
        if (!util_1.isNullOrUndefined(property.text) && !Array.isArray(property)) {
            this.selectedProperty = property.text;
        }
        this.currentSelectedItem.targetPropertyRef = '/*[local-name()=\'' + this.targetPropertiesWrapperElement +
            '\']/*[local-name()=\'' + this.selectedProperty + '\']';
    };
    PropertyMappingsComponent.prototype.getMappings = function () {
        var _this = this;
        this.service.getPropertyMappings().subscribe(function (data) {
            _this.handleData(data);
        }, function (error) { return _this.notify.error(error.toString()); });
    };
    PropertyMappingsComponent.prototype.handleData = function (data) {
        this.apiData = data;
        this.apiData.propertyMappings.propertyMapping = this.apiData.propertyMappings.propertyMapping.map(function (obj) {
            if (obj.targetObjectRef === null) {
                obj.targetObjectRef = '';
            }
            else {
                obj.targetObjectRef = obj.targetObjectRef.id;
            }
            return obj;
        });
        this.loading = false;
    };
    PropertyMappingsComponent.prototype.onCellSelected = function (selectedItem) {
        this.currentSelectedItem = selectedItem.row;
    };
    PropertyMappingsComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.service.removePropertyMapping(this.currentSelectedItem.serviceTemplatePropertyRef).subscribe(function (data) { return _this.handleSuccess('Deleted property mapping'); }, function (error) { return _this.handleError(error); });
    };
    PropertyMappingsComponent.prototype.onRemoveClick = function (elementToRemove) {
        if (!util_1.isNullOrUndefined(elementToRemove) && !util_1.isNullOrUndefined(this.currentSelectedItem)) {
            this.confirmDeleteModal.show();
        }
        else {
            this.notify.warning('No Element was selected!');
        }
    };
    PropertyMappingsComponent.prototype.onAddClick = function () {
        this.addOrUpdateBtnTxt = 'Add';
        this.propertyMappingForm.reset();
        this.currentSelectedItem = new propertyMappings_service_1.Property();
        this.addPropertyMappingModal.show();
    };
    PropertyMappingsComponent.prototype.onEditClick = function () {
        this.addOrUpdateBtnTxt = 'Update';
        this.addPropertyMappingModal.show();
    };
    PropertyMappingsComponent.prototype.addPropertyMapping = function (serviceTemplateProp, targetObj, targetProp) {
        var _this = this;
        this.service.addPropertyMapping({
            serviceTemplatePropertyRef: serviceTemplateProp,
            targetObjectRef: targetObj,
            targetPropertyRef: targetProp
        }).subscribe(function (data) { return _this.handleSuccess('Added new property mapping'); }, function (error) { return _this.handleError(error); });
        this.addPropertyMappingModal.hide();
    };
    PropertyMappingsComponent.prototype.handleSuccess = function (message) {
        this.getMappings();
        this.notify.success(message);
    };
    PropertyMappingsComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString());
    };
    return PropertyMappingsComponent;
}());
__decorate([
    core_1.ViewChild('addPropertyMappingModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyMappingsComponent.prototype, "addPropertyMappingModal", void 0);
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyMappingsComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('browseForServiceTemplatePropertyDiag'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertyMappingsComponent.prototype, "browseForServiceTemplatePropertyDiag", void 0);
__decorate([
    core_1.ViewChild('propertyMappingForm'),
    __metadata("design:type", forms_1.NgForm)
], PropertyMappingsComponent.prototype, "propertyMappingForm", void 0);
__decorate([
    core_1.ViewChild('tempList'),
    __metadata("design:type", Object)
], PropertyMappingsComponent.prototype, "templateSelect", void 0);
__decorate([
    core_1.ViewChild('propertiesSelect'),
    __metadata("design:type", Object)
], PropertyMappingsComponent.prototype, "propertiesSelect", void 0);
PropertyMappingsComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-boundary-property-mappings',
        templateUrl: 'propertyMappings.component.html',
        providers: [propertyMappings_service_1.PropertyMappingService]
    }),
    __metadata("design:paramtypes", [propertyMappings_service_1.PropertyMappingService,
        wineryNotification_service_1.WineryNotificationService,
        instance_service_1.InstanceService])
], PropertyMappingsComponent);
exports.PropertyMappingsComponent = PropertyMappingsComponent;
//# sourceMappingURL=propertyMappings.component.js.map