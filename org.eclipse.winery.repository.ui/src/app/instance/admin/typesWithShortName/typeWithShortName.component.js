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
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var typeWithShortName_service_1 = require("./typeWithShortName.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var router_1 = require("@angular/router");
var TypeWithShortNameComponent = (function () {
    function TypeWithShortNameComponent(service, notify, router) {
        this.service = service;
        this.notify = notify;
        this.router = router;
        this.loading = true;
        this.types = [];
        this.newTypeWithShortName = new typeWithShortName_service_1.TypeWithShortName();
        this.columns = [
            { title: 'Short Name', name: 'shortName' },
            { title: 'Long Name', name: 'type' }
        ];
        this.elementToRemove = null;
    }
    TypeWithShortNameComponent.prototype.getTypes = function () {
        var _this = this;
        this.service.getAllTypes().subscribe(function (data) {
            _this.types = data;
            _this.validatorObjectType = new wineryDuplicateValidator_directive_1.WineryValidatorObject(_this.types, 'type');
            _this.validatorObjectShortName = new wineryDuplicateValidator_directive_1.WineryValidatorObject(_this.types, 'shortName');
            _this.loading = false;
        }, function (error) { return _this.notify.error(error.toString()); });
    };
    TypeWithShortNameComponent.prototype.ngOnInit = function () {
        if (this.router.url.includes('planlanguages')) {
            this.title = 'Plan Languages';
        }
        else if (this.router.url.includes('plantypes')) {
            this.title = 'Plan Types';
        }
        else {
            this.title = 'Constraint Types';
        }
        this.getTypes();
    };
    TypeWithShortNameComponent.prototype.addType = function (type, shortName) {
        this.types.push({ type: type, shortName: shortName });
        this.saveType();
    };
    /**
     * handler for clicks on remove button
     * @param data
     */
    TypeWithShortNameComponent.prototype.onRemoveClick = function (data) {
        this.notify.warning('Not yet implemented!');
        // future functionality
        // return;
        // if (isNullOrUndefined(data)) {
        //     this.notify.warning('Nothing to remove. Please select a element');
        //     return;
        // } else {
        //     this.elementToRemove = data;
        //     this.confirmDeleteModal.show();
        // }
    };
    /**
     * handler for clicks on the add button
     */
    TypeWithShortNameComponent.prototype.onAddClick = function () {
        this.addModal.show();
    };
    TypeWithShortNameComponent.prototype.deleteType = function () {
        this.confirmDeleteModal.hide();
        this.deleteItemFromTypesWithShortNameList(this.elementToRemove);
        this.elementToRemove = null;
    };
    TypeWithShortNameComponent.prototype.saveAll = function () {
        var _this = this;
        this.service.postTypes(this.types).subscribe(function (data) { return _this.handleSave(data); }, function (error) { return _this.handleError(error); });
    };
    TypeWithShortNameComponent.prototype.saveType = function () {
        var _this = this;
        this.service.postType(this.newTypeWithShortName).subscribe(function (data) { return _this.handleSave(data); }, function (error) { return _this.handleError(error); });
    };
    /**
     * Deletes a property from the table and model.
     * @param itemToDelete
     */
    TypeWithShortNameComponent.prototype.deleteItemFromTypesWithShortNameList = function (itemToDelete) {
        var list = this.types;
        for (var i = 0; i < list.length; i++) {
            if (list[i].type === itemToDelete.type) {
                list.splice(i, 1);
            }
        }
    };
    TypeWithShortNameComponent.prototype.handleSave = function (data) {
        this.handleSuccess();
        this.getTypes();
    };
    /**
     * Sets loading to false and shows error notification.
     *
     * @param error
     */
    TypeWithShortNameComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString(), 'Error');
    };
    /**
     * Set loading to false and show success notification.
     *
     */
    TypeWithShortNameComponent.prototype.handleSuccess = function () {
        this.loading = false;
        this.notify.success('Saved changes on server', 'Success');
    };
    return TypeWithShortNameComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], TypeWithShortNameComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], TypeWithShortNameComponent.prototype, "addModal", void 0);
TypeWithShortNameComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-type-with-short-name',
        templateUrl: 'typeWithShortName.component.html',
        providers: [wineryNamespaceSelector_service_1.WineryNamespaceSelectorService, typeWithShortName_service_1.TypeWithShortNameService],
    }),
    __metadata("design:paramtypes", [typeWithShortName_service_1.TypeWithShortNameService,
        wineryNotification_service_1.WineryNotificationService,
        router_1.Router])
], TypeWithShortNameComponent);
exports.TypeWithShortNameComponent = TypeWithShortNameComponent;
//# sourceMappingURL=typeWithShortName.component.js.map