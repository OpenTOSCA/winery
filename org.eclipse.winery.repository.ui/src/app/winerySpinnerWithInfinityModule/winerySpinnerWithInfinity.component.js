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
var noop = function () {
};
var CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return SpinnerWithInfinityComponent; }),
    multi: true
};
/**
 * This component provides a number input field with additional up and down arrow buttons
 * as well as an optional infinity symbol button
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>min</code> minimum value for the input field</li>
 *     <li><code>max</code> maximum value for the input field</li>
 *     <li><code>label</code> label of the input field, which is in front of the input</li>
 *     <li><code>valueSt</code> defines the internal value of the infinity value</li>
 *     <li><code>withInfinity</code> defines whether to show the infinity button or not</li>
 * </ul>
 *
 * @example <caption>Basic usage</caption>
 * ```html
 *   <winery-spinner-with-infinity
 *       #upperBoundSpinner label="Upper Bound" withInfinity="true">
 *   </winery-spinner-with-infinity>
 * ```
 */
var SpinnerWithInfinityComponent = (function () {
    function SpinnerWithInfinityComponent() {
        this.min = 0;
        this.max = 1000;
        this.label = 'Default Label';
        this.valueSt = 42;
        this.withInfinity = false;
        this.infinityIsPlaced = false;
        // The internal data model
        this.innerValue = '1';
        // Placeholders for the callbacks which are later provided
        // by the Control Value Accessor
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
    }
    Object.defineProperty(SpinnerWithInfinityComponent.prototype, "value", {
        // get accessor
        get: function () {
            return this.innerValue;
        },
        // set accessor including call the onchange callback
        set: function (v) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                // return unbounded in case of infinity symbol
                if (v !== '∞') {
                    this.onChangeCallback(v);
                }
                else {
                    this.onChangeCallback('unbounded');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    // Set touched on blur
    SpinnerWithInfinityComponent.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    // From ControlValueAccessor interface
    SpinnerWithInfinityComponent.prototype.writeValue = function (value) {
        if (value !== this.innerValue) {
            // show infinity symbol in case of unbounded is set
            if (value === 'unbounded') {
                this.innerValue = '∞';
                this.infinityIsPlaced = true;
            }
            else {
                this.innerValue = value;
            }
        }
    };
    // From ControlValueAccessor interface
    SpinnerWithInfinityComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    // From ControlValueAccessor interface
    SpinnerWithInfinityComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    SpinnerWithInfinityComponent.prototype.addInfinite = function () {
        this.value = '∞';
        this.infinityIsPlaced = true;
    };
    SpinnerWithInfinityComponent.prototype.increment = function () {
        var modelAsNumber;
        if (this.infinityIsPlaced) {
            modelAsNumber = this.valueSt;
            this.infinityIsPlaced = false;
        }
        else {
            modelAsNumber = Number(this.innerValue);
        }
        modelAsNumber++;
        if (modelAsNumber <= this.max) {
            this.value = modelAsNumber.toString();
        }
    };
    SpinnerWithInfinityComponent.prototype.decrement = function () {
        var modelAsNumber;
        if (this.infinityIsPlaced) {
            modelAsNumber = (this.valueSt + 1);
            this.infinityIsPlaced = false;
        }
        else {
            modelAsNumber = Number(this.innerValue);
        }
        modelAsNumber--;
        if (modelAsNumber >= this.min) {
            this.value = modelAsNumber.toString();
        }
    };
    return SpinnerWithInfinityComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SpinnerWithInfinityComponent.prototype, "min", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SpinnerWithInfinityComponent.prototype, "max", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SpinnerWithInfinityComponent.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SpinnerWithInfinityComponent.prototype, "valueSt", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SpinnerWithInfinityComponent.prototype, "withInfinity", void 0);
SpinnerWithInfinityComponent = __decorate([
    core_1.Component({
        selector: 'winery-spinner-with-infinity',
        templateUrl: 'winerySpinnerWithInfinity.component.html',
        providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
    })
], SpinnerWithInfinityComponent);
exports.SpinnerWithInfinityComponent = SpinnerWithInfinityComponent;
//# sourceMappingURL=winerySpinnerWithInfinity.component.js.map