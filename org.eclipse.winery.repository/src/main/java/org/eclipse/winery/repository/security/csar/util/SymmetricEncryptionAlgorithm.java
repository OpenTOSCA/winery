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

package org.eclipse.winery.repository.security.csar.util;

public enum SymmetricEncryptionAlgorithm {
    AES256("AES", 256, true),
    AES512("AES", 512, false);
    
    private String name;
    private int keySizeInBits;
    private boolean isDefault;
    
    SymmetricEncryptionAlgorithm(String algorithm, int keySizeInBits, boolean isDefault) {
        this.name = algorithm;
        this.keySizeInBits = keySizeInBits;
        this.isDefault = isDefault;        
    }

    public String getName() { return this.name; }

    public int getkeySizeInBits() { return this.keySizeInBits; }
    
    public static SymmetricEncryptionAlgorithm valueOf(String algorithm, int keySizeInBits) {
        for (SymmetricEncryptionAlgorithm a : values()) {
            if (keySizeInBits != -1) {
                if (a.getName().equals(algorithm.toUpperCase()) && a.getkeySizeInBits() == keySizeInBits)
                    return a;
            }
            else {
                if (a.getName().equals(algorithm.toUpperCase()) && a.isDefault)
                    return a;
            }
        }
        throw new IllegalArgumentException("Chosen option is not supported: " + "@algorithm." + algorithm + " @keySize." + keySizeInBits);
    }

    public static SymmetricEncryptionAlgorithm valueOf(String algorithm, byte[] key) {
        return valueOf(algorithm, key.length * Byte.SIZE);
    }
    
}
