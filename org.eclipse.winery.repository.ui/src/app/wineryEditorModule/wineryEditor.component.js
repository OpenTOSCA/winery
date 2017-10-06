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
 *
 * Contributors:
 *     Philipp Meyer - initial API and implementation
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var util_1 = require("util");
var noop = function () {
};
exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return WineryEditorComponent; }),
    multi: true
};
/**
 * This component provides an editor for editing and showing code with syntax highlight for different
 * kinds of languages like xml, javascript etc.
 * For more information look under <a href="https://wiki.eclipse.org/Orion">Orion</a>
 * <b>Important notes:</b> The model binding just works in one direction.
 * That means that if a model is bind to the component the current text is shown.
 * In order to get the current text of the editor component the getData() method of the component have to be called.
 *
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>dataEditorLang</code> sets the language for the syntax highlight
 *     </li>
 *     <li><code>height</code> Sets the height of the editor
 * </ul>
 *
 *
 * @example <caption>Basic usage</caption>
 * ```html
 *  <winery-editor #editor
 *  [ngModel]="xmlData">
 *  </winery-editor>
 * ```
 */
var WineryEditorComponent = (function () {
    function WineryEditorComponent() {
        this.dataEditorLang = 'application/xml';
        this.height = 500;
        this.loading = true;
        this.orionEditor = undefined;
        // The internal data model
        this.innerValue = '';
        // Placeholders for the callbacks which are later provided
        // by the Control Value Accessor
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
    }
    WineryEditorComponent.prototype.ngOnInit = function () {
        requirejs(['orion/editor/edit'], function (edit) {
            this.orionEditor = edit({ className: 'editor', parent: 'xml', contentType: this.dataEditorLang })[0];
            this.orionEditor.setText(this.innerValue);
        }.bind(this));
    };
    Object.defineProperty(WineryEditorComponent.prototype, "value", {
        // get accessor
        get: function () {
            return this.innerValue;
        },
        // set accessor including call the onchange callback
        set: function (v) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                this.onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    // Set touched on blur
    WineryEditorComponent.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    // From ControlValueAccessor interface
    WineryEditorComponent.prototype.writeValue = function (value) {
        if (value !== this.innerValue && !util_1.isNullOrUndefined(value)) {
            this.innerValue = value;
            if (!util_1.isNullOrUndefined(this.orionEditor)) {
                this.orionEditor.setText(this.innerValue);
            }
        }
    };
    // From ControlValueAccessor interface
    WineryEditorComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    // From ControlValueAccessor interface
    WineryEditorComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    WineryEditorComponent.prototype.getData = function () {
        if (!util_1.isNullOrUndefined(this.orionEditor)) {
            return this.orionEditor.getText();
        }
    };
    WineryEditorComponent.prototype.setData = function (value) {
        if (!util_1.isNullOrUndefined(this.orionEditor)) {
            return this.orionEditor.setText(value);
        }
    };
    return WineryEditorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryEditorComponent.prototype, "dataEditorLang", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryEditorComponent.prototype, "height", void 0);
WineryEditorComponent = __decorate([
    core_1.Component({
        selector: 'winery-editor',
        templateUrl: 'wineryEditor.component.html',
        providers: [exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [])
], WineryEditorComponent);
exports.WineryEditorComponent = WineryEditorComponent;
//# sourceMappingURL=wineryEditor.component.js.map