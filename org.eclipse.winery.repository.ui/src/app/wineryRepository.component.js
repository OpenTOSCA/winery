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
var wineryNotification_service_1 = require("./wineryNotificationModule/wineryNotification.service");
var wineryGitLog_component_1 = require("./wineryGitLog/wineryGitLog.component");
var WineryRepositoryComponent = (function () {
    function WineryRepositoryComponent(vcr, notify) {
        this.notify = notify;
        // region variables
        this.name = 'Winery Repository';
        // endregion
        this.options = {
            position: ['top', 'right'],
            timeOut: 3000,
            lastOnBottom: true
        };
        this.notify.init(vcr);
    }
    WineryRepositoryComponent.prototype.onClick = function () {
        this.gitLog.hide();
    };
    return WineryRepositoryComponent;
}());
__decorate([
    core_1.ViewChild('gitLog'),
    __metadata("design:type", wineryGitLog_component_1.WineryGitLogComponent)
], WineryRepositoryComponent.prototype, "gitLog", void 0);
WineryRepositoryComponent = __decorate([
    core_1.Component({
        selector: 'winery-repository',
        templateUrl: './wineryRepository.html',
    })
    /*
     * This component represents the root component for the Winery Repository.
     */
    ,
    __metadata("design:paramtypes", [core_1.ViewContainerRef, wineryNotification_service_1.WineryNotificationService])
], WineryRepositoryComponent);
exports.WineryRepositoryComponent = WineryRepositoryComponent;
//# sourceMappingURL=wineryRepository.component.js.map