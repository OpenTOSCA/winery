/********************************************************************************
 * Copyright (c) 2017-2020 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.model.tosca.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.xml.namespace.QName;

import org.eclipse.winery.model.tosca.yaml.support.YTMapRequirementDefinition;
import org.eclipse.winery.model.tosca.yaml.visitor.AbstractParameter;
import org.eclipse.winery.model.tosca.yaml.visitor.AbstractResult;
import org.eclipse.winery.model.tosca.yaml.visitor.IVisitor;

import org.eclipse.jdt.annotation.NonNull;

public class YTGroupType extends YTNodeOrGroupType {
    private List<QName> members;
    private List<YTMapRequirementDefinition> requirements;
    private Map<String, YTCapabilityDefinition> capabilities;
    private Map<String, YTInterfaceDefinition> interfaces;

    protected YTGroupType(Builder builder) {
        super(builder);
        this.setMembers(builder.members);
        this.setRequirements(builder.requirements);
        this.setCapabilities(builder.capabilities);
        this.setInterfaces(builder.interfaces);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof YTGroupType)) return false;
        if (!super.equals(o)) return false;
        YTGroupType that = (YTGroupType) o;
        return Objects.equals(getMembers(), that.getMembers()) &&
            Objects.equals(getRequirements(), that.getRequirements()) &&
            Objects.equals(getCapabilities(), that.getCapabilities()) &&
            Objects.equals(getInterfaces(), that.getInterfaces());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getMembers(), getRequirements(), getCapabilities(), getInterfaces());
    }

    @Override
    public String toString() {
        return "TGroupType{" +
            "members=" + getMembers() +
            ", requirements=" + getRequirements() +
            ", capabilities=" + getCapabilities() +
            ", interfaces=" + getInterfaces() +
            "} " + super.toString();
    }

    @NonNull
    public List<QName> getMembers() {
        if (this.members == null) {
            this.members = new ArrayList<>();
        }

        return members;
    }

    public void setMembers(List<QName> members) {
        this.members = members;
    }

    @NonNull
    public List<YTMapRequirementDefinition> getRequirements() {
        if (this.requirements == null) {
            this.requirements = new ArrayList<>();
        }

        return requirements;
    }

    public void setRequirements(List<YTMapRequirementDefinition> requirements) {
        this.requirements = requirements;
    }

    @NonNull
    public Map<String, YTCapabilityDefinition> getCapabilities() {
        if (this.capabilities == null) {
            this.capabilities = new LinkedHashMap<>();
        }

        return capabilities;
    }

    public void setCapabilities(Map<String, YTCapabilityDefinition> capabilities) {
        this.capabilities = capabilities;
    }

    @NonNull
    public Map<String, YTInterfaceDefinition> getInterfaces() {
        if (this.interfaces == null) {
            this.interfaces = new LinkedHashMap<>();
        }

        return interfaces;
    }

    public void setInterfaces(Map<String, YTInterfaceDefinition> interfaces) {
        this.interfaces = interfaces;
    }

    public <R extends AbstractResult<R>, P extends AbstractParameter<P>> R accept(IVisitor<R, P> visitor, P parameter) {
        R ir1 = super.accept(visitor, parameter);
        R ir2 = visitor.visit(this, parameter);
        if (ir1 == null) {
            return ir2;
        } else {
            return ir1.add(ir2);
        }
    }

    public static class Builder extends YTEntityType.Builder<Builder> {
        private List<QName> members;
        private List<YTMapRequirementDefinition> requirements;
        private Map<String, YTCapabilityDefinition> capabilities;
        private Map<String, YTInterfaceDefinition> interfaces;

        public Builder() {

        }

        public Builder(YTEntityType entityType) {
            super(entityType);
        }

        @Override
        public Builder self() {
            return this;
        }

        public Builder setMembers(List<QName> members) {
            this.members = members;
            return this;
        }

        public Builder setRequirements(List<YTMapRequirementDefinition> requirements) {
            this.requirements = requirements;
            return this;
        }

        public Builder setCapabilities(Map<String, YTCapabilityDefinition> capabilities) {
            this.capabilities = capabilities;
            return this;
        }

        public Builder setInterfaces(Map<String, YTInterfaceDefinition> interfaces) {
            this.interfaces = interfaces;
            return this;
        }

        public Builder addMembers(List<QName> members) {
            if (members == null || members.isEmpty()) {
                return this;
            }

            if (this.members == null) {
                this.members = new ArrayList<>(members);
            } else {
                this.members.addAll(members);
            }

            return this;
        }

        public Builder addMembers(QName member) {
            if (member == null) {
                return this;
            }

            return addMembers(Collections.singletonList(member));
        }

        public Builder addRequirements(List<YTMapRequirementDefinition> requirements) {
            if (requirements == null || requirements.isEmpty()) {
                return this;
            }

            if (this.requirements == null) {
                this.requirements = new ArrayList<>(requirements);
            } else {
                this.requirements.addAll(requirements);
            }

            return this;
        }

        public Builder addRequirements(YTMapRequirementDefinition requirement) {
            if (requirement == null || requirement.isEmpty()) {
                return this;
            }

            return addRequirements(Collections.singletonList(requirement));
        }

        public Builder addRequirements(Map<String, YTRequirementDefinition> requirements) {
            if (requirements == null || requirements.isEmpty()) {
                return this;
            }

            // TOSCA YAML syntax: one RequirementDefinition per MapRequirementDefinition
            requirements.forEach((key, value) -> {
                YTMapRequirementDefinition tmp = new YTMapRequirementDefinition();
                tmp.put(key, value);
                addRequirements(tmp);
            });

            return this;
        }

        public Builder addRequirements(String name, YTRequirementDefinition requirement) {
            if (name == null || name.isEmpty()) {
                return this;
            }

            return addRequirements(Collections.singletonMap(name, requirement));
        }

        public Builder addCapabilities(Map<String, YTCapabilityDefinition> capabilities) {
            if (capabilities == null || capabilities.isEmpty()) {
                return this;
            }

            if (this.capabilities == null) {
                this.capabilities = new LinkedHashMap<>(capabilities);
            } else {
                this.capabilities.putAll(capabilities);
            }

            return this;
        }

        public Builder addCapabilities(String key, YTCapabilityDefinition capability) {
            if (key == null || key.isEmpty()) {
                return this;
            }

            return addCapabilities(Collections.singletonMap(key, capability));
        }

        public Builder addInterfaces(Map<String, YTInterfaceDefinition> interfaces) {
            if (interfaces == null || interfaces.isEmpty()) {
                return this;
            }

            if (this.interfaces == null) {
                this.interfaces = new LinkedHashMap<>(interfaces);
            } else {
                this.interfaces.putAll(interfaces);
            }

            return this;
        }

        public Builder addInterfaces(String name, YTInterfaceDefinition interfaceDefinition) {
            if (name == null) {
                return this;
            }

            return addInterfaces(Collections.singletonMap(name, interfaceDefinition));
        }

        public YTGroupType build() {
            return new YTGroupType(this);
        }
    }
}
