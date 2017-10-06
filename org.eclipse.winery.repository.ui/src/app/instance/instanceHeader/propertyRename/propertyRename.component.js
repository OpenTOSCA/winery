/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
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
var core_1 = require("@angular/core");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var propertyRename_service_1 = require("./propertyRename.service");
var toscaComponent_1 = require("../../../wineryInterfaces/toscaComponent");
var forms_1 = require("@angular/forms");
var enums_1 = require("../../../wineryInterfaces/enums");
/**
 * This adds a an editable field to the html that manipulates either the namespace or the id/name of a ToscaComponent
 *
 * @Input id: this is the id of the property which must either be 'id' or 'namespace'
 * @Input toscaComponent: the toscaComponent which's id/namespace is edited/displayed
 */
var PropertyRenameComponent = (function () {
    function PropertyRenameComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.editMode = false;
        this.disableEditing = true;
        this.propertyValue = '';
    }
    PropertyRenameComponent.prototype.ngOnInit = function () {
        this.service.setToscaComponent(this.toscaComponent);
        this.service.setPropertyName(this.propertyName);
        this.disableEditing = this.toscaComponent.toscaType === enums_1.ToscaTypes.Imports
            || this.toscaComponent.toscaType === enums_1.ToscaTypes.Admin;
    };
    PropertyRenameComponent.prototype.ngOnChanges = function () {
        this.service.setToscaComponent(this.toscaComponent);
    };
    PropertyRenameComponent.prototype.updateValue = function () {
        var _this = this;
        this.service.setPropertyValue(this.propertyValue).subscribe(function (data) { return _this.handleUpdateValue(); }, function (error) { return _this.handleError(error); });
    };
    PropertyRenameComponent.prototype.onClickEdit = function () {
        if (this.propertyName === 'localName') {
            this.propertyValue = this.toscaComponent.localName;
        }
        else {
            this.propertyValue = this.toscaComponent.namespace;
        }
        this.editMode = true;
    };
    PropertyRenameComponent.prototype.onSaveValue = function () {
        this.editMode = false;
        this.updateValue();
    };
    PropertyRenameComponent.prototype.onCancel = function () {
        this.editMode = false;
    };
    PropertyRenameComponent.prototype.handleUpdateValue = function () {
        this.notify.success('Renamed ' + this.propertyName + ' to ' + this.propertyValue);
        this.service.reload(this.propertyValue);
    };
    PropertyRenameComponent.prototype.handleError = function (error) {
        this.notify.error('id/name ' + this.propertyValue
            + ' already exists in the current namespace, please enter a different ' + this.propertyName);
    };
    return PropertyRenameComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PropertyRenameComponent.prototype, "propertyName", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", toscaComponent_1.ToscaComponent)
], PropertyRenameComponent.prototype, "toscaComponent", void 0);
__decorate([
    core_1.ViewChild('renameComponentForm'),
    __metadata("design:type", forms_1.NgForm)
], PropertyRenameComponent.prototype, "renameComponentForm", void 0);
PropertyRenameComponent = __decorate([
    core_1.Component({
        selector: 'winery-property-rename',
        templateUrl: 'propertyRename.component.html',
        providers: [propertyRename_service_1.PropertyRenameService],
        styleUrls: [
            'propertyRename.component.css'
        ]
    }),
    __metadata("design:paramtypes", [propertyRename_service_1.PropertyRenameService,
        wineryNotification_service_1.WineryNotificationService])
], PropertyRenameComponent);
exports.PropertyRenameComponent = PropertyRenameComponent;
//# sourceMappingURL=propertyRename.component.js.map