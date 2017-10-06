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
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
var core_1 = require("@angular/core");
var listDefinedTypesAndElements_service_1 = require("./listDefinedTypesAndElements.service");
var wineryNotification_service_1 = require("../../wineryNotificationModule/wineryNotification.service");
var router_1 = require("@angular/router");
var ListDefinedTypesAndElementsComponent = (function () {
    function ListDefinedTypesAndElementsComponent(service, notify, router) {
        this.service = service;
        this.notify = notify;
        this.router = router;
        this.loading = true;
        this.columns = [
            { title: 'Local Names', name: 'key' }
        ];
    }
    ListDefinedTypesAndElementsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getDeclarations()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
        var splitUrl = this.router.url.split('/');
        if (splitUrl[splitUrl.length - 1].includes('types')) {
            this.elementOrType = 'Defined Types';
        }
        else {
            this.elementOrType = 'Declared Elements';
        }
    };
    ListDefinedTypesAndElementsComponent.prototype.handleData = function (data) {
        this.loading = false;
        this.elements = data.map(function (value) {
            return new SingleColumn(value);
        });
        if (this.elements.length === 0) {
            this.title = 'No ' + this.elementOrType + ' available!';
        }
        else {
            this.title = this.elementOrType;
        }
    };
    ListDefinedTypesAndElementsComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error.toString());
    };
    return ListDefinedTypesAndElementsComponent;
}());
ListDefinedTypesAndElementsComponent = __decorate([
    core_1.Component({
        templateUrl: 'listDefinedTypesAndElements.component.html',
        providers: [
            listDefinedTypesAndElements_service_1.ListDefinedTypesAndElementsService
        ]
    }),
    __metadata("design:paramtypes", [listDefinedTypesAndElements_service_1.ListDefinedTypesAndElementsService, wineryNotification_service_1.WineryNotificationService,
        router_1.Router])
], ListDefinedTypesAndElementsComponent);
exports.ListDefinedTypesAndElementsComponent = ListDefinedTypesAndElementsComponent;
var SingleColumn = (function () {
    function SingleColumn(key) {
        this.key = key;
    }
    return SingleColumn;
}());
//# sourceMappingURL=listDefinedTypesAndElements.component.js.map