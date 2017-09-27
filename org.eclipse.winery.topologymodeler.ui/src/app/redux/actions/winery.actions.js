"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WineryActions = WineryActions_1 = (function () {
    function WineryActions() {
        this.sendPaletteOpened = (function (paletteOpened) { return ({
            type: WineryActions_1.SEND_PALETTE_OPENED,
            paletteOpened: paletteOpened
        }); });
        this.openSidebar = (function (newSidebarData) { return ({
            type: WineryActions_1.OPEN_SIDEBAR,
            sidebarContents: newSidebarData.sidebarContents
        }); });
        this.changeNodeName = (function (nodeNames) { return ({
            type: WineryActions_1.CHANGE_NODE_NAME,
            nodeNames: nodeNames.nodeNames
        }); });
        this.saveNodeTemplate = (function (newNode) { return ({
            type: WineryActions_1.SAVE_NODE_TEMPLATE,
            nodeTemplate: newNode
        }); });
        this.saveRelationship = (function (newRelationship) { return ({
            type: WineryActions_1.SAVE_RELATIONSHIP,
            relationshipTemplate: newRelationship
        }); });
    }
    return WineryActions;
}());
WineryActions.SEND_PALETTE_OPENED = 'SEND_PALETTE_OPENED';
WineryActions.OPEN_SIDEBAR = 'OPEN_SIDEBAR';
WineryActions.SAVE_NODE_TEMPLATE = 'SAVE_NODE_TEMPLATE';
WineryActions.SAVE_RELATIONSHIP = 'SAVE_RELATIONSHIP';
WineryActions.CHANGE_NODE_NAME = 'CHANGE_NODE_NAME';
WineryActions = WineryActions_1 = __decorate([
    core_1.Injectable()
], WineryActions);
exports.WineryActions = WineryActions;
var WineryActions_1;
