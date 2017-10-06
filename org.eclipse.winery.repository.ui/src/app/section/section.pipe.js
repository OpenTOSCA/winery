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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("util");
/**
 * This pipe filters the given components by the given filter string and namespace.
 * If <code>showNamespaces</code> is set to <code>'group'</code>, the components are grouped by the namespaces.
 */
var SectionPipe = (function () {
    function SectionPipe() {
    }
    SectionPipe.prototype.transform = function (value, args) {
        var _this = this;
        if (util_1.isNullOrUndefined(value)) {
            return value;
        }
        if (util_1.isNullOrUndefined(args.filterString)) {
            args.filterString = '';
        }
        if (util_1.isNullOrUndefined(args.showNamespaces) || args.showNamespaces === 'all') {
            return value.filter(function (item) { return _this.filter(item, args.filterString); });
        }
        else if ((args.showNamespaces.length > 0) && !args.showNamespaces.includes('group')) {
            return value.filter(function (item, index, array) {
                return (item.namespace === args.showNamespaces)
                    && _this.filter(item, args.filterString);
            });
        }
        else if (args.showNamespaces === 'group') {
            var distinctNamespaces = [];
            // Get all namespaces and count their appearance
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                if (util_1.isNullOrUndefined(distinctNamespaces[item.namespace])) {
                    var o = { namespace: item.namespace, count: 1 };
                    distinctNamespaces[item.namespace] = o;
                    distinctNamespaces.push(o);
                }
                else {
                    distinctNamespaces[item.namespace].count++;
                }
            }
            // Apply the search filter and return the resulting array
            return distinctNamespaces.filter(function (item) { return _this.filter(item, args.filterString); });
        }
    };
    SectionPipe.prototype.filter = function (item, filter) {
        var containsId = false;
        var containsNamespace = false;
        if (item.id) {
            containsId = item.id.toLowerCase().includes(filter.toLowerCase());
        }
        containsNamespace = item.namespace.toLowerCase().includes(filter.toLowerCase());
        return containsId || containsNamespace;
    };
    return SectionPipe;
}());
SectionPipe = __decorate([
    core_1.Pipe({
        name: 'filterSections'
    })
], SectionPipe);
exports.SectionPipe = SectionPipe;
//# sourceMappingURL=section.pipe.js.map