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
package org.eclipse.winery.accountability.storage;

import java.util.concurrent.CompletableFuture;

/**
 * A storage service provider that allows storing arbitrary files, and address them using Strings, while not allowing
 * their removal.
 */
public interface ImmutableStorageProvider {
    CompletableFuture<String> store(final byte[] input);
    
    CompletableFuture<byte[]> retrieve(final String address);
    
    void close();
}
