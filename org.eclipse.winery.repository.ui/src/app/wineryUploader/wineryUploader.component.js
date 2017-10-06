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
 *     Niko Stadelmaier - module refactoring
 */
var core_1 = require("@angular/core");
var util_1 = require("util");
var wineryUploader_service_1 = require("./wineryUploader.service");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
/**
 * This component provides a modal popup with a <code>title</code> and optional progress bar <code>showProgress</code> for file uploads.
 * The file will be uploaded to the given <code>uploadUrl</code>.
 *
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>uploadUrl: string</code> the target destination for the upload - should be a valid url
 *     It can either ba string in the template or a property of type string of the component
 *     </li>
 *     <li><code>showProgress: boolean</code> either shows or hides the progress of the upload. It is shown by default.
 *     </li>
 *     <li><code>modalRef</code> The reference to the modal.
 *     </li>
 *     <li><code>uploadImmediately</code> This flag is set to true by default. If no immediate upload is desired, you can
 *     set this to false. However, if set to false, you need to call the upload method yourself.
 *     </li>
 *     <li><code>uploadMethod</code> Specifies the http method used to upload the file. By default POST is used.
 *     </li>
 *     <li><code>allowMultipleFiles</code> This parameter specifies whether multiple files can be selected. False by default.
 *     </li>
 * </ul>
 * <br>
 * <br>
 * @example <caption>Basic usage with url in template</caption>
 * ```html
 * <winery-uploader
 *      [uploadUrl]="'http://upload.to.server'"
 *      [showProgress]="true">
 * </winery-uploader>
 * ```
 */
var WineryUploaderComponent = (function () {
    function WineryUploaderComponent(service, notify) {
        this.service = service;
        this.notify = notify;
        this.fileOver = false;
        this.loading = false;
        this.showProgress = true;
        this.modalRef = null;
        this.uploadImmediately = true;
        this.uploadMethod = 'POST';
        this.allowMultipleFiles = false;
        this.onFileDropped = new core_1.EventEmitter();
        this.onSuccess = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
    }
    WineryUploaderComponent.prototype.ngOnInit = function () {
        this.service.uploadMethod = this.uploadMethod;
        this.service.uploadUrl = this.uploadUrl;
    };
    WineryUploaderComponent.prototype.ngOnChanges = function () {
        this.service.uploadUrl = this.uploadUrl;
    };
    WineryUploaderComponent.prototype.dropFile = function (event) {
        if (!util_1.isNullOrUndefined(event) && util_1.isNullOrUndefined(this.service.uploader.queue[0])) {
            this.fileOver = event;
        }
        else {
            this.fileOver = false;
            this.onFileDropped.emit(this.service.uploader.queue[0]);
            if (this.uploadImmediately) {
                this.upload();
            }
        }
    };
    WineryUploaderComponent.prototype.upload = function (uploadTo) {
        var _this = this;
        this.loading = true;
        if (!util_1.isNullOrUndefined(uploadTo) && uploadTo !== this.uploadUrl) {
            this.service.uploadUrl = uploadTo;
        }
        this.service.uploader.onCompleteItem = function (item, response, status, headers) {
            _this.loading = false;
            if (status >= 200 && status <= 204) {
                _this.notify.success('Successfully uploaded file ' + item.file.name);
                if (!util_1.isNullOrUndefined(_this.modalRef)) {
                    _this.modalRef.hide();
                }
                _this.onSuccess.emit();
            }
            else {
                _this.notify.error('Error while uploading file ' + item.file.name);
                _this.onError.emit(new Error('Error while uploading file ' + item.file.name));
            }
            return { item: item, response: response, status: status, headers: headers };
        };
        this.service.uploader.onCompleteAll = function () {
            _this.service.uploader.clearQueue();
        };
        this.service.uploader.uploadAll();
    };
    return WineryUploaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryUploaderComponent.prototype, "uploadUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "showProgress", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "modalRef", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "uploadImmediately", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "uploadMethod", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "allowMultipleFiles", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "onFileDropped", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "onSuccess", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryUploaderComponent.prototype, "onError", void 0);
WineryUploaderComponent = __decorate([
    core_1.Component({
        selector: 'winery-uploader',
        templateUrl: 'wineryUploader.component.html',
        styleUrls: [
            'wineryUploader.component.css'
        ],
        providers: [wineryUploader_service_1.WineryUploaderService],
    }),
    __metadata("design:paramtypes", [wineryUploader_service_1.WineryUploaderService,
        wineryNotification_service_1.WineryNotificationService])
], WineryUploaderComponent);
exports.WineryUploaderComponent = WineryUploaderComponent;
//# sourceMappingURL=wineryUploader.component.js.map