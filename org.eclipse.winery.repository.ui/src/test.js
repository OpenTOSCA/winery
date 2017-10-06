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
 *     Lukas Harzenetter - initial API and implementation
 *
 * This file has been generated using `ng new` and adapted to winery's needs.
 */
require("zone.js/dist/long-stack-trace-zone");
require("zone.js/dist/proxy.js");
require("zone.js/dist/sync-test");
require("zone.js/dist/jasmine-patch");
require("zone.js/dist/async-test");
require("zone.js/dist/fake-async-test");
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
__karma__.loaded = function () {
};
testing_1.getTestBed().initTestEnvironment(testing_2.BrowserDynamicTestingModule, testing_2.platformBrowserDynamicTesting());
var context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
__karma__.start();
//# sourceMappingURL=test.js.map