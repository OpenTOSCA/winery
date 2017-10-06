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
 *     Tino Stadelmaier, Philipp Meyer - initial API and implementation
 *     Lukas Harzenetter - HTTP message in notification
 */
var core_1 = require("@angular/core");
var editXML_service_1 = require("./editXML.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var wineryEditor_component_1 = require("../../../wineryEditorModule/wineryEditor.component");
var EditXMLComponent = (function () {
    function EditXMLComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.getXmlData = true;
        this.hideSaveButton = false;
        this.loading = true;
        this.id = 'XML';
        this.dataEditorLang = 'application/xml';
        // Set height to 500 px
        this.height = 500;
    }
    EditXMLComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.getXmlData) {
            this.service.getXmlData()
                .subscribe(function (data) { return _this.handleXmlData(data); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.loading = false;
        }
    };
    EditXMLComponent.prototype.saveXmlData = function () {
        var _this = this;
        this.service.saveXmlData(this.editor.getData())
            .subscribe(function (data) { return _this.handlePutResponse(data); }, function (error) { return _this.handleError(error.text()); });
        this.loading = true;
    };
    EditXMLComponent.prototype.getEditorContent = function () {
        return this.editor.getData();
    };
    EditXMLComponent.prototype.setEditorContent = function (xml) {
        this.xmlData = xml;
        this.editor.setData(this.xmlData);
    };
    EditXMLComponent.prototype.handleXmlData = function (xml) {
        this.loading = false;
        this.xmlData = xml;
    };
    EditXMLComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    EditXMLComponent.prototype.handlePutResponse = function (response) {
        this.loading = false;
        this.notify.success('Successfully saved data!');
        if (response.text()) {
            this.notify.warning(response.text());
        }
    };
    return EditXMLComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], EditXMLComponent.prototype, "getXmlData", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], EditXMLComponent.prototype, "hideSaveButton", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], EditXMLComponent.prototype, "xmlData", void 0);
__decorate([
    core_1.ViewChild('editor'),
    __metadata("design:type", wineryEditor_component_1.WineryEditorComponent)
], EditXMLComponent.prototype, "editor", void 0);
EditXMLComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-edit-xml',
        templateUrl: 'editXML.component.html',
        providers: [editXML_service_1.EditXMLService]
    }),
    __metadata("design:paramtypes", [editXML_service_1.EditXMLService,
        wineryNotification_service_1.WineryNotificationService])
], EditXMLComponent);
exports.EditXMLComponent = EditXMLComponent;
//# sourceMappingURL=editXML.component.js.map