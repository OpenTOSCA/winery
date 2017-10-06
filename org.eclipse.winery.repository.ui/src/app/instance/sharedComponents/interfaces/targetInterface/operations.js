"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var TargetInterfaceOperation = (function () {
    function TargetInterfaceOperation() {
        this.interfaceName = '';
        this.operationName = '';
    }
    return TargetInterfaceOperation;
}());
exports.TargetInterfaceOperation = TargetInterfaceOperation;
var NodeOperation = (function (_super) {
    __extends(NodeOperation, _super);
    function NodeOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodeRef = '';
        return _this;
    }
    return NodeOperation;
}(TargetInterfaceOperation));
exports.NodeOperation = NodeOperation;
var RelationshipOperation = (function (_super) {
    __extends(RelationshipOperation, _super);
    function RelationshipOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.relationshipRef = '';
        return _this;
    }
    return RelationshipOperation;
}(TargetInterfaceOperation));
exports.RelationshipOperation = RelationshipOperation;
var PlanOperation = (function () {
    function PlanOperation() {
        this.planRef = '';
    }
    return PlanOperation;
}());
exports.PlanOperation = PlanOperation;
//# sourceMappingURL=operations.js.map