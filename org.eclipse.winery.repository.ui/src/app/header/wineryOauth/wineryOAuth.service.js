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
var http_1 = require("@angular/http");
var wineryNotification_service_1 = require("../../wineryNotificationModule/wineryNotification.service");
var util_1 = require("util");
var utils_1 = require("../../wineryUtils/utils");
var router_1 = require("@angular/router");
var configuration_1 = require("../../configuration");
var Observable_1 = require("rxjs/Observable");
/**
 * This service provides OAuth login service. If the credentials are not set, it defaults
 * to login with GitHub.
 */
var WineryOAuthService = (function () {
    function WineryOAuthService(http, activatedRoute, notify) {
        this.http = http;
        this.activatedRoute = activatedRoute;
        this.notify = notify;
        this.clientId = 'b106f7f4e3393fad0529';
        this.loginUrl = 'https://github.com/login/oauth/authorize';
        this.redirectUri = '';
        this.scope = 'repo';
        this.alwaysUseCurrentUrlAsRedirect = true;
        this.storage = localStorage;
    }
    /**
     * Tries to parse the code and the state from the url parameters and continues
     * the login process in order to get the <code>accessToken</code>.
     */
    WineryOAuthService.prototype.tryGetAccessToken = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.observer = observer;
            if (!util_1.isNullOrUndefined(_this.storage.getItem(StorageElements.accessToken))) {
                _this.getUserInformation();
            }
            else if (util_1.isNullOrUndefined(_this.storage.getItem(StorageElements.state))) {
                observer.next({ success: false });
                observer.complete();
            }
            else {
                var subscription = _this.activatedRoute.queryParams
                    .subscribe(function (params) { return _this.parseParamsAndGetToken(params); });
            }
        });
    };
    /**
     * Initiates the login with the provider:
     *  - user needs to login at provider
     *  - user needs to approve the requested scopes
     */
    WineryOAuthService.prototype.login = function () {
        this.logout();
        this.storage.setItem(StorageElements.state, utils_1.Utils.generateRandomString());
        if (this.alwaysUseCurrentUrlAsRedirect) {
            this.redirectUri = location.origin + location.pathname;
        }
        location.href = this.loginUrl
            + '?client_id=' + encodeURIComponent(this.clientId)
            + '&state=' + encodeURIComponent(this.storage.getItem(StorageElements.state))
            + '&redirect_uri=' + encodeURIComponent(this.redirectUri)
            + '&scope=' + encodeURIComponent(this.scope);
    };
    /**
     * Logs the user out by deleting all saved key values paris in the local storage.
     */
    WineryOAuthService.prototype.logout = function () {
        this.storage.removeItem(StorageElements.state);
        this.storage.removeItem(StorageElements.accessToken);
        this.storage.removeItem(StorageElements.tokenType);
        this.storage.removeItem(StorageElements.userName);
    };
    WineryOAuthService.prototype.getUserInformation = function () {
        var _this = this;
        if (util_1.isNullOrUndefined(this.storage.getItem(StorageElements.accessToken))) {
            this.observer.next({ success: false });
            this.observer.complete();
            return;
        }
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.set('Accept', 'application/json');
        this.http.get('https://api.github.com/user?access_token=' + this.storage.getItem(StorageElements.accessToken), options)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { return _this.handleUserInformation(data); }, function (error) { return _this.handleError(error); });
    };
    WineryOAuthService.prototype.parseParamsAndGetToken = function (params) {
        var _this = this;
        if (!util_1.isNullOrUndefined(params['code']) && !util_1.isNullOrUndefined(params['state'])) {
            if (params['state'] === this.storage.getItem(StorageElements.state)) {
                var headers = new http_1.Headers();
                var options = new http_1.RequestOptions({ headers: headers });
                headers.set('Content-Type', 'application/json');
                var payload = {
                    code: params['code'],
                    state: params['state']
                };
                this.http.post(configuration_1.backendBaseURL + '/admin/githubaccesstoken', payload, options)
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) { return _this.processAccessToken(data); }, function (error) { return _this.handleError(error); });
            }
            else {
                this.observer.error(false);
                this.notify.error('States are different! Login could not be completed!');
            }
        }
    };
    WineryOAuthService.prototype.processAccessToken = function (token) {
        this.storage.setItem(StorageElements.accessToken, token.access_token);
        this.storage.setItem(StorageElements.tokenType, token.token_type);
        this.getUserInformation();
    };
    WineryOAuthService.prototype.handleUserInformation = function (data) {
        this.storage.setItem(StorageElements.userName, data.name);
        this.observer.next({ success: true, userName: data.name });
        this.observer.complete();
    };
    WineryOAuthService.prototype.handleError = function (error) {
        this.observer.error('An error happened in the communication with GitHub.');
        this.observer.complete();
        this.notify.error('Login failed!');
        this.logout();
    };
    Object.defineProperty(WineryOAuthService.prototype, "accessToken", {
        get: function () {
            return this.storage.getItem(StorageElements.accessToken);
        },
        enumerable: true,
        configurable: true
    });
    return WineryOAuthService;
}());
WineryOAuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.ActivatedRoute,
        wineryNotification_service_1.WineryNotificationService])
], WineryOAuthService);
exports.WineryOAuthService = WineryOAuthService;
var StorageElements;
(function (StorageElements) {
    StorageElements[StorageElements["state"] = 'state'] = "state";
    StorageElements[StorageElements["accessToken"] = 'accessToken'] = "accessToken";
    StorageElements[StorageElements["tokenType"] = 'tokenType'] = "tokenType";
    StorageElements[StorageElements["userName"] = 'name'] = "userName";
})(StorageElements || (StorageElements = {}));
//# sourceMappingURL=wineryOAuth.service.js.map