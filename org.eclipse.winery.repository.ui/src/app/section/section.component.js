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
var selectData_1 = require("../wineryInterfaces/selectData");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var wineryDuplicateValidator_directive_1 = require("../wineryValidators/wineryDuplicateValidator.directive");
var section_service_1 = require("./section.service");
var configuration_1 = require("../configuration");
var util_1 = require("util");
var forms_1 = require("@angular/forms");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var enums_1 = require("../wineryInterfaces/enums");
var utils_1 = require("../wineryUtils/utils");
var showAll = 'Show all Items';
var showGrouped = 'Group by Namespace';
var SectionComponent = (function () {
    function SectionComponent(route, change, router, service, notify) {
        this.route = route;
        this.change = change;
        this.router = router;
        this.service = service;
        this.notify = notify;
        this.loading = true;
        this.toscaTypes = enums_1.ToscaTypes;
        this.filterString = '';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.showNamespace = 'all';
        this.changeViewButtonTitle = showGrouped;
        this.newComponentSelectedType = new selectData_1.SelectData();
        this.fileUploadUrl = configuration_1.backendBaseURL + '/';
    }
    /**
     * @override
     *
     * Subscribe to the url on initialisation in order to get the corresponding resource type.
     */
    SectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.routeSub = this.route
            .data
            .subscribe(function (data) { return _this.handleResolverData(data); }, function (error) { return _this.handleError(error); });
    };
    SectionComponent.prototype.ngOnDestroy = function () {
        this.routeSub.unsubscribe();
    };
    SectionComponent.prototype.onChangeView = function () {
        if (this.showNamespace === 'group') {
            this.changeViewButtonTitle = showGrouped;
            this.showNamespace = 'all';
        }
        else {
            this.changeViewButtonTitle = showAll;
            this.showNamespace = 'group';
        }
        localStorage.setItem(this.toscaType + '_showNamespace', this.showNamespace);
    };
    SectionComponent.prototype.onAdd = function () {
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.componentData, 'id');
        // This is needed for the modal to correctly display the selected namespace
        this.newComponentNamespace = '';
        this.change.detectChanges();
        this.addComponentForm.reset();
        this.newComponentNamespace = (this.showNamespace !== 'all' && this.showNamespace !== 'group') ? this.showNamespace : '';
        this.newComponentSelectedType = this.types ? this.types[0].children[0] : null;
        this.addModal.show();
    };
    SectionComponent.prototype.typeSelected = function (event) {
        this.newComponentSelectedType = event;
    };
    SectionComponent.prototype.addComponent = function () {
        var _this = this;
        var compType = this.newComponentSelectedType ? this.newComponentSelectedType.id : null;
        this.service.createComponent(this.newComponentName, this.newComponentNamespace, compType)
            .subscribe(function (data) { return _this.handleSaveSuccess(); }, function (error) { return _this.handleError(error); });
    };
    SectionComponent.prototype.showSpecificNamespaceOnly = function () {
        return !(this.showNamespace === 'group' || this.showNamespace === 'all');
    };
    SectionComponent.prototype.getSectionsData = function () {
        var _this = this;
        var url = '/' + this.toscaType;
        if (this.toscaType === enums_1.ToscaTypes.Imports) {
            url += '/' + encodeURIComponent(encodeURIComponent(this.importXsdSchemaType));
        }
        this.service.getSectionData(url)
            .subscribe(function (res) { return _this.handleData(res); }, function (error) { return _this.handleError(error); });
    };
    SectionComponent.prototype.onPageChange = function (page) {
        this.currentPage = page;
    };
    SectionComponent.prototype.onRemoveElement = function () {
    };
    /**
     * Handle the resolved data.
     * @param data needs to be of type any because there is no specific type specified by angular
     */
    SectionComponent.prototype.handleResolverData = function (data) {
        var resolved = data.resolveData;
        this.toscaType = resolved.section;
        this.importXsdSchemaType = resolved.xsdSchemaType;
        var storedNamespace = localStorage.getItem(this.toscaType + '_showNamespace') !== null ?
            localStorage.getItem(this.toscaType + '_showNamespace') : 'all';
        this.showNamespace = resolved.namespace ? resolved.namespace : storedNamespace;
        this.types = null;
        this.service.setPath(resolved.path);
        this.getSectionsData();
    };
    SectionComponent.prototype.handleData = function (resources) {
        var _this = this;
        this.componentData = resources;
        if (!this.showSpecificNamespaceOnly() && (this.componentData.length > 50)) {
            this.showNamespace = 'group';
            this.changeViewButtonTitle = showAll;
        }
        else if (!this.showSpecificNamespaceOnly()) {
            if (this.showNamespace === 'group') {
                this.changeViewButtonTitle = showAll;
            }
            else {
                this.changeViewButtonTitle = showGrouped;
            }
        }
        else {
            this.changeViewButtonTitle = showGrouped;
        }
        var typesUrl = utils_1.Utils.getImplementationOrTemplateOfType(this.toscaType);
        if (!util_1.isNullOrUndefined(typesUrl)) {
            this.service.getSectionData('/' + typesUrl + '?grouped=angularSelect')
                .subscribe(function (data) { return _this.handleTypes(data); }, function (error) { return _this.handleError(error); });
        }
        else {
            this.loading = false;
        }
    };
    SectionComponent.prototype.handleTypes = function (types) {
        this.loading = false;
        this.types = types.length > 0 ? types : null;
    };
    SectionComponent.prototype.handleSaveSuccess = function () {
        this.newComponentName = this.newComponentName.replace(/\s/g, '_');
        this.notify.success('Successfully saved component ' + this.newComponentName);
        this.router.navigateByUrl('/' + this.toscaType + '/'
            + encodeURIComponent(encodeURIComponent(this.newComponentNamespace)) + '/'
            + this.newComponentName);
    };
    SectionComponent.prototype.handleError = function (error) {
        this.loading = false;
        this.notify.error(error.toString());
    };
    return SectionComponent;
}());
__decorate([
    core_1.ViewChild('addModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], SectionComponent.prototype, "addModal", void 0);
__decorate([
    core_1.ViewChild('removeElementModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], SectionComponent.prototype, "removeElementModal", void 0);
__decorate([
    core_1.ViewChild('addComponentForm'),
    __metadata("design:type", forms_1.NgForm)
], SectionComponent.prototype, "addComponentForm", void 0);
__decorate([
    core_1.ViewChild('addCsarModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], SectionComponent.prototype, "addCsarModal", void 0);
SectionComponent = __decorate([
    core_1.Component({
        selector: 'winery-section-component',
        templateUrl: 'section.component.html',
        styleUrls: [
            'section.component.css'
        ],
        providers: [
            section_service_1.SectionService,
        ]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        core_1.ChangeDetectorRef,
        router_1.Router,
        section_service_1.SectionService,
        wineryNotification_service_1.WineryNotificationService])
], SectionComponent);
exports.SectionComponent = SectionComponent;
//# sourceMappingURL=section.component.js.map