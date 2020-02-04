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

package org.eclipse.winery.common.configuration;

import org.eclipse.winery.common.Util;

import org.apache.commons.configuration2.YAMLConfiguration;

public class RepositoryConfigurationObject extends AbstractConfigurationObject {

    private final String key = "repository.";
    private GitConfigurationObject gitConfiguration;
    private String repositoryRoot;
    private RepositoryProvider provider;
    private YAMLConfiguration configuration;

    public enum RepositoryProvider {

        FILE("file"), YAML("yaml");

        private final String name;

        RepositoryProvider(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return name;
        }
    }

    RepositoryConfigurationObject(YAMLConfiguration configuration) {
        this.repositoryRoot = configuration.getString(key + "repositoryRoot");
        this.configuration = configuration;
        this.setGitConfiguration(Environments.getGitConfig());
        String provider = Environment.getConfiguration().getString(key + "provider");
        if (provider.equalsIgnoreCase(RepositoryProvider.YAML.name())) {
            this.setProvider(RepositoryProvider.YAML);
        } else {
            this.setProvider(RepositoryProvider.FILE);
        }
    }

    @Override
    void save() {
        configuration.setProperty(key + "provider", this.getProvider().toString());
        configuration.setProperty(key + "repositoryRoot", this.repositoryRoot);
        this.getGitConfiguration().save();
        Environment.save();
    }

    /**
     * Returns the path to the repository saved in the configuration file.
     *
     * @return path to configuration
     */
    public String getRepositoryRoot() {
        String repositoryRoot = this.repositoryRoot;
        if (repositoryRoot == null || repositoryRoot.isEmpty()) {
            repositoryRoot = Util.determineAndCreateRepositoryPath().toString();
            Environments.getRepositoryConfig().setRepositoryRoot(repositoryRoot);
            return repositoryRoot;
        } else {
            return repositoryRoot;
        }
    }

    public void setRepositoryRoot(String changedRepositoryRoot) {
        this.repositoryRoot = changedRepositoryRoot;
        this.save();
    }

    public GitConfigurationObject getGitConfiguration() {
        return gitConfiguration;
    }

    public void setGitConfiguration(GitConfigurationObject gitConfiguration) {
        this.gitConfiguration = gitConfiguration;
    }

    public RepositoryConfigurationObject.RepositoryProvider getProvider() {
        return provider;
    }

    public void setProvider(RepositoryProvider provider) {
        this.provider = provider;
    }
}
