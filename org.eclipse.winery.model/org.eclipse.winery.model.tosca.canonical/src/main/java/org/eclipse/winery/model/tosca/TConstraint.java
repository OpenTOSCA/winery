/*******************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.model.tosca;

import java.io.Serializable;
import java.util.Objects;

import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;

public class TConstraint implements Serializable {

    protected Object any;
    protected String constraintType;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TConstraint)) return false;
        TConstraint that = (TConstraint) o;
        return Objects.equals(any, that.any) &&
            Objects.equals(constraintType, that.constraintType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(any, constraintType);
    }

    @Nullable
    public Object getAny() {
        return any;
    }

    public void setAny(@Nullable Object value) {
        this.any = value;
    }

    @NonNull
    public String getConstraintType() {
        return constraintType;
    }

    public void setConstraintType(String value) {
        this.constraintType = Objects.requireNonNull(value);
    }
}
