/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *******************************************************************************/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionService } from '../section/section.service';
import { InheritanceService } from '../instance/sharedComponents/inheritance/inheritance.service';
import { TooltipConfig } from 'ngx-bootstrap';
import { getToolTip } from '../wineryAddComponentModule/addComponent.component';
import { AddComponentValidation } from '../wineryAddComponentModule/addComponentValidation';
import { isNullOrUndefined } from 'util';
import { WineryVersion } from '../model/wineryVersion';
import { SelectData } from '../model/selectData';
import { SectionData } from '../section/sectionData';
import { ToscaTypes } from '../model/enums';
import { WineryNotificationService } from '../wineryNotificationModule/wineryNotification.service';

@Component({
    selector: 'winery-add-component-data-component',
    templateUrl: 'addComponentData.component.html',
    providers: [
        SectionService,
        InheritanceService,
        WineryNotificationService,
        {
            provide: TooltipConfig,
            useFactory: getToolTip
        }
    ]
})

export class WineryAddComponentDataComponent {

    @Input() componentData: SectionData[] = [];
    @Input() toscaType: ToscaTypes;
    @Input() types: SelectData[];
    @Input() typeRequired: boolean;
    @Input() newComponentName: string;
    @Output() typeChanged: EventEmitter<SelectData> = new EventEmitter();
    @Output() newComponentNameEvent: EventEmitter<string> = new EventEmitter();
    @Output() newComponentNamespaceEvent: EventEmitter<string> = new EventEmitter();

    loading: boolean;
    validation: AddComponentValidation;
    newComponentFinalName: string;
    newComponentSelectedType: SelectData = new SelectData();
    newComponentVersion: WineryVersion = new WineryVersion('', 1, 1);
    newComponentNamespace: string;
    collapseVersioning = true;
    hideHelp = true;
    storage: Storage = localStorage;
    useStartNamespace = true;

    private readonly storageKey = 'hideVersionHelp';

    constructor(private sectionService: SectionService, private notify: WineryNotificationService) {
    }

    onInputChange() {
        if (!this.componentData) {
            this.sectionService.getSectionData('/' + this.toscaType)
                .subscribe(
                    data => this.handleComponentData(data),
                    error => this.showError(error)
                );
        }
        this.validation = new AddComponentValidation();
        this.newComponentFinalName = this.newComponentName;

        if (this.typeRequired && isNullOrUndefined(this.newComponentSelectedType)) {
            this.validation.noTypeAvailable = true;
            return { noTypeAvailable: true };
        }

        if (!isNullOrUndefined(this.newComponentFinalName) && this.newComponentFinalName.length > 0) {
            this.newComponentFinalName += WineryVersion.WINERY_NAME_FROM_VERSION_SEPARATOR + this.newComponentVersion.toString();
            const duplicate = this.componentData.find((component) => component.name.toLowerCase() === this.newComponentFinalName.toLowerCase());

            if (!isNullOrUndefined(duplicate)) {
                const namespace = this.newComponentNamespace.endsWith('/') ? this.newComponentNamespace.slice(0, -1) : this.newComponentNamespace;

                if (duplicate.namespace === namespace) {
                    if (duplicate.name === this.newComponentFinalName) {
                        this.validation.noDuplicatesAllowed = true;
                        return { noDuplicatesAllowed: true };
                    } else {
                        this.validation.differentCaseDuplicateWarning = true;
                    }
                } else {
                    this.validation.differentNamespaceDuplicateWarning = true;
                }
            }
        }

        if (this.newComponentVersion.componentVersion) {
            this.validation.noUnderscoresAllowed = this.newComponentVersion.componentVersion.includes('_');
            if (this.validation.noUnderscoresAllowed) {
                return { noUnderscoresAllowed: true };
            }
        }

        this.validation.noVersionProvidedWarning = isNullOrUndefined(this.newComponentVersion.componentVersion)
            || this.newComponentVersion.componentVersion.length === 0;
        this.newComponentNameEvent.emit(this.newComponentFinalName);
        this.newComponentNamespaceEvent.emit(this.newComponentNamespace);
    }

    showHelp() {
        if (this.hideHelp) {
            this.storage.removeItem(this.storageKey);
        } else {
            this.storage.setItem(this.storageKey, 'true');
        }
        this.hideHelp = !this.hideHelp;
    }

    typeSelected(event: SelectData) {
        this.newComponentSelectedType = event;
        this.typeChanged.emit(this.newComponentSelectedType);
    }

    private showError(error: any) {
        this.notify.error(error.message);
        this.loading = false;
    }

    private handleComponentData(data: SectionData[]) {
        this.componentData = data;
    }
}
