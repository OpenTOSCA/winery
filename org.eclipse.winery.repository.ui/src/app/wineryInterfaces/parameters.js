"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputParameters = (function () {
    function InputParameters() {
        this.inputParameter = [];
    }
    return InputParameters;
}());
exports.InputParameters = InputParameters;
var OutputParameters = (function () {
    function OutputParameters() {
        this.outputParameter = [];
    }
    return OutputParameters;
}());
exports.OutputParameters = OutputParameters;
var InterfaceParameter = (function () {
    function InterfaceParameter(name, type, required) {
        this.name = name;
        this.type = type;
        this.required = required;
    }
    return InterfaceParameter;
}());
exports.InterfaceParameter = InterfaceParameter;
//# sourceMappingURL=parameters.js.map