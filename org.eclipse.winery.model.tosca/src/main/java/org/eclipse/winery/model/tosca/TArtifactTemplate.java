/*******************************************************************************
 * Copyright (c) 2013-2017 Contributors to the Eclipse Foundation
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

import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;
import org.eclipse.winery.model.tosca.constants.Namespaces;
import org.eclipse.winery.model.tosca.constants.QNames;

import javax.xml.bind.annotation.*;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


/**
 * <p>Java class for tArtifactTemplate complex type.
 * <p>
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;complexType name="tArtifactTemplate">
 *   &lt;complexContent>
 *     &lt;extension base="{http://docs.oasis-open.org/tosca/ns/2011/12}tEntityTemplate">
 *       &lt;sequence>
 *         &lt;element name="ArtifactReferences" minOccurs="0">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="ArtifactReference" type="{http://docs.oasis-open.org/tosca/ns/2011/12}tArtifactReference"
 * maxOccurs="unbounded"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *       &lt;/sequence>
 *       &lt;attribute name="name" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;anyAttribute processContents='lax' namespace='##other'/>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tArtifactTemplate", propOrder = {
    "policies", "artifactReferences"
})
public class TArtifactTemplate
    extends TEntityTemplate {

    @XmlElement(name = "Policies", namespace = Namespaces.TOSCA_WINERY_EXTENSIONS_NAMESPACE)
    protected TArtifactTemplate.Policies policies;
    
    @XmlElement(name = "ArtifactReferences")
    protected TArtifactTemplate.ArtifactReferences artifactReferences;
    
    @XmlAttribute(name = "name")
    protected String name;

    public TArtifactTemplate() {
    }

    public TArtifactTemplate(Builder builder) {
        super(builder);
        this.name = builder.name;
        this.artifactReferences = builder.artifactReferences;
        this.policies = builder.policies;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TArtifactTemplate)) return false;
        if (!super.equals(o)) return false;
        TArtifactTemplate that = (TArtifactTemplate) o;
        return Objects.equals(artifactReferences, that.artifactReferences) &&
            Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), artifactReferences, name);
    }

    /**
     * Gets the value of the policies property.
     *
     * @return possible object is {@link TPolicy}
     */
    public TArtifactTemplate.Policies getPolicies() {
        return policies;
    }

    /**
     * Gets the value of the first available encrypted policy if there is one.
     *
     * @return possible object is {@link TPolicy}
     */
    public TPolicy getEncryptionPolicy() {
        if (Objects.isNull(policies)) {
            return null;
        }
        for (TPolicy p : policies.getPolicies()) {
            if (QNames.WINERY_ENCRYPTION_POLICY_TYPE.equals(p.getPolicyType())) {
                return p;
            }
        }        
        return null;
    }

    /**
     * Gets the value of the first available signing policy if there is one.
     *
     * @return possible object is {@link TPolicy}
     */
    public TPolicy getSigningPolicy() {
        if (Objects.isNull(policies)) {
            return null;
        }
        for (TPolicy p : policies.getPolicies()) {
            if (QNames.WINERY_SIGNING_POLICY_TYPE.equals(p.getPolicyType())) {
                return p;
            }
        }
        return null;
    }

    /**
     * Sets the value of the policies property.
     *
     * @param value allowed object is {@link TArtifactTemplate.Policies }
     */
    public void setPolicies(TArtifactTemplate.Policies value) {
        this.policies = value;
    }
    
    /**
     * Gets the value of the artifactReferences property.
     *
     * @return possible object is {@link TArtifactTemplate.ArtifactReferences }
     */
    /*@Nullable*/
    public TArtifactTemplate.ArtifactReferences getArtifactReferences() {

        return artifactReferences;
    }

    /**
     * Sets the value of the artifactReferences property.
     *
     * @param value allowed object is {@link TArtifactTemplate.ArtifactReferences }
     */
    public void setArtifactReferences(TArtifactTemplate.ArtifactReferences value) {
        this.artifactReferences = value;
    }
    
    /**
     * Gets the value of the name property.
     *
     * @return possible object is {@link String }
     */
    @Nullable
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     *
     * @param value allowed object is {@link String }
     */
    public void setName(String value) {
        this.name = value;
    }


    /**
     * <p>Java class for anonymous complex type.
     * <p>
     * <p>The following schema fragment specifies the expected content contained within this class.
     * <p>
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="ArtifactReference" type="{http://docs.oasis-open.org/tosca/ns/2011/12}tArtifactReference"
     * maxOccurs="unbounded"/>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "artifactReference"
    })
    public static class ArtifactReferences {

        @XmlElement(name = "ArtifactReference", required = true)
        protected List<TArtifactReference> artifactReference;

        /**
         * Gets the value of the artifactReference property.
         * <p>
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the artifactReference property.
         * <p>
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getArtifactReference().add(newItem);
         * </pre>
         * <p>
         * <p>
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link TArtifactReference }
         */
        @NonNull
        public List<TArtifactReference> getArtifactReference() {
            if (artifactReference == null) {
                artifactReference = new ArrayList<TArtifactReference>();
            }
            return this.artifactReference;
        }
    }
    
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "policy"
    })
    public static class Policies {

        @XmlElement(name = "Policy", namespace = Namespaces.TOSCA_NAMESPACE, required = true)
        protected List<TPolicy> policy;

        /**
         * Gets the value of the policies property.
         * <p>
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the JAXB object.
         * This is why there is not a <CODE>set</CODE> method for the wineryExtensionPolicies property.
         * <p>
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getPolicies().add(newItem);
         * </pre>
         * <p>
         * <p>
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link TPolicy }
         */
        @NonNull
        public List<TPolicy> getPolicies() {
            if (policy == null) {
                policy = new ArrayList<>();
            }
            return this.policy;
        }
    }

    public static class Builder extends TEntityTemplate.Builder<Builder> {
        private String name;
        private TArtifactTemplate.ArtifactReferences artifactReferences;
        private TArtifactTemplate.Policies policies;
        
        
        public Builder(String id, QName type) {
            super(id, type);
        }

        public Builder(TEntityTemplate entityTemplate) {
            super(entityTemplate);
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setArtifactReferences(TArtifactTemplate.ArtifactReferences artifactReferences) {
            this.artifactReferences = artifactReferences;
            return this;
        }

        public Builder addArtifactReferences(TArtifactTemplate.ArtifactReferences artifactReferences) {
            if (artifactReferences == null || artifactReferences.getArtifactReference().isEmpty()) {
                return this;
            }

            if (this.artifactReferences == null) {
                this.artifactReferences = artifactReferences;
            } else {
                this.artifactReferences.getArtifactReference().addAll(artifactReferences.artifactReference);
            }
            return this;
        }

        public Builder addArtifactReferences(List<TArtifactReference> artifactReferences) {
            if (artifactReferences == null) {
                return this;
            }

            TArtifactTemplate.ArtifactReferences tmp = new TArtifactTemplate.ArtifactReferences();
            tmp.getArtifactReference().addAll(artifactReferences);
            return addArtifactReferences(tmp);
        }

        public Builder addArtifactReferences(TArtifactReference artifactReferences) {
            if (artifactReferences == null) {
                return this;
            }

            TArtifactTemplate.ArtifactReferences tmp = new TArtifactTemplate.ArtifactReferences();
            tmp.getArtifactReference().add(artifactReferences);
            return addArtifactReferences(tmp);
        }

        public Builder setPolicies(TArtifactTemplate.Policies policies) {
            this.policies = policies;
            return this;
        }

        public Builder addPolicies(TArtifactTemplate.Policies policies) {
            if (policies == null || policies.getPolicies().isEmpty()) {
                return this;
            }

            if (this.policies == null) {
                this.policies = policies;
            } else {
                this.policies.getPolicies().addAll(policies.policy);
            }
            return this;
        }

        public Builder addPolicies(List<TPolicy> policies) {
            if (policies == null) {
                return this;
            }

            TArtifactTemplate.Policies tmp = new TArtifactTemplate.Policies();
            tmp.getPolicies().addAll(policies);
            return addPolicies(tmp);
        }

        public Builder addPolicies(TPolicy policy) {
            if (policy == null) {
                return this;
            }

            TArtifactTemplate.Policies tmp = new TArtifactTemplate.Policies();
            tmp.getPolicies().add(policy);
            return addPolicies(tmp);
        }

        @Override
        public Builder self() {
            return this;
        }

        public TArtifactTemplate build() {
            return new TArtifactTemplate(this);
        }
    }
}
