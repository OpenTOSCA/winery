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
var properties_service_1 = require("./properties.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var PropertiesComponent = (function () {
    function PropertiesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        /**
         * Why `any`? => see {@link PropertiesService.getProperties()}
         */
        this.properties = null;
        this.loading = true;
    }
    PropertiesComponent.prototype.ngOnInit = function () {
        this.getProperties();
    };
    PropertiesComponent.prototype.save = function () {
        var _this = this;
        this.loading = true;
        this.service.saveProperties(this.properties)
            .subscribe(function (data) { return _this.handleSave(); }, function (error) { return _this.handleError(error); });
    };
    PropertiesComponent.prototype.getProperties = function () {
        var _this = this;
        this.service.getProperties()
            .subscribe(function (data) { return _this.handleProperties(data); }, function (error) { return _this.loading = false; });
    };
    PropertiesComponent.prototype.handleSave = function () {
        this.notify.success('Successfully updated properties!');
        this.getProperties();
    };
    PropertiesComponent.prototype.handleProperties = function (data) {
        this.loading = false;
        this.propertyKeys = Object.keys(data);
        if (this.properties != null && this.propertyKeys.length > 0) {
            this.properties = data;
        }
    };
    PropertiesComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return PropertiesComponent;
}());
PropertiesComponent = __decorate([
    core_1.Component({
        selector: 'winery-properties',
        templateUrl: 'properties.component.html',
        styleUrls: [
            'properties.component.css'
        ],
        providers: [
            properties_service_1.PropertiesService
        ]
    }),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService, wineryNotification_service_1.WineryNotificationService])
], PropertiesComponent);
exports.PropertiesComponent = PropertiesComponent;
//# sourceMappingURL=properties.component.js.map