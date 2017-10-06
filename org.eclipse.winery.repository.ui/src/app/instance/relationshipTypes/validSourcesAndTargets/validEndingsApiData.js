"use strict";
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
var selectData_1 = require("../../../wineryInterfaces/selectData");
var ValidEndingsData = (function () {
    function ValidEndingsData() {
        this.validSource = new ValidEndingsApiDataSet();
        this.validTarget = new ValidEndingsApiDataSet();
    }
    return ValidEndingsData;
}());
exports.ValidEndingsData = ValidEndingsData;
var ValidEndingsApiDataSet = (function () {
    function ValidEndingsApiDataSet() {
        this.validEndingsSelectionType = ValidEndingsSelectionEnum.EVERYTHING;
        this.validDataSet = new selectData_1.SelectData();
    }
    return ValidEndingsApiDataSet;
}());
exports.ValidEndingsApiDataSet = ValidEndingsApiDataSet;
var ValidEndingsSelectionEnum;
(function (ValidEndingsSelectionEnum) {
    ValidEndingsSelectionEnum[ValidEndingsSelectionEnum["EVERYTHING"] = 'EVERYTHING'] = "EVERYTHING";
    ValidEndingsSelectionEnum[ValidEndingsSelectionEnum["NODETYPE"] = 'NODETYPE'] = "NODETYPE";
    ValidEndingsSelectionEnum[ValidEndingsSelectionEnum["REQTYPE"] = 'REQUIREMENTTYPE'] = "REQTYPE";
    ValidEndingsSelectionEnum[ValidEndingsSelectionEnum["CAPTYPE"] = 'CAPABILITYTYPE'] = "CAPTYPE";
})(ValidEndingsSelectionEnum = exports.ValidEndingsSelectionEnum || (exports.ValidEndingsSelectionEnum = {}));
//# sourceMappingURL=validEndingsApiData.js.map