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

package org.eclipse.winery.accountability;

import java.util.Objects;
import java.util.Properties;

import org.eclipse.winery.accountability.exceptions.AccountabilityException;

public class AccountabilityManagerFactory {

    private static AccountabilityManager accountabilityManager;
    private static Properties activeProperties;

    public static AccountabilityManager getAccountabilityManager(Properties accountabilityConfiguration) throws AccountabilityException {
        boolean requiresRecreation = false;
        // if any of the relevant configurations is changed, we need a new instance!
        if (activeProperties != null) {
            requiresRecreation = checkIfChanged(accountabilityConfiguration);
        }

        if (Objects.isNull(accountabilityManager) || requiresRecreation) {
            // if there is an older accountability manager, we should shut it down
            if (!Objects.isNull(accountabilityManager)) {
                accountabilityManager.close();
            }

            accountabilityManager = new AccountabilityManagerImpl(accountabilityConfiguration);
            copyProperties(accountabilityConfiguration);
        }

        return accountabilityManager;
    }
    
    private static boolean checkIfChanged(Properties accountabilityConfiguration) {
        return !(accountabilityConfiguration.getProperty("geth-url").equalsIgnoreCase(activeProperties.getProperty("geth-url")) &&
            accountabilityConfiguration.getProperty("swarm-gateway-url").equals(activeProperties.getProperty("swarm-gateway-url")) &&
            accountabilityConfiguration.getProperty("ethereum-credentials-file-path").equals(activeProperties.getProperty("ethereum-credentials-file-path")) &&
            accountabilityConfiguration.getProperty("ethereum-credentials-file-name").equals(activeProperties.getProperty("ethereum-credentials-file-name")) &&
            accountabilityConfiguration.getProperty("ethereum-password").equals(activeProperties.getProperty("ethereum-password")) &&
            accountabilityConfiguration.getProperty("ethereum-provenance-smart-contract-address").equalsIgnoreCase(activeProperties.getProperty("ethereum-provenance-smart-contract-address")) &&
            accountabilityConfiguration.getProperty("ethereum-authorization-smart-contract-address").equalsIgnoreCase(activeProperties.getProperty("ethereum-authorization-smart-contract-address")));
    }
    
    private static void copyProperties(Properties accountabilityConfiguration) {
        activeProperties = new Properties();
        accountabilityConfiguration.stringPropertyNames().forEach(name -> activeProperties.setProperty(name, accountabilityConfiguration.getProperty(name)));
    }
}
