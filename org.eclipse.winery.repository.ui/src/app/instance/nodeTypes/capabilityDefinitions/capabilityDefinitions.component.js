"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Philipp Meyer, Tino Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var CapabilityDefinitionsComponent = (function () {
    function CapabilityDefinitionsComponent() {
    }
    return CapabilityDefinitionsComponent;
}());
CapabilityDefinitionsComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-capability-definitions',
        templateUrl: 'capabilityDefinitions.component.html'
    })
], CapabilityDefinitionsComponent);
exports.CapabilityDefinitionsComponent = CapabilityDefinitionsComponent;
//# sourceMappingURL=capabilityDefinitions.component.js.map