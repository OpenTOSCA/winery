/********************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.repository.export;

import java.util.Objects;

public class ToscaMetaEntry {
    
    private String name;
    private String contentType;
    private String digestAlgorithm;
    private String digestValue;
        
    private ToscaMetaEntry(Builder builder) {
        this.name = builder.name;
        this.contentType = builder.contentType;
        this.digestAlgorithm = builder.digestAlgorithm;
        this.digestValue = builder.digestValue;
    }

    public static class Builder {
        // Required parameters
        private final String name;
        private final String contentType;

        private String digestAlgorithm;
        private String digestValue;

        public Builder(String name, String contentType) {
            this.name = name;
            this.contentType = contentType;
        }

        public Builder digestAlgorithm(String digestAlgorithm) {
            this.digestAlgorithm = digestAlgorithm;
            return this;
        }

        public Builder digestValue(String digestValue) {
            this.digestValue = digestValue;
            return this;
        }

        public ToscaMetaEntry build() {
            return new ToscaMetaEntry(this);
        }
    }
    
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append(System.lineSeparator());
        sb.append("Name: ");
        sb.append(name);
        sb.append(System.lineSeparator());
        sb.append("Content-Type: ");
        sb.append(contentType);
        sb.append(System.lineSeparator());
        if (Objects.nonNull(digestAlgorithm)) {
            sb.append("Digest-Algorithm: ");
            sb.append(digestAlgorithm);
            sb.append(System.lineSeparator());
        }
        if (Objects.nonNull(digestValue)) {
            sb.append("Digest: ");
            sb.append(digestValue);
            sb.append(System.lineSeparator());
        }
        return sb.toString();
    }
    
    public void setDigestValue(String value) {
        this.digestValue = value;
    }

    public String getDigestValue() {
        return this.digestValue;
    }
    
}
