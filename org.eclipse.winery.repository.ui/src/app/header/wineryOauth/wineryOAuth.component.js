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
 */
var core_1 = require("@angular/core");
var wineryOAuth_service_1 = require("./wineryOAuth.service");
/**
 * This component adds support for a OAuth login. For now, it only allows to login using GitHub.
 * However, the main work is done by the {@link WineryOAuthService}.
 */
var WineryOAuthComponent = (function () {
    function WineryOAuthComponent(service) {
        this.service = service;
        this.buttonLabel = 'Login with GitHub';
        this.loggedIn = false;
    }
    WineryOAuthComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.tryGetAccessToken()
            .subscribe(function (data) { return _this.handleLogin(data); });
    };
    WineryOAuthComponent.prototype.onButtonClicked = function () {
        if (!this.loggedIn) {
            this.service.login();
        }
        else {
            this.service.logout();
            this.loggedIn = false;
            this.buttonLabel = 'Login with GitHub';
        }
    };
    WineryOAuthComponent.prototype.handleLogin = function (loginData) {
        if (loginData.success) {
            this.loggedIn = true;
            this.buttonLabel = 'Logout as ' + loginData.userName;
        }
    };
    return WineryOAuthComponent;
}());
WineryOAuthComponent = __decorate([
    core_1.Component({
        selector: 'winery-oauth',
        templateUrl: 'wineryOAuth.component.html',
        providers: [
            wineryOAuth_service_1.WineryOAuthService,
        ]
    }),
    __metadata("design:paramtypes", [wineryOAuth_service_1.WineryOAuthService])
], WineryOAuthComponent);
exports.WineryOAuthComponent = WineryOAuthComponent;
//# sourceMappingURL=wineryOAuth.component.js.map