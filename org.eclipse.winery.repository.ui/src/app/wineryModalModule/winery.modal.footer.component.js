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
 *     Tino Stadelmaier - initial API and implementation
 */
var core_1 = require("@angular/core");
var WineryModalFooterComponent = (function () {
    function WineryModalFooterComponent() {
        this.showDefaultButtons = true;
        this.closeButtonLabel = 'Cancel';
        this.okButtonLabel = 'Add';
        this.disableOkButton = false;
        this.onOk = new core_1.EventEmitter();
        this.onCancel = new core_1.EventEmitter();
    }
    WineryModalFooterComponent.prototype.ok = function () {
        this.onOk.emit();
        this.modalRef.hide();
    };
    WineryModalFooterComponent.prototype.cancel = function () {
        this.onCancel.emit();
        this.modalRef.hide();
    };
    return WineryModalFooterComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "showDefaultButtons", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "closeButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "okButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "modalRef", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "disableOkButton", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "onOk", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryModalFooterComponent.prototype, "onCancel", void 0);
WineryModalFooterComponent = __decorate([
    core_1.Component({
        selector: 'winery-modal-footer',
        templateUrl: 'winery.modal.footer.component.html'
    })
], WineryModalFooterComponent);
exports.WineryModalFooterComponent = WineryModalFooterComponent;
//# sourceMappingURL=winery.modal.footer.component.js.map