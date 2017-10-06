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
var templatesOfTypes_service_1 = require("./templatesOfTypes.service");
var TemplatesOfTypeComponent = (function () {
    function TemplatesOfTypeComponent(service, notificationService) {
        this.service = service;
        this.notificationService = notificationService;
        this.loading = true;
        this.columns = [
            { title: 'Namespace', name: 'namespace', sort: true },
            { title: 'Name', name: 'localname', sort: true },
        ];
        this.templateData = [];
    }
    TemplatesOfTypeComponent.prototype.ngOnInit = function () {
        this.getImplementationData();
    };
    // region ######## table methods ########
    TemplatesOfTypeComponent.prototype.onCellSelected = function (data) {
        if (!util_1.isNullOrUndefined(data)) {
            this.selectedCell = data.row;
        }
    };
    // endregion
    // region ######## call service methods and subscription handlers ########
    TemplatesOfTypeComponent.prototype.getImplementationData = function () {
        var _this = this;
        this.service.getTemplateData()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    TemplatesOfTypeComponent.prototype.handleData = function (impl) {
        this.templateData = impl;
        if (this.service.getPath().includes('artifact')) {
            this.templateData = this.templateData.map(function (item) {
                var url = '/#/' + 'artifacttemplates' + '/' + encodeURIComponent(encodeURIComponent(item.namespace))
                    + '/' + item.localname;
                item.localname = '<a href="' + url + '">' + item.localname + '</a>';
                return item;
            });
        }
        else if (this.service.getPath().includes('policy')) {
            this.templateData = this.templateData.map(function (item) {
                var url = '/#/' + 'policytemplates' + '/' + encodeURIComponent(encodeURIComponent(item.namespace))
                    + '/' + item.localname;
                item.localname = '<a href="' + url + '">' + item.localname + '</a>';
                return item;
            });
        }
        this.loading = false;
    };
    TemplatesOfTypeComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notificationService.error('Action caused an error:\n', error);
    };
    return TemplatesOfTypeComponent;
}());
TemplatesOfTypeComponent = __decorate([
    core_1.Component({
        selector: 'winery-templates-of-type',
        templateUrl: 'templatesOfType.component.html',
        providers: [templatesOfTypes_service_1.TemplatesOfTypeService,
            wineryNotification_service_1.WineryNotificationService],
    }),
    __metadata("design:paramtypes", [templatesOfTypes_service_1.TemplatesOfTypeService,
        wineryNotification_service_1.WineryNotificationService])
], TemplatesOfTypeComponent);
exports.TemplatesOfTypeComponent = TemplatesOfTypeComponent;
//# sourceMappingURL=templatesOfTypes.component.js.map