package org.eclipse.winery.TestConsistency.entitytypeimplementations;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.eclipse.winery.common.ids.definitions.NodeTypeImplementationId;
import org.eclipse.winery.common.ids.definitions.ServiceTemplateId;
import org.eclipse.winery.common.ids.definitions.TOSCAComponentId;
import org.eclipse.winery.repository.backend.Repository;
import org.eclipse.winery.repository.export.TOSCAExportUtil;
import org.eclipse.winery.repository.resources.AbstractResourceTest;

import org.junit.Test;

import static org.junit.Assert.fail;

/**
 * Created by Lati on 08.08.17.
 */
public class TestConsistencyNodeTypeImplementationId extends AbstractResourceTest {

	/**
	 * testConsistency - checks consistency between Repository and its linked elements for Duplicates.
	 * @throws Exception
	 */
	@Test
	public void testConsistency() throws Exception{
		this.setRevisionTo("c25aa724201824fce6eddcc7c35a666c6e015880"); // prepare local Repository.
		
		List<String> errors = new ArrayList<>(); // collect Errors in list.
		
		Set<NodeTypeImplementationId> list = Repository.INSTANCE.getAllTOSCAComponentIds(NodeTypeImplementationId.class);
		// Get All PolicyTemplateIds from Repository 
		for (NodeTypeImplementationId id : list) { // Iterate all PolicyTemplateIds
			Collection<TOSCAComponentId> linked = TOSCAExportUtil.getReferencedTOSCAComponentIds(id); 
			// get All Linke TOSCAComponentIds
			for (TOSCAComponentId l : linked) {
				// Iterate all linked TOSCAComponentIds
					if (!Repository.INSTANCE.exists(l)) { // If Repository already has the linked TOSCAComponentId in it.
					errors.add(id.getQName().toString() + l.getQName().toString()); // Collect found Error.
				}
			}
		}
		if (!errors.isEmpty()) {
			fail(); // If we have found one thing the Test Fails.
		}
	}
}
