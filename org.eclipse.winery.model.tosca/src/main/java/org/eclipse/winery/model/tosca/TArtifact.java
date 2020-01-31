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

package org.eclipse.winery.model.tosca;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.namespace.QName;

import org.eclipse.winery.model.tosca.visitor.Visitor;

// this entire class is added to support YAML mode
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tArtifact")
public class TArtifact extends TEntityTemplate {

    @XmlAttribute(name = "file", required = true)
    protected String file;

    @XmlAttribute(name = "targetLocation", required = false)
    protected String targetLocation;

    public TArtifact() {

    }

    public TArtifact(Builder builder) {
        super(builder);
        this.file = builder.file;
        this.targetLocation = builder.targetLocation;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getTargetLocation() {
        return targetLocation;
    }

    public void setTargetLocation(String targetLocation) {
        this.targetLocation = targetLocation;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String getName() {
        return getId();
    }

    @Override
    public void setName(String value) {
        setId(value);
    }

    public static class Builder extends TEntityTemplate.Builder<TArtifact.Builder> {
        private String file;
        private String targetLocation;

        public Builder(String id, QName type) {
            super(id, type);
        }

        public Builder setFile(String file) {
            this.file = file;
            return self();
        }

        public Builder setTargetLocation(String location) {
            this.targetLocation = location;
            return self();
        }

        @Override
        public TArtifact.Builder self() {
            return this;
        }
    }
}
