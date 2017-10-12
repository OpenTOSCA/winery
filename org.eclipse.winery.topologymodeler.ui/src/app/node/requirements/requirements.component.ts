/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Josip Ledic - ledicjp@gmail.com
 *     Yannic Sowoidnich
 */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'winery-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.css']
})
/**
 * This Handles Information about the nodes requirements
 */
export class RequirementsComponent implements OnInit {
    @Output() toggleModalHandler: EventEmitter<any>;

    constructor() {
        this.toggleModalHandler = new EventEmitter();
    }

    /**
     * Propagates the click event to node.component, where requirements modal gets opened.
     * @param $event
     */
    public toggleModal($event) {
        const modalData = {
            type: 'REQUIREMENTS'
        };
        this.toggleModalHandler.emit(modalData);
    }

    ngOnInit() {
    }

}
