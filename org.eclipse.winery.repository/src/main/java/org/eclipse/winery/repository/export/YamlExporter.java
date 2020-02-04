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
package org.eclipse.winery.repository.export;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;

import org.eclipse.winery.common.ids.definitions.DefinitionsChildId;
import org.eclipse.winery.model.csar.toscametafile.TOSCAMetaFile;
import org.eclipse.winery.model.csar.toscametafile.TOSCAMetaFileParser;
import org.eclipse.winery.model.tosca.Definitions;
import org.eclipse.winery.model.tosca.yaml.TServiceTemplate;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.backend.filebased.YamlRepository;
import org.eclipse.winery.repository.converter.X2YConverter;
import org.eclipse.winery.repository.converter.Y2XConverter;
import org.eclipse.winery.repository.converter.support.Utils;
import org.eclipse.winery.repository.converter.support.exception.MultiException;
import org.eclipse.winery.repository.converter.support.reader.XmlReader;
import org.eclipse.winery.repository.converter.support.reader.YamlReader;
import org.eclipse.winery.repository.exceptions.WineryRepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// TODO: Revise and fix (old Converter.java class)
public class YamlExporter {

    private static final Logger LOGGER = LoggerFactory.getLogger(YamlExporter.class);

    private final YamlRepository repository;

    public YamlExporter() {
        this.repository = (YamlRepository) RepositoryFactory.getRepository();
    }

    public YamlExporter(YamlRepository repository) {
        this.repository = repository;
    }

    public Definitions convertY2X(TServiceTemplate serviceTemplate, String name, String namespace, Path path, Path outPath) {
        return new Y2XConverter().convert(serviceTemplate, name, namespace/* TODO, path, outPath*/);
    }

    public void convertY2X(InputStream zip) throws MultiException {
        Path path = Utils.unzipFile(zip);
        LOGGER.debug("Unzip path: {}", path);

        PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:*.{yml,yaml}");
        MultiException exception = Arrays.stream(Optional.ofNullable(path.toFile().listFiles()).orElse(new File[] {}))
            .map(File::toPath)
            .filter(file -> matcher.matches(file.getFileName()))
            .map(file -> {
                YamlReader reader = new YamlReader();
                try {
                    String id = file.getFileName().toString().substring(0, file.getFileName().toString().lastIndexOf("."));
                    Path fileName = file.subpath(path.getNameCount(), file.getNameCount());
                    Path fileOutPath = path.resolve("tmp");
                    String namespace = reader.getNamespace(path, fileName);
                    try (InputStream is = new FileInputStream(new File(path.toFile(), fileName.toString()))) {
                        TServiceTemplate serviceTemplate = reader.parse(is, namespace);
                        LOGGER.debug("Convert filePath = {}, fileName = {}, id = {}, namespace = {}, fileOutPath = {}",
                            path, fileName, id, namespace, fileOutPath);
                        this.convertY2X(serviceTemplate, id, namespace, path, fileOutPath);
                    } catch (Exception e) {
                        return new MultiException().add(e);
                    }
                } catch (MultiException e) {
                    return e;
                }
                return null;
            })
            .filter(Objects::nonNull)
            .reduce(MultiException::add)
            .orElse(new MultiException());
        if (exception.hasException()) throw exception;
    }

    public InputStream convertX2Y(InputStream csar) {
        Path filePath = Utils.unzipFile(csar);
        Path fileOutPath = filePath.resolve("tmp");
        try {
            TOSCAMetaFileParser parser = new TOSCAMetaFileParser();
            TOSCAMetaFile metaFile = parser.parse(filePath.resolve("TOSCA-Metadata").resolve("TOSCA.meta"));

            XmlReader reader = new XmlReader();
            try {
                String fileName = metaFile.getEntryDefinitions();
                Definitions definitions = reader.parse(filePath, Paths.get(fileName));
                this.convertX2Y(definitions, fileOutPath);
            } catch (MultiException e) {
                LOGGER.error("Convert TOSCA XML to TOSCA YAML error", e);
            }
            return Utils.zipPath(fileOutPath);
        } catch (Exception e) {
            LOGGER.error("Error", e);
            throw new AssertionError();
        }
    }

    public InputStream convertX2Y(DefinitionsChildId id) throws MultiException {
        Path path = Utils.getTmpDir(Paths.get(id.getQName().getLocalPart()));
        convertX2Y(repository.getDefinitions(id), path);
        return Utils.zipPath(path);
    }

    public String convertDefinitionsChildToYaml(DefinitionsChildId id) throws MultiException {
        Path path = Utils.getTmpDir(Paths.get(id.getQName().getLocalPart()));
        convertX2Y(repository.getDefinitions(id), path);
        // convention: single file in root contains the YAML support
        // TODO: Links in the YAML should be changed to real links into Winery
        Optional<Path> rootYamlFile;
        try {
            return Files.find(path, 1, (filePath, basicFileAttributes) -> filePath.getFileName().toString().endsWith(".yml"))
                .findAny()
                .map(p -> {
                    try {
                        return new String(Files.readAllBytes(p), StandardCharsets.UTF_8);
                    } catch (IOException e) {
                        LOGGER.debug("Could not read root file", e);
                        return "Could not read root file";
                    }
                })
                .orElseThrow(() -> {
                    MultiException multiException = new MultiException();
                    multiException.add(new WineryRepositoryException("Root YAML file not found."));
                    return multiException;
                });
        } catch (IOException e) {
            MultiException multiException = new MultiException();
            multiException.add(new WineryRepositoryException("Root YAML file not found.", e));
            throw multiException;
        }
    }

    public void convertX2Y(Definitions definitions, Path outPath) throws MultiException {
        new X2YConverter(this.repository).convert(definitions/*, outPath*/);
    }
}
