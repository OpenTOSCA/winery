"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var WineryComponent = (function () {
    function WineryComponent(name) {
        if (name === void 0) { name = ''; }
        this.documentation = null;
        this.any = null;
        this.otherAttributes = null;
        this.name = '';
        this.name = name;
    }
    return WineryComponent;
}());
exports.WineryComponent = WineryComponent;
var WineryTemplate = (function (_super) {
    __extends(WineryTemplate, _super);
    function WineryTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = null;
        _this.propertyConstraints = null;
        return _this;
    }
    WineryTemplate.prototype.setValuesFromPlan = function (plan) {
        this.name = plan.name;
        this.id = plan.id;
    };
    return WineryTemplate;
}(WineryComponent));
exports.WineryTemplate = WineryTemplate;
var WineryTemplateOrImplementationComponent = (function (_super) {
    __extends(WineryTemplateOrImplementationComponent, _super);
    function WineryTemplateOrImplementationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WineryTemplateOrImplementationComponent;
}(WineryTemplate));
exports.WineryTemplateOrImplementationComponent = WineryTemplateOrImplementationComponent;
var WineryInstance = (function (_super) {
    __extends(WineryInstance, _super);
    function WineryInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WineryInstance;
}(WineryComponent));
exports.WineryInstance = WineryInstance;
var ArtifactApiData = (function (_super) {
    __extends(ArtifactApiData, _super);
    function ArtifactApiData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ArtifactApiData;
}(WineryComponent));
exports.ArtifactApiData = ArtifactApiData;
var WineryTopologyTemplate = (function (_super) {
    __extends(WineryTopologyTemplate, _super);
    function WineryTopologyTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WineryTopologyTemplate;
}(WineryComponent));
exports.WineryTopologyTemplate = WineryTopologyTemplate;
var NodeTemplate = (function (_super) {
    __extends(NodeTemplate, _super);
    function NodeTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.requirements = null;
        _this.capabilities = null;
        _this.policies = null;
        _this.deploymentArtifacts = null;
        return _this;
    }
    return NodeTemplate;
}(WineryTemplate));
exports.NodeTemplate = NodeTemplate;
var RelationshipTemplates = (function (_super) {
    __extends(RelationshipTemplates, _super);
    function RelationshipTemplates() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.relationshipConstraing = null;
        return _this;
    }
    return RelationshipTemplates;
}(WineryTemplate));
exports.RelationshipTemplates = RelationshipTemplates;
var RelationshipElement = (function () {
    function RelationshipElement() {
    }
    return RelationshipElement;
}());
exports.RelationshipElement = RelationshipElement;
//# sourceMappingURL=wineryComponent.js.map