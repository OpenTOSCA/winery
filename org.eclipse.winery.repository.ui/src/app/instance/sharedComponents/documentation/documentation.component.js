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
 *     Lukas Balzer, Nicole Keppler - initial API and implementation
 */
var core_1 = require("@angular/core");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var documentation_service_1 = require("./documentation.service");
var DocumentationComponent = (function () {
    function DocumentationComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.documentationData = 'default documentation value';
    }
    DocumentationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getDocumentationData()
            .subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    DocumentationComponent.prototype.saveToServer = function () {
        var _this = this;
        this.loading = true;
        this.service.saveDocumentationData(this.documentationData)
            .subscribe(function (data) { return _this.handleResponse(data); }, function (error) { return _this.handleError(error); });
    };
    DocumentationComponent.prototype.handleData = function (docu) {
        this.documentationData = docu;
        this.loading = false;
    };
    DocumentationComponent.prototype.handleResponse = function (response) {
        this.loading = false;
        this.notify.success('Successfully saved Documentation!');
    };
    DocumentationComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return DocumentationComponent;
}());
DocumentationComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-documentation',
        templateUrl: 'documentation.component.html',
        providers: [documentation_service_1.DocumentationService],
        styleUrls: [
            'documentation.component.css'
        ]
    }),
    __metadata("design:paramtypes", [documentation_service_1.DocumentationService, wineryNotification_service_1.WineryNotificationService])
], DocumentationComponent);
exports.DocumentationComponent = DocumentationComponent;
//# sourceMappingURL=documentation.component.js.map