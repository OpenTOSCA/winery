package org.eclipse.winery.repository;

import org.eclipse.winery.common.ids.definitions.DefinitionsChildId;

public class ConsistencyCheckError {

	private DefinitionsChildId checkedId;
	private DefinitionsChildId inconsistentId;

	@Override
	public String toString() {
		return getErrorMessageForIds();
	}

	private String getErrorMessageForIds() {
		return "Found error by " + this.getCheckedId().getClass().getCanonicalName()
			+ "checking id" + this.getCheckedId().getQName() + " with inconsistend Id "
			+ this.getInconsistentId().getQName();
	}

	public DefinitionsChildId getCheckedId() {
		return this.checkedId;
	}

	public void setCheckedId(DefinitionsChildId checkedId) {
		this.checkedId = checkedId;
	}

	public DefinitionsChildId getInconsistentId() {
		return this.inconsistentId;
	}

	public void setInconsistentId(DefinitionsChildId inconsistentId) {
		this.inconsistentId = inconsistentId;
	}
}
