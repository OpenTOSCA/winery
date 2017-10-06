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
var router_1 = require("@angular/router");
var instance_service_1 = require("./instance.service");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var configuration_1 = require("../configuration");
var removeWhiteSpaces_pipe_1 = require("../wineryPipes/removeWhiteSpaces.pipe");
var existService_1 = require("../wineryUtils/existService");
var util_1 = require("util");
var enums_1 = require("../wineryInterfaces/enums");
var toscaComponent_1 = require("../wineryInterfaces/toscaComponent");
var utils_1 = require("../wineryUtils/utils");
var InstanceComponent = (function () {
    function InstanceComponent(route, router, service, notify, existService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.service = service;
        this.notify = notify;
        this.existService = existService;
        this.routeSub = this.route
            .data
            .subscribe(function (data) {
            _this.toscaComponent = data['resolveData'] ? data['resolveData'] : new toscaComponent_1.ToscaComponent(enums_1.ToscaTypes.Admin, '', '');
            _this.service.setSharedData(_this.toscaComponent);
            if (!util_1.isNullOrUndefined(_this.toscaComponent) && _this.toscaComponent.toscaType !== enums_1.ToscaTypes.Imports) {
                if (_this.toscaComponent.toscaType === enums_1.ToscaTypes.NodeType) {
                    var img_1 = configuration_1.backendBaseURL + _this.service.path + '/visualappearance/50x50';
                    _this.existService.check(img_1)
                        .subscribe(function () { return _this.imageUrl = img_1; }, function () { return _this.imageUrl = null; });
                }
                _this.service.getComponentData()
                    .subscribe(function (compData) { return _this.handleComponentData(compData); });
            }
            _this.availableTabs = _this.service.getSubMenuByResource();
        }, function (error) { return _this.handleError(error); });
    }
    InstanceComponent.prototype.deleteComponent = function () {
        var _this = this;
        this.service.deleteComponent().subscribe(function (data) { return _this.handleDelete(); }, function (error) { return _this.handleError(error); });
    };
    InstanceComponent.prototype.handleComponentData = function (data) {
        this.typeUrl = utils_1.Utils.getTypeOfTemplateOrImplementation(this.toscaComponent.toscaType);
        if (!util_1.isNullOrUndefined(this.typeUrl)) {
            this.typeUrl = '/' + this.typeUrl;
            var tempOrImpl = data.serviceTemplateOrNodeTypeOrNodeTypeImplementation[0];
            var qName = void 0;
            if (!util_1.isNullOrUndefined(tempOrImpl.type)) {
                qName = tempOrImpl.type.slice(1).split('}');
                this.typeOf = 'Type: ';
            }
            else if (!util_1.isNullOrUndefined(tempOrImpl.nodeType)) {
                qName = tempOrImpl.nodeType.slice(1).split('}');
                this.typeOf = 'Implementation for ';
            }
            else if (!util_1.isNullOrUndefined(tempOrImpl.relationshipType)) {
                qName = tempOrImpl.relationshipType.slice(1).split('}');
                this.typeOf = 'Implementation for ';
            }
            if (qName.length === 2) {
                this.typeUrl += '/' + encodeURIComponent(qName[0]) + '/' + qName[1];
                this.typeId = qName[1];
            }
            else {
                this.typeUrl = null;
            }
        }
    };
    InstanceComponent.prototype.handleDelete = function () {
        this.notify.success('Successfully deleted ' + this.toscaComponent.localName);
        this.router.navigate(['/' + this.toscaComponent.toscaType]);
    };
    InstanceComponent.prototype.handleError = function (error) {
        this.notify.error(error.toString(), 'Error');
    };
    InstanceComponent.prototype.ngOnDestroy = function () {
        this.routeSub.unsubscribe();
    };
    return InstanceComponent;
}());
InstanceComponent = __decorate([
    core_1.Component({
        templateUrl: 'instance.component.html',
        providers: [
            instance_service_1.InstanceService,
            removeWhiteSpaces_pipe_1.RemoveWhiteSpacesPipe,
        ]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        instance_service_1.InstanceService,
        wineryNotification_service_1.WineryNotificationService, existService_1.ExistService])
], InstanceComponent);
exports.InstanceComponent = InstanceComponent;
//# sourceMappingURL=instance.component.js.map