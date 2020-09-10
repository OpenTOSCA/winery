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

import org.eclipse.winery.model.tosca.yaml.TPropertyAssignment;
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
    @ArgumentsSource(PropertyAssignmentArgumentsProvider.class)
    public void testPropertyAssignmentSerialization(TPropertyAssignment prop, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(prop, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    @ParameterizedTest
    @ArgumentsSource(PropertyFunctionArgumentsProvider.class)
    public void testPropertyFunctionSerialization(TPropertyAssignment prop, String expected) {
        YamlWriter writer = new YamlWriter();
        YamlPrinter p = writer.visit(prop, new YamlWriter.Parameter(0).addContext("root"));
        assertEquals(expected, p.toString());
    }

    static class PropertyAssignmentArgumentsProvider implements ArgumentsProvider {

        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            final TPropertyAssignment baseList = new TPropertyAssignment(Stream.of("a1", "a2").map(TPropertyAssignment::new).collect(Collectors.toList()));
            final Map<String, TPropertyAssignment> nestedMap = new HashMap<>();
            nestedMap.put("pre_activities", baseList);
            nestedMap.put("post_activities", baseList);
            nestedMap.put("type", new TPropertyAssignment("sequence"));
            final List<TPropertyAssignment> multipleMaps = new ArrayList<>();
            multipleMaps.add(new TPropertyAssignment(nestedMap));
            multipleMaps.add(new TPropertyAssignment(nestedMap));
            return Stream.of(
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment("value"))), "root:\n  key: \"value\"\n"),
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment((Object)null))), "root:\n  key: null\n"),
//                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment(""))), "root:\n  key: \"\"\n"),
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment(""))), "root:\n"),
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment(Collections.emptyMap()))), "root:\n  key: {}\n"),
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("key", new TPropertyAssignment(Collections.emptyList()))), "root:\n  key: []\n"),
                Arguments.of(baseList,"root:\n  - \"a1\"\n  - \"a2\"\n"),
                Arguments.of(new TPropertyAssignment(Collections.singletonMap("entries", baseList)), "root:\n  entries:\n    - \"a1\"\n    - \"a2\"\n"),
                Arguments.of(new TPropertyAssignment(multipleMaps), "root:\n  - post_activities:\n      - \"a1\"\n      - \"a2\"\n    pre_activities:\n      - \"a1\"\n      - \"a2\"\n    type: \"sequence\"\n  - post_activities:\n      - \"a1\"\n      - \"a2\"\n    pre_activities:\n      - \"a1\"\n      - \"a2\"\n    type: \"sequence\"\n")
            );
        }
    }

    static class PropertyFunctionArgumentsProvider implements ArgumentsProvider {
        @Override
        public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
            return Stream.of(
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_input", new TPropertyAssignment("value"))),
                    "root: { get_input: value }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_input", new TPropertyAssignment(Arrays.asList("hierarchical", "value")))),
                    "root: { get_input: [ hierarchical, value ] }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_property", new TPropertyAssignment(Arrays.asList("entity_name", "prop_name")))),
                    "root: { get_property: [ entity_name, prop_name ] }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_attribute", new TPropertyAssignment(Arrays.asList("entity_name", "attribute_name")))),
                    "root: { get_attribute: [ entity_name, attribute_name ] }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_operation_output", new TPropertyAssignment(Arrays.asList("entity_name", "interface_name", "operation_name", "output_var_name")))),
                    "root: { get_operation_output: entity_name, interface_name, operation_name, output_var_name }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_nodes_of_type", new TPropertyAssignment("nt_name"))),
                    "root: { get_nodes_of_type: nt_name }\n"),
                Arguments.of(
                    new TPropertyAssignment(Collections.singletonMap("get_artifact", new TPropertyAssignment(Arrays.asList("e_name", "a_name", "loc", false)))),
                    "root: { get_artifact: [ e_name, a_name, loc, false ] }\n")
            );
        }
    }
}
