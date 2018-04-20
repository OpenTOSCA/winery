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

package org.eclipse.winery.repository.security.csar.support;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum SupportedEncryptionAlgorithm {
    AES256("AES", 256, true),
    AES512("AES", 512, false),
    DES256("DES", 256, true),
    DES512("DES", 512, false),
    RSA1024("RSA", 1024, true),
    RSA2048("RSA", 2048, true);

    private String name;
    private int keySizeInBits;
    @JsonProperty
    private boolean isDefault;
    
    SupportedEncryptionAlgorithm(String algorithm, int keySizeInBits, boolean isDefault) {
        this.name = algorithm;
        this.keySizeInBits = keySizeInBits;
        this.isDefault = isDefault;
    }

    public String getName() { return this.name; }

    public int getkeySizeInBits() { return this.keySizeInBits; }
    
    public static SupportedEncryptionAlgorithm valueOf(String algorithm, int keySizeInBits) {
        if (Objects.nonNull(algorithm)) {
            for (SupportedEncryptionAlgorithm a : values()) {
                if (keySizeInBits != 0) {
                    if (a.getName().equals(algorithm.toUpperCase().trim()) && a.getkeySizeInBits() == keySizeInBits) {
                        return a;
                    }
                }
                else {
                    if (a.getName().equals(algorithm.toUpperCase().trim()) && a.isDefault) {
                        return a;
                    }
                }
            }
        }
        
        throw new IllegalArgumentException("Chosen option is not supported: " + "@algorithm." + algorithm + " @keySize." + keySizeInBits);
    }

    public static SupportedEncryptionAlgorithm valueOf(String algorithm, byte[] key) {
        return valueOf(algorithm, key.length * Byte.SIZE);
    }
}
