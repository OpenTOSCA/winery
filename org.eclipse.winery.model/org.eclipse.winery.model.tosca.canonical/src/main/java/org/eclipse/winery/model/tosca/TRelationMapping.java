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

import javax.xml.namespace.QName;

import org.eclipse.winery.model.tosca.visitor.Visitor;

public class TRelationMapping extends TPrmMapping {

    private QName relationType;

    private TRelationDirection direction;

    private QName validSourceOrTarget;

    public QName getRelationType() {
        return relationType;
    }

    public void setRelationType(QName relationType) {
        this.relationType = relationType;
    }

    public TRelationDirection getDirection() {
        return direction;
    }

    public void setDirection(TRelationDirection direction) {
        this.direction = direction;
    }

    public QName getValidSourceOrTarget() {
        return validSourceOrTarget;
    }

    public void setValidSourceOrTarget(QName validSourceOrTarget) {
        this.validSourceOrTarget = validSourceOrTarget;
    }

    @Override
    public boolean equals(Object obj) {
        return obj instanceof TRelationMapping
            && getId().equals(((TRelationMapping) obj).getId());
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
