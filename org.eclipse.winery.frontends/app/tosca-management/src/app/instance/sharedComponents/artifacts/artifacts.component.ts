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

import { Component, OnInit } from '@angular/core';
import { ImplementationService } from '../implementations/implementations.service';
import { WineryNotificationService } from '../../../wineryNotificationModule/wineryNotification.service';
import { ArtifactsService } from './artifacts.service';

@Component({
    selector: 'winery-instance-artifacts',
    templateUrl: 'artifacts.component.html',
    providers: [ArtifactsService,
        WineryNotificationService],
})
export class ArtifactsComponent implements OnInit {
    ngOnInit(): void {
    }

}
