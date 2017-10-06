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
var removeWhiteSpaces_pipe_1 = require("../../wineryPipes/removeWhiteSpaces.pipe");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var toscaComponent_1 = require("../../wineryInterfaces/toscaComponent");
var enums_1 = require("../../wineryInterfaces/enums");
var InstanceHeaderComponent = (function () {
    function InstanceHeaderComponent(router) {
        this.router = router;
        this.deleteConfirmed = new core_1.EventEmitter();
        this.needTwoLines = false;
        this.showManagementButtons = true;
    }
    InstanceHeaderComponent.prototype.ngOnInit = function () {
        if (this.subMenu.length > 7) {
            this.needTwoLines = true;
        }
        if (this.toscaComponent.toscaType === enums_1.ToscaTypes.Imports) {
            this.showManagementButtons = false;
        }
    };
    InstanceHeaderComponent.prototype.removeConfirmed = function () {
        this.deleteConfirmed.emit();
    };
    return InstanceHeaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", toscaComponent_1.ToscaComponent)
], InstanceHeaderComponent.prototype, "toscaComponent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstanceHeaderComponent.prototype, "typeUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstanceHeaderComponent.prototype, "typeId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstanceHeaderComponent.prototype, "typeOf", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], InstanceHeaderComponent.prototype, "subMenu", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstanceHeaderComponent.prototype, "imageUrl", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], InstanceHeaderComponent.prototype, "deleteConfirmed", void 0);
__decorate([
    core_1.ViewChild('confirmDeleteModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], InstanceHeaderComponent.prototype, "confirmDeleteModal", void 0);
InstanceHeaderComponent = __decorate([
    core_1.Component({
        selector: 'winery-instance-header',
        templateUrl: './instanceHeader.component.html',
        styleUrls: [
            './instanceHeader.component.css'
        ],
        providers: [
            removeWhiteSpaces_pipe_1.RemoveWhiteSpacesPipe
        ],
    }),
    __metadata("design:paramtypes", [router_1.Router])
], InstanceHeaderComponent);
exports.InstanceHeaderComponent = InstanceHeaderComponent;
//# sourceMappingURL=instanceHeader.component.js.map