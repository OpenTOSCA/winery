/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.repository.importing;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.eclipse.winery.common.RepositoryFileReference;
import org.eclipse.winery.common.ids.IdNames;
import org.eclipse.winery.common.ids.definitions.DefinitionsChildId;
import org.eclipse.winery.common.ids.definitions.NodeTypeId;
import org.eclipse.winery.common.ids.definitions.RelationshipTypeId;
import org.eclipse.winery.common.ids.definitions.ServiceTemplateId;
import org.eclipse.winery.model.csar.toscametafile.TOSCAMetaFile;
import org.eclipse.winery.model.csar.toscametafile.YamlTOSCAMetaFileParser;
import org.eclipse.winery.model.tosca.Definitions;
import org.eclipse.winery.model.tosca.TDefinitions;
import org.eclipse.winery.model.tosca.TExtensibleElements;
import org.eclipse.winery.model.tosca.TImport;
import org.eclipse.winery.model.tosca.TNodeType;
import org.eclipse.winery.model.tosca.TRelationshipType;
import org.eclipse.winery.model.tosca.utils.ModelUtilities;
import org.eclipse.winery.model.tosca.yaml.TServiceTemplate;
import org.eclipse.winery.repository.backend.BackendUtils;
import org.eclipse.winery.repository.backend.IRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.backend.filebased.GitBasedRepository;
import org.eclipse.winery.repository.backend.filebased.YamlRepository;
import org.eclipse.winery.repository.converter.X2YConverter;
import org.eclipse.winery.repository.converter.Y2XConverter;
import org.eclipse.winery.repository.converter.support.Namespaces;
import org.eclipse.winery.repository.converter.support.exception.MultiException;
import org.eclipse.winery.repository.converter.support.reader.YamlReader;
import org.eclipse.winery.repository.converter.support.writer.YamlWriter;
import org.eclipse.winery.repository.datatypes.ids.elements.DirectoryId;
import org.eclipse.winery.repository.datatypes.ids.elements.GenericDirectoryId;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class YamlCsarImporter extends CsarImporter {
    private static final Logger LOGGER = LoggerFactory.getLogger(YamlCsarImporter.class);

    /**
     * Parse TOSCA Meta File
     *
     * @param toscaMetaPath the path of the meta file
     */
    @Override
    protected TOSCAMetaFile parseTOSCAMetaFile(Path toscaMetaPath) {
        final YamlTOSCAMetaFileParser tmfp = new YamlTOSCAMetaFileParser();
        return tmfp.parse(toscaMetaPath);
    }

    @Override
    protected Optional<TDefinitions> parseDefinitionsElement(Path entryDefinitionsPath, final List<String> errors) {
        YamlReader reader = new YamlReader();
        TServiceTemplate serviceTemplate;
        try {
            serviceTemplate = reader.parse(new FileInputStream(entryDefinitionsPath.toFile()));

            // TODO: store service template's name in metadata to simplify the import
            String serviceTemplateName = entryDefinitionsPath.toString().substring(
                entryDefinitionsPath.toString().indexOf("__") + 2,
                entryDefinitionsPath.toString().indexOf(".tosca")
            );

            Y2XConverter converter = new Y2XConverter();
            return Optional.of(converter.convert(serviceTemplate, serviceTemplateName, serviceTemplate.getMetadata().get("targetNamespace")));
        } catch (MultiException | FileNotFoundException e) {
            e.printStackTrace();
            LOGGER.error("Could not read the given entry definition " + e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    protected void parseCsarContents(final Path path, TOSCAMetaFile tmf, ImportMetaInformation importMetaInformation, CsarImportOptions options, Map<String, File> fileMap) throws IOException {
        String entryDefinitions = tmf.getEntryDefinitions();

        if (Objects.nonNull(entryDefinitions)) {

            Path defsPath = path.resolve(entryDefinitions);
            importMetaInformation.entryServiceTemplate = null;
            this.importDefinitions(tmf, defsPath, importMetaInformation.errors, options)
                .ifPresent(serviceTemplateId1 -> importMetaInformation.entryServiceTemplate = serviceTemplateId1);

            this.importSelfServiceMetaData(tmf, path, defsPath, importMetaInformation.errors);
        }
    }

    @Override
    protected Optional<ServiceTemplateId> processDefinitionsImport(TDefinitions defs, TOSCAMetaFile tmf, Path definitionsPath, List<String> errors, CsarImportOptions options) throws IOException {
        Optional<ServiceTemplateId> entryServiceTemplate = Optional.empty();

        String defaultNamespace = defs.getTargetNamespace();
        List<TExtensibleElements> componentInstanceList = defs.getServiceTemplateOrNodeTypeOrNodeTypeImplementation();

        for (final TExtensibleElements ci : componentInstanceList) {
            if (ci instanceof org.eclipse.winery.model.tosca.TServiceTemplate &&
                Objects.isNull(((org.eclipse.winery.model.tosca.TServiceTemplate) ci).getTopologyTemplate())
            ) {
                continue;
            }

            // Determine & ensure that element has the namespace
            String namespace = this.getNamespace(ci, defaultNamespace);
            this.setNamespace(ci, namespace);
            String id = ModelUtilities.getId(ci);

            final DefinitionsChildId wid = determineWineryId(ci, namespace, id);

            if (RepositoryFactory.getRepository().exists(wid)) {
                if (options.isOverwrite()) {
                    RepositoryFactory.getRepository().forceDelete(wid);
                    String msg = String.format("Deleted %1$s %2$s to enable replacement", ci.getClass().getName(), wid.getQName().toString());
                    LOGGER.debug(msg);
                } else {
                    String msg = String.format("Skipped %1$s %2$s, because it already exists", ci.getClass().getName(), wid.getQName().toString());
                    LOGGER.debug(msg);
                    // this is not displayed in the UI as we currently do not distinguish between pre-existing types and types created during the import.
                    continue;
                }
            }

            // Create a fresh definitions object without the other data.
            final Definitions newDefs = BackendUtils.createWrapperDefinitions(wid);
            // add the current TExtensibleElements as the only content to it
            newDefs.getServiceTemplateOrNodeTypeOrNodeTypeImplementation().add(ci);
            // import license and readme files
            importLicenseAndReadme(definitionsPath.getParent().getParent(), wid, tmf, errors);
            importArtifacts(definitionsPath.getParent().getParent(), ci, wid, tmf, errors);

            if (ci instanceof TNodeType) {
                this.adjustNodeType(definitionsPath.getParent().getParent(), (TNodeType) ci, (NodeTypeId) wid, tmf, errors);
            } else if (ci instanceof TRelationshipType) {
                this.adjustRelationshipType(definitionsPath.getParent().getParent(), (TRelationshipType) ci, (RelationshipTypeId) wid, tmf, errors);
            }

            storeDefs(wid, newDefs);
        }

        List<TImport> imports = defs.getImport();
        this.importImports(definitionsPath.getParent(), tmf, imports, errors, options);

        return entryServiceTemplate;
    }

    private void importArtifacts(Path rootPath, TExtensibleElements ci, DefinitionsChildId wid, TOSCAMetaFile tmf, final List<String> errors) {
        if (ci instanceof org.eclipse.winery.model.tosca.TServiceTemplate) {
            org.eclipse.winery.model.tosca.TServiceTemplate st = (org.eclipse.winery.model.tosca.TServiceTemplate) ci;
            st.getTopologyTemplate()
                .getNodeTemplates()
                .forEach(node -> node.getArtifacts().getArtifact().forEach(a -> {
                        Path path = rootPath.resolve(a.getFile());
                        if (!Files.exists(path)) {
                            errors.add(String.format("Reference %1$s not found", a.getFile()));
                            return;
                        }
                        Set<Path> allFiles;
                        if (Files.isRegularFile(path)) {
                            allFiles = new HashSet<>();
                            allFiles.add(path);

                            // Path p = Paths.get("files", node.getId(), a.getId());
                            // RepositoryFileReference ref = new RepositoryFileReference(wid, p, a.getFile());
                            DirectoryId serviceTemplateYamlArtifactsDir =
                                new GenericDirectoryId(wid, IdNames.FILES_DIRECTORY);
                            DirectoryId nodeTemplateYamlArtifactsDir =
                                new GenericDirectoryId(serviceTemplateYamlArtifactsDir, node.getId());
                            DirectoryId yamlArtifactFilesDirectoryId =
                                new GenericDirectoryId(nodeTemplateYamlArtifactsDir, a.getName());

                            this.importAllFiles(rootPath, allFiles, yamlArtifactFilesDirectoryId, tmf, errors);
                        }
                    }
                ));
        } else if (ci instanceof TNodeType) {
            TNodeType nt = (TNodeType) ci;
            if (Objects.nonNull(nt.getArtifacts())) {
                nt.getArtifacts().getArtifact().forEach(a -> {
                    Path path = rootPath.resolve(a.getFile());
                    if (!Files.exists(path)) {
                        errors.add(String.format("Reference %1$s not found", a.getFile()));
                        return;
                    }
                    Set<Path> allFiles;
                    if (Files.isRegularFile(path)) {
                        allFiles = new HashSet<>();
                        allFiles.add(path);

                        DirectoryId nodeTypeArtifactsDir =
                            new GenericDirectoryId(wid, IdNames.FILES_DIRECTORY);
                        DirectoryId yamlArtifactFilesDirectoryId =
                            new GenericDirectoryId(nodeTypeArtifactsDir, a.getName());

                        this.importAllFiles(rootPath, allFiles, yamlArtifactFilesDirectoryId, tmf, errors);
                    }
                });
            }
        }
    }

    /**
     * @param basePath the base path where to resolve files from. This is the directory of the Definitions
     * @param imports  the list of imports to import. SIDE EFFECT: this list is modified. After this method has run, the
     *                 list contains the imports to be put into the wrapper element
     * @param options  the set of options applicable while importing a CSAR
     */
    private void importImports(Path basePath, TOSCAMetaFile tmf, List<TImport> imports, final List<String> errors, CsarImportOptions options) throws IOException {
        Iterator<TImport> iterator = imports.iterator();
        while (iterator.hasNext()) {
            TImport imp = iterator.next();
            String importType = imp.getImportType();
            String loc = imp.getLocation();

            if (Namespaces.TOSCA_NS.equals(importType)) {
                Path defsPath = basePath.resolve(loc);
                // fallback for older CSARs, where the location is given from the root
                if (Files.exists(defsPath)) {
                    this.importDefinitions(tmf, defsPath, errors, options);
                    // imports of definitions don't have to be kept as these are managed by Winery

                }
            }
            iterator.remove();
        }
    }

    private void storeDefs(DefinitionsChildId id, TDefinitions defs) {
        RepositoryFileReference ref = BackendUtils.getRefOfDefinitions(id);
        IRepository repo = RepositoryFactory.getRepository();
        X2YConverter converter = null;
        if (repo instanceof GitBasedRepository) {
            GitBasedRepository wrapper = (GitBasedRepository) RepositoryFactory.getRepository();
            converter = new X2YConverter((YamlRepository) wrapper.getRepository());
        } else if (repo instanceof YamlRepository) {
            converter = new X2YConverter((YamlRepository) repo);
        }

        if (Objects.nonNull(converter)) {
            YamlWriter writer = new YamlWriter();
            writer.write(converter.convert((Definitions) defs), repo.ref2AbsolutePath(ref));
        }
    }
}
