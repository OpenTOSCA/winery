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

import java.security.Key;
import java.security.KeyPair;

public interface KeystoreManager {

    KeyPair generateKeyPair(String algorithm, int keySize);
    
    Key generateSecretKey(String algorithm, int keySize);
    
    boolean storeSecretKey(String keyAlias, Key key);

    Key loadSecretKey(String keyAlias);

    boolean storePrivateKey(String keyAlias, Key key);

    Key loadPrivateKey(String keyAlias);
    
    void storeCertificate();
    
    int getKeystoreSize();
    
}
