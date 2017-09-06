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
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Niko Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var util_1 = require("util");
var configuration_1 = require("../configuration");
var SectionResolver = (function () {
    function SectionResolver(router) {
        this.router = router;
    }
    SectionResolver.prototype.resolve = function (route, state) {
        var section = configuration_1.sections[route.params['section']];
        var namespace = decodeURIComponent(decodeURIComponent(route.params['namespace']));
        if (!util_1.isNullOrUndefined(section)) {
            return { section: section, namespace: namespace, path: route.params['section'] };
        }
        else {
            this.router.navigate(['/notfound']);
            return null;
        }
    };
    return SectionResolver;
}());
SectionResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], SectionResolver);
exports.SectionResolver = SectionResolver;
//# sourceMappingURL=section.resolver.js.map