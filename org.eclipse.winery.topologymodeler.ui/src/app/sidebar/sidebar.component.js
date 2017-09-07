"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
var animations_1 = require("@angular/animations");
var SidebarComponent = (function () {
    function SidebarComponent($ngRedux, actions) {
        this.$ngRedux = $ngRedux;
        this.actions = actions;
        this.nodeNameKeyUp = new Subject_1.Subject();
    }
    SidebarComponent.prototype.closeSidebar = function () {
        this.$ngRedux.dispatch(this.actions.openSidebar({
            sidebarContents: {
                sidebarVisible: false,
                nodeId: '',
                nameTextFieldValue: ''
            }
        }));
    };
    ;
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sidebarSubscription = this.$ngRedux.select(function (state) { return state.wineryState.sidebarContents; })
            .subscribe(function (newValue) {
            _this.sidebarState = newValue;
            if (newValue.sidebarVisible) {
                _this.sidebarAnimationStatus = 'in';
            }
        });
        this.nodeTemplateSubscription = this.$ngRedux.select(function (state) { return state.wineryState.currentJsonTopology.nodeTemplates; })
            .subscribe(function (nodeTemplates) {
        });
        // apply changes to the node name <input> field with a debounceTime of 300ms
        var nodeNameKeyupObservable = this.nodeNameKeyUp
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(function (data) {
            _this.$ngRedux.dispatch(_this.actions.changeNodeName({
                nodeNames: {
                    oldNodeName: _this.sidebarState.nameTextFieldValue,
                    newNodeName: data
                }
            }));
            // refresh
            _this.$ngRedux.dispatch(_this.actions.openSidebar({
                sidebarContents: {
                    sidebarVisible: true,
                    nodeId: _this.sidebarState.nodeId,
                    nameTextFieldValue: data
                }
            }));
        });
    };
    SidebarComponent.prototype.minInstancesChanged = function () {
    };
    SidebarComponent.prototype.maxInstancesChanged = function () {
    };
    return SidebarComponent;
}());
SidebarComponent = __decorate([
    core_1.Component({
        selector: 'winery-sidebar',
        templateUrl: './sidebar.component.html',
        styleUrls: ['./sidebar.component.css'],
        animations: [
            animations_1.trigger('sidebarAnimationStatus', [
                animations_1.state('in', animations_1.style({ transform: 'translateX(0)' })),
                animations_1.transition('void => *', [
                    animations_1.style({ transform: 'translateX(100%)' }),
                    animations_1.animate('100ms cubic-bezier(0.86, 0, 0.07, 1)')
                ]),
                animations_1.transition('* => void', [
                    animations_1.animate('200ms cubic-bezier(0.86, 0, 0.07, 1)', animations_1.style({
                        opacity: 0,
                        transform: 'translateX(100%)'
                    }))
                ])
            ])
        ]
    })
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
