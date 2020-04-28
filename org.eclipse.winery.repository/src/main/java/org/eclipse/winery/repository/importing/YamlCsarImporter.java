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
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.eclipse.winery.model.csar.toscametafile.TOSCAMetaFile;
import org.eclipse.winery.model.csar.toscametafile.YamlTOSCAMetaFileParser;
import org.eclipse.winery.model.tosca.TDefinitions;
import org.eclipse.winery.model.tosca.yaml.TServiceTemplate;
import org.eclipse.winery.repository.converter.Y2XConverter;
import org.eclipse.winery.repository.converter.support.exception.MultiException;
import org.eclipse.winery.repository.converter.support.reader.YamlReader;

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
}
