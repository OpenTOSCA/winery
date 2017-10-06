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
var interfacesApiData_1 = require("../interfacesApiData");
var operations_1 = require("./operations");
var instance_service_1 = require("../../../instance.service");
var util_1 = require("util");
var wineryComponent_1 = require("../../../../wineryInterfaces/wineryComponent");
var interfaces_service_1 = require("../interfaces.service");
var wineryNotification_service_1 = require("../../../../wineryNotificationModule/wineryNotification.service");
var plans_service_1 = require("../../../serviceTemplates/plans/plans.service");
/**
 * Component for setting Boundary Definitions Interfaces. Is used in {@link InterfacesComponent}.
 * It can be used by passing in a <code>operation</code> of type {@link InterfaceOperationApiData}.
 */
var WineryTargetInterfaceComponent = (function () {
    function WineryTargetInterfaceComponent(sharedData, interfacesService, plansService, notify) {
        this.sharedData = sharedData;
        this.interfacesService = interfacesService;
        this.plansService = plansService;
        this.notify = notify;
        this.loading = false;
    }
    WineryTargetInterfaceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.plansService.getPlansData(this.sharedData.path + '/plans/')
            .subscribe(function (data) { return _this.handlePlansData(data); });
    };
    WineryTargetInterfaceComponent.prototype.ngOnChanges = function (changes) {
        if (!util_1.isNullOrUndefined(this.operation)) {
            if (!util_1.isNullOrUndefined(this.operation.relationshipOperation)) {
                this.onRelationshipSelected();
            }
            else if (!util_1.isNullOrUndefined(this.operation.plan)) {
                this.onPlanSelected();
            }
            else {
                this.onNodeSelected();
            }
        }
    };
    WineryTargetInterfaceComponent.prototype.onNodeSelected = function () {
        var _this = this;
        this.referenceData = util_1.isNullOrUndefined(this.sharedData.topologyTemplate.nodeTemplates) ? null
            : this.sharedData.topologyTemplate.nodeTemplates;
        if (util_1.isNullOrUndefined(this.operation.nodeOperation)) {
            this.operation.nodeOperation = new operations_1.NodeOperation();
            this.activeReference = util_1.isNullOrUndefined(this.referenceData) ? null : this.referenceData[0];
            if (!util_1.isNullOrUndefined(this.activeReference)) {
                this.operation.nodeOperation.nodeRef = this.activeReference.id;
            }
        }
        else if (!util_1.isNullOrUndefined(this.referenceData)) {
            this.activeReference = this.referenceData.find(function (element) {
                return element.id === _this.operation.nodeOperation.nodeRef;
            });
        }
        this.operation.relationshipOperation = null;
        this.operation.plan = null;
        this.currentSelected = CurrentSelectedEnum.nodeTemplate;
        this.getInterfaces();
    };
    WineryTargetInterfaceComponent.prototype.onRelationshipSelected = function () {
        var _this = this;
        this.referenceData = util_1.isNullOrUndefined(this.sharedData.topologyTemplate.relationshipTemplates) ? null
            : this.sharedData.topologyTemplate.relationshipTemplates;
        if (util_1.isNullOrUndefined(this.operation.relationshipOperation)) {
            this.operation.relationshipOperation = new operations_1.RelationshipOperation();
            this.activeReference = util_1.isNullOrUndefined(this.referenceData) ? null : this.referenceData[0];
            if (!util_1.isNullOrUndefined(this.activeReference)) {
                this.operation.relationshipOperation.relationshipRef = this.activeReference.id;
            }
        }
        else if (!util_1.isNullOrUndefined(this.referenceData)) {
            this.activeReference = this.referenceData.find(function (element) {
                return element.id === _this.operation.relationshipOperation.relationshipRef;
            });
        }
        this.operation.nodeOperation = null;
        this.operation.plan = null;
        this.currentSelected = CurrentSelectedEnum.relationshipTemplate;
        this.getInterfaces();
    };
    WineryTargetInterfaceComponent.prototype.onPlanSelected = function () {
        var _this = this;
        this.referenceData = util_1.isNullOrUndefined(this.plans) ? null : this.plans;
        this.activeReference = util_1.isNullOrUndefined(this.plans) ? null : this.plans[0];
        if (util_1.isNullOrUndefined(this.operation.plan)) {
            this.operation.plan = new operations_1.PlanOperation();
            this.operation.plan.planRef = this.activeReference.id;
        }
        else if (!util_1.isNullOrUndefined(this.referenceData)) {
            this.activeReference = this.referenceData.find(function (element) {
                return element.id === _this.operation.plan.planRef;
            });
        }
        this.operation.nodeOperation = null;
        this.operation.relationshipOperation = null;
        this.currentSelected = CurrentSelectedEnum.plan;
    };
    WineryTargetInterfaceComponent.prototype.onReferenceSelected = function (event) {
        this.activeReference = this.referenceData.find(function (element) {
            return element.id === event.id;
        });
        if (this.currentSelected === CurrentSelectedEnum.nodeTemplate) {
            this.operation.nodeOperation.nodeRef = this.activeReference.id;
            this.operation.nodeOperation.interfaceName = null;
            this.operation.nodeOperation.operationName = null;
        }
        else if (this.currentSelected === CurrentSelectedEnum.relationshipTemplate) {
            this.operation.relationshipOperation.relationshipRef = this.activeReference.id;
            this.operation.relationshipOperation.operationName = null;
            this.operation.relationshipOperation.interfaceName = null;
        }
        else {
            this.operation.plan.planRef = this.activeReference.id;
        }
        this.getInterfaces();
    };
    WineryTargetInterfaceComponent.prototype.onInterfaceSelected = function (event) {
        this.activeInterface = this.interfaces.find(function (element) {
            return element.name === event.id;
        });
        this.activeOperation = this.activeInterface.operation[0];
        this.setInterfaceAndOperation();
    };
    WineryTargetInterfaceComponent.prototype.onOperationSelected = function (event) {
        this.activeOperation = this.activeInterface.operation.find(function (element) {
            return element.name === event.id;
        });
        this.setInterfaceAndOperation();
    };
    WineryTargetInterfaceComponent.prototype.getInterfaces = function () {
        var _this = this;
        this.loading = true;
        this.interfaces = null;
        this.activeInterface = null;
        this.activeOperation = null;
        var relationshipInterfaces = false;
        if (this.currentSelected === CurrentSelectedEnum.nodeTemplate) {
            this.activeReference = this.sharedData.topologyTemplate.nodeTemplates.find(function (element, id, context) {
                return element.id === _this.operation.nodeOperation.nodeRef;
            });
            if (util_1.isNullOrUndefined(this.activeReference)) {
                this.activeReference = this.sharedData.topologyTemplate.nodeTemplates[0];
            }
        }
        else if (this.currentSelected === CurrentSelectedEnum.relationshipTemplate) {
            relationshipInterfaces = true;
            this.activeReference = this.sharedData.topologyTemplate.relationshipTemplates.find(function (element, id, context) {
                return element.id === _this.operation.relationshipOperation.relationshipRef;
            });
            if (util_1.isNullOrUndefined(this.activeReference)) {
                this.activeReference = this.sharedData.topologyTemplate.relationshipTemplates[0];
            }
        }
        if (!util_1.isNullOrUndefined(this.activeReference)) {
            var qName = this.activeReference.type.slice(1).split('}');
            var url = '/' + this.currentSelected + '/' + encodeURIComponent(encodeURIComponent(qName[0])) + '/' + qName[1];
            this.interfacesService.getInterfaces(url, relationshipInterfaces)
                .subscribe(function (data) { return _this.handleInterfaceData(data); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.loading = false;
        }
    };
    WineryTargetInterfaceComponent.prototype.setInterfaceAndOperation = function () {
        if (!util_1.isNullOrUndefined(this.activeInterface)) {
            switch (this.currentSelected) {
                case CurrentSelectedEnum.nodeTemplate:
                    this.operation.nodeOperation.interfaceName = this.activeInterface.name;
                    if (!util_1.isNullOrUndefined(this.activeOperation)) {
                        this.operation.nodeOperation.operationName = this.activeOperation.name;
                    }
                    break;
                case CurrentSelectedEnum.relationshipTemplate:
                    this.operation.relationshipOperation.interfaceName = this.activeInterface.name;
                    if (!util_1.isNullOrUndefined(this.activeOperation)) {
                        this.operation.relationshipOperation.operationName = this.activeOperation.name;
                    }
                    break;
            }
        }
    };
    WineryTargetInterfaceComponent.prototype.handleInterfaceData = function (data) {
        var _this = this;
        this.loading = false;
        this.interfaces = data;
        if (this.currentSelected === CurrentSelectedEnum.nodeTemplate) {
            var nodeInterface = this.interfaces.find(function (element, id, arr) {
                return element.name === _this.operation.nodeOperation.interfaceName;
            });
            this.activeInterface = nodeInterface ? nodeInterface : this.interfaces[0];
            if (!util_1.isNullOrUndefined(this.activeInterface)) {
                this.activeOperation = this.activeInterface.operation.find(function (element, id, arr) {
                    return element.name === _this.operation.nodeOperation.operationName;
                });
            }
        }
        else if (this.currentSelected === CurrentSelectedEnum.relationshipTemplate) {
            var relInterface = this.interfaces.find(function (element, id, arr) {
                return element.name === _this.operation.relationshipOperation.interfaceName;
            });
            this.activeInterface = relInterface ? relInterface : this.interfaces[0];
            if (!util_1.isNullOrUndefined(this.activeInterface)) {
                this.activeOperation = this.activeInterface.operation.find(function (element, id, arr) {
                    return element.name === _this.operation.relationshipOperation.operationName;
                });
            }
        }
        if (!util_1.isNullOrUndefined(this.activeInterface) && util_1.isNullOrUndefined(this.activeOperation)) {
            this.activeOperation = this.activeInterface.operation[0];
        }
        this.setInterfaceAndOperation();
    };
    WineryTargetInterfaceComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error);
    };
    WineryTargetInterfaceComponent.prototype.handlePlansData = function (data) {
        this.plans = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var plan = data_1[_i];
            var tmp = new wineryComponent_1.WineryTemplate();
            tmp.setValuesFromPlan(plan);
            this.plans.push(tmp);
        }
        if (this.currentSelected === CurrentSelectedEnum.plan) {
            this.onPlanSelected();
        }
    };
    return WineryTargetInterfaceComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", interfacesApiData_1.InterfaceOperationApiData)
], WineryTargetInterfaceComponent.prototype, "operation", void 0);
WineryTargetInterfaceComponent = __decorate([
    core_1.Component({
        selector: 'winery-service-templates-target-interface',
        templateUrl: 'wineryTargetInterface.component.html',
        providers: [
            plans_service_1.PlansService
        ]
    }),
    __metadata("design:paramtypes", [instance_service_1.InstanceService,
        interfaces_service_1.InterfacesService,
        plans_service_1.PlansService,
        wineryNotification_service_1.WineryNotificationService])
], WineryTargetInterfaceComponent);
exports.WineryTargetInterfaceComponent = WineryTargetInterfaceComponent;
var CurrentSelectedEnum;
(function (CurrentSelectedEnum) {
    CurrentSelectedEnum[CurrentSelectedEnum["nodeTemplate"] = 'nodetypes'] = "nodeTemplate";
    CurrentSelectedEnum[CurrentSelectedEnum["relationshipTemplate"] = 'relationshiptypes'] = "relationshipTemplate";
    CurrentSelectedEnum[CurrentSelectedEnum["plan"] = 'plan'] = "plan";
})(CurrentSelectedEnum || (CurrentSelectedEnum = {}));
//# sourceMappingURL=wineryTargetInterface.component.js.map