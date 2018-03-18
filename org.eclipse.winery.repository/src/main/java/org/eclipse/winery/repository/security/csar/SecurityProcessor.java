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

package org.eclipse.winery.repository.security.csar;

import org.eclipse.winery.repository.security.csar.datatypes.CertificateType;
import org.eclipse.winery.repository.security.csar.datatypes.KeyPairType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;

import java.security.Key;

public interface SecurityProcessor {

    Key generateSecretKey(String alias, String algorithm, int keySize) throws GenericSecurityProcessorException;

    KeyPairType generateKeyPair(String algorithm, int keySize);
    
    CertificateType generateSelfSignedCertificate(KeyPairType keypair);
}
