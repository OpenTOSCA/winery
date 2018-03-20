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

import java.math.BigInteger;
import java.util.Date;

public class CertificateInformation {
    @JsonProperty
    private BigInteger serialNumber;
    @JsonProperty
    private String sigAlgName;
    @JsonProperty
    private String issuerDN;
    @JsonProperty
    private String subjectDN;
    @JsonProperty
    private Date notBefore;
    @JsonProperty
    private Date notAfter;
    
    public CertificateInformation(BigInteger serialNumber, String sigAlgName, String issuerDN, String subjectDN, Date notBefore, Date notAfter) {
        this.serialNumber = serialNumber;
        this.sigAlgName = sigAlgName;
        this.issuerDN = issuerDN;
        this.subjectDN = subjectDN;
        this.notBefore = notBefore;
        this.notAfter = notAfter;
    }
    
    public CertificateInformation(BigInteger serialNumber, String sigAlgName, String subjectDN, Date notBefore, Date notAfter) {
        this(serialNumber, sigAlgName, subjectDN, subjectDN, notBefore, notAfter);
    }
    
    public String getValidityPeriod() {
        return "[" + notBefore.toString() + ", " + notAfter.toString() + "]"; 
    }
    
}
