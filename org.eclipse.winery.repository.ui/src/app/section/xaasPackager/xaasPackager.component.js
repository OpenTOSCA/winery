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
var xaasPackagerService_1 = require("./xaasPackagerService");
var wineryNotification_service_1 = require("../../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var util_1 = require("util");
var XaasPackagerComponent = (function () {
    function XaasPackagerComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.isModalShown = false;
        this.isFormValid = false;
        this.selectedInfracstuctureNodeType = null;
    }
    XaasPackagerComponent.prototype.ngDoCheck = function () {
        if (!util_1.isNullOrUndefined(this.selectedNodeTypes) && (this.selectedNodeTypes.length !== 0) && !util_1.isNullOrUndefined(this.selectedArtifactType)) {
            this.isFormValid = true;
        }
        else {
            this.isFormValid = false;
        }
    };
    XaasPackagerComponent.prototype.onAddClick = function () {
        var _this = this;
        var formData = new FormData();
        if (!util_1.isNullOrUndefined(this.file)) {
            formData.append('file', this.file, this.file.name);
        }
        if (!util_1.isNull(this.selectedArtifactType)) {
            formData.append('artifactType', this.selectedArtifactType);
        }
        if (!util_1.isNullOrUndefined(this.selectedNodeTypes)) {
            for (var _i = 0, _a = this.selectedNodeTypes; _i < _a.length; _i++) {
                var nodetype = _a[_i];
                formData.append('nodeTypes', nodetype);
            }
        }
        if (!util_1.isNullOrUndefined(this.tagItems)) {
            for (var _b = 0, _c = this.tagItems; _b < _c.length; _b++) {
                var tag = _c[_b];
                formData.append('tags', tag);
            }
        }
        else {
            formData.append('tags', '');
        }
        if (!util_1.isNullOrUndefined(this.selectedInfracstuctureNodeType)) {
            formData.append('infrastructureNodeType', this.selectedInfracstuctureNodeType);
        }
        this.service.createTempalteFromArtifact(formData).subscribe(function (data) { return _this.notify.success('Service Template successfully created!'); }, function (error) { return _this.handleError(error); });
        this.resetArtifactCreationData();
        this.createFromArtifactModal.hide();
    };
    XaasPackagerComponent.prototype.onCreateFromArtifact = function () {
        var _this = this;
        this.service.getNodetypes().subscribe(function (data) { return _this.nodeTypes = data.map(function (obj) {
            if (!util_1.isNullOrUndefined(obj.qName)) {
                return obj.qName;
            }
        }); }, function (error) { return _this.handleError(error); });
        this.service.getArtifactTpesAndInfrastructureNodetypes().subscribe(function (data) { return _this.handleArtifactTypeAndInfrastructureNodetypesData(data); }, function (error) { return _this.handleError(error); });
        this.isModalShown = true;
    };
    XaasPackagerComponent.prototype.refreshValue = function (value) {
        this.value = value;
        this.selectedNodeTypes = this.itemsToStringArray(value);
    };
    XaasPackagerComponent.prototype.refreshSelectedArtifactType = function (value) {
        this.selectedArtifactType = value.text;
    };
    XaasPackagerComponent.prototype.refreshSelectedInfrastructureNodeType = function (value) {
        this.selectedInfracstuctureNodeType = value.text;
    };
    XaasPackagerComponent.prototype.itemsToString = function (value) {
        if (value === void 0) { value = []; }
        return value
            .map(function (item) {
            return item.text;
        }).join(',');
    };
    XaasPackagerComponent.prototype.itemsToStringArray = function (value) {
        if (value === void 0) { value = []; }
        return value.map(function (item) {
            return item.text;
        });
    };
    XaasPackagerComponent.prototype.fileChange = function (event) {
        var fileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
    };
    XaasPackagerComponent.prototype.onHidden = function () {
        this.isModalShown = false;
    };
    XaasPackagerComponent.prototype.hideCreateFromArtifactModal = function () {
        this.resetArtifactCreationData();
        this.createFromArtifactModal.hide();
    };
    XaasPackagerComponent.prototype.resetArtifactCreationData = function () {
        this.selectedInfracstuctureNodeType = null;
        this.selectedArtifactType = null;
        this.selectedNodeTypes = [];
        this.tagItems = [];
        this.value = [];
        this.file = null;
    };
    XaasPackagerComponent.prototype.handleArtifactTypeAndInfrastructureNodetypesData = function (data) {
        this.artifactTypes = data.artifactTypes;
        this.infrastructureNodetypes = data.infrastructureNodeTypes;
    };
    XaasPackagerComponent.prototype.handleError = function (error) {
        this.notify.error(error);
    };
    return XaasPackagerComponent;
}());
__decorate([
    core_1.ViewChild('createFromArtifactModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], XaasPackagerComponent.prototype, "createFromArtifactModal", void 0);
XaasPackagerComponent = __decorate([
    core_1.Component({
        selector: 'winery-xaas-packager',
        templateUrl: 'xaasPackager.component.html',
        styleUrls: [
            'xaasPackager.component.css'
        ],
        providers: [
            xaasPackagerService_1.PackagerService
        ]
    }),
    __metadata("design:paramtypes", [xaasPackagerService_1.PackagerService,
        wineryNotification_service_1.WineryNotificationService])
], XaasPackagerComponent);
exports.XaasPackagerComponent = XaasPackagerComponent;
var NodeTypeData = (function () {
    function NodeTypeData() {
    }
    return NodeTypeData;
}());
exports.NodeTypeData = NodeTypeData;
//# sourceMappingURL=xaasPackager.component.js.map