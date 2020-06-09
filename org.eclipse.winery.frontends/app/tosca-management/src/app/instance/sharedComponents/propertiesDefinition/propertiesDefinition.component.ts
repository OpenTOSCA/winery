/*******************************************************************************
 * Copyright (c) 2017-2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *******************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { InstanceService } from '../../instance.service';
import { PropertiesDefinitionService } from './propertiesDefinition.service';
import {
    PropertiesDefinition, PropertiesDefinitionEnum, PropertiesDefinitionKVElement, PropertiesDefinitionsResourceApiData, WinerysPropertiesDefinition
} from './propertiesDefinitionsResourceApiData';
import { SelectData } from '../../../model/selectData';
import { WineryNotificationService } from '../../../wineryNotificationModule/wineryNotification.service';
import { WineryRowData, WineryTableColumn } from '../../../wineryTableModule/wineryTable.component';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { WineryRepositoryConfigurationService } from '../../../wineryFeatureToggleModule/WineryRepositoryConfiguration.service';
import { FeatureEnum } from '../../../wineryFeatureToggleModule/wineryRepository.feature.direct';
import { YamlPropertyDefinition, isYaml } from './yaml/yamlPropertyDefinition';
import { WineryValidatorObject } from '../../../wineryValidators/wineryDuplicateValidator.directive';
import { Constraint, yaml_well_known } from '../../../model/constraint';
import { SchemaDefinition, TDataType } from '../../../../../../topologymodeler/src/app/models/ttopology-template';
import { DataTypesService } from '../../dataTypes/dataTypes.service';

@Component({
    templateUrl: 'propertiesDefinition.component.html',
    styleUrls: [
        'propertiesDefinition.component.css'
    ],
    providers: [
        PropertiesDefinitionService,
        DataTypesService,
    ],
})
export class PropertiesDefinitionComponent implements OnInit {

    propertiesEnum = PropertiesDefinitionEnum;
    loading = true;

    resourceApiData: PropertiesDefinitionsResourceApiData;

    selectItems: SelectData[];
    activeElement = new SelectData();
    selectedCell: WineryRowData;
    elementToRemove: any = null;
    columns: Array<WineryTableColumn> = [];
    tableData: Array<PropertiesDefinitionKVElement | YamlPropertyDefinition> = [];

    editedProperty: any;
    editedConstraints: Constraint[];
    propertyOperation: 'Add' | 'Edit';
    isYaml: boolean;
    validatorObject: WineryValidatorObject;
    availableTypes: string[] = [];
    private yamlTypes: string[] = [];
    private xmlTypes: string[] = ['xsd:string', 'xsd:float', 'xsd:decimal', 'xsd:anyURI', 'xsd:QName'];

    configEnum = FeatureEnum;

    @ViewChild('confirmDeleteModal')
    confirmDeleteModal: ModalDirective;
    confirmDeleteModalRef: BsModalRef;

    @ViewChild('editorModal')
    editorModal: ModalDirective;
    editorModalRef: BsModalRef;

    constructor(public sharedData: InstanceService, private service: PropertiesDefinitionService,
                private modalService: BsModalService, private dataTypes: DataTypesService,
                private notify: WineryNotificationService, private configurationService: WineryRepositoryConfigurationService) {
    }

    // region ########## Angular Callbacks ##########
    /**
     * @override
     */
    ngOnInit() {
        this.getPropertiesDefinitionsResourceApiData();

        // fill the available types with the types we know
        setTimeout(() => {
            yaml_well_known.forEach(t => this.yamlTypes.push(t));
            this.dataTypes.getDataTypes().subscribe(
                (types: TDataType[]) => types.forEach(t => this.yamlTypes.push(`{${t.namespace}}${t.id}`)),
                error => console.log(error),
            );
        });
    }

    copyToTable() {
        this.tableData = [];
        if (this.resourceApiData.propertiesDefinition !== null) {
            // assume we have yaml properties
            this.columns = yaml_columns;
            this.tableData = this.resourceApiData.propertiesDefinition.properties
                .map(prop => {
                    fillDefaults(prop);
                    return prop;
                });
            this.isYaml = true;
            this.availableTypes = this.yamlTypes;
            this.validatorObject = new WineryValidatorObject(
                this.resourceApiData.propertiesDefinition.properties,
                'name',
                this.editedProperty);

        } else if (this.resourceApiData.winerysPropertiesDefinition !== null) {
            this.columns = winery_properties_columns;
            this.tableData = this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList
                .map(prop => {
                    fillDefaults(prop);
                    return prop;
                });
            this.isYaml = false;
            this.availableTypes = this.xmlTypes;
            this.validatorObject = new WineryValidatorObject(
                this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList,
                'key',
                this.editedProperty
            );
        }
    }

    // endregion

    // region ########## Template Callbacks ##########
    // region ########## Radio Buttons ##########
    onNoneSelected(): void {
        this.resourceApiData.selectedValue = PropertiesDefinitionEnum.None;
    }

    /**
     * Called by the template, if property XML Element is selected. It sends a GET request
     * to the backend to get the data for the select dropdown.
     */
    onXmlElementSelected(): void {
        this.resourceApiData.selectedValue = PropertiesDefinitionEnum.Element;

        if (!this.resourceApiData.propertiesDefinition) {
            this.resourceApiData.propertiesDefinition = new PropertiesDefinition();
        }

        this.resourceApiData.propertiesDefinition.type = null;
        this.resourceApiData.winerysPropertiesDefinition = null;

        this.service.getXsdElementDefinitions()
            .subscribe(
                data => this.handleSelectData(data, false),
                error => this.handleError(error)
            );
    }

    /**
     * Called by the template, if property XML Type is selected. It sends a GET request
     * to the backend to get the data for the select dropdown.
     */
    onXmlTypeSelected(): void {
        this.resourceApiData.selectedValue = PropertiesDefinitionEnum.Type;

        if (!this.resourceApiData.propertiesDefinition) {
            this.resourceApiData.propertiesDefinition = new PropertiesDefinition();
        }

        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.winerysPropertiesDefinition = null;

        this.service.getXsdTypeDefinitions()
            .subscribe(
                data => this.handleSelectData(data, true),
                error => this.handleError(error)
            );
    }

    /**
     * Called by the template, if the custom key/value pair property is selected. It will display
     * a table to enter those pairs.
     */
    onCustomKeyValuePairSelected(): void {
        this.resourceApiData.selectedValue = PropertiesDefinitionEnum.Custom;

        if (!this.resourceApiData.propertiesDefinition) {
            this.resourceApiData.propertiesDefinition = new PropertiesDefinition();
        }
        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.propertiesDefinition.type = null;

        if (!this.resourceApiData.winerysPropertiesDefinition) {
            this.resourceApiData.winerysPropertiesDefinition = new WinerysPropertiesDefinition();
        }
        // The key/value pair list may be null
        if (!this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList) {
            this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList = [];
        }

        if (!this.resourceApiData.winerysPropertiesDefinition.namespace) {
            this.resourceApiData.winerysPropertiesDefinition.namespace = this.sharedData.toscaComponent.namespace + '/propertiesdefinition/winery';
        }
        if (!this.resourceApiData.winerysPropertiesDefinition.elementName) {
            this.resourceApiData.winerysPropertiesDefinition.elementName = 'properties';
        }

        this.activeElement = new SelectData();
        this.activeElement.text = this.resourceApiData.winerysPropertiesDefinition.namespace;
    }

    onYamlProperties(): void {
        this.resourceApiData.selectedValue = PropertiesDefinitionEnum.Yaml;

        // null away all the data access points that are not yaml
        this.resourceApiData.winerysPropertiesDefinition = new WinerysPropertiesDefinition();
        this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList = null;
        this.resourceApiData.propertiesDefinition.element = null;
        this.resourceApiData.propertiesDefinition.type = null;
    }

    // endregion

    // region ########## Button Callbacks ##########
    save(): void {
        this.loading = true;
        if (this.resourceApiData.selectedValue === PropertiesDefinitionEnum.None) {
            this.service.deletePropertiesDefinitions()
                .subscribe(
                    data => this.handleDelete(data),
                    error => this.handleError(error)
                );
        } else {
            this.service.postPropertiesDefinitions(this.resourceApiData)
                .subscribe(
                    data => this.handleSave(data),
                    error => this.handleError(error)
                );
        }
    }

    /**
     * handler for clicks on remove button
     * @param data
     */
    onRemoveClick(data: PropertiesDefinitionKVElement) {
        if (data) {
            this.elementToRemove = data;
            this.confirmDeleteModalRef = this.modalService.show(this.confirmDeleteModal);
        }
    }

    /**
     * handler for clicks on the add button
     */
    onAddClick() {
        this.editedProperty = this.configurationService.isYaml() ? new YamlPropertyDefinition() : new PropertiesDefinitionKVElement();
        this.editedConstraints = [];
        this.propertyOperation = 'Add';
        if (this.editedProperty.entrySchema === undefined) {
            this.editedProperty.entrySchema = { type: '' };
        }
        if (this.editedProperty.keySchema === undefined) {
            this.editedProperty.keySchema = { type: '' };
        }
        this.editorModalRef = this.modalService.show(this.editorModal);
    }

    onEditClick(data: YamlPropertyDefinition | PropertiesDefinitionKVElement) {
        this.propertyOperation = 'Edit';
        this.editedProperty = data;
        this.editedConstraints = [];
        if (this.editedProperty.keySchema === undefined) {
            this.editedProperty.keySchema = { type: '' };
        }
        if (this.editedProperty.entrySchema === undefined) {
            this.editedProperty.entrySchema = { type: '' };
        }
        this.editedProperty.constraints.forEach((c: Constraint) => this.editedConstraints.push(c));
        this.editorModalRef = this.modalService.show(this.editorModal);
    }

    // endregion

    /**
     * Called by the template, if a property is selected in the select box. Cannot be replaced
     * by ngModel in the template because the same select is used for element and type definitions.
     */
    xmlValueSelected(event: SelectData): void {
        if (this.resourceApiData.selectedValue === PropertiesDefinitionEnum.Element) {
            this.resourceApiData.propertiesDefinition.element = event.id;
        } else if (this.resourceApiData.selectedValue === PropertiesDefinitionEnum.Type) {
            this.resourceApiData.propertiesDefinition.type = event.id;
        }
    }

    onCellSelected(data: WineryRowData) {
        this.selectedCell = data;
    }

    // endregion

    // region ########## Modal Callbacks ##########
    handleEditorSubmit(name: string, type: string, entrySchema: string, keySchema: string, defaultValue: string, required: boolean, description: string) {
        if (this.propertyOperation === 'Add') {
            this.createEditedProperty(name, type, entrySchema, keySchema);
        } else if (this.propertyOperation === 'Edit') {
            this.updateEditedProperty(name, type, entrySchema, keySchema);
        }
        // update shared properties
        this.editedProperty.type = type;
        this.editedProperty.defaultValue = defaultValue;
        this.editedProperty.required = required;
        this.editedProperty.description = description;
        this.editedProperty.constraints = this.editedConstraints;
        // no need to update resourceApiData for edit operation because the editedProperty is a reference
        if (this.propertyOperation === 'Add') {
            if (this.isYaml) {
                // @ts-ignore
                this.resourceApiData.propertiesDefinition.properties.push(newProp);
            } else {
                // @ts-ignore
                this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList.push(newProp);
            }
        }
        this.save();
        this.copyToTable();
        // abuse AddClick to clear the form without producing errors
        this.onAddClick();
        this.editorModalRef.hide();
    }

    private updateEditedProperty(name: string, type: string, entrySchema: string, keySchema: string) {
        if (this.isYaml) {
            this.editedProperty.name = name;
            if (type === 'list' || type === 'map') {
                // entrySchema should be defined now
                if (this.editedProperty.entrySchema) {
                    this.editedProperty.entrySchema.type = entrySchema || 'string';
                } else {
                    this.editedProperty.entrySchema = new SchemaDefinition(entrySchema || 'string', '', [], undefined, undefined);
                }
            } else {
                this.editedProperty.entrySchema = undefined;
            }
            if (type === 'map' && keySchema !== '') {
                if (this.editedProperty.keySchema) {
                    this.editedProperty.keySchema.type = keySchema;
                } else {
                    this.editedProperty.keySchema = new SchemaDefinition(keySchema, '', [], undefined, undefined);
                }
            } else {
                this.editedProperty.keySchema = undefined;
            }
        } else {
            this.editedProperty.key = name;
            delete this.editedProperty.entrySchema;
            delete this.editedProperty.keySchema;
        }
    }

    private createEditedProperty(name: string, type: string, entrySchema: string, keySchema: string) {
        let newProp;
        if (this.isYaml) {
            newProp = new YamlPropertyDefinition(name);
            if (type === 'list' || type === 'map') {
                // entry schema should be defined now
                newProp.entrySchema = new SchemaDefinition(entrySchema || 'string', '', [], undefined, undefined);
            }
            if (type === 'map' && keySchema !== '') {
                newProp.keySchema = new SchemaDefinition(keySchema, '', [], undefined, undefined);
            }
        } else {
            newProp = new PropertiesDefinitionKVElement();
            newProp.key = name;
        }
        this.editedProperty = newProp;
    }

    removeConfirmed() {
        this.confirmDeleteModalRef.hide();
        this.deleteItemFromPropertyDefinitionKvList(this.elementToRemove);
        this.elementToRemove = null;
        this.copyToTable();
        this.save();
    }

    addConstraint(selectedConstraintKey: string, constraintValue: string) {
        // lists have to be separated by ','
        if (list_constraint_keys.indexOf(selectedConstraintKey) > -1) {
            this.editedConstraints.push(new Constraint(selectedConstraintKey, null, constraintValue.split(',')));
        } else {
            this.editedConstraints.push(new Constraint(selectedConstraintKey, constraintValue, null));
        }
    }

    /**
     * removes item from constraint list
     * @param constraintClause
     */
    removeConstraint(constraintClause: Constraint) {
        const index = this.editedConstraints.indexOf(constraintClause);
        if (index > -1) {
            this.editedConstraints.splice(index, 1);
        }
    }

    get valid_constraint_keys() {
        return valid_constraint_keys;
    }

    get list_constraint_keys() {
        return list_constraint_keys;
    }

    get range_constraint_keys() {
        return range_constraint_keys;
    }

    // endregion

    // region ########## Private Methods ##########
    private getPropertiesDefinitionsResourceApiData(): void {
        this.loading = true;
        this.service.getPropertiesDefinitionsData()
            .subscribe(
                data => this.handlePropertiesDefinitionData(data),
                error => this.handleError(error)
            );
    }

    private handleSelectData(data: SelectData[], isType: boolean) {
        this.selectItems = data;

        this.selectItems.some(nsList => {
            this.activeElement = nsList.children.find(item => {
                if (isType) {
                    return item.id === this.resourceApiData.propertiesDefinition.type;
                }
                return item.id === this.resourceApiData.propertiesDefinition.element;
            });
            return !!this.activeElement;
        });

        if (!this.activeElement) {
            this.activeElement = new SelectData();
        }
    }

    /**
     * Set loading to false and show success notification.
     *
     * @param data
     * @param actionType
     */
    private handleSuccess(data: any, actionType?: string): void {
        this.loading = false;
        this.copyToTable();
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
    }

    /**
     * Reloads the new data from the backend (only called on success).
     *
     * @param data
     */
    private handleDelete(data: any): void {
        this.handleSuccess(data, 'delete');
        this.getPropertiesDefinitionsResourceApiData();
    }

    private handlePropertiesDefinitionData(data: PropertiesDefinitionsResourceApiData): void {
        this.resourceApiData = data;
        // because the selectedValue doesn't get set correctly do it here
        switch (!this.resourceApiData.selectedValue ? '' : this.resourceApiData.selectedValue.toString()) {
            case PropertiesDefinitionEnum.Element:
                this.onXmlElementSelected();
                break;
            case PropertiesDefinitionEnum.Type:
                this.onXmlTypeSelected();
                break;
            case PropertiesDefinitionEnum.Custom:
                this.onCustomKeyValuePairSelected();
                break;
            case PropertiesDefinitionEnum.Yaml:
                this.onYamlProperties();
                break;
            default:
                this.resourceApiData.selectedValue = PropertiesDefinitionEnum.None;
        }

        this.handleSuccess(data);
    }

    private handleSave(data: HttpResponse<string>) {
        this.handleSuccess(data, 'change');
        this.getPropertiesDefinitionsResourceApiData();
    }

    /**
     * Deletes a property from the table and model.
     * @param itemToDelete
     */
    private deleteItemFromPropertyDefinitionKvList(itemToDelete: any): void {
        const list = this.resourceApiData.winerysPropertiesDefinition.propertyDefinitionKVList || [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].key === itemToDelete.key) {
                list.splice(i, 1);
            }
        }

        const yamlList = this.resourceApiData.propertiesDefinition.properties || [];
        for (let i = 0; i < yamlList.length; i++) {
            if (yamlList[i].name === itemToDelete.key) {
                yamlList.splice(i, 1);
            }
        }
    }

    /**
     * Sets loading to false and shows error notification.
     *
     * @param error
     */
    private handleError(error: HttpErrorResponse): void {
        this.loading = false;
        this.notify.error(error.message, 'Error');
    }
    // endregion
}

const winery_properties_columns: Array<WineryTableColumn> = [
    { title: 'Name', name: 'key', sort: true },
    { title: 'Type', name: 'type', sort: true },
    { title: 'Required', name: 'required' },
    { title: 'Default Value', name: 'defaultValue' },
    { title: 'Description', name: 'description' },
    { title: 'Constraints', name: 'constraints', display: joinList},
];
const yaml_columns: Array<WineryTableColumn> = [
    { title: 'Name', name: 'name', sort: true },
    { title: 'Type', name: 'type', sort: true },
    { title: 'Required', name: 'required' },
    { title: 'Default Value', name: 'defaultValue' },
    { title: 'Description', name: 'description' },
    { title: 'Constraints', name: 'constraints', display: joinList },
];

function joinList(list: any[]): string {
    let constraintsString = '';
    for (const value of list) {
        if (value.value == null) {
            constraintsString += value.key + ':' + value.list.toString();
        } else if (value.list == null) {
            constraintsString += value.key + ':' + value.value;
        } else {
            constraintsString += value.key;
        }
        if (list.indexOf(value) !== list.length - 1) {
            constraintsString += ', ';
        }
    }
    return constraintsString;
}

function fillDefaults(propDef: YamlPropertyDefinition | PropertiesDefinitionKVElement) {
    if (!propDef.defaultValue) {
        propDef.defaultValue = '';
    }
    if (!propDef.description) {
        propDef.description = '';
    }
}

const valid_constraint_keys = ['equal', 'greater_than', 'greater_or_equal', 'less_than', 'less_or_equal', 'in_range',
    'valid_values', 'length', 'min_length', 'max_length', 'pattern', 'schema'];
const list_constraint_keys = ['valid_values', 'in_range'];
const range_constraint_keys = ['in_range'];
