/*******************************************************************************
 * Copyright (c) 2019-2020 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.model.tosca.extensions;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

import org.eclipse.winery.model.tosca.TTopologyTemplate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "otPatternRefinementModel")
public class OTPatternRefinementModel extends OTRefinementModel {

    @XmlElement(name = "RefinementStructure")
    private TTopologyTemplate refinementStructure;

    @XmlElementWrapper(name = "AttributeMappings")
    @XmlElement(name = "AttributeMapping")
    private List<OTAttributeMapping> attributeMappings;

    @XmlElementWrapper(name = "StayMappings")
    @XmlElement(name = "StayMapping")
    private List<OTStayMapping> stayMappings;

    @Deprecated
    public OTPatternRefinementModel() { }

    public OTPatternRefinementModel(Builder builder) {
        super(builder);
        this.refinementStructure = builder.refinementStructure;
        this.attributeMappings = builder.attributeMappings;
        this.stayMappings = builder.stayMappings;
    }

    @NonNull
    @JsonIgnore
    @XmlTransient
    public TTopologyTemplate getRefinementTopology() {
        if (refinementStructure == null) {
            refinementStructure = new TTopologyTemplate();
        }
        return refinementStructure;
    }

    public TTopologyTemplate getRefinementStructure() {
        return getRefinementTopology();
    }

    public void setRefinementTopology(TTopologyTemplate refinementStructure) {
        this.refinementStructure = refinementStructure;
    }

    @Nullable
    public List<OTAttributeMapping> getAttributeMappings() {
        return attributeMappings;
    }

    public void setAttributeMappings(List<OTAttributeMapping> attributeMappings) {
        this.attributeMappings = attributeMappings;
    }

    @Nullable
    public List<OTStayMapping> getStayMappings() {
        return stayMappings;
    }

    public void setStayMappings(List<OTStayMapping> stayMappings) {
        this.stayMappings = stayMappings;
    }

    public static class Builder extends OTRefinementModel.Builder<Builder> {

        private TTopologyTemplate refinementStructure;
        private List<OTAttributeMapping> attributeMappings;
        private List<OTStayMapping> stayMappings;

        public Builder() { }

        public Builder setRefinementStructure(TTopologyTemplate refinementStructure) {
            this.refinementStructure = refinementStructure;
            return self();
        }

        public Builder setAttributeMappings(List<OTAttributeMapping> attributeMappings) {
            this.attributeMappings = attributeMappings;
            return self();
        }

        public Builder setStayMappings(List<OTStayMapping> stayMappings) {
            this.stayMappings = stayMappings;
            return self();
        }

        public OTPatternRefinementModel build() {
            return new OTPatternRefinementModel(this);
        }

        @Override
        public Builder self() {
            return null;
        }
    }
}
