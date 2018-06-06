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

import org.eclipse.winery.repository.security.csar.datatypes.*;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.support.SupportedEncryptionAlgorithm;

import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.util.Collection;

public interface KeystoreManager {

    boolean keystoreExists();
    
    boolean entityExists(String alias);
    
    Collection<SupportedEncryptionAlgorithm> getSupportedSymmetricEncryptionAlgorithms();
    
    Collection<KeyEntityInformation> getSecretKeysList(boolean withKeyEncoded);

    Collection<KeyPairInformation> getKeyPairsList() throws GenericKeystoreManagerException;

    Collection<CertificateInformation> getCertificatesList() throws GenericKeystoreManagerException;
    
    KeystoreContentsInformation getKeystoreContentsInformation() throws GenericKeystoreManagerException;

    KeyEntityInformation storeSecretKey(String alias, Key key) throws GenericKeystoreManagerException;

    Key loadKey(String alias) throws GenericKeystoreManagerException;
    
    KeyEntityInformation loadKeyAsText(String alias, KeyType type) throws GenericKeystoreManagerException;

    byte[] loadKeyAsByteArray(String alias, KeyType type) throws GenericKeystoreManagerException;

    KeyPairInformation storeKeyPair(String alias, PrivateKey privateKey, Certificate[] certificates) throws GenericKeystoreManagerException;

    KeyPairInformation loadKeyPairAsText(String alias) throws GenericKeystoreManagerException;
    
    Certificate storeCertificate(String alias, InputStream is) throws GenericKeystoreManagerException;
    
    String loadX509PEMCertificatesAsText(String alias) throws GenericKeystoreManagerException;

    byte[] loadCertificateAsByteArray(String alias) throws GenericKeystoreManagerException;
    
    int getKeystoreSize() throws GenericKeystoreManagerException;

    void deleteKeystoreEntry(String alias) throws GenericKeystoreManagerException;

    void deleteAllSecretKeys() throws GenericKeystoreManagerException;

    void deleteAllKeyPairs() throws GenericKeystoreManagerException;
    
    //CertificateInformation loadCertificateInformation(String alias) throws GenericKeystoreManagerException;
    
}
