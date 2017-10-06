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
var interfacesApiData_1 = require("../../sharedComponents/interfaces/interfacesApiData");
var PlanModelReverence = (function () {
    function PlanModelReverence() {
        this.reference = '';
    }
    return PlanModelReverence;
}());
exports.PlanModelReverence = PlanModelReverence;
var PlansApiData = (function (_super) {
    __extends(PlansApiData, _super);
    function PlansApiData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.precondition = null;
        _this.planModel = null;
        _this.planModelReference = new PlanModelReverence();
        _this.id = '';
        _this.planType = '';
        _this.planLanguage = '';
        return _this;
    }
    return PlansApiData;
}(interfacesApiData_1.InterfaceOperationApiData));
exports.PlansApiData = PlansApiData;
//# sourceMappingURL=plansApiData.js.map