/*******************************************************************************
 * Copyright (c) 2017 Contributors to the Eclipse Foundation
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
import { AfterContentInit, AfterViewInit } from '@angular/core';
import { WineryModalFooterComponent } from './winery.modal.footer.component';
import { WineryModalHeaderComponent } from './winery.modal.header.component';
import { ModalDirective } from 'ngx-bootstrap';
/**
 * This component provides a generic modal component for any kind of pop-ups.
 * To use it, the {@link WineryModalModule} must be imported in the corresponding module.
 *
 * In order to use this component, see the following example, note that the <code>modalRef</code> must be set.
 * For further information, see the sub-components {@link WineryModalHeaderComponent}, {@link WineryModalBodyComponent},
 * and {@link WineryModalFooterComponent}.
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>modalRef</code> The modalRef must be set, otherwise the component will not work!
 *     </li>
 *     <li><code>size</code>
 *     </li>
 *     <li><code>keyboard</code>
 *     </li>
 *     <li><code>backdrop</code>
 *     </li>
 * </ul>
 *
 * @example <caption>Short Example</caption>
 * ```html
 * <winery-modal bsModal #confirmDeleteModal="bs-modal" [modalRef]="confirmDeleteModal">
 *     <winery-modal-header [title]="'Delete Property'">
 *     </winery-modal-header>
 *     <winery-modal-body>
 *         <p *ngIf="elementToRemove != null">
 *         Do you want to delete the Element
 *             <span style="font-weight:bold;">{{ elementToRemove.key }}</span>?
 *         </p>
 *     </winery-modal-body>
 *     <winery-modal-footer (onOk)="removeConfirmed();"
 *                          [closeButtonLabel]="'Cancel'"
 *                          [okButtonLabel]="'Delete'">
 *     </winery-modal-footer>
 * </winery-modal>
 * ```
 */
export declare class WineryModalComponent implements AfterViewInit, AfterContentInit {
    modalRef: ModalDirective;
    size: string;
    keyboard: boolean;
    backdrop: boolean;
    hostClass: string;
    hostRole: string;
    hostTabIndex: string;
    headerContent: WineryModalHeaderComponent;
    footerContent: WineryModalFooterComponent;
    private overrideSize;
    private cssClass;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    getCssClasses(): string;
    private isSmall();
    private isLarge();
}
