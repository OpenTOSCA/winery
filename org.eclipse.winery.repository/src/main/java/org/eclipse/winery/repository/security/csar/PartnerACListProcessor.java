/********************************************************************************
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

package org.eclipse.winery.repository.security.csar;

import org.apache.commons.configuration2.PropertiesConfiguration;
import org.apache.commons.configuration2.builder.FileBasedConfigurationBuilder;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.eclipse.winery.common.RepositoryFileReference;
import org.eclipse.winery.common.ids.admin.ACListId;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.backend.filebased.FilebasedRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class PartnerACListProcessor {

    private FileBasedConfigurationBuilder builder;
    
    public PartnerACListProcessor(String partnerName) {
        final String fileName = generatePartnerACListFileName(partnerName);
        RepositoryFileReference partnerACLRef = getPartnerACLRef(fileName);
        Configurations configs = new Configurations();

        if (!RepositoryFactory.getRepository().exists(partnerACLRef)) {
            createEmptyPartnerACLFile(partnerACLRef);
        }
        
        Path p = getPartnerACListFilePath(partnerACLRef);
        this.builder = configs.propertiesBuilder(new File(String.valueOf(p)));
    }
    
    public boolean addPolicyConfig(String policyId, String value) {
        try {
            PropertiesConfiguration config = (PropertiesConfiguration) builder.getConfiguration();
            config.addProperty(policyId, value);
            // save configuration
            builder.save();
            return true;
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updatePolicyConfig(String policyId, String value) {
        try {
            PropertiesConfiguration config = (PropertiesConfiguration) builder.getConfiguration();
            config.setProperty(policyId, value);
            // save configuration
            builder.save();
            return true;
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePolicyConfig(String policyId) {
        try {
            PropertiesConfiguration config = (PropertiesConfiguration) builder.getConfiguration();
            config.clearProperty(policyId);
            // save configuration
            builder.save();
            return true;
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    public Map<String, String> getCurrentConfigurations() {
        try {
            PropertiesConfiguration config = (PropertiesConfiguration) builder.getConfiguration();
            Map<String, String> result = new HashMap<>();
            Iterator<String> i = config.getKeys();
            while (i.hasNext()) {
                String k = i.next();
                result.put(k, (String) config.getProperty(k));
            }
            // save configuration
            builder.save();
            return result;
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
        return null;        
    }
    
    private static String generatePartnerACListFileName(String partnerName) {
        return partnerName.concat(SecureCSARConstants.ACL_FILE_EXTENSION);
    }
    
    private static RepositoryFileReference getPartnerACLRef(String fileName) {
        return new RepositoryFileReference(new ACListId(), fileName);
    }
    
    private static Path getPartnerACListFilePath(RepositoryFileReference partnerACLRef) {
        return ((FilebasedRepository) RepositoryFactory.getRepository()).ref2AbsolutePath(partnerACLRef);
    }
    
    private static void createEmptyPartnerACLFile(RepositoryFileReference partnerACLRef) {
        try {
            Files.createFile(getPartnerACListFilePath(partnerACLRef));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static boolean partnerACLExists(String partnerName) {
        final String fileName = generatePartnerACListFileName(partnerName);
        RepositoryFileReference partnerACLRef = getPartnerACLRef(fileName);
        return RepositoryFactory.getRepository().exists(partnerACLRef);
    }
    
    public static void createPartnerACL(String partnerName) {
        final String fileName = generatePartnerACListFileName(partnerName);
        final RepositoryFileReference partnerACLRef = getPartnerACLRef(fileName);
        if (!RepositoryFactory.getRepository().exists(partnerACLRef)) {
            createEmptyPartnerACLFile(partnerACLRef);
        }
    }
}
