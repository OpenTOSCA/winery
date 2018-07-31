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

export enum LifecycleInterface {
    INTERFACE = 'http://opentosca.org/interfaces/lifecycle',
    INSTALL = 'install',
    CONFIGURE = 'configure',
    START = 'start',
    STOP = 'stop',
    UNINSTALL = 'uninstall'
}