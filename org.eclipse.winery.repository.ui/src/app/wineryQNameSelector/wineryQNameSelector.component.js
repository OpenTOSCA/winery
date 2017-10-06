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
var util_1 = require("util");
var enums_1 = require("../wineryInterfaces/enums");
/**
 * This component provides a selector for QNames in addition with a link to the currently
 * selected QName.
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>title</code> sets the title for the selector.
 *     </li>
 *     <li><code>displayList</code> the list of QNames in {@link NameAndQNameApiDataList} format. This field is
 *         mandatory!
 *     <li><code>toscaType</code>
 *     </li>
 *     <li><code>selectedValue</code> sets the currently selected value in the dropdown
 *     </li>
 * </ul>
 *
 * <label>Outputs</label>
 * <ul>
 *     <li><code>selectedValueChanged</code> emits the selected value in the dropdown.
 *     </li>
 * </ul>
 *
 * @example <caption>Basic usage</caption>
 * ```html
 * <winery-qname-selector
 *     [title]="'Derived from'"
 *     [displayList]="availableSuperClasses"
 *     [toscaType]="toscaType"
 *     [selectedValue]="inheritanceApiData.derivedFrom"
 *     (selectedValueChanged)="onSelectedValueChanged($event.value)">
 * </winery-qname-selector>
 * ```
 */
var WineryQNameSelectorComponent = (function () {
    function WineryQNameSelectorComponent() {
        this.width = 600;
        this.showOpenButton = true;
        this.selectedValueChanged = new core_1.EventEmitter();
        this.openSuperClassLink = '';
    }
    WineryQNameSelectorComponent.prototype.ngOnInit = function () {
        this.setButtonLink();
    };
    WineryQNameSelectorComponent.prototype.onChange = function (value) {
        this.selectedValue = value;
        this.setButtonLink();
        this.selectedValueChanged.emit({ value: this.selectedValue });
    };
    WineryQNameSelectorComponent.prototype.handleData = function (availableSuperClasses) {
        this.qNameList = availableSuperClasses;
        this.setButtonLink();
    };
    WineryQNameSelectorComponent.prototype.setButtonLink = function () {
        if (util_1.isNullOrUndefined(this.selectedValue)) {
            this.selectedValue = '(none)';
        }
        var parts = this.selectedValue.split('}');
        // can be '(none)'
        if (parts.length > 1) {
            var namespace = parts[0].slice(1);
            var name_1 = parts[1];
            this.openSuperClassLink = '/' + this.toscaType + '/' + encodeURIComponent(encodeURIComponent(namespace)) + '/' + name_1;
        }
    };
    return WineryQNameSelectorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryQNameSelectorComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryQNameSelectorComponent.prototype, "displayList", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], WineryQNameSelectorComponent.prototype, "toscaType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryQNameSelectorComponent.prototype, "selectedValue", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryQNameSelectorComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryQNameSelectorComponent.prototype, "showOpenButton", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryQNameSelectorComponent.prototype, "selectedValueChanged", void 0);
WineryQNameSelectorComponent = __decorate([
    core_1.Component({
        selector: 'winery-qname-selector',
        templateUrl: './wineryQNameSelector.component.html',
    }),
    __metadata("design:paramtypes", [])
], WineryQNameSelectorComponent);
exports.WineryQNameSelectorComponent = WineryQNameSelectorComponent;
//# sourceMappingURL=wineryQNameSelector.component.js.map