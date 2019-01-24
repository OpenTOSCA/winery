/********************************************************************************
 * Copyright (c) 2018-2019 Contributors to the Eclipse Foundation
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

package org.eclipse.winery.security.support.enums;

import java.security.spec.AlgorithmParameterSpec;
import java.security.spec.ECGenParameterSpec;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AsymmetricEncryptionAlgorithmEnum {
    RSA1024("RSA", 1024, null),
    RSA2048("RSA", 2048, null),
    ECIES_secp256k1("ECIES", 256, new ECGenParameterSpec("secp256k1") );

    private String name;
    private int keySizeInBits;
    private AlgorithmParameterSpec spec;
    
    AsymmetricEncryptionAlgorithmEnum(String algorithm, int keySizeInBits, AlgorithmParameterSpec spec) {
        this.name = algorithm;
        this.keySizeInBits = keySizeInBits;
        this.spec = spec;
    }

    public String getName() {
        return this.name;
    }

    public int getKeySizeInBits() {
        return this.keySizeInBits;
    }
    
    public AlgorithmParameterSpec getAlgorithmParameterSpec() {
        return  this.spec;
    }
    
    public static AsymmetricEncryptionAlgorithmEnum findAnyByName(String name) throws IllegalArgumentException {
        for (AsymmetricEncryptionAlgorithmEnum current : values()) {
            if (current.name.equalsIgnoreCase(name))
                return current;
        }
        
        throw new IllegalArgumentException("Asymmetric algorithm not supported: " + name);
    }

    public static AsymmetricEncryptionAlgorithmEnum findKey(String name, int keySizeInBits) throws IllegalArgumentException {
        for (AsymmetricEncryptionAlgorithmEnum current : values()) {
            if (current.name.equalsIgnoreCase(name) && current.keySizeInBits == keySizeInBits)
                return current;
        }

        throw new IllegalArgumentException("Asymmetric algorithm not supported: " + name);
    }
}
