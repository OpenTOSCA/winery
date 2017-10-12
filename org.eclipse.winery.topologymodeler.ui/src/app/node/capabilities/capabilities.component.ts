/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Yannic Sowoidnich
 */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'winery-capabilities',
  templateUrl: './capabilities.component.html',
  styleUrls: ['./capabilities.component.css']
})
/**
 * This Handles Information about the nodes capabilities
 */
export class CapabilitiesComponent implements OnInit {
    @Output() toggleModalHandler: EventEmitter<any>;

    constructor() {
        this.toggleModalHandler = new EventEmitter();
    }

    /**
     * Propagates the click event to node.component, where capabilities modal gets opened.
     * @param $event
     */
    public toggleModal($event) {
        const modalData = {
            type : 'CAPABILITIES'
        };
        this.toggleModalHandler.emit(modalData);
    }

    ngOnInit() {
    }
}
