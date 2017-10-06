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
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var router_1 = require("@angular/router");
var WineryGitLogComponent = (function () {
    function WineryGitLogComponent(notify, router) {
        this.notify = notify;
        this.router = router;
        this.isExpanded = false;
        this.lfsAvailable = false;
        this.files = [];
        this.commitMsg = '';
        this.show = false;
    }
    WineryGitLogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.webSocket = new WebSocket('ws://' + location.hostname + ':8080/winery/git');
        this.webSocket.onopen = function (event) {
            _this.refreshLog();
            _this.show = true;
        };
        this.webSocket.onmessage = function (event) {
            switch (event.data) {
                case 'commit success': {
                    _this.notify.success('Commited: ' + _this.commitMsg);
                    _this.commitMsg = '';
                    _this.selectedFile = null;
                    break;
                }
                case 'commit failed': {
                    _this.notify.error('commit failed');
                    break;
                }
                case 'reset failed': {
                    _this.notify.error('winery-repository reset to last commit failed!');
                    break;
                }
                case 'reset success': {
                    _this.notify.success('winery-repository resetted to last commit');
                    _this.router.navigate(['/']);
                    break;
                }
                case 'git-lfs': {
                    _this.lfsAvailable = true;
                    console.log('true');
                    break;
                }
                default: {
                    _this.files = JSON.parse(event.data);
                    for (var i = 0; i < _this.files.length; i++) {
                        _this.files[i].name = decodeURIComponent(decodeURIComponent(_this.files[i].name));
                    }
                }
            }
        };
        this.webSocket.onclose = function (event) {
            _this.webSocket.close();
        };
    };
    WineryGitLogComponent.prototype.commit = function () {
        if (this.files === null || this.files.length === 0) {
            this.notify.error('A commit must contain at least one change!');
        }
        else if (this.commitMsg === '') {
            this.notify.error('Please enter a valid commit message!');
        }
        else {
            this.webSocket.send(this.commitMsg);
        }
    };
    WineryGitLogComponent.prototype.refreshLog = function () {
        this.webSocket.send('');
    };
    WineryGitLogComponent.prototype.doCommitMsgValueChange = function (data) {
        this.commitMsg = data.target.value;
    };
    WineryGitLogComponent.prototype.select = function (file) {
        if (this.selectedFile === file) {
            this.selectedFile = null;
        }
        else {
            this.selectedFile = file;
        }
    };
    WineryGitLogComponent.prototype.onExpand = function () {
        this.isExpanded = !this.isExpanded;
        this.selectedFile = null;
    };
    WineryGitLogComponent.prototype.discardChanges = function () {
        this.webSocket.send('reset');
        this.selectedFile = null;
    };
    WineryGitLogComponent.prototype.hide = function () {
        this.isExpanded = false;
    };
    return WineryGitLogComponent;
}());
__decorate([
    core_1.ViewChild('confirmDiscardModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], WineryGitLogComponent.prototype, "confirmDiscardModal", void 0);
WineryGitLogComponent = __decorate([
    core_1.Component({
        selector: 'winery-gitlog',
        templateUrl: 'wineryGitLog.component.html',
        styleUrls: [
            'wineryGitLog.component.css'
        ]
    }),
    __metadata("design:paramtypes", [wineryNotification_service_1.WineryNotificationService,
        router_1.Router])
], WineryGitLogComponent);
exports.WineryGitLogComponent = WineryGitLogComponent;
//# sourceMappingURL=wineryGitLog.component.js.map