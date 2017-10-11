/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Thommy Zelenik - initial API and implementation
 */
import { Injectable } from '@angular/core';

declare const jsPlumb: any;

/**
 * Defines the JSPlumb instance which is used over the complete project.
 */
@Injectable()
export class JsPlumbService {
  getJsPlumbInstance(): any {
    jsPlumb.ready(() => {
    });
    return jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 1,
        stroke: '#fafafa',
      },
      Connector: ['Bezier', {curviness: 1, stub: 200}],
      Endpoint: 'Blank',
      connectorOverlays: [
        ['Arrow', {location: 1}],
      ],
      ConnectionsDetachable: false,
      Anchor: 'Continuous'
    });
  }
}
