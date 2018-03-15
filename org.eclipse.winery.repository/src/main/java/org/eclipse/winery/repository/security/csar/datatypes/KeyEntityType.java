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

package org.eclipse.winery.repository.security.csar.datatypes;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

@JsonDeserialize(builder = KeyEntityType.Builder.class)
public class KeyEntityType {
    @JsonProperty
    private final String alias;
    @JsonProperty
    private final String algorithm;
    @JsonProperty
    private int keySizeInBits;
    @JsonProperty
    private String base64Key;
    
    @JsonPOJOBuilder(withPrefix = "")
    public static class Builder {
        // Required parameters
        private final String alias;
        private final String algorithm;

        private int keySizeInBits;
        private String base64Key;
        
        public Builder(String alias, String algorithm) {
            this.alias = alias;
            this.algorithm = algorithm;
        }
        
        public Builder keySizeInBits(int size) { keySizeInBits = size * Byte.SIZE; return this; }
        public Builder base64Key(String key) { base64Key = key; return this; }

        public KeyEntityType build() {
            return new KeyEntityType(this);
        }
    }
    
    private KeyEntityType(Builder builder) {
        alias = builder.alias;
        algorithm = builder.algorithm;
        keySizeInBits = builder.keySizeInBits;
        base64Key = builder.base64Key;
    }
    
    public String getAlias() { return alias; }    
}
