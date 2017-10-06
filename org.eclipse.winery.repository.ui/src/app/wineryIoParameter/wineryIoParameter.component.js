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
 */
var core_1 = require("@angular/core");
var parameters_1 = require("../wineryInterfaces/parameters");
var wineryDuplicateValidator_directive_1 = require("../wineryValidators/wineryDuplicateValidator.directive");
var enums_1 = require("../wineryInterfaces/enums");
var wineryNotification_service_1 = require("../wineryNotificationModule/wineryNotification.service");
var forms_1 = require("@angular/forms");
var ngx_bootstrap_1 = require("ngx-bootstrap");
/**
 * This component provides two tables for adding and removing input and output parameters as they are used for example
 * in the {@link InterfacesComponent}. Therefore you need to specify the arrays containing the input/output parameters
 * as an {@link InterfaceParameter} array. Additionally, there are some events which fire upon adding/removing elements.
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>inputParameters</code> the array for the input parameters. It must be of type {@link InterfaceParameter}.
 *     </li>
 *     <li><code>outputParameters</code> the array for the output parameters. It must be of type {@link InterfaceParameter}.
 *     </li>
 * </ul>
 *
 * <label>Outputs</label>
 * <ul>
 *     <li><code>inputParameterAdded</code> fires upon adding a input parameter to the table. It also contains the
 *     added element which is of type {@link InterfaceParameter}..
 *     </li>
 *     <li><code>outputParameterAdded</code> fires upon adding a output parameter to the table. It also contains the
 *     added element which is of type {@link InterfaceParameter}..
 *     </li>
 *     <li><code>inputParameterRemoved</code> fires upon removing a input parameter from the table. It also contains the
 *     removed element which is of type {@link InterfaceParameter}.
 *     </li>
 *     <li><code>outputParameterRemoved</code> fires upon removing a output parameter from the table. It also contains the
 *     removed element which is of type {@link InterfaceParameter}.
 *     </li>
 * </ul>
 *
 * @example <caption>Minimalistic example:</caption>
 * ```
 * <winery-io-parameter [inputParameters]="newPlan.inputParameters.inputParameter"
 *                      [outputParameters]="newPlan.outputParameters.outputParameter">
 * </winery-io-parameter>
 * ```
 */
var WineryIoParameterComponent = (function () {
    function WineryIoParameterComponent(notify) {
        this.notify = notify;
        this.inputParameterAdded = new core_1.EventEmitter();
        this.outputParameterAdded = new core_1.EventEmitter();
        this.inputParameterRemoved = new core_1.EventEmitter();
        this.outputParameterRemoved = new core_1.EventEmitter();
        this.columns = [
            { title: 'Name', name: 'name', sort: true },
            { title: 'Type', name: 'type', sort: true },
            { title: 'Required', name: 'required', sort: false }
        ];
    }
    // region ########## Input Parameters ##########
    WineryIoParameterComponent.prototype.addInputParam = function () {
        this.modalTitle = 'Input Parameter';
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.inputParameters, 'name');
        this.parameterForm.reset();
        this.addIntParametersModal.show();
    };
    WineryIoParameterComponent.prototype.onAddInputParam = function (name, type, required) {
        var item = new parameters_1.InterfaceParameter(name, type, required ? enums_1.YesNoEnum.YES : enums_1.YesNoEnum.NO);
        this.inputParameters.push(item);
        this.inputParameterAdded.emit(item);
    };
    WineryIoParameterComponent.prototype.onInputParameterSelected = function (selectedInput) {
        this.selectedInputParameter = selectedInput;
    };
    WineryIoParameterComponent.prototype.removeInputParameter = function () {
        this.modalTitle = 'Remove Input Parameter';
        this.elementToRemove = this.selectedInputParameter.name;
        this.removeElementModal.show();
    };
    WineryIoParameterComponent.prototype.onRemoveInputParameter = function () {
        this.inputParameters.splice(this.inputParameters.indexOf(this.selectedInputParameter));
        this.inputParameterRemoved.emit(this.selectedInputParameter);
        this.selectedInputParameter = null;
    };
    // endregion
    // region ########## Output Parameters ##########
    WineryIoParameterComponent.prototype.addOutputParam = function () {
        this.modalTitle = 'Output Parameter';
        this.validatorObject = new wineryDuplicateValidator_directive_1.WineryValidatorObject(this.outputParameters, 'name');
        this.parameterForm.reset();
        this.addIntParametersModal.show();
    };
    WineryIoParameterComponent.prototype.onAddOutputParam = function (name, type, required) {
        var item = new parameters_1.InterfaceParameter(name, type, required ? enums_1.YesNoEnum.YES : enums_1.YesNoEnum.NO);
        this.outputParameters.push(item);
        this.outputParameterAdded.emit(item);
    };
    WineryIoParameterComponent.prototype.onOutputParameterSelected = function (selectedOutput) {
        this.selectedOutputParameter = selectedOutput;
    };
    WineryIoParameterComponent.prototype.removeOutputParameter = function () {
        this.modalTitle = 'Remove Output Parameter';
        this.elementToRemove = this.selectedOutputParameter.name;
        this.removeElementModal.show();
    };
    WineryIoParameterComponent.prototype.onRemoveOutputParameter = function () {
        this.outputParameters.splice(this.outputParameters.indexOf(this.selectedOutputParameter));
        this.outputParameterRemoved.emit(this.selectedOutputParameter);
        this.selectedOutputParameter = null;
    };
    // endregion
    WineryIoParameterComponent.prototype.onRemoveElement = function () {
        switch (this.modalTitle) {
            case 'Remove Input Parameter':
                this.onRemoveInputParameter();
                break;
            case 'Remove Output Parameter':
                this.onRemoveOutputParameter();
                break;
            default:
                this.notify.error('Couldn\'t remove element!');
        }
    };
    return WineryIoParameterComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], WineryIoParameterComponent.prototype, "inputParameters", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], WineryIoParameterComponent.prototype, "outputParameters", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryIoParameterComponent.prototype, "inputParameterAdded", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryIoParameterComponent.prototype, "outputParameterAdded", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryIoParameterComponent.prototype, "inputParameterRemoved", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryIoParameterComponent.prototype, "outputParameterRemoved", void 0);
__decorate([
    core_1.ViewChild('addIntParametersModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], WineryIoParameterComponent.prototype, "addIntParametersModal", void 0);
__decorate([
    core_1.ViewChild('removeElementModal'),
    __metadata("design:type", ngx_bootstrap_1.ModalDirective)
], WineryIoParameterComponent.prototype, "removeElementModal", void 0);
__decorate([
    core_1.ViewChild('parameterForm'),
    __metadata("design:type", forms_1.NgForm)
], WineryIoParameterComponent.prototype, "parameterForm", void 0);
WineryIoParameterComponent = __decorate([
    core_1.Component({
        selector: 'winery-io-parameter',
        templateUrl: './wineryIoParameter.component.html'
    }),
    __metadata("design:paramtypes", [wineryNotification_service_1.WineryNotificationService])
], WineryIoParameterComponent);
exports.WineryIoParameterComponent = WineryIoParameterComponent;
//# sourceMappingURL=wineryIoParameter.component.js.map