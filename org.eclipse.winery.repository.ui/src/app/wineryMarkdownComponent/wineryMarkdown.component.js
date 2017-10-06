/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
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
var core_1 = require("@angular/core");
var angular2_markdown_1 = require("angular2-markdown");
var WineryMarkdownComponent = (function () {
    function WineryMarkdownComponent(_markdown) {
        this._markdown = _markdown;
        this.markdownContent = '';
    }
    WineryMarkdownComponent.prototype.ngOnInit = function () {
        this._markdown.setMarkedOptions({});
        this._markdown.setMarkedOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
        this._markdown.renderer.table = function (header, body) {
            return "\n        <table class=\"table2\">\n          <thead>\n            " + header + "\n          </thead>\n          <tbody>\n            " + body + "\n          </tbody>\n        </table>\n        ";
        };
        this._markdown.renderer.blockquote = function (quote) {
            return "<blockquote class=\"king-quote\">" + quote + "</blockquote>";
        };
    };
    return WineryMarkdownComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryMarkdownComponent.prototype, "markdownContent", void 0);
WineryMarkdownComponent = __decorate([
    core_1.Component({
        selector: 'winery-markdown',
        encapsulation: core_1.ViewEncapsulation.None,
        templateUrl: './wineryMarkdown.component.html',
        providers: [],
        styleUrls: ['wineryMarkdown.component.css'],
    }),
    __metadata("design:paramtypes", [angular2_markdown_1.MarkdownService])
], WineryMarkdownComponent);
exports.WineryMarkdownComponent = WineryMarkdownComponent;
//# sourceMappingURL=wineryMarkdown.component.js.map