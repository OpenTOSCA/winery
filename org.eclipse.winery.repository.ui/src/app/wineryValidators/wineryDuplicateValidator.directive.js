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
var forms_1 = require("@angular/forms");
var util_1 = require("util");
var WineryValidatorObject = (function () {
    function WineryValidatorObject(list, property) {
        this.list = list;
        this.property = property;
    }
    WineryValidatorObject.prototype.validate = function (compareObject) {
        return function (control) {
            if (util_1.isNullOrUndefined(compareObject) || util_1.isNullOrUndefined(compareObject.list)) {
                return null;
            }
            var name = control.value;
            var no = false;
            if (util_1.isNullOrUndefined(compareObject.property)) {
                no = compareObject.list.find(function (item) { return item === name; });
            }
            else {
                no = compareObject.list.find(function (item) { return item[compareObject.property] === name; });
            }
            return no ? { 'wineryDuplicateValidator': { name: name } } : null;
        };
    };
    return WineryValidatorObject;
}());
exports.WineryValidatorObject = WineryValidatorObject;
var WineryDuplicateValidatorDirective = WineryDuplicateValidatorDirective_1 = (function () {
    function WineryDuplicateValidatorDirective() {
        this.valFn = forms_1.Validators.nullValidator;
    }
    WineryDuplicateValidatorDirective.prototype.ngOnChanges = function (changes) {
        var change = changes['wineryDuplicateValidator'];
        if (change && !util_1.isNullOrUndefined(this.wineryDuplicateValidator)) {
            var val = change.currentValue;
            this.valFn = this.wineryDuplicateValidator.validate(val);
        }
        else {
            this.valFn = forms_1.Validators.nullValidator;
        }
    };
    WineryDuplicateValidatorDirective.prototype.validate = function (control) {
        return this.valFn(control);
    };
    return WineryDuplicateValidatorDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", WineryValidatorObject)
], WineryDuplicateValidatorDirective.prototype, "wineryDuplicateValidator", void 0);
WineryDuplicateValidatorDirective = WineryDuplicateValidatorDirective_1 = __decorate([
    core_1.Directive({
        selector: '[wineryDuplicateValidator]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: WineryDuplicateValidatorDirective_1, multi: true }]
    })
], WineryDuplicateValidatorDirective);
exports.WineryDuplicateValidatorDirective = WineryDuplicateValidatorDirective;
var WineryDuplicateValidatorDirective_1;
//# sourceMappingURL=wineryDuplicateValidator.directive.js.map