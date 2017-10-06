/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Lukas Harzenetter, Niko Stadelmaier - initial API and implementation
 */
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
var core_1 = require("@angular/core");
var util_1 = require("util");
var SelectableListComponent = (function () {
    function SelectableListComponent() {
        this.removeButtonClicked = new core_1.EventEmitter();
        this.addButtonClicked = new core_1.EventEmitter();
        this.selectionChanged = new core_1.EventEmitter();
    }
    SelectableListComponent.prototype.ngOnInit = function () {
        if (util_1.isNullOrUndefined(this.rows)) {
            this.rows = [];
        }
    };
    SelectableListComponent.prototype.onAdd = function ($event) {
        $event.stopPropagation();
        this.addButtonClicked.emit();
    };
    SelectableListComponent.prototype.onRemove = function ($event) {
        $event.stopPropagation();
        this.removeButtonClicked.emit(this.currentSelected);
    };
    SelectableListComponent.prototype.onChange = function (value) {
        this.currentSelected = value;
        this.selectionChanged.emit(value);
    };
    return SelectableListComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SelectableListComponent.prototype, "rows", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SelectableListComponent.prototype, "title", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SelectableListComponent.prototype, "removeButtonClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SelectableListComponent.prototype, "addButtonClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SelectableListComponent.prototype, "selectionChanged", void 0);
SelectableListComponent = __decorate([
    core_1.Component({
        selector: 'winery-selectable-list',
        templateUrl: 'selectableList.component.html',
        styleUrls: [
            'selectableList.component.css',
        ],
    }),
    __metadata("design:paramtypes", [])
], SelectableListComponent);
exports.SelectableListComponent = SelectableListComponent;
//# sourceMappingURL=selectableList.component.js.map