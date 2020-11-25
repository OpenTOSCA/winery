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

package org.eclipse.winery.model.tosca.extensions;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

import org.eclipse.jdt.annotation.NonNull;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tParticipants", propOrder = {
    "participant"
})
public class OTParticipants implements Serializable {

    @XmlElement(name = "Participant", required = true)
    protected List<OTParticipant> participant;

    @Deprecated // used for XML deserialization of API request content
    public OTParticipants() {
    }

    public OTParticipants(Builder builder) {
        this.participant = builder.participant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OTParticipants that = (OTParticipants) o;
        return Objects.equals(participant, that.participant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(participant);
    }

    @NonNull
    public List<OTParticipant> getParticipant() {
        if (participant == null) {
            participant = new ArrayList<>();
        }
        return participant;
    }

    public static class Builder {

        private List<OTParticipant> participant;

        public Builder() {
        }

        public Builder setParticipant(List<OTParticipant> participant) {
            this.participant = participant;
            return this;
        }

        public Builder addParticipant(List<OTParticipant> participant) {
            if (participant == null) {
                return this;
            }
            if (this.participant == null) {
                this.participant = participant;
            } else {
                this.participant.addAll(participant);
            }
            return this;
        }

        public Builder addParticipant(OTParticipant participant) {
            if (participant == null) {
                return this;
            }
            List<OTParticipant> tmp = new ArrayList<>();
            tmp.add(participant);
            return addParticipant(tmp);
        }

        public OTParticipants build() {
            return new OTParticipants(this);
        }
    }
}
