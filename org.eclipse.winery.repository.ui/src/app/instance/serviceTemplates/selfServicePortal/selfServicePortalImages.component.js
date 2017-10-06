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
 *     Niko Stadelmaier - initial API and implementation
 *     Lukas Balzer - corrected image upload of SelfServicePortal
 */
var core_1 = require("@angular/core");
var selfServicePortal_service_1 = require("./selfServicePortal.service");
var wineryNotification_service_1 = require("../../../wineryNotificationModule/wineryNotification.service");
var SelfServicePortalImagesComponent = (function () {
    function SelfServicePortalImagesComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.loading = true;
    }
    SelfServicePortalImagesComponent.prototype.ngOnInit = function () {
        this.loading = true;
        this.iconPath = this.service.getIconPath();
        this.imagePath = this.service.getImagePath();
        this.loading = false;
    };
    SelfServicePortalImagesComponent.prototype.onUploadSuccess = function (name) {
        this.loading = true;
        this.notify.success('Successfully uploaded ' + name);
        var number = Math.random();
        this.iconPath = this.service.getIconPath() + '?' + number;
        this.imagePath = this.service.getImagePath() + '?' + number;
        this.loading = false;
    };
    return SelfServicePortalImagesComponent;
}());
SelfServicePortalImagesComponent = __decorate([
    core_1.Component({
        selector: 'winery-self-service-images',
        templateUrl: 'selfServicePortalImages.component.html'
    }),
    __metadata("design:paramtypes", [selfServicePortal_service_1.SelfServicePortalService,
        wineryNotification_service_1.WineryNotificationService])
], SelfServicePortalImagesComponent);
exports.SelfServicePortalImagesComponent = SelfServicePortalImagesComponent;
//# sourceMappingURL=selfServicePortalImages.component.js.map