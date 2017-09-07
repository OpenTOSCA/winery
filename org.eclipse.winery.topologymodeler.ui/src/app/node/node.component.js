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
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Josip Ledic - initial API and implementation, Refactoring to use Redux instead
 *     Thommy Zelenik - implementation, Refactoring
 */
var core_1 = require("@angular/core");
var NodeComponent = (function () {
    function NodeComponent(differsSelectedNodes, $ngRedux, actions) {
        var _this = this;
        this.$ngRedux = $ngRedux;
        this.actions = actions;
        this.items = ['Item 1', 'Item 2', 'Item 3'];
        this.accordionGroupPanel = 'accordionGroupPanel';
        this.customClass = 'customClass';
        this.longpress = false;
        this.makeSelectionVisible = false;
        this.bindMouseMove = function (ev) {
            _this.mouseMove(ev);
        };
        this.sendId = new core_1.EventEmitter();
        this.askForRepaint = new core_1.EventEmitter();
        this.setDragSource = new core_1.EventEmitter();
        this.closedEndpoint = new core_1.EventEmitter();
        this.checkFocusNode = new core_1.EventEmitter();
    }
    NodeComponent.prototype.addItem = function () {
        this.items.push("Items " + (this.items.length + 1));
    };
    NodeComponent.prototype.ngOnInit = function () {
    };
    NodeComponent.prototype.ngAfterViewInit = function () {
        this.sendId.emit(this.title);
    };
    NodeComponent.prototype.repaint = function ($event) {
        var _this = this;
        $event.stopPropagation();
        setTimeout(function () { return _this.askForRepaint.emit(); }, 1);
    };
    NodeComponent.prototype.trackTimeOfMouseDown = function ($event) {
        var _this = this;
        this.startTime = new Date().getTime();
        var focusNodeData = {
            id: this.title,
            ctrlKey: $event.ctrlKey
        };
        this.checkFocusNode.emit(focusNodeData);
        if ($event.srcElement.parentElement.className !== 'accordion-toggle') {
            if (!$event.ctrlKey) {
                this.connectorEndpointVisible = !this.connectorEndpointVisible;
            }
            this.zone.runOutsideAngular(function () {
                document.getElementById(_this.title).addEventListener('mousemove', _this.bindMouseMove);
            });
        }
    };
    NodeComponent.prototype.mouseMove = function ($event) {
        this.connectorEndpointVisible = false;
    };
    NodeComponent.prototype.trackTimeOfMouseUp = function ($event) {
        document.getElementById(this.title).removeEventListener('mousemove', this.bindMouseMove);
        this.endTime = new Date().getTime();
        this.testTimeDifference($event);
    };
    NodeComponent.prototype.ngOnChanges = function () {
        return true;
    };
    NodeComponent.prototype.ngOnChanges = function () {
        return true;
    };
    NodeComponent.prototype.testTimeDifference = function () {
        if ((this.endTime - this.startTime) < 250) {
            this.longpress = false;
        }
        else if (this.endTime - this.startTime >= 300) {
            this.longpress = true;
        }
    };
    NodeComponent.prototype.makeSource = function ($event) {
        var dragSourceInfo = {
            dragSource: this.dragSource,
            nodeId: this.title
        };
        this.setDragSource.emit(dragSourceInfo);
    };
    NodeComponent.prototype.showConnectorEndpoint = function ($event) {
        $event.stopPropagation();
        if ($event.ctrlKey) {
        }
        else {
            if (!this.longpress) {
                if (this.connectorEndpointVisible === true) {
                    this.closedEndpoint.emit('set no more drag sources');
                }
            }
        }
    };
    // Only display the sidebar if the click is no longpress
    NodeComponent.prototype.openSidebar = function ($event) {
        $event.stopPropagation();
        // close sidebar when longpressing a node template
        if (this.longpress) {
            this.$ngRedux.dispatch(this.actions.openSidebar({
                sidebarContents: {
                    sidebarVisible: false,
                    nodeId: '',
                    nameTextFieldValue: ''
                }
            }));
        }
        else {
            this.$ngRedux.dispatch(this.actions.openSidebar({
                sidebarContents: {
                    sidebarVisible: true,
                    nodeId: this.title,
                    nameTextFieldValue: this.name
                }
            }));
        }
    };
    // Only display the sidebar if the click is no longpress
    NodeComponent.prototype.openSidebar = function ($event) {
        $event.stopPropagation();
        // close sidebar when longpressing a node template
        if (this.longpress) {
            this.$ngRedux.dispatch(this.actions.openSidebar({
                sidebarContents: {
                    sidebarVisible: false,
                    nodeId: '',
                    nameTextFieldValue: ''
                }
            }));
        }
        else {
            this.$ngRedux.dispatch(this.actions.openSidebar({
                sidebarContents: {
                    sidebarVisible: true,
                    nodeId: this.title,
                    nameTextFieldValue: this.name
                }
            }));
        }
    };
    return NodeComponent;
}());
__decorate([
    core_1.Input()
], NodeComponent.prototype, "needsToBeFlashed", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "title", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "name", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "left", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "top", void 0);
__decorate([
    core_1.Output()
], NodeComponent.prototype, "sendId", void 0);
__decorate([
    core_1.Output()
], NodeComponent.prototype, "askForRepaint", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "nodeColor", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "nodeImageUrl", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "dragSource", void 0);
__decorate([
    core_1.Input()
], NodeComponent.prototype, "navbarButtonsState", void 0);
__decorate([
    core_1.Output()
], NodeComponent.prototype, "setDragSource", void 0);
__decorate([
    core_1.Output()
], NodeComponent.prototype, "closedEndpoint", void 0);
__decorate([
    core_1.Output()
], NodeComponent.prototype, "checkFocusNode", void 0);
NodeComponent = __decorate([
    core_1.Component({
        selector: 'winery-node',
        templateUrl: './node.component.html',
        styleUrls: ['./node.component.css'],
    })
], NodeComponent);
exports.NodeComponent = NodeComponent;
