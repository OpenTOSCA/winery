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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.*;

public class JCEKSKeystoreManager implements KeystoreManager {

    private static final String KEYSTORE_PASSWORD = "password";
    private static final String KEYSTORE_NAME = "winery-keystore.jceks";
    private static final Logger LOGGER = LoggerFactory.getLogger(JCEKSKeystoreManager.class);
    private Configuration configuration;
    private KeyStore keystore;
    
    public JCEKSKeystoreManager(Configuration c) {
        // in case keystore's properties configuration is needed
        this.configuration = c;
        this.keystore = loadKeystore();
        // TODO handle keystore==null
    }
    
    private KeyStore loadKeystore() {
        RepositoryFileReference keystoreRef = new RepositoryFileReference(new KeystoreId(), KEYSTORE_NAME);
        FilebasedRepository fr = (FilebasedRepository) RepositoryFactory.getRepository();
        String keystorePath = fr.ref2AbsolutePath(keystoreRef).toString();
        try {
            if (!RepositoryFactory.getRepository().exists(keystoreRef)) {
                KeyStore keyStore = KeyStore.getInstance("JCEKS");
                keyStore.load(null, null);
                keyStore.store(new FileOutputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
                return keyStore;
            }
            else {
                KeyStore keyStore = KeyStore.getInstance("JCEKS");
                keyStore.load(new FileInputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
                return keyStore;
            }
        }
        catch (Exception e) {
            LOGGER.error("Could not generate JCEKS keystore", e);
        }
        
        return null;
    }
    
    @Override
    public KeyPair generateKeyPair(String algorithm, int keySize) {

        return null;
    }

    @Override
    public Key generateSecretKey(String algorithm, int keySize) {
        return null;
    }

    @Override
    public boolean storeSecretKey(String keyAlias, Key key) {
        try {
            if (!this.keystore.containsAlias(keyAlias)) {
                this.keystore.setKeyEntry(keyAlias, key, KEYSTORE_PASSWORD.toCharArray(), null);
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
    public Key loadSecretKey(String keyAlias) {
        try {
            return this.keystore.getKey(keyAlias, KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnrecoverableKeyException e) {
            e.printStackTrace();
        }
        
        return null;
    }

    @Override
    public boolean storePrivateKey(String keyAlias, Key key) {
        return false;
    }

    @Override
    public Key loadPrivateKey(String keyAlias) {
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
