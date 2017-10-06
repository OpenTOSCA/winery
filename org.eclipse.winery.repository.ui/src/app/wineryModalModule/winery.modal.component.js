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
var util_1 = require("util");
var winery_modal_footer_component_1 = require("./winery.modal.footer.component");
var winery_modal_header_component_1 = require("./winery.modal.header.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var SMALL = 'sm';
var LARGE = 'lg';
/**
 * This component provides a generic modal component for any kind of pop-ups.
 * To use it, the {@link WineryModalModule} must be imported in the corresponding module.
 *
 * In order to use this component, see the following example, note that the <code>modalRef</code> must be set.
 * For further information, see the sub-components {@link WineryModalHeaderComponent}, {@link WineryModalBodyComponent},
 * and {@link WineryModalFooterComponent}.
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>modalRef</code> The modalRef must be set, otherwise the component will not work!
 *     </li>
 *     <li><code>size</code>
 *     </li>
 *     <li><code>keyboard</code>
 *     </li>
 *     <li><code>backdrop</code>
 *     </li>
 * </ul>
 *
 * @example <caption>Short Example</caption>
 * ```html
 * <winery-modal bsModal #confirmDeleteModal="bs-modal" [modalRef]="confirmDeleteModal">
 *     <winery-modal-header [title]="'Delete Property'">
 *     </winery-modal-header>
 *     <winery-modal-body>
 *         <p *ngIf="elementToRemove != null">
 *         Do you want to delete the Element
 *             <span style="font-weight:bold;">{{ elementToRemove.key }}</span>?
 *         </p>
 *     </winery-modal-body>
 *     <winery-modal-footer (onOk)="removeConfirmed();"
 *                          [closeButtonLabel]="'Cancel'"
 *                          [okButtonLabel]="'Delete'">
 *     </winery-modal-footer>
 * </winery-modal>
 * ```
 */
var WineryModalComponent = (function () {
    function WineryModalComponent() {
        this.keyboard = true;
        this.backdrop = true;
        this.hostClass = 'modal fade';
        this.hostRole = 'dialog';
        this.hostTabIndex = '-1';
        this.overrideSize = null;
        this.cssClass = '';
    }
    WineryModalComponent.prototype.ngAfterContentInit = function () {
        if (!util_1.isNullOrUndefined(this.headerContent)) {
            this.headerContent.modalRef = this.modalRef;
        }
        if (!util_1.isNullOrUndefined(this.footerContent)) {
            this.footerContent.modalRef = this.modalRef;
        }
    };
    WineryModalComponent.prototype.ngAfterViewInit = function () {
        if (!this.backdrop) {
            this.modalRef.config.backdrop = 'static';
        }
        else {
            this.modalRef.config.backdrop = this.backdrop;
        }
        this.modalRef.config.keyboard = this.keyboard;
        if (ModalSize.validSize(this.size)) {
            this.overrideSize = this.size;
        }
    };
    WineryModalComponent.prototype.getCssClasses = function () {
        var classes = [];
        if (this.isSmall()) {
            classes.push('modal-sm');
        }
        if (this.isLarge()) {
            classes.push('modal-lg');
        }
        if (this.cssClass !== '') {
            classes.push(this.cssClass);
        }
        return classes.join(' ');
    };
    WineryModalComponent.prototype.isSmall = function () {
        return this.overrideSize !== LARGE
            && this.size === SMALL
            || this.overrideSize === SMALL;
    };
    WineryModalComponent.prototype.isLarge = function () {
        return this.overrideSize !== SMALL
            && this.size === LARGE
            || this.overrideSize === LARGE;
    };
    return WineryModalComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], WineryModalComponent.prototype, "modalRef", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryModalComponent.prototype, "size", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalComponent.prototype, "keyboard", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryModalComponent.prototype, "backdrop", void 0);
__decorate([
    core_1.HostBinding('class'),
    __metadata("design:type", Object)
], WineryModalComponent.prototype, "hostClass", void 0);
__decorate([
    core_1.HostBinding('attr.role'),
    __metadata("design:type", Object)
], WineryModalComponent.prototype, "hostRole", void 0);
__decorate([
    core_1.HostBinding('tabindex'),
    __metadata("design:type", Object)
], WineryModalComponent.prototype, "hostTabIndex", void 0);
__decorate([
    core_1.ContentChild(winery_modal_header_component_1.WineryModalHeaderComponent),
    __metadata("design:type", winery_modal_header_component_1.WineryModalHeaderComponent)
], WineryModalComponent.prototype, "headerContent", void 0);
__decorate([
    core_1.ContentChild(winery_modal_footer_component_1.WineryModalFooterComponent),
    __metadata("design:type", winery_modal_footer_component_1.WineryModalFooterComponent)
], WineryModalComponent.prototype, "footerContent", void 0);
WineryModalComponent = __decorate([
    core_1.Component({
        selector: 'winery-modal',
        templateUrl: 'winery.modal.component.html',
    })
], WineryModalComponent);
exports.WineryModalComponent = WineryModalComponent;
/**
 * This class is used to determine the modal's size
 */
var ModalSize = (function () {
    function ModalSize() {
    }
    ModalSize.validSize = function (size) {
        return size && (size === SMALL || size === LARGE);
    };
    return ModalSize;
}());
exports.ModalSize = ModalSize;
//# sourceMappingURL=winery.modal.component.js.map