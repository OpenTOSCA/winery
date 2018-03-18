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

import java.util.Base64;

@JsonDeserialize(builder = KeyEntityType.Builder.class)
public class KeyEntityType {
    @JsonProperty
    private final String alias;
    @JsonProperty
    private final String algorithm;
    @JsonProperty
    private final String keyFormat;
    @JsonProperty
    private int keySizeInBits;
    @JsonProperty
    private String base64Key;

    @JsonPOJOBuilder(withPrefix = "")
    public static class Builder {
        // Required parameters
        private final String alias;
        private final String algorithm;
        private final String keyFormat;

        private int keySizeInBits;
        private String base64Key;
        
        public Builder(String alias, String algorithm, String keyFormat) {
            this.alias = alias;
            this.algorithm = algorithm;
            this.keyFormat = keyFormat;
        }
        
        public Builder keySizeInBits(int size) { 
            keySizeInBits = size * Byte.SIZE; 
            return this; 
        }
        
        public Builder base64Key(String key) { 
            base64Key = key; 
            return this; 
        }
        
        public Builder base64Key(byte[] key) {
            base64Key = getBase64EncodedKey(key); 
            return this; 
        }

        private String getBase64EncodedKey(byte[] key) {
            return Base64.getEncoder().encodeToString(key);
        }
        
        public KeyEntityType build() {
            return new KeyEntityType(this);
        }
    }
    
    private KeyEntityType(Builder builder) {
        alias = builder.alias;
        algorithm = builder.algorithm;
        keyFormat = builder.keyFormat;
        keySizeInBits = builder.keySizeInBits;
        base64Key = builder.base64Key;
    }
    
    public String getAlias() { return alias; }

    public String getAlgorithm() { return algorithm; }

    public String getKeyFormat() { return keyFormat; }

    public int getKeySizeInBits() { return keySizeInBits; }

    public String getBase64Key() { return base64Key; }
}
