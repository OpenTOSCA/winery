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

import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.support.SymmetricAlgorithm;

import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.util.Collection;

public interface KeystoreManager {

    boolean keystoreExists();
    
    boolean entityExists(String alias);
    
    Collection<SymmetricAlgorithm> getSupportedSymmetricEncryptionAlgorithms();
    
    Collection<KeyEntityType> getSecretKeysList(boolean withKeyEncoded);

    Collection<KeyPair> getKeyPairsList();

    Collection<Certificate> getCertificatesList();

    KeyEntityType storeSecretKey(String alias, String algorithm, InputStream uploadedInputStream) throws GenericKeystoreManagerException;

    KeyEntityType storeSecretKey(String alias, Key key) throws GenericKeystoreManagerException;
    
    boolean storeKeyPair(String alias, KeyPair keypair);

    void storeCertificate();

    KeyEntityType loadSecretKey(String alias) throws GenericKeystoreManagerException;

    byte[] loadSecretKeyAsByteArray(String alias) throws GenericKeystoreManagerException;

    Key loadPrivateKey(String alias);
    
    int getKeystoreSize();
    
    void deleteKeystoreEntry(String alias) throws GenericKeystoreManagerException;
    
    void deleteAllSecretKeys() throws GenericKeystoreManagerException;
    
}
