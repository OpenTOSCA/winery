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

import org.apache.commons.configuration.Configuration;
import org.eclipse.winery.common.RepositoryFileReference;
import org.eclipse.winery.common.ids.admin.KeystoreId;
import org.eclipse.winery.repository.backend.filebased.FilebasedRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.security.csar.util.SymmetricEncryptionAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.KeyGenerator;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

public class JCEKSKeystoreManager implements KeystoreManager {

    private static final String KEYSTORE_PASSWORD = "password";
    private static final String KEYSTORE_TYPE = "JCEKS";
    private static final String KEYSTORE_NAME = "winery-keystore.jceks";
    private static final String KEYSTORE_PROVIDER = "BC";
    
    private static final Logger LOGGER = LoggerFactory.getLogger(JCEKSKeystoreManager.class);
    private Configuration configuration;
    private KeyStore keystore;
    private String keystorePath;
    
    public JCEKSKeystoreManager(Configuration c) {
        // in case keystore's properties configuration is needed
        this.configuration = c;
        loadKeystore();
        Security.addProvider(new BouncyCastleProvider());
    }
    
    private void loadKeystore() {
        RepositoryFileReference keystoreRef = new RepositoryFileReference(new KeystoreId(), KEYSTORE_NAME);
        FilebasedRepository fr = (FilebasedRepository) RepositoryFactory.getRepository();
        this.keystorePath = fr.ref2AbsolutePath(keystoreRef).toString();
        try {
            KeyStore keyStore = KeyStore.getInstance(KEYSTORE_TYPE);
            if (!RepositoryFactory.getRepository().exists(keystoreRef)) {
                keyStore.load(null, null);
                keyStore.store(new FileOutputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
                this.keystore = keyStore;
            }
            keyStore.load(new FileInputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
            this.keystore = keyStore;
        }
        catch (Exception e) {
            LOGGER.error("Could not generate JCEKS keystore", e);
        }        
    }
    
    @Override
    public KeyStore.PrivateKeyEntry generatePrivateKeyEntry(String alias, String algorithm, int keySize) {
        
        return null;
    }

    @Override
    public Key generateSecretKeyEntry(String alias, String algorithm, int keySize) {
        KeyGenerator keyGenerator = null;
        try {
            SymmetricEncryptionAlgorithm chosenAlgo = SymmetricEncryptionAlgorithm.valueOf(algorithm, keySize);
            keyGenerator = KeyGenerator.getInstance(chosenAlgo.getName(), KEYSTORE_PROVIDER);
            assert keyGenerator != null;
            keyGenerator.init(chosenAlgo.getKeySize());
            Key k = keyGenerator.generateKey();
            this.keystore.setKeyEntry(alias, k, KEYSTORE_PASSWORD.toCharArray(), null);
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            return k;
        } catch (NoSuchAlgorithmException | NoSuchProviderException | KeyStoreException | CertificateException | IOException e) {
            LOGGER.error("Error while generating a secret key", e);
        }
        
        return null;
    }

    @Override
    public boolean storeSecretKey(String alias, Key key) {
        try {
            if (!this.keystore.containsAlias(alias)) {
                this.keystore.setKeyEntry(alias, key, KEYSTORE_PASSWORD.toCharArray(), null);
                return true;
            }
            else
                return false;            
        } catch (KeyStoreException e) {
            LOGGER.error("The provided key cannot be stored", e);
        }
        
        return false;
    }

    @Override
    public Key loadSecretKey(String alias) {
        try {
            return this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public boolean storePrivateKey(String alias, Key key) {
        return false;
    }

    @Override
    public Key loadPrivateKey(String alias) {
        return null;
    }

    @Override
    public void storeCertificate() {

    }

    @Override
    public int getKeystoreSize() {
        try {
            return this.keystore.size();
        } catch (KeyStoreException e) {
            LOGGER.error("Error while checking the size of the keystore", e);
        }
        return -1;
    }
}
