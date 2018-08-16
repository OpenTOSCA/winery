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

import java.util.Objects;
import java.util.Properties;

import org.eclipse.winery.accountability.storage.swarm.SwarmProvider;

public class ImmutableStorageProviderFactory {
    private static ImmutableStorageProvider storageProvider;

    public static ImmutableStorageProvider getStorageProvider(ImmutableStorageProviderFactory.AvailableImmutableStorages desiredProvider, Properties configuration) {
        // The requested blockchain technology could be retrieved from the configurations file
        if (Objects.isNull(storageProvider)) {
            switch (desiredProvider) {
                case SWARM:
                    storageProvider = new SwarmProvider(configuration.getProperty("swarm-gateway-url"));
                    break;
                case TEST:
                default:
                    storageProvider = new SwarmProvider("https://swarm-gateways.net");
                    break;
            }
        }

        return storageProvider;
    }

    public enum AvailableImmutableStorages {
        SWARM,
        TEST
    }
}
