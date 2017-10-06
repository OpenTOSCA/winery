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
 *     Lukas Harzenetter - initial API and implementation
 *     Niko Stadelmaier - add types and documentation
 */
var core_1 = require("@angular/core");
var wineryNamespaceSelector_service_1 = require("./wineryNamespaceSelector.service");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var forms_1 = require("@angular/forms");
var noop = function () {
};
var customInputControl = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return WineryNamespaceSelectorComponent; }),
    multi: true,
};
/**
 * This component only wraps the namespace chooser. It gets the whole list from the backend and
 * provides typeahead for selecting a namespace. This component can be used with the <code>ngModel</code> directive.
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>ngModel</code> required for getting the value from this input.
 *     </li>
 *     <li><code>isRequired</code> provides a way for setting the namespace input as required. By default,
 *         required is set to false.
 *     </li>
 *     <li><code>typeAheadListLimit</code> sets the length of the options which are shown by typeahead. By default,
 *         the limit is set to 50
 *     </li>
 * </ul>
 * <br>
 * @example <caption>Basic usage</caption>
 * ```html
 * <winery-namespace-selector name="namespaceSelector" [(ngModel)]="mySelectedNamespace">
 * </winery-namespace-selector>
 * ```
 *
 * @example <caption>Example with using the required validation</caption>
 * ```html
 * <form #myForm="ngForm">
 *     <winery-namespace-selector
 *         name="namespaceSelector"
 *         [(ngModel)]="mySelectedNamespace"
 *         [isRequired]="true"
 *         [typeAheadListLimit]="20"
 *         required>
 *     </winery-namespace-selector>
 *     <button type="button" [disabled]="!myForm?.form.valid" (click)="onSave();">Save</button>
 * </form>
 * ```
 */
var WineryNamespaceSelectorComponent = (function () {
    function WineryNamespaceSelectorComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.isRequired = false;
        this.typeAheadListLimit = 50;
        this.onChange = new core_1.EventEmitter();
        this.loading = true;
        this.allNamespaces = [];
        this.innerValue = '';
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
    }
    WineryNamespaceSelectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getAllNamespaces()
            .subscribe(function (data) {
            _this.allNamespaces = data;
            _this.loading = false;
        }, function (error) { return _this.notify.error(error.toString()); });
    };
    Object.defineProperty(WineryNamespaceSelectorComponent.prototype, "selectedNamespace", {
        get: function () {
            return this.innerValue;
        },
        set: function (v) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                this.onChangeCallback(v);
                this.onChange.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    WineryNamespaceSelectorComponent.prototype.writeValue = function (value) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    };
    WineryNamespaceSelectorComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    WineryNamespaceSelectorComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return WineryNamespaceSelectorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryNamespaceSelectorComponent.prototype, "isRequired", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryNamespaceSelectorComponent.prototype, "typeAheadListLimit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryNamespaceSelectorComponent.prototype, "onChange", void 0);
WineryNamespaceSelectorComponent = __decorate([
    core_1.Component({
        selector: 'winery-namespace-selector',
        templateUrl: './wineryNamespaceSelector.component.html',
        providers: [
            wineryNamespaceSelector_service_1.WineryNamespaceSelectorService,
            customInputControl
        ]
    }),
    __metadata("design:paramtypes", [wineryNamespaceSelector_service_1.WineryNamespaceSelectorService, wineryNotification_service_1.WineryNotificationService])
], WineryNamespaceSelectorComponent);
exports.WineryNamespaceSelectorComponent = WineryNamespaceSelectorComponent;
//# sourceMappingURL=wineryNamespaceSelector.component.js.map