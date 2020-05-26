/*******************************************************************************
 * Copyright (c) 2015-2017 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.bpmn2bpel;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.eclipse.winery.bpmn2bpel.parser.ParseException;
import org.eclipse.winery.bpmn2bpel.planwriter.PlanWriterException;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class BPMN4Tosca2BpelTest {

    protected static final Path RESOURCES_DIR;

    static {
        Path stub;
        try {
            stub = Paths.get(BPMN4Tosca2BpelTest.class.getClassLoader().getResource("bpmn4tosca").toURI());
        } catch (URISyntaxException e) {
            stub = Paths.get(System.getProperty("java.io.tmpdir"), "resolution-failed");
        }
        RESOURCES_DIR = stub;
    }

    @Test
    public void testTransform() throws ParseException, PlanWriterException, MalformedURLException, URISyntaxException {
        URI srcUri = RESOURCES_DIR.resolve("bpmn4tosca.json").toUri();
        URI targetUri = RESOURCES_DIR.resolve("managementplan.zip").toUri();
        BPMN4Tosca2BpelTest.class.getResource(".");
        Bpmn4Tosca2Bpel transformer = new Bpmn4Tosca2Bpel();
        transformer.transform(srcUri, targetUri);
    }

    @Test
    public void testTransformGateway()
        throws ParseException, PlanWriterException, MalformedURLException, URISyntaxException {
        URI srcUri = RESOURCES_DIR.resolve("bpmn4tosca.exclusivegateway.json").toUri();
        URI targetUri = RESOURCES_DIR.resolve("managementplan.exclusivegateway.zip").toUri();
        BPMN4Tosca2BpelTest.class.getResource(".");
        Bpmn4Tosca2Bpel transformer = new Bpmn4Tosca2Bpel();
        transformer.transform(srcUri, targetUri);
    }

    @Test
    public void testNoEndpointGateway()
        throws ParseException, PlanWriterException, MalformedURLException, URISyntaxException {
        URI srcUri = RESOURCES_DIR.resolve("bpmn4tosca.noEndpoint.json").toUri();
        URI targetUri = RESOURCES_DIR.resolve("managementplan.noEndpoint.zip").toUri();
        BPMN4Tosca2BpelTest.class.getResource(".");
        Bpmn4Tosca2Bpel transformer = new Bpmn4Tosca2Bpel();
        transformer.transform(srcUri, targetUri);
    }

    @Test
    public void testUndefinedEndpointGateway()
        throws ParseException, PlanWriterException, MalformedURLException, URISyntaxException {
        URI srcUri = RESOURCES_DIR.resolve("bpmn4tosca.undefinedEndpoint.json").toUri();
        URI targetUri = RESOURCES_DIR.resolve("managementplan.undefinedEndpoint.zip").toUri();
        BPMN4Tosca2BpelTest.class.getResource(".");
        Bpmn4Tosca2Bpel transformer = new Bpmn4Tosca2Bpel();
        transformer.transform(srcUri, targetUri);
    }

    @Test
    public void testNonExistingEndpointGateway()
        throws ParseException, PlanWriterException, MalformedURLException, URISyntaxException {
        URI srcUri = RESOURCES_DIR.resolve("bpmn4tosca.nonExistingEndpoint.json").toUri();
        URI targetUri = RESOURCES_DIR.resolve("managementplan.nonExistingEndpoint.zip").toUri();

        BPMN4Tosca2BpelTest.class.getResource(".");

        Bpmn4Tosca2Bpel transformer = new Bpmn4Tosca2Bpel();
        assertThrows(ParseException.class, () -> transformer.transform(srcUri, targetUri));
    }
}
