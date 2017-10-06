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
var instance_service_1 = require("../../instance.service");
var propertiesDefinition_service_1 = require("./propertiesDefinition.service");
var propertiesDefinitionsResourceApiData_1 = require("./propertiesDefinitionsResourceApiData");
var selectData_1 = require("../../../wineryInterfaces/selectData");
var util_1 = require("util");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var PropertiesDefinitionComponent = (function () {
    function PropertiesDefinitionComponent(sharedData, service, notify) {
        this.sharedData = sharedData;
        this.service = service;
        this.notify = notify;
        this.propertiesEnum = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum;
        this.loading = true;
        this.activeElement = new selectData_1.SelectData();
        this.elementToRemove = null;
        this.columns = [
            { title: 'Name', name: 'key', sort: true },
            { title: 'Type', name: 'type', sort: true },
        ];
        this.newProperty = new propertiesDefinitionsResourceApiData_1.PropertiesDefinitionKVElement();
    }
    // region ########## Angular Callbacks ##########
    /**
     * @override
     */
    PropertiesDefinitionComponent.prototype.ngOnInit = function () {
        this.getPropertiesDefinitionsResourceApiData();
    };
    // endregion
    // region ########## Template Callbacks ##########
    // region ########## Radio Buttons ##########
    PropertiesDefinitionComponent.prototype.onNoneSelected = function () {
        this.resourceApiData.selectedValue = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.None;
    };
    /**
     * Called by the template, if property XML Element is selected. It sends a GET request
     * to the backend to get the data for the select dropdown.
     */
    PropertiesDefinitionComponent.prototype.onXmlElementSelected = function () {
        var _this = this;
        this.resourceApiData.selectedValue = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Element;
        if (util_1.isNullOrUndefined(this.resourceApiData.propertiesDefinition)) {
            this.resourceApiData.propertiesDefinition = new propertiesDefinitionsResourceApiData_1.PropertiesDefinition();
        }
        this.resourceApiData.propertiesDefinition.type = null;
        this.resourceApiData.winerysPropertiesDefinition = null;
        this.service.getXsdElementDefinitions()
            .subscribe(function (data) { return _this.handleSelectData(data, false); }, function (error) { return _this.handleError(error); });
    };
    /**
     * Called by the template, if property XML Type is selected. It sends a GET request
     * to the backend to get the data for the select dropdown.
     */
    PropertiesDefinitionComponent.prototype.onXmlTypeSelected = function () {
        var _this = this;
        this.resourceApiData.selectedValue = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Type;
        if (util_1.isNullOrUndefined(this.resourceApiData.propertiesDefinition)) {
            this.resourceApiData.propertiesDefinition = new propertiesDefinitionsResourceApiData_1.PropertiesDefinition();
        }
        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.winerysPropertiesDefinition = null;
        this.service.getXsdTypeDefinitions()
            .subscribe(function (data) { return _this.handleSelectData(data, true); }, function (error) { return _this.handleError(error); });
    };
    /**
     * Called by the template, if the custom key/value pair property is selected. It will display
     * a table to enter those pairs.
     */
    PropertiesDefinitionComponent.prototype.onCustomKeyValuePairSelected = function () {
        this.resourceApiData.selectedValue = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Custom;
        if (util_1.isNullOrUndefined(this.resourceApiData.propertiesDefinition)) {
            this.resourceApiData.propertiesDefinition = new propertiesDefinitionsResourceApiData_1.PropertiesDefinition();
        }
        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.propertiesDefinition.type = null;
        if (util_1.isNullOrUndefined(this.resourceApiData.propertiesDefinition)) {
            this.resourceApiData.propertiesDefinition = new propertiesDefinitionsResourceApiData_1.PropertiesDefinition();
        }
        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.propertiesDefinition.type = null;
        if (util_1.isNullOrUndefined(this.resourceApiData.winerysPropertiesDefinition)) {
            this.resourceApiData.winerysPropertiesDefinition = new propertiesDefinitionsResourceApiData_1.WinerysPropertiesDefinition();
        }
        // The key/value pair list may be null
        if (util_1.isNullOrUndefined(this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList)) {
            this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList = [];
        }
        if (util_1.isNullOrUndefined(this.resourceApiData.winerysPropertiesDefinition.namespace)) {
            this.resourceApiData.winerysPropertiesDefinition.namespace = this.sharedData.toscaComponent.namespace + '/propertiesdefinition/winery';
        }
        if (util_1.isNullOrUndefined(this.resourceApiData.winerysPropertiesDefinition.elementName)) {
            this.resourceApiData.winerysPropertiesDefinition.elementName = 'properties';
        }
        this.activeElement = new selectData_1.SelectData();
        this.activeElement.text = this.resourceApiData.winerysPropertiesDefinition.namespace;
    };
    // endregion
    // region ########## Button Callbacks ##########
    PropertiesDefinitionComponent.prototype.save = function () {
        var _this = this;
        this.loading = true;
        if (this.resourceApiData.selectedValue === propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.None) {
            this.service.deletePropertiesDefinitions()
                .subscribe(function (data) { return _this.handleDelete(data); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.service.postPropertiesDefinitions(this.resourceApiData)
                .subscribe(function (data) { return _this.handleSave(data); }, function (error) { return _this.handleError(error); });
        }
    };
    /**
     * handler for clicks on remove button
     * @param data
     */
    PropertiesDefinitionComponent.prototype.onRemoveClick = function (data) {
        if (util_1.isNullOrUndefined(data)) {
            return;
        }
        else {
            this.elementToRemove = data;
            this.confirmDeleteModal.show();
        }
    };
    /**
     * handler for clicks on the add button
     */
    PropertiesDefinitionComponent.prototype.onAddClick = function () {
        this.newProperty = new propertiesDefinitionsResourceApiData_1.PropertiesDefinitionKVElement();
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList, 'key');
        this.addModal.show();
    };
    // endregion
    /**
     * Called by the template, if a property is selected in the select box. Cannot be replaced
     * by ngModel in the template because the same select is used for element and type definitions.
     */
    PropertiesDefinitionComponent.prototype.xmlValueSelected = function (event) {
        if (this.resourceApiData.selectedValue === propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Element) {
            this.resourceApiData.propertiesDefinition.element = event.id;
        }
        else if (this.resourceApiData.selectedValue === propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Type) {
            this.resourceApiData.propertiesDefinition.type = event.id;
        }
    };
    PropertiesDefinitionComponent.prototype.onCellSelected = function (data) {
        if (util_1.isNullOrUndefined(data)) {
            this.selectedCell = data;
        }
    };
    // endregion
    // region ########## Modal Callbacks ##########
    /**
     * Adds a property to the table and model
     * @param propType
     * @param propName
     */
    PropertiesDefinitionComponent.prototype.addProperty = function (propType, propName) {
        this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList.push({
            key: propName,
            type: propType
        });
        this.addModal.hide();
    };
    PropertiesDefinitionComponent.prototype.removeConfirmed = function () {
        this.confirmDeleteModal.hide();
        this.deleteItemFromPropertyDefinitionKvList(this.elementToRemove);
        this.elementToRemove = null;
    };
    // endregion
    // region ########## Private Methods ##########
    PropertiesDefinitionComponent.prototype.getPropertiesDefinitionsResourceApiData = function () {
        var _this = this;
        this.loading = true;
        this.service.getPropertiesDefinitionsData()
            .subscribe(function (data) { return _this.handlePropertiesDefinitionData(data); }, function (error) { return _this.handleError(error); });
    };
    PropertiesDefinitionComponent.prototype.handleSelectData = function (data, isType) {
        var _this = this;
        this.selectItems = data;
        this.selectItems.some(function (nsList) {
            _this.activeElement = nsList.children.find(function (item) {
                if (isType) {
                    return item.id === _this.resourceApiData.propertiesDefinition.type;
                }
                return item.id === _this.resourceApiData.propertiesDefinition.element;
            });
            return !util_1.isNullOrUndefined(_this.activeElement);
        });
        if (util_1.isNullOrUndefined(this.activeElement)) {
            this.activeElement = new selectData_1.SelectData();
        }
    };
    /**
     * Set loading to false and show success notification.
     *
     * @param data
     * @param actionType
     */
    PropertiesDefinitionComponent.prototype.handleSuccess = function (data, actionType) {
        this.loading = false;
        switch (actionType) {
            case 'delete':
                this.notify.success('Deleted PropertiesDefinition', 'Success');
                break;
            case 'change':
                this.notify.success('Saved changes on server', 'Success');
                break;
            default:
                break;
        }
    };
    /**
     * Reloads the new data from the backend (only called on success).
     *
     * @param data
     */
    PropertiesDefinitionComponent.prototype.handleDelete = function (data) {
        this.handleSuccess(data, 'delete');
        this.getPropertiesDefinitionsResourceApiData();
    };
    PropertiesDefinitionComponent.prototype.handlePropertiesDefinitionData = function (data) {
        this.resourceApiData = data;
        // because the selectedValue doesn't get set correctly do it here
        switch (util_1.isNullOrUndefined(this.resourceApiData.selectedValue) ? '' : this.resourceApiData.selectedValue.toString()) {
            case propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Element:
                this.onXmlElementSelected();
                break;
            case propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Type:
                this.onXmlTypeSelected();
                break;
            case propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.Custom:
                this.onCustomKeyValuePairSelected();
                break;
            default:
                this.resourceApiData.selectedValue = propertiesDefinitionsResourceApiData_1.PropertiesDefinitionEnum.None;
        }
        this.handleSuccess(data);
    };
    ;
    PropertiesDefinitionComponent.prototype.handleSave = function (data) {
        this.handleSuccess(data, 'change');
        this.getPropertiesDefinitionsResourceApiData();
    };
    /**
     * Deletes a property from the table and model.
     * @param itemToDelete
     */
    PropertiesDefinitionComponent.prototype.deleteItemFromPropertyDefinitionKvList = function (itemToDelete) {
        var list = this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].key === itemToDelete.key) {
                list.splice(i, 1);
            }
        }
    };
    /**
     * Sets loading to false and shows error notification.
     *
     * @param error
     */
    PropertiesDefinitionComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString(), 'Error');
    };
    return PropertiesDefinitionComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertiesDefinitionComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], PropertiesDefinitionComponent.prototype, "addModal", void 0);
PropertiesDefinitionComponent = __decorate([
    core_1.Component({
        templateUrl: 'propertiesDefinition.component.html',
        styleUrls: [
            'propertiesDefinition.component.css'
        ],
        providers: [
            propertiesDefinition_service_1.PropertiesDefinitionService
        ]
    }),
    __metadata("design:paramtypes", [instance_service_1.InstanceService, propertiesDefinition_service_1.PropertiesDefinitionService,
        wineryNotification_service_1.WineryNotificationService])
], PropertiesDefinitionComponent);
exports.PropertiesDefinitionComponent = PropertiesDefinitionComponent;
//# sourceMappingURL=propertiesDefinition.component.js.map