/*******************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
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
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountabilityParticipant } from '../AccountabilityParticipant';
import { AccountabilityService } from '../accountability.service';
import { WineryNotificationService } from '../../../../wineryNotificationModule/wineryNotification.service';
import { SelectData } from '../../../../model/selectData';
import { AuthorizationElement } from '../../../../model/provenance';
import { AccountabilityParentComponent } from '../accountabilityParent.component';

@Component({
    templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent extends AccountabilityParentComponent {
    @ViewChild('authenticationLineageModal') authenticationLineageModal: ModalDirective;
    authenticationData: AuthorizationElement[];
    participant: AuthorizationElement = {identity: '', address: '', transactionHash: '', unixTimestamp: 0};

    constructor(protected service: AccountabilityService, protected notify: WineryNotificationService ) {
        super(service, notify);
    }

    onOk() {
        this.authenticate();
    }

    private handleAuthenticationData(data: AuthorizationElement[]) {
        this.loading = false;
        this.authenticationData = data;
        this.participant = data[data.length - 1]; // the last participant in the lineage is the one whose address we have entered.
        this.authenticationLineageModal.show();
    }

    private authenticate() {
        this.loading = true;
        this.service.authenticate(this.selectedProvenanceId.id, this.participant.address)
            .subscribe(
                data => this.handleAuthenticationData(data),
                error => this.handleError(error)
            );
    }
}
