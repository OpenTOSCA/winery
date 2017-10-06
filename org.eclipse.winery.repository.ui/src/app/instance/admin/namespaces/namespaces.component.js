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
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var wineryNamespaceSelector_service_1 = require("../../../wineryNamespaceSelector/wineryNamespaceSelector.service");
var namespaces_service_1 = require("./namespaces.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var util_1 = require("util");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var NamespacesComponent = (function () {
    function NamespacesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.adminNamespaces = [];
        this.newNamespace = { namespace: '', prefix: '' };
        this.columns = [
            { title: 'Prefix', name: 'prefix' },
            { title: 'Namespace', name: 'namespace' }
        ];
    }
    NamespacesComponent.prototype.getNamespaces = function () {
        var _this = this;
        this.service.getAllNamespaces().subscribe(function (data) {
            _this.adminNamespaces = data;
            _this.validatorObjectNamespace = new wineryDuplicateValidator_directive_1.WineryValidatorObject(_this.adminNamespaces, 'namespace');
            _this.validatorObjectPrefix = new wineryDuplicateValidator_directive_1.WineryValidatorObject(_this.adminNamespaces, 'prefix');
            _this.loading = false;
        }, function (error) { return _this.notify.error(error.toString()); });
    };
    NamespacesComponent.prototype.ngOnInit = function () {
        this.getNamespaces();
    };
    NamespacesComponent.prototype.addNamespace = function (namespace, prefix) {
        this.adminNamespaces.push({
            namespace: namespace,
            prefix: prefix
        });
        this.save();
    };
    /**
     * handler for clicks on remove button
     * @param data
     */
    NamespacesComponent.prototype.onRemoveClick = function (data) {
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
    NamespacesComponent.prototype.onAddClick = function () {
        this.addModal.show();
    };
    NamespacesComponent.prototype.deleteNamespace = function () {
        this.confirmDeleteModal.hide();
        this.deleteItemFromPropertyDefinitionKvList(this.elementToRemove);
        this.elementToRemove = null;
        this.save();
    };
    NamespacesComponent.prototype.save = function () {
        var _this = this;
        this.service.postNamespaces(this.adminNamespaces).subscribe(function (data) { return _this.handleSave(data); }, function (error) { return _this.handleError(error); });
    };
    /**
     * Deletes a property from the table and model.
     * @param itemToDelete
     */
    NamespacesComponent.prototype.deleteItemFromPropertyDefinitionKvList = function (itemToDelete) {
        var list = this.adminNamespaces;
        for (var i = 0; i < list.length; i++) {
            if (list[i].namespace === itemToDelete.namespace) {
                list.splice(i, 1);
            }
        }
    };
    NamespacesComponent.prototype.handleSave = function (data) {
        this.handleSuccess();
        this.getNamespaces();
    };
    /**
     * Sets loading to false and shows error notification.
     *
     * @param error
     */
    NamespacesComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString(), 'Error');
    };
    /**
     * Set loading to false and show success notification.
     *
     */
    NamespacesComponent.prototype.handleSuccess = function () {
        this.loading = false;
        this.notify.success('Saved changes on server', 'Success');
    };
    return NamespacesComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], NamespacesComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], NamespacesComponent.prototype, "addModal", void 0);
NamespacesComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-namespaces',
        templateUrl: 'namespaces.component.html',
        providers: [wineryNamespaceSelector_service_1.WineryNamespaceSelectorService, namespaces_service_1.NamespacesService],
    }),
    __metadata("design:paramtypes", [namespaces_service_1.NamespacesService,
        wineryNotification_service_1.WineryNotificationService])
], NamespacesComponent);
exports.NamespacesComponent = NamespacesComponent;
//# sourceMappingURL=namespaces.component.js.map