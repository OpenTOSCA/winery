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
 */
var core_1 = require("@angular/core");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var common_1 = require("@angular/common");
var WineryNotificationService = (function () {
    function WineryNotificationService(pToastr, datePipe) {
        this.pToastr = pToastr;
        this.datePipe = datePipe;
        this.notifications = [];
        this.toastr = pToastr;
    }
    /**
     * Initializes the Notification Service
     * Important: this function must be called before using the the service
     *
     * @param rootVcr - View Container Reference of the root component
     */
    WineryNotificationService.prototype.init = function (rootVcr) {
        this.toastr.setRootViewContainerRef(rootVcr);
    };
    /**
     * returns a List of all previously created notifications
     * @returns {Array<any>} - contains the notification objects
     */
    WineryNotificationService.prototype.getHistory = function () {
        return this.notifications;
    };
    /**
     *
     * @param message
     * @param title
     */
    WineryNotificationService.prototype.success = function (message, title, options) {
        if (title === void 0) { title = 'Success'; }
        if (options === void 0) { options = {}; }
        this.toastr.success(message, title, options);
        this.notifications.push({ title: title, message: message, type: 'success', createdOn: this.getCurrentDate() });
    };
    /**
     *
     * @param message
     * @param title
     */
    WineryNotificationService.prototype.error = function (message, title) {
        if (title === void 0) { title = 'Error'; }
        this.toastr.error(message, title);
        this.notifications.push({ title: title, message: message, type: 'error', createdOn: this.getCurrentDate() });
    };
    /**
     *
     * @param message
     * @param title
     */
    WineryNotificationService.prototype.warning = function (message, title) {
        if (title === void 0) { title = 'Warning'; }
        this.toastr.warning(message, title);
        this.notifications.push({ title: title, message: message, type: 'warning', createdOn: this.getCurrentDate() });
    };
    /**
     * returns the current date
     * @returns {string}
     */
    WineryNotificationService.prototype.getCurrentDate = function () {
        return this.datePipe.transform(Date.now(), 'short');
    };
    return WineryNotificationService;
}());
WineryNotificationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_toastr_1.ToastsManager,
        common_1.DatePipe])
], WineryNotificationService);
exports.WineryNotificationService = WineryNotificationService;
//# sourceMappingURL=wineryNotification.service.js.map