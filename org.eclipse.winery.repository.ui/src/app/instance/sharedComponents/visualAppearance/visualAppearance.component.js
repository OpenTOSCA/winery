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
 *     Lukas Balzer - initial API and implementation
 */
var core_1 = require("@angular/core");
var visualAppearance_service_1 = require("./visualAppearance.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var util_1 = require("util");
var relationshipTypesVisualsApiData_1 = require("./relationshipTypesVisualsApiData");
var nodeTypesVisualsApiData_1 = require("./nodeTypesVisualsApiData");
var VisualAppearanceComponent = (function () {
    function VisualAppearanceComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.isNodeType = true;
    }
    VisualAppearanceComponent.prototype.ngOnInit = function () {
        this.loading = true;
        this.img16Path = this.service.getImg16x16Path();
        this.img50Path = this.service.getImg50x50Path();
        if (this.service.path.includes('relationshiptypes')) {
            this.isNodeType = false;
        }
        if (this.isNodeType) {
            this.getNodeTypeData();
        }
        else {
            this.getRelationshipData();
        }
    };
    /**
     * @param type the part of the arrow that should be changed<p>
     *             should be one of
     *             <ul>
     *                 <li>dash
     *                 <li>sourceArrowHead
     *                 <li>targetArrowHead
     *             </ul>
     * @param style the style of the line which should be one of the styles accepted by jsPlumb:<p>
     *              <b>for source-/targetArrowHead</b>
     *              <ul>
     *                  <li>none
     *                  <li>PlainArrow
     *                  <li>Diamond
     *              </ul><b>for dash</b>
     *              <ul>
     *                  <li>plain
     *                  <li>dotted
     *                  <li>dotted2
     *              </ul>
     */
    VisualAppearanceComponent.prototype.selectArrowItem = function (type, style) {
        var hasType = !util_1.isNullOrUndefined(type);
        var hasStyle = !util_1.isNullOrUndefined(style);
        var dashSelected = false;
        var sourcearrowheadSelected = false;
        var targetarrowheadSelected = false;
        if (hasType && type === 'dash') {
            this.relationshipData.dash = hasStyle ? style : this.relationshipData.dash;
            dashSelected = !this.relationshipData.boolData.dashSelected;
        }
        else if (hasType && type === 'sourceArrowHead') {
            this.relationshipData.sourceArrowHead = hasStyle ? style : this.relationshipData.sourceArrowHead;
            sourcearrowheadSelected = !this.relationshipData.boolData.sourceArrowHeadSelected;
        }
        else if (hasType && type === 'targetArrowHead') {
            this.relationshipData.targetArrowHead = hasStyle ? style : this.relationshipData.targetArrowHead;
            targetarrowheadSelected = !this.relationshipData.boolData.targetArrowHeadSelected;
        }
        this.relationshipData.boolData.dashSelected = dashSelected;
        this.relationshipData.boolData.sourceArrowHeadSelected = sourcearrowheadSelected;
        this.relationshipData.boolData.targetArrowHeadSelected = targetarrowheadSelected;
    };
    VisualAppearanceComponent.prototype.saveToServer = function () {
        var _this = this;
        if (this.isNodeType) {
            this.service.saveVisuals(new nodeTypesVisualsApiData_1.NodeTypesVisualsApiData(this.nodeTypeData)).subscribe(function (data) { return _this.handleResponse(data); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.service.saveVisuals(new relationshipTypesVisualsApiData_1.RelationshipTypesVisualsApiData(this.relationshipData, false)).subscribe(function (data) { return _this.handleResponse(data); }, function (error) { return _this.handleError(error); });
        }
    };
    VisualAppearanceComponent.prototype.getRelationshipData = function () {
        var _this = this;
        this.service.getData().subscribe(function (data) { return _this.handleRelationshipData(data); }, function (error) { return _this.handleError(error); });
    };
    VisualAppearanceComponent.prototype.getNodeTypeData = function () {
        var _this = this;
        this.service.getData().subscribe(function (data) { return _this.handleColorData(data); }, function (error) { return _this.handleError(error); });
    };
    VisualAppearanceComponent.prototype.handleColorData = function (data) {
        this.nodeTypeData = new nodeTypesVisualsApiData_1.NodeTypesVisualsApiData(data);
        this.loading = false;
    };
    VisualAppearanceComponent.prototype.handleRelationshipData = function (data) {
        this.relationshipData = new relationshipTypesVisualsApiData_1.RelationshipTypesVisualsApiData(data, true);
        this.loading = false;
    };
    VisualAppearanceComponent.prototype.onUploadSuccess = function () {
        this.loading = true;
        if (this.isNodeType) {
            this.getNodeTypeData();
        }
        else {
            this.getRelationshipData();
        }
    };
    Object.defineProperty(VisualAppearanceComponent.prototype, "colorLocal", {
        get: function () {
            return this.relationshipData.color;
        },
        set: function (color) {
            this.relationshipData.color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisualAppearanceComponent.prototype, "borderColorLocal", {
        get: function () {
            return this.nodeTypeData.color;
        },
        set: function (color) {
            this.nodeTypeData.color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisualAppearanceComponent.prototype, "hoverColorLocal", {
        get: function () {
            return this.relationshipData.hoverColor;
        },
        set: function (color) {
            this.relationshipData.hoverColor = color;
        },
        enumerable: true,
        configurable: true
    });
    VisualAppearanceComponent.prototype.handleResponse = function (response) {
        this.loading = false;
        this.notify.success('Successfully saved visual data!');
    };
    VisualAppearanceComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    return VisualAppearanceComponent;
}());
VisualAppearanceComponent = __decorate([
    core_1.Component({
        templateUrl: 'visualAppearance.component.html',
        styleUrls: [
            'visualAppearance.component.css'
        ],
        providers: [visualAppearance_service_1.VisualAppearanceService]
    }),
    __metadata("design:paramtypes", [visualAppearance_service_1.VisualAppearanceService,
        wineryNotification_service_1.WineryNotificationService])
], VisualAppearanceComponent);
exports.VisualAppearanceComponent = VisualAppearanceComponent;
//# sourceMappingURL=visualAppearance.component.js.map