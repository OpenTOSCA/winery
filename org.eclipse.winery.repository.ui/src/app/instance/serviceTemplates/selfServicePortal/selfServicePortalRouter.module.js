"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var selfServicePortalDescription_component_1 = require("./selfServicePortalDescription.component");
var selfServicePortalImages_component_1 = require("./selfServicePortalImages.component");
var selfServicePortalOptions_component_1 = require("./selfServicePortalOptions.component");
var editXML_component_1 = require("../../sharedComponents/editXML/editXML.component");
exports.selfServiceRoutes = [
    {
        path: 'description',
        component: selfServicePortalDescription_component_1.SelfServiceDescriptionComponent
    },
    {
        path: 'images',
        component: selfServicePortalImages_component_1.SelfServicePortalImagesComponent
    },
    {
        path: 'options',
        component: selfServicePortalOptions_component_1.SelfServicePortalOptionsComponent
    },
    {
        path: 'xml',
        component: editXML_component_1.EditXMLComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'description'
    }
];
var SelfServiceRoutingModule = (function () {
    function SelfServiceRoutingModule() {
    }
    return SelfServiceRoutingModule;
}());
SelfServiceRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            router_1.RouterModule.forChild(exports.selfServiceRoutes)
        ],
        exports: [router_1.RouterModule],
        declarations: [],
        providers: [],
    })
], SelfServiceRoutingModule);
exports.SelfServiceRoutingModule = SelfServiceRoutingModule;
//# sourceMappingURL=selfServicePortalRouter.module.js.map