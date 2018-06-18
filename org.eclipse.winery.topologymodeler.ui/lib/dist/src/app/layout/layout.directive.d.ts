/********************************************************************************
 * Copyright (c) 2017-2018 Contributors to the Eclipse Foundation
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
 ********************************************************************************/
import { ElementRef } from '@angular/core';
import { TNodeTemplate, TRelationshipTemplate } from '../models/ttopology-template';
import { ToastrService } from 'ngx-toastr';
import { NodeComponent } from '../node/node.component';
export declare class LayoutDirective {
    private alert;
    private elRef;
    readonly nodeXOffset: number;
    readonly nodeYOffset: number;
    private jsPlumbInstance;
    constructor(alert: ToastrService, elRef: ElementRef);
    /**
     * Sets the JsPlumb instance from the existing JsPlumb canvas instance for further usage
     * @param jsPlumbInstance
     */
    setJsPlumbInstance(jsPlumbInstance: any): void;
    /**
     * Layouts all nodes (not just the selected ones).
     * Uses ELK.Js which implements sugiyama to layout nodes.
     * @param nodeChildrenArray
     * @param relationshipTemplates
     */
    layoutNodes(nodeChildrenArray: Array<NodeComponent>, relationshipTemplates: Array<TRelationshipTemplate>): void;
    /**
     * This applies the calculated positions to the actual node elements.
     * Uses ELK.Js which implements sugiyama to layout nodes.
     * @param data The data (relationships, nodes) used by the layouting algo.
     * @param nodeTemplates The internal representation of the nodes.
     * @param jsPlumbInstance
     */
    private applyPositions(data, nodeChildrenArray);
    /**
     * Aligns all selected elements horizontally or vertically.
     * If no element is selected, all elements get aligned horizontally or vertically.
     * @param nodeChildrenArray
     * @param selectedNodes
     * @param alignMode
     */
    align(nodeChildrenArray: Array<NodeComponent>, selectedNodes: Array<TNodeTemplate>, alignMode: any): void;
    /**
     * Repaints everything after 1ms.
     * @param jsPlumbInstance
     */
    private repaintEverything();
}
