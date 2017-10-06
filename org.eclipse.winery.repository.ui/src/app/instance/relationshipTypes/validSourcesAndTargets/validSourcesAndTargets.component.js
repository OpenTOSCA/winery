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
 *     Nicole Keppler - initial API and implementation
 */
var core_1 = require("@angular/core");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var validSourcesAndTargets_service_1 = require("./validSourcesAndTargets.service");
var validEndingsApiData_1 = require("./validEndingsApiData");
var util_1 = require("util");
var ValidSourcesAndTargetsComponent = (function () {
    function ValidSourcesAndTargetsComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        // loading
        this.loading = true;
        this.loadingSrc = true;
        this.loadingTrg = true;
        // for radio button management
        this.selectedEnum = validEndingsApiData_1.ValidEndingsSelectionEnum;
        // ValidEndings Data and SelectData
        this.validEndingsData = new validEndingsApiData_1.ValidEndingsData();
        this.selectSources = null;
        this.selectTargets = null;
    }
    ValidSourcesAndTargetsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.service.getValidEndingsData()
            .subscribe(function (data) { return _this.handleValidEndingsData(data); }, function (error) { return _this.handleError(error); });
    };
    ValidSourcesAndTargetsComponent.prototype.handleValidEndingsData = function (validEndingsData) {
        this.loading = false;
        this.validEndingsData = validEndingsData;
        if (util_1.isNullOrUndefined(this.validEndingsData.validSource)) {
            this.validEndingsData.validSource = new validEndingsApiData_1.ValidEndingsApiDataSet();
        }
        else {
            // convert validEndingsSelectionType to angular specific enum
            switch (this.validEndingsData.validSource.validEndingsSelectionType) {
                case this.selectedEnum.NODETYPE:
                    this.loadingSrc = true;
                    this.getSelectionData('/nodetypes?grouped=angularSelect', 'source');
                    break;
                case this.selectedEnum.REQTYPE:
                    this.loadingSrc = true;
                    this.getSelectionData('/requirementtypes?grouped=angularSelect', 'source');
                    break;
            }
        }
        if (util_1.isNullOrUndefined(this.validEndingsData.validTarget)) {
            this.validEndingsData.validTarget = new validEndingsApiData_1.ValidEndingsApiDataSet();
        }
        else {
            // convert validEndingsSelectionType to angular specific enum
            switch (this.validEndingsData.validTarget.validEndingsSelectionType) {
                case this.selectedEnum.NODETYPE:
                    this.loadingTrg = true;
                    this.getSelectionData('/nodetypes?grouped=angularSelect', 'target');
                    break;
                case this.selectedEnum.CAPTYPE:
                    this.loadingTrg = true;
                    this.getSelectionData('/capabilitytypes?grouped=angularSelect', 'target');
                    break;
            }
        }
    };
    ValidSourcesAndTargetsComponent.prototype.onSelectedTrgValueChanged = function (event) {
        this.validEndingsData.validTarget.validDataSet = { id: event.id, text: event.text };
    };
    ValidSourcesAndTargetsComponent.prototype.onSelectedSrcValueChanged = function (event) {
        this.validEndingsData.validSource.validDataSet = { id: event.id, text: event.text };
    };
    ValidSourcesAndTargetsComponent.prototype.onValidSourceSelected = function (event) {
        switch (event) {
            case validEndingsApiData_1.ValidEndingsSelectionEnum.NODETYPE:
                this.validEndingsData.validSource.validEndingsSelectionType = this.selectedEnum.NODETYPE;
                this.getSelectionData('/nodetypes?grouped=angularSelect', 'source');
                break;
            case validEndingsApiData_1.ValidEndingsSelectionEnum.REQTYPE:
                this.validEndingsData.validSource.validEndingsSelectionType = this.selectedEnum.REQTYPE;
                break;
            default:
                this.validEndingsData.validSource.validEndingsSelectionType = this.selectedEnum.EVERYTHING;
        }
    };
    ValidSourcesAndTargetsComponent.prototype.onValidTargetSelected = function (event) {
        switch (event) {
            case validEndingsApiData_1.ValidEndingsSelectionEnum.CAPTYPE:
                this.validEndingsData.validTarget.validEndingsSelectionType = this.selectedEnum.CAPTYPE;
                break;
            case validEndingsApiData_1.ValidEndingsSelectionEnum.NODETYPE:
                this.validEndingsData.validTarget.validEndingsSelectionType = this.selectedEnum.NODETYPE;
                this.getSelectionData('/nodetypes?grouped=angularSelect', 'target');
                break;
            default:
                this.validEndingsData.validTarget.validEndingsSelectionType = this.selectedEnum.EVERYTHING;
        }
    };
    ValidSourcesAndTargetsComponent.prototype.saveToServer = function () {
        var _this = this;
        this.loading = true;
        if (this.validEndingsData.validSource.validEndingsSelectionType === this.selectedEnum.EVERYTHING ||
            this.validEndingsData.validSource.validEndingsSelectionType === this.selectedEnum.REQTYPE) {
            this.validEndingsData.validSource = null;
        }
        if (this.validEndingsData.validTarget.validEndingsSelectionType === this.selectedEnum.EVERYTHING ||
            this.validEndingsData.validTarget.validEndingsSelectionType === this.selectedEnum.CAPTYPE) {
            this.validEndingsData.validTarget = null;
        }
        this.service.saveValidEndings(this.validEndingsData)
            .subscribe(function (data) { return _this.handleResponse(); }, function (error) { return _this.handleError(error); });
        if (this.validEndingsData.validTarget === null) {
            this.validEndingsData.validTarget = new validEndingsApiData_1.ValidEndingsApiDataSet();
        }
        if (this.validEndingsData.validSource === null) {
            this.validEndingsData.validSource = new validEndingsApiData_1.ValidEndingsApiDataSet();
        }
    };
    ValidSourcesAndTargetsComponent.prototype.getSelectionData = function (reqDataPath, type) {
        var _this = this;
        this.service.getSelectorData(reqDataPath)
            .subscribe(function (data) {
            if (type === 'source') {
                _this.selectSources = _this.handleTypes(data);
                _this.loadingSrc = false;
            }
            else if (type === 'target') {
                _this.selectTargets = _this.handleTypes(data);
                _this.loadingTrg = false;
            }
        }, function (error) { return _this.handleError(error); });
    };
    ValidSourcesAndTargetsComponent.prototype.handleTypes = function (types) {
        return types.length > 0 ? types : null;
    };
    ValidSourcesAndTargetsComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error, 'Error');
    };
    ValidSourcesAndTargetsComponent.prototype.handleResponse = function () {
        this.loading = false;
        this.notify.success('Successfully saved Valid Sources and Targets!');
    };
    return ValidSourcesAndTargetsComponent;
}());
ValidSourcesAndTargetsComponent = __decorate([
    core_1.Component({
        selector: 'winery-valid-endings',
        templateUrl: 'validSourcesAndTargets.component.html',
        providers: [validSourcesAndTargets_service_1.ValidService],
    }),
    __metadata("design:paramtypes", [validSourcesAndTargets_service_1.ValidService,
        wineryNotification_service_1.WineryNotificationService])
], ValidSourcesAndTargetsComponent);
exports.ValidSourcesAndTargetsComponent = ValidSourcesAndTargetsComponent;
//# sourceMappingURL=validSourcesAndTargets.component.js.map