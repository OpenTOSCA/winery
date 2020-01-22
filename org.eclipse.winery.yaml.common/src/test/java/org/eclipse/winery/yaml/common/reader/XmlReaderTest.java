/********************************************************************************
 * Copyright (c) 2017 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.yaml.common.reader;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.eclipse.winery.yaml.common.AbstractTest;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

// todo ensure it works with the new Reader, Writer, Data model, Converter
public class XmlReaderTest extends AbstractTest {
    @BeforeAll
    private static void setPath() {
        AbstractTest.path = Paths.get("src/test/resources/reader");
    }

    @DisplayName("Simple XML reader test")
    @ParameterizedTest
    @MethodSource("getXmlFiles")
    public void testReader(Path name) throws Exception {
        Assertions.assertNotNull(getXmlDefinitions(name));
    }
}
