package org.eclipse.winery.accountability.storage.swarm;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.concurrent.ExecutionException;

import org.eclipse.winery.accountability.storage.ImmutableStorageProvider;
import org.eclipse.winery.accountability.storage.ImmutableStorageProviderFactory;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.*;

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
class SwarmProviderTest {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(SwarmProviderTest.class);
    
    @Test
    public void testStorageAndRetrieval() {

        final String dataToStore = "This a string intended for testing!";
        ImmutableStorageProvider swarm = ImmutableStorageProviderFactory
            .getStorageProvider(ImmutableStorageProviderFactory.AvailableImmutableStorages.TEST, null);
        assertNotNull(swarm);
        try {
            swarm
                .store(dataToStore.getBytes(Charset.defaultCharset()))
                .thenCompose((hash)-> {
                    LOGGER.debug("retrieved hash is: {}", hash);
                    return swarm.retrieve(hash);
                })
                .thenAccept((bytes)-> {
                    try {
                        String receivedMsg = IOUtils.toString(bytes, Charset.defaultCharset().name()); 
                        LOGGER.debug("retrieved msg is: {}", receivedMsg);
                        assertEquals(dataToStore, receivedMsg);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                })
                .get();
        } catch ( InterruptedException | ExecutionException ignored) {
            
        }
    }

}
