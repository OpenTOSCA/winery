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

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;
import java.util.HashMap;
import java.util.Map;

public class DistinguishedName {
    private final Map<String, String> identityData;

    public DistinguishedName(String distinguishedName) {
        this.identityData = new HashMap<>();
        LdapName ldapDN;
        try {
            ldapDN = new LdapName(distinguishedName);
            for (Rdn rdn: ldapDN.getRdns()) {
                this.identityData.put(rdn.getType(), (String) rdn.getValue());
            }
        } catch (InvalidNameException e) {
            e.printStackTrace();
        }
    }
    
    public boolean isValid() {
        return identityData.containsKey("CN") && identityData.containsKey("O") && identityData.containsKey("C");
    }
    
    public Map<String, String> getIdentityData() {
        return identityData;
    }
    
}
