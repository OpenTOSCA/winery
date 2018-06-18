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
/**
 * Retrieves the local name and the namespace from the qname
 */
export declare class QName {
    private _qName;
    private _localName;
    private _nameSpace;
    constructor(_qName?: string);
    /**
     * Getter for localName
     */
    /**
     * Setter for localName
     */
    localName: string;
    /**
     * Getter for namespace
     */
    /**
     * Setter for namespace
     */
    nameSpace: string;
    /**
     * Getter for qName
     */
    /**
     * Setter for qName
     */
    qName: string;
    /**
     * Another setter for when the QName has to be constructed
     * @param localname
     * @param namespace
     */
    setQNameWithLocalNameAndNamespace(localname: string, namespace: string): void;
}
