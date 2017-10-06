/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 * Lukas Harzenetter - initial API and implementation
 */

package org.eclipse.winery.repository.rest.resources.entitytypeimplementations.relationshiptypeimplementations;

import org.eclipse.winery.repository.rest.resources.AbstractResourceTest;

import org.junit.Test;

public class RelationshipTypeImplementationResourceTest extends AbstractResourceTest {

	private final String ENTITY_TYPE = "relationshiptypeimplementations/";
	private final String INSTANCE_XML_PATH = "entityimplementations/" + ENTITY_TYPE + "instance.xml";
	private final String BAOBAB_JSON_PATH = "entityimplementations/" + ENTITY_TYPE + "baobab_inital.json";

	public static final String FOLDERPATH = "http%3A%2F%2Fwinery.opentosca.org%2Ftest%2Frelationshiptypeimplementations%2Ffruits/kiwi_implementation";


	private final String INSTANCE_URL = ENTITY_TYPE + FOLDERPATH;

	@Test
	public void getInstanceXml() throws Exception {
		this.setRevisionTo("c25aa724201824fce6eddcc7c35a666c6e015880");
		this.assertGet(testStringConverter(INSTANCE_URL), INSTANCE_XML_PATH);
	}

	@Test
	public void getServicetemplate() throws Exception {
		this.setRevisionTo("c25aa724201824fce6eddcc7c35a666c6e015880");
		this.assertGet(ENTITY_TYPE, BAOBAB_JSON_PATH);
	}
	
	@Test
	public void getComponentAsJson() throws Exception {
		this.setRevisionTo("3fe0df76e98d46ead68295920e5d1cf1354bdea1");
		this.assertGet("relationshiptypeimplementations/http%253A%252F%252Fwinery.opentosca.org%252Ftest%252Frelationshiptypeimplementations%252Ffruits/kiwi_implementation/", "entityimplementations/relationshiptypeimplementations/initial.json");
	}
}
