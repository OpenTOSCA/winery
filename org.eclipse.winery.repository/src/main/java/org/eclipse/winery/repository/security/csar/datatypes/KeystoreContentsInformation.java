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

import java.util.Collection;

public class KeystoreContentsInformation {
    @JsonProperty
    private Collection<KeyEntityInformation> secretKeys;
    @JsonProperty
    private Collection<KeyPairInformation> keypairs;
    @JsonProperty
    private Collection<CertificateInformation> trustedCertificates;
    
    public KeystoreContentsInformation(Collection<KeyEntityInformation> secretKeys, 
                                       Collection<KeyPairInformation> keypairs,
                                       Collection<CertificateInformation> trustedCertificates) {
        this.secretKeys = secretKeys;
        this.keypairs = keypairs;
        this.trustedCertificates = trustedCertificates;
    }    
}
