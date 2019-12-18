/*******************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.repository.backend.filebased;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

import org.eclipse.winery.common.configuration.Environments;
import org.eclipse.winery.repository.backend.IRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.backend.constants.Filename;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MultiRepositoryManager {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(MultiRepositoryManager.class);

    /**
     * Copies the the list of repositories into the repository root. Reconfigures the factory so that on the next get it
     * will return a MultiRepository
     *
     * @param repositoryList The list of repositories that is copied to the root
     */
    static void initializeRepositoryListForMultiRepositoryAndReconfigureFactory(List<RepositoryProperties> repositoryList) {
        ObjectMapper objectMapper = new ObjectMapper();
        File repositoryConfiguration = new File(Environments.getRepositoryConfig().getRepositoryRoot(), Filename.FILENAME_JSON_REPOSITORIES);
        if (!repositoryConfiguration.exists()) {
            try {
                Files.createFile(repositoryConfiguration.toPath());
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
                objectMapper.writeValue(repositoryConfiguration, repositoryList);
            } catch (IOException exception) {
                exception.printStackTrace();
            }
        }
        try {
            RepositoryFactory.reconfigure();
        } catch (Exception e) {
            LOGGER.debug("Error reconfiguring the RepositoryFactory.", e);
        }
    }

    /**
     * If the repository is a MultiRepository, this method will return the list of all repositories in the
     * MultiRepository. If it is not a MultiRepository, the returned list is empty.
     * This method will also clone the repositories specified in the repositories.json file and their dependencies.
     * 
     * @return a list of repositories, represented by their properties.
     */
    public List<RepositoryProperties> getRepositoriesAsList() {
        IRepository repository = RepositoryFactory.getRepository();
        if (repository instanceof MultiRepository) {
            return ((MultiRepository) repository).getRepositoriesFromFile();
        }
        return Collections.emptyList();
    }

    /**
     * If the repository is a MultiRepository, this method will copy the repositories into the repository. If the
     * repository is not a MultiRepository, it will be transformed into one first.
     *
     * @param repositories the list of repositories copied into the MultiRepository
     */
    public void addRepositoryToFile(List<RepositoryProperties> repositories) {
        IRepository repo = RepositoryFactory.getRepository();
        if (!(repo instanceof MultiRepository)) {
            initializeRepositoryListForMultiRepositoryAndReconfigureFactory(repositories);
            repo = RepositoryFactory.getRepository();
        }
        ((MultiRepository) repo).addRepositoryToFile(repositories);
    }
}
