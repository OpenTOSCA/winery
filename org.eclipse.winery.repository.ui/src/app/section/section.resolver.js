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
var utils_1 = require("../wineryUtils/utils");
var enums_1 = require("../wineryInterfaces/enums");
var SectionResolver = (function () {
    function SectionResolver(router) {
        this.router = router;
    }
    SectionResolver.prototype.resolve = function (route, state) {
        var section = utils_1.Utils.getToscaTypeFromString(route.url[0].path);
        var namespace = route.params['namespace'] ? decodeURIComponent(decodeURIComponent(route.params['namespace'])) : null;
        var xsdSchemaType = enums_1.ToscaTypes.Imports ? decodeURIComponent(decodeURIComponent(route.params['xsdSchemaType'])) : null;
        return { section: section, namespace: namespace, path: route.url[0].path, xsdSchemaType: xsdSchemaType };
    };
    return SectionResolver;
}());
SectionResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], SectionResolver);
exports.SectionResolver = SectionResolver;
//# sourceMappingURL=section.resolver.js.map