/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var APL2 = require("./licenses/Apache-2.0");
var GPL3 = require("./licenses/GPL-3.0");
var MIT = require("./licenses/MIT");
var BSD2 = require("./licenses/BSD-2-Clause");
var BSD3 = require("./licenses/BSD-3-Clause");
var EPL1 = require("./licenses/EPL-1.0");
var EPL2 = require("./licenses/EPL-1.0");
var AGPL3 = require("./licenses/AGPL-3.0");
var GPL2 = require("./licenses/GPL-2.0");
var LGPL2_1 = require("./licenses/LGPL-2.1");
var LGPL3 = require("./licenses/LGPL-3.0");
var MPL2 = require("./licenses/MPL-2.0");
var Unlicense = require("./licenses/Unlicense");
var LicenseEnum;
(function (LicenseEnum) {
    LicenseEnum[LicenseEnum["None"] = 'None'] = "None";
    LicenseEnum[LicenseEnum["APL20"] = 'Apache License 2.0'] = "APL20";
    LicenseEnum[LicenseEnum["GPL30"] = 'GNU General Public License v3.0'] = "GPL30";
    LicenseEnum[LicenseEnum["MIT"] = 'MIT License'] = "MIT";
    LicenseEnum[LicenseEnum["BSD2Clause"] = 'BSD 2-clause "Simplified" License'] = "BSD2Clause";
    LicenseEnum[LicenseEnum["BSD3Clause"] = 'BSD 3-clause "New" or "Revised" License'] = "BSD3Clause";
    LicenseEnum[LicenseEnum["EPL10"] = 'Eclipse Public License 1.0'] = "EPL10";
    LicenseEnum[LicenseEnum["EPL20"] = 'Eclipse Public License 2.0'] = "EPL20";
    LicenseEnum[LicenseEnum["AGPL30"] = 'GNU Affero General Public License v3.0'] = "AGPL30";
    LicenseEnum[LicenseEnum["GPL20"] = 'GNU General Public License v2.0'] = "GPL20";
    LicenseEnum[LicenseEnum["LGPL21"] = 'GNU Lesser General Public License v2.1'] = "LGPL21";
    LicenseEnum[LicenseEnum["LGPL30"] = 'GNU Lesser General Public License v3.0'] = "LGPL30";
    LicenseEnum[LicenseEnum["MPL20"] = 'Mozilla Public License 2.0'] = "MPL20";
    LicenseEnum[LicenseEnum["Unlicense"] = 'The Unlicense'] = "Unlicense";
})(LicenseEnum = exports.LicenseEnum || (exports.LicenseEnum = {}));
var WineryLicense = (function () {
    function WineryLicense() {
    }
    WineryLicense.getLicense = function (license) {
        var licenseText = '';
        switch (license) {
            case LicenseEnum.None:
                licenseText = '';
                break;
            case LicenseEnum.APL20:
                licenseText = APL2.license;
                break;
            case LicenseEnum.GPL30:
                licenseText = GPL3.license;
                break;
            case LicenseEnum.MIT:
                licenseText = MIT.license;
                break;
            case LicenseEnum.BSD2Clause:
                licenseText = BSD2.license;
                break;
            case LicenseEnum.BSD3Clause:
                licenseText = BSD3.license;
                break;
            case LicenseEnum.EPL10:
                licenseText = EPL1.license;
                break;
            case LicenseEnum.EPL20:
                licenseText = EPL2.license;
                break;
            case LicenseEnum.AGPL30:
                licenseText = AGPL3.license;
                break;
            case LicenseEnum.GPL20:
                licenseText = GPL2.license;
                break;
            case LicenseEnum.LGPL21:
                licenseText = LGPL2_1.license;
                break;
            case LicenseEnum.LGPL30:
                licenseText = LGPL3.license;
                break;
            case LicenseEnum.MPL20:
                licenseText = MPL2.license;
                break;
            case LicenseEnum.Unlicense:
                licenseText = Unlicense.license;
                break;
            default:
                licenseText = 'error no valid license type';
                break;
        }
        return licenseText;
    };
    return WineryLicense;
}());
exports.WineryLicense = WineryLicense;
//# sourceMappingURL=wineryLicense.enum.js.map