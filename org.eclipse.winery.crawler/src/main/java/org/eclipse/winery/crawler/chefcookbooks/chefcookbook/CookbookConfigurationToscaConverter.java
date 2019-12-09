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

package org.eclipse.winery.crawler.chefcookbooks.chefcookbook;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.xml.namespace.QName;

import org.eclipse.winery.common.configuration.Environments;
import org.eclipse.winery.common.ids.definitions.CapabilityTypeId;
import org.eclipse.winery.common.ids.definitions.NodeTypeId;
import org.eclipse.winery.common.ids.definitions.RequirementTypeId;
import org.eclipse.winery.common.version.WineryVersion;
import org.eclipse.winery.model.tosca.TCapabilityDefinition;
import org.eclipse.winery.model.tosca.TNodeType;
import org.eclipse.winery.model.tosca.TRequirementDefinition;
import org.eclipse.winery.repository.backend.IRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;

public class CookbookConfigurationToscaConverter {

    private final IRepository repository = RepositoryFactory.getRepository(new File(Environments.getRepositoryConfig().getRepositoryRoot()).toPath());

    public List<TNodeType> convertCookbookConfigurationToToscaNode(ChefCookbookConfiguration cookbookConfiguration, int counter) {
        List<TNodeType> nodeTypes = new ArrayList<>();
        String cookbookName = cookbookConfiguration.getName();
        String version = cookbookConfiguration.getVersion();

        String namespace = buildNamespaceForCookbookConfigs(cookbookName, version);

        TNodeType.Builder configurationNodeType = new TNodeType.Builder(cookbookName + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + counter);
        configurationNodeType.setTargetNamespace(namespace);

        TRequirementDefinition platform = convertPlatformToRequirement(cookbookConfiguration.getSupports(), namespace);
        configurationNodeType.addRequirementDefinitions(platform);

        TCapabilityDefinition installedPackage;
        List<TCapabilityDefinition> installedPackages = convertInstalledPackagesToCapabilities(cookbookConfiguration.getInstalledPackages(), namespace);
        for (TCapabilityDefinition aPackage : installedPackages) {
            installedPackage = aPackage;
            configurationNodeType.addCapabilityDefinitions(installedPackage);
        }

        TRequirementDefinition requiredPackage;
        List<TRequirementDefinition> requiredPackages = convertRequiredPackagesToRequirements(cookbookConfiguration.getRequiredPackages(), namespace);

        for (TRequirementDefinition aPackage : requiredPackages) {
            requiredPackage = aPackage;
            configurationNodeType.addRequirementDefinitions(requiredPackage);
        }

        TNodeType tNodeType = new TNodeType(configurationNodeType);

        TNodeType platformNodeType = convertPlatformToNodeType(cookbookConfiguration.getSupports());

        nodeTypes.add(tNodeType);
        nodeTypes.add(platformNodeType);
        return nodeTypes;
    }

    public void saveToscaNodeType(TNodeType tNodeType) {
        try {
            repository.setElement(
                new NodeTypeId(tNodeType.getTargetNamespace(), tNodeType.getName(), false),
                tNodeType);
            if (tNodeType.getCapabilityDefinitions() != null) {
                for (TCapabilityDefinition capability : tNodeType.getCapabilityDefinitions().getCapabilityDefinition()) {
                    QName capabilityType = capability.getCapabilityType();
                    repository.setElement(
                        new CapabilityTypeId(capabilityType),
                        capability
                    );
                }
            }
            if (tNodeType.getRequirementDefinitions() != null) {
                for (TRequirementDefinition requirementDefinition : tNodeType.getRequirementDefinitions().getRequirementDefinition()) {
                    QName requirementType = requirementDefinition.getRequirementType();
                    repository.setElement(
                        new RequirementTypeId(requirementType),
                        requirementDefinition
                    );
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private List<TCapabilityDefinition> convertInstalledPackagesToCapabilities(LinkedHashMap<String, ChefPackage> installedPackages, String namespace) {
        List<TCapabilityDefinition> packageCapabilities = new ArrayList<>();
        ChefPackage chefPackage;
        for (int i = 0; i < installedPackages.size(); i++) {
            chefPackage = ChefCookbookConfiguration.getPackageByIndex(installedPackages, i);
            packageCapabilities.add(convertPackageToCapability(chefPackage, namespace, i + 1));
        }
        return packageCapabilities;
    }

    private List<TRequirementDefinition> convertRequiredPackagesToRequirements(LinkedHashMap<String, ChefPackage> requiredPackages, String namespace) {
        List<TRequirementDefinition> packageRequirements = new ArrayList<>();
        ChefPackage chefPackage;
        for (int i = 0; i < requiredPackages.size(); i++) {
            chefPackage = ChefCookbookConfiguration.getPackageByIndex(requiredPackages, i);
            packageRequirements.add(convertPackageToRequirement(chefPackage, namespace, i + 1));
        }
        return packageRequirements;
    }

    private TCapabilityDefinition convertPackageToCapability(ChefPackage chefPackage, String namespace, int counter) {
        TCapabilityDefinition.Builder builder;
        if (chefPackage.getVersion() != null) {
            builder = new TCapabilityDefinition.Builder("package" + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + counter, new QName(namespace, chefPackage.getPackageName() + "-" + chefPackage.getVersion()));
        } else {
            builder = new TCapabilityDefinition.Builder("package" + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + counter, new QName(namespace, chefPackage.getPackageName()));
        }
        return new TCapabilityDefinition(builder);
    }

    private TRequirementDefinition convertPackageToRequirement(ChefPackage chefPackage, String namespace, int counter) {
        TRequirementDefinition.Builder builder;
        if (chefPackage.getVersion() != null) {
            builder = new TRequirementDefinition.Builder("package" + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + counter, new QName(namespace, chefPackage.getPackageName() + "-" + chefPackage.getVersion()));
        } else {
            builder = new TRequirementDefinition.Builder("package" + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + counter, new QName(namespace, chefPackage.getPackageName()));
        }
        return new TRequirementDefinition(builder);
    }

    private TRequirementDefinition convertPlatformToRequirement(Platform platform, String namespace) {
        TRequirementDefinition.Builder builder = new TRequirementDefinition.Builder("supported plattform", new QName(namespace, platform.getName() + "_" + platform.getVersion() + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + "1"));
        return new TRequirementDefinition(builder);
    }

    private TCapabilityDefinition convertPlatformToCapability(Platform platform, String namespace) {
        TCapabilityDefinition.Builder builder = new TCapabilityDefinition.Builder("platform", new QName(namespace, platform.getName() + "_" + platform.getVersion() + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + "1"));
        return new TCapabilityDefinition(builder);
    }

    /**
     * Build namespace of nodetype
     */
    private String buildNamespaceForCookbookConfigs(String cookbookName, String cookbookVersion) {
        return "https://supermarket.chef.io/api/v1/cookbooks/" + cookbookName + "/versions/" + cookbookVersion;
    }

    private String buildNamespaceForPlatforms() {
        return "https://supermarket.chef.io/api/v1/platforms/";
    }

    private TNodeType convertPlatformToNodeType(Platform platform) {
        String namespace = buildNamespaceForPlatforms();
        TNodeType.Builder configurationNodeType = new TNodeType.Builder(platform.getName() + "-" + platform.getVersion() + WineryVersion.WINERY_VERSION_SEPARATOR + WineryVersion.WINERY_VERSION_PREFIX + "1");
        configurationNodeType.setTargetNamespace(namespace);

        configurationNodeType.addCapabilityDefinitions(convertPlatformToCapability(platform, namespace));

        return new TNodeType(configurationNodeType);
    }
}
