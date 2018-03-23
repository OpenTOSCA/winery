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
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.IOException;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CertificateInformation {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
    
    @JsonProperty
    private BigInteger serialNumber;
    @JsonProperty
    private String sigAlgName;
    @JsonProperty
    private String issuerDN;
    @JsonProperty
    private String subjectDN;
    @JsonSerialize(using = JsonDateSerializer.class)
    private Date validFrom;
    @JsonSerialize(using = JsonDateSerializer.class)
    private Date validBefore;
    
    public CertificateInformation(BigInteger serialNumber, String sigAlgName, String issuerDN, String subjectDN, Date validFrom, Date validBefore) {
        this.serialNumber = serialNumber;
        this.sigAlgName = sigAlgName;
        this.issuerDN = issuerDN;
        this.subjectDN = subjectDN;
        this.validFrom = validFrom;
        this.validBefore = validBefore;
    }
    
    public CertificateInformation(BigInteger serialNumber, String sigAlgName, String subjectDN, Date validFrom, Date validBefore) {
        this(serialNumber, sigAlgName, subjectDN, subjectDN, validFrom, validBefore);
    }
    
    public String printValidityPeriod() {
        return "[" + dateFormat.format(validFrom) + ", " + dateFormat.format(validBefore) + "]"; 
    }

    private static class JsonDateSerializer extends JsonSerializer<Date> {
        @Override
        public void serialize(Date date, JsonGenerator gen, SerializerProvider provider) throws IOException, JsonProcessingException {
            String formattedDate = dateFormat.format(date);
            gen.writeString(formattedDate);
        }
    }
}
