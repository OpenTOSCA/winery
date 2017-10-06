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
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryDuplicateValidator_directive_1 = require("../../../wineryValidators/wineryDuplicateValidator.directive");
var instance_service_1 = require("../../instance.service");
var implementationAPIData_1 = require("./implementationAPIData");
var implementations_service_1 = require("./implementations.service");
var implementationWithTypeAPIData_1 = require("./implementationWithTypeAPIData");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var utils_1 = require("../../../wineryUtils/utils");
var ImplementationsComponent = (function () {
    function ImplementationsComponent(sharedData, service, notificationService) {
        this.sharedData = sharedData;
        this.service = service;
        this.notificationService = notificationService;
        this.loading = true;
        this.newImplementation = new implementationAPIData_1.ImplementationAPIData('', '');
        this.nameOfElementToRemove = '';
        this.selectedNamespace = '';
        this.columns = [
            { title: 'Namespace', name: 'namespace', sort: true },
            { title: 'Name', name: 'displayname', sort: true },
        ];
        this.implementationData = [];
    }
    ImplementationsComponent.prototype.ngOnInit = function () {
        this.getImplementationData();
    };
    // region ######## table methods ########
    ImplementationsComponent.prototype.onCellSelected = function (data) {
        if (!util_1.isNullOrUndefined(data)) {
            this.selectedCell = data.row;
        }
    };
    ImplementationsComponent.prototype.onAddClick = function () {
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.implementationData, 'localname');
        this.newImplementation = new implementationAPIData_1.ImplementationAPIData('', '');
        this.addModal.show();
    };
    ImplementationsComponent.prototype.addNewImplementation = function (localname) {
        var _this = this;
        this.loading = true;
        var type = '{' + this.sharedData.toscaComponent.namespace + '}' + this.sharedData.toscaComponent.localName;
        var resource = new implementationWithTypeAPIData_1.ImplementationWithTypeAPIData(this.selectedNamespace, localname, type);
        this.service.postImplementation(resource).subscribe(function (data) { return _this.handlePostResponse(data); }, function (error) { return _this.handleError(error); });
    };
    ImplementationsComponent.prototype.onRemoveClick = function (data) {
        if (util_1.isNullOrUndefined(data)) {
            return;
        }
        else {
            this.elementToRemove = new implementationAPIData_1.ImplementationAPIData(data.namespace, data.localname);
            var regex = /.*>(.*)<+/g;
            var match = regex.exec(data.localname);
            this.nameOfElementToRemove = match[1];
            this.confirmDeleteModal.show();
        }
    };
    ImplementationsComponent.prototype.removeConfirmed = function () {
        var _this = this;
        this.confirmDeleteModal.hide();
        this.loading = true;
        this.service.deleteImplementations(this.elementToRemove)
            .subscribe(function (data) { return _this.handleDeleteResponse(data); }, function (error) { return _this.handleError(error); });
        this.elementToRemove = null;
    };
    // endregion
    // region ######## call service methods and subscription handlers ########
    ImplementationsComponent.prototype.getImplementationData = function () {
        var _this = this;
        this.service.getImplementationData()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    ImplementationsComponent.prototype.handleData = function (impl) {
        var _this = this;
        this.implementationData = impl;
        this.implementationData = this.implementationData.map(function (item) {
            var url = '/#/' + utils_1.Utils.getImplementationOrTemplateOfType(_this.sharedData.toscaComponent.toscaType)
                + '/' + encodeURIComponent(encodeURIComponent(item.namespace))
                + '/' + item.localname;
            item.displayname = '<a href="' + url + '">' + item.localname + '</a>';
            return item;
        });
        this.loading = false;
    };
    ImplementationsComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notificationService.error('Action caused an error:\n', error);
    };
    ImplementationsComponent.prototype.handlePostResponse = function (data) {
        this.loading = false;
        if (data.ok) {
            this.getImplementationData();
            this.notificationService.success('Created new Implementation');
        }
        else {
            this.notificationService.error('Failed to create Implementation');
        }
    };
    ImplementationsComponent.prototype.handleDeleteResponse = function (data) {
        this.loading = false;
        if (data.ok) {
            this.getImplementationData();
            this.notificationService.success('Deletion of Implementation Successful');
        }
        else {
            this.notificationService.error('Failed to delete Implementation failed');
        }
    };
    return ImplementationsComponent;
}());
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], ImplementationsComponent.prototype, "confirmDeleteModal", void 0);
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], ImplementationsComponent.prototype, "addModal", void 0);
ImplementationsComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-implementations',
        templateUrl: 'implementations.component.html',
        providers: [implementations_service_1.ImplementationService,
            wineryNotification_service_1.WineryNotificationService],
    }),
    __metadata("design:paramtypes", [instance_service_1.InstanceService,
        implementations_service_1.ImplementationService,
        wineryNotification_service_1.WineryNotificationService])
], ImplementationsComponent);
exports.ImplementationsComponent = ImplementationsComponent;
//# sourceMappingURL=implementations.component.js.map