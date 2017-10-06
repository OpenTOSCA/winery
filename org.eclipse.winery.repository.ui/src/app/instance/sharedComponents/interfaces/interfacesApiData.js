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
 *     Niko Stadelmaier - initial API and implementation
 */
var parameters_1 = require("../../../wineryInterfaces/parameters");
var wineryComponent_1 = require("../../../wineryInterfaces/wineryComponent");
var InterfacesApiData = (function () {
    function InterfacesApiData(name) {
        if (name === void 0) { name = ''; }
        this.operation = [];
        this.name = name;
    }
    return InterfacesApiData;
}());
exports.InterfacesApiData = InterfacesApiData;
var InterfaceOperationApiData = (function (_super) {
    __extends(InterfaceOperationApiData, _super);
    function InterfaceOperationApiData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputParameters = new parameters_1.InputParameters();
        _this.outputParameters = new parameters_1.OutputParameters();
        return _this;
    }
    return InterfaceOperationApiData;
}(wineryComponent_1.WineryComponent));
exports.InterfaceOperationApiData = InterfaceOperationApiData;
//# sourceMappingURL=interfacesApiData.js.map