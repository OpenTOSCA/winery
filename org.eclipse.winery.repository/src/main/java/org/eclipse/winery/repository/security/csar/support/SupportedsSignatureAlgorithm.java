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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

public enum SupportedsSignatureAlgorithm {
    RSA_SHA256("RSA", SupportedDigestAlgorithm.SHA256, "SHA256withRSA", true),
    RSA_SHA384("RSA", SupportedDigestAlgorithm.SHA384, "SHA384withRSA", false),
    RSA_SHA512("RSA", SupportedDigestAlgorithm.SHA512, "SHA512withRSA", false);
    
    private String name;
    private SupportedDigestAlgorithm digestAlgorithm;
    private String fullName;
    private boolean isDefault;

    SupportedsSignatureAlgorithm(String name, SupportedDigestAlgorithm digestAlgorithm, String fullName, boolean isDefault) {
        this.name = name;
        this.digestAlgorithm = digestAlgorithm;
        this.fullName = fullName;
        this.isDefault = isDefault;
    }

    public String getFullName() {
        return fullName;
    }
    
    public static Collection<String> getOptionsForAlgorithm(String algorithm) {
        if (Objects.nonNull(algorithm)) {
            Collection<String> result = new ArrayList<>();
            for (SupportedsSignatureAlgorithm a : values()) {
                if (algorithm.equals(a.name))
                    result.add(a.fullName);
            }
            return result;
        }
        throw new IllegalArgumentException("Chosen signature algorithm is not supported: " + "@algorithm." + algorithm);
    }
    
    public static String getDefaultOptionForAlgorithm(String algorithm) {
        if (Objects.nonNull(algorithm)) {
            for (SupportedsSignatureAlgorithm a : values()) {
                if (algorithm.equals(a.name) && a.isDefault)
                    return a.fullName;
            }
        }
        throw new IllegalArgumentException("Chosen signature algorithm is not supported: " + "@algorithm." + algorithm);
    }
}
