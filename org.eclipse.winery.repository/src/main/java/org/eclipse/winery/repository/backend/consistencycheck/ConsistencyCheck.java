/**
 * Copyright (c) 2017 University of Stuttgart.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 * Oliver Kopp - initial API and implementation
 *******************************************************************************/
package org.eclipse.winery.repository.backend.consistencycheck;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.eclipse.winery.common.ids.definitions.ArtifactTemplateId;
import org.eclipse.winery.common.ids.definitions.ArtifactTypeId;
import org.eclipse.winery.common.ids.definitions.CapabilityTypeId;
import org.eclipse.winery.common.ids.definitions.DefinitionsChildId;
import org.eclipse.winery.common.ids.definitions.NodeTypeId;
import org.eclipse.winery.common.ids.definitions.NodeTypeImplementationId;
import org.eclipse.winery.common.ids.definitions.PolicyTemplateId;
import org.eclipse.winery.common.ids.definitions.RelationshipTypeImplementationId;
import org.eclipse.winery.common.ids.definitions.RequirementTypeId;
import org.eclipse.winery.common.ids.definitions.ServiceTemplateId;
import org.eclipse.winery.repository.ConsistencyCheckError;
import org.eclipse.winery.repository.backend.IRepository;

public class ConsistencyCheck {

	public void checkConsistency(IRepository repository) {
 
	}

	public List<ConsistencyCheckError> checkForConsistency(IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();

		errors.addAll(checkConsistencyArtifactTemplate(repository.getAllDefinitionsChildIds(ArtifactTemplateId.class), repository));
		errors.addAll(checkConsistencyPolicyTemplate(repository.getAllDefinitionsChildIds(PolicyTemplateId.class), repository));
		errors.addAll(checkConsistencyServiceTemplate(repository.getAllDefinitionsChildIds(ServiceTemplateId.class), repository));

		errors.addAll(checkConsistencyNodeTypeImplementation(repository.getAllDefinitionsChildIds(NodeTypeImplementationId.class), repository));
		errors.addAll(checkConsistencyRelationshipTypeImplementation(repository.getAllDefinitionsChildIds(RelationshipTypeImplementationId.class), repository));
		errors.addAll(checkConsistencyArtifactType(repository.getAllDefinitionsChildIds(ArtifactTypeId.class), repository));

		errors.addAll(checkConsistencyCapabilityType(repository.getAllDefinitionsChildIds(CapabilityTypeId.class), repository));
		errors.addAll(checkConsistencyNodeType(repository.getAllDefinitionsChildIds(NodeTypeId.class), repository));
		errors.addAll(checkConsistencyRequirementType(repository.getAllDefinitionsChildIds(RequirementTypeId.class), repository));

		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyArtifactTemplate(Set<ArtifactTemplateId> artifactTemplateIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (ArtifactTemplateId id : artifactTemplateIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyPolicyTemplate(Set<PolicyTemplateId> policyTemplateIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (PolicyTemplateId id : policyTemplateIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyServiceTemplate(Set<ServiceTemplateId> serviceTemplateIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (ServiceTemplateId id : serviceTemplateIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyNodeTypeImplementation(Set<NodeTypeImplementationId> nodeTypeImplementationIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (NodeTypeImplementationId id : nodeTypeImplementationIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyRelationshipTypeImplementation(Set<RelationshipTypeImplementationId> relationshipTypeImplementationIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (RelationshipTypeImplementationId id : relationshipTypeImplementationIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyArtifactType(Set<ArtifactTypeId> artifactTypeIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (ArtifactTypeId id : artifactTypeIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyCapabilityType(Set<CapabilityTypeId> capabilityTypeIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (CapabilityTypeId id : capabilityTypeIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyNodeType(Set<NodeTypeId> nodeTypeIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (NodeTypeId id : nodeTypeIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	private List<ConsistencyCheckError> checkConsistencyRequirementType(Set<RequirementTypeId> requirementTypeIds, IRepository repository) {
		List<ConsistencyCheckError> errors = new ArrayList<>();
		for (RequirementTypeId id : requirementTypeIds) {
			checkForTypeRelation(errors, id, repository);
		}
		return errors;
	}

	/**
	 * This Method checks for a {@link DefinitionsChildId} if Links exist and if they exist if they are Regular for the Repository {@link IRepository}
	 * @param errors List of all Error Found.
	 * @param definitionsChildId definitionsChildId to Check.
	 * @param repository repository to use for the Check.
	 */
	private static void checkForTypeRelation(List<ConsistencyCheckError> errors, DefinitionsChildId definitionsChildId, IRepository repository) {
		Collection<DefinitionsChildId> linked;
		try {
			linked = repository.getReferencedDefinitionsChildIds(definitionsChildId);
			// get All Linke TOSCAComponentIds
			for (DefinitionsChildId l : linked) {
				// Iterate all linked TOSCAComponentIds
				if (!repository.exists(l)) { // If Repository already has the linked TOSCAComponentId in it.
					ConsistencyCheckError consistencyError = new ConsistencyCheckError();
					consistencyError.setCheckedId(definitionsChildId);
					consistencyError.setInconsistentId(l);
					errors.add(consistencyError);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
