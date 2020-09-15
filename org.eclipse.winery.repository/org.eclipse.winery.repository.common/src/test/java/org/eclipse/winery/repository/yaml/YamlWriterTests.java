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

package org.eclipse.winery.repository.yaml;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.winery.model.tosca.yaml.YTConstraintClause;
import org.eclipse.winery.model.tosca.yaml.YTImportDefinition;
import org.eclipse.winery.model.tosca.yaml.YTPropertyAssignment;
import org.eclipse.winery.model.tosca.yaml.YTServiceTemplate;
import org.eclipse.winery.model.tosca.yaml.support.Defaults;
import org.eclipse.winery.repository.converter.writer.YamlPrinter;
import org.eclipse.winery.repository.converter.writer.YamlWriter;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import org.junit.jupiter.params.provider.ArgumentsSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class YamlWriterTests {

    @ParameterizedTest
    @ArgumentsSource(ServiceTemplatesProvider.class)
    public void testServiceTemplates(YTServiceTemplate template, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(template, new YamlWriter.Parameter(0));
        assertEquals(expected, p.toString());
    }

    @ParameterizedTest
    @ArgumentsSource(ImportArgumentsProvider.class)
    public void testImports(YTImportDefinition importDef, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(importDef, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    @ParameterizedTest
    @ArgumentsSource(ConstraintClausesArgumentsProvider.class)
    public void testConstraintClauses(YTConstraintClause constraint, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(constraint, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    @ParameterizedTest
    @ArgumentsSource(PropertyAssignmentArgumentsProvider.class)
    public void testPropertyAssignmentSerialization(YTPropertyAssignment prop, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(prop, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    @ParameterizedTest
    @ArgumentsSource(PropertyFunctionArgumentsProvider.class)
    public void testPropertyFunctionSerialization(YTPropertyAssignment prop, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(prop, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    static class ServiceTemplatesProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            YTServiceTemplate stWithImports = new YTServiceTemplate.Builder(Defaults.TOSCA_DEFINITIONS_VERSION)
                .addImports("S3Bucket", new YTImportDefinition.Builder("radonnodesaws__AwsS3Bucket.tosca")
                    .setNamespacePrefix("radonnodesaws")
                    .setNamespaceUri("radon.nodes.aws")
                    .build())
                .addImports("Lambda", new YTImportDefinition.Builder("radonnodesaws__AwsLambdaFunctionFromS3.tosca")
                    .setNamespacePrefix("radonnodesaws")
                    .setNamespaceUri("radon.nodes.aws")
                    .build())
                .build();
            return Stream.of(
                Arguments.of(stWithImports, "tosca_definitions_version: tosca_simple_yaml_1_3\n\nimports:\n  - file: radonnodesaws__AwsS3Bucket.tosca\n    namespace_uri: radon.nodes.aws\n    namespace_prefix: radonnodesaws\n  - file: radonnodesaws__AwsLambdaFunctionFromS3.tosca\n    namespace_uri: radon.nodes.aws\n    namespace_prefix: radonnodesaws\n")
            );
        }
    }

    static class ImportArgumentsProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            YTImportDefinition base = new YTImportDefinition.Builder("radonnodes__AwsS3Bucket.tosca")
                .setNamespacePrefix("radonnodesaws")
                .setNamespaceUri("radon.nodes.aws")
                .build();
            return Stream.of(
                Arguments.of(base, "file: radonnodes__AwsS3Bucket.tosca\nnamespace_uri: radon.nodes.aws\nnamespace_prefix: radonnodesaws\n")
            );
        }
    }

    static class ConstraintClausesArgumentsProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            final YTConstraintClause simpleClause = new YTConstraintClause();
            simpleClause.setKey("in_range");
            simpleClause.setList(Arrays.asList("512", "2048"));
            final YTConstraintClause valueClause = new YTConstraintClause();
            valueClause.setKey("key");
            valueClause.setValue("value");
            return Stream.of(
                Arguments.of(simpleClause, "in_range: [ 512, 2048 ]\n"),
                Arguments.of(valueClause, "key: value\n")
            );
        }
    }

    static class PropertyAssignmentArgumentsProvider implements ArgumentsProvider {

        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            final YTPropertyAssignment baseList = new YTPropertyAssignment(Stream.of("a1", "a2").map(YTPropertyAssignment::new).collect(Collectors.toList()));
            final Map<String, YTPropertyAssignment> nestedMap = new HashMap<>();
            nestedMap.put("pre_activities", baseList);
            nestedMap.put("post_activities", baseList);
            nestedMap.put("type", new YTPropertyAssignment("sequence"));
            final List<YTPropertyAssignment> multipleMaps = new ArrayList<>();
            multipleMaps.add(new YTPropertyAssignment(nestedMap));
            multipleMaps.add(new YTPropertyAssignment(nestedMap));
            return Stream.of(
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("key", new YTPropertyAssignment("value"))), "root:\n  key: \"value\"\n"),
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("key", new YTPropertyAssignment((Object) null))), "root:\n  key: null\n"),
                // Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment(""))), "root:\n  key: \"\"\n"),
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("key", new YTPropertyAssignment(""))), "root:\n"),
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("key", new YTPropertyAssignment(Collections.emptyMap()))), "root:\n  key: {}\n"),
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("key", new YTPropertyAssignment(Collections.emptyList()))), "root:\n  key: []\n"),
                Arguments.of(baseList, "root:\n  - \"a1\"\n  - \"a2\"\n"),
                Arguments.of(new YTPropertyAssignment(Collections.singletonMap("entries", baseList)), "root:\n  entries:\n    - \"a1\"\n    - \"a2\"\n"),
                Arguments.of(new YTPropertyAssignment(multipleMaps), "root:\n  - post_activities:\n      - \"a1\"\n      - \"a2\"\n    pre_activities:\n      - \"a1\"\n      - \"a2\"\n    type: \"sequence\"\n  - post_activities:\n      - \"a1\"\n      - \"a2\"\n    pre_activities:\n      - \"a1\"\n      - \"a2\"\n    type: \"sequence\"\n")
            );
        }
    }

    static class PropertyFunctionArgumentsProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            return Stream.of(
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_input", new YTPropertyAssignment("value"))),
                    "root: { get_input: value }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_input", new YTPropertyAssignment(Arrays.asList("hierarchical", "value")))),
                    "root: { get_input: [ hierarchical, value ] }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_property", new YTPropertyAssignment(Arrays.asList("entity_name", "prop_name")))),
                    "root: { get_property: [ entity_name, prop_name ] }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_attribute", new YTPropertyAssignment(Arrays.asList("entity_name", "attribute_name")))),
                    "root: { get_attribute: [ entity_name, attribute_name ] }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_operation_output", new YTPropertyAssignment(Arrays.asList("entity_name", "interface_name", "operation_name", "output_var_name")))),
                    "root: { get_operation_output: entity_name, interface_name, operation_name, output_var_name }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_nodes_of_type", new YTPropertyAssignment("nt_name"))),
                    "root: { get_nodes_of_type: nt_name }\n"),
                Arguments.of(
                    new YTPropertyAssignment(Collections.singletonMap("get_artifact", new YTPropertyAssignment(Arrays.asList("e_name", "a_name", "loc", false)))),
                    "root: { get_artifact: [ e_name, a_name, loc, false ] }\n")
            );
        }
    }
}
