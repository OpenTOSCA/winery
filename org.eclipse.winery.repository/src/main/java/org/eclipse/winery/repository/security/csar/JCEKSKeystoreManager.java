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
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.util.SymmetricEncryptionAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.Enumeration;

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
            KeyStore keystore = KeyStore.getInstance(KEYSTORE_TYPE);
            if (!RepositoryFactory.getRepository().exists(keystoreRef)) {
                keystore.load(null, null);
                keystore.store(new FileOutputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
                this.keystore = keystore;
            }
            keystore.load(new FileInputStream(keystorePath), KEYSTORE_PASSWORD.toCharArray());
            this.keystore = keystore;
        }
        catch (Exception e) {
            LOGGER.error("Could not generate JCEKS keystore", e);
        }        
    }
    
    @Override
    public KeyEntityType generateSecretKeyEntry(String alias, String algorithm, int keySize) {
        try {
            KeyGenerator keyGenerator;
            SymmetricEncryptionAlgorithm chosenAlgorithm = SymmetricEncryptionAlgorithm.valueOf(algorithm, keySize);
            keyGenerator = KeyGenerator.getInstance(chosenAlgorithm.getName(), KEYSTORE_PROVIDER);
            assert keyGenerator != null;
            keyGenerator.init(chosenAlgorithm.getKeySize());
            Key k = keyGenerator.generateKey();
            
            keystore.setKeyEntry(alias, k, KEYSTORE_PASSWORD.toCharArray(), null);
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            return new KeyEntityType.Builder(alias, algorithm).keySizeInBits(keySize).build();
        } catch (NoSuchAlgorithmException | NoSuchProviderException | KeyStoreException | CertificateException | IOException e) {
            LOGGER.error("Error while generating a secret key", e);
        }
        
        return null;
    }

    @Override
    public boolean storeSecretKey(String alias, Key key) {
        try {
            if (!keystore.containsAlias(alias)) {
                keystore.setKeyEntry(alias, key, KEYSTORE_PASSWORD.toCharArray(), null);
                
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
    public boolean storeKeyPair(String alias, KeyPair keypair) {
        return false;
    }

    @Override
    public KeyEntityType loadSecretKey(String alias) throws GenericKeystoreManagerException {
        try {
            Key key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
            if ((key instanceof SecretKey)) {
                byte[] encodedKey = key.getEncoded();
                key.getFormat();
                KeyEntityType result = new KeyEntityType.Builder(alias, key.getAlgorithm())
                    .base64Key(getBase64EncodedKey(encodedKey))
                    .keySizeInBits(encodedKey.length)
                    .build();
                return result;
            }
            else
                throw new UnrecoverableKeyException();
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            LOGGER.error("Error loading a secret key", e.getMessage());
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
    }

    @Override
    public byte[] loadSecretKeyAsByteArray(String alias) throws GenericKeystoreManagerException {
        Key key;
        try {
            key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
            if ((key instanceof SecretKey))
                return key.getEncoded();
            else
                throw new UnrecoverableKeyException();
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            LOGGER.error("Error loading a secret key", e.getMessage());
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
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

    @Override
    public void deleteKeystoreEntry(String alias) throws GenericKeystoreManagerException {
        try {
            this.keystore.deleteEntry(alias);
            this.keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e) {
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
    }

    @Override
    public void deleteAllSecretKeys() throws GenericKeystoreManagerException {
        try {
            for (KeyEntityType secretKey : getSecretKeysList(false)) {
                deleteKeystoreEntry(secretKey.getAlias());
            }
            this.keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | IOException | CertificateException | NoSuchAlgorithmException | GenericKeystoreManagerException e) {
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
    }

    @Override
    public Collection<KeyPair> getKeyPairsList() {
        Enumeration<String> aliases = null;
        Collection<KeyPair> keypairs = new ArrayList<>();
        try {
            aliases = this.keystore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                if (this.keystore.isKeyEntry(alias)) {
                    Key key = null;
                    try {
                        key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
                        if ((key instanceof PrivateKey)) {
                            Certificate cert = this.keystore.getCertificate(alias);
                            KeyPair kp = new KeyPair(cert.getPublicKey(), (PrivateKey) key);
                            keypairs.add(kp);                            
                        }
                    } catch (NoSuchAlgorithmException | UnrecoverableKeyException e) {
                        e.printStackTrace();
                    }
                }                    
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
        return keypairs;
    }

    @Override
    public Collection<Certificate> getCertificatesList() {
        return null;
    }

    @Override
    public boolean keystoreExists() {
        return keystore != null;
    }

    @Override
    public boolean entityExists(String alias) {
        try {
            return keystore.containsAlias(alias);
        } catch (KeyStoreException e) {
            e.printStackTrace();
            LOGGER.error("Error while checking if entity exists", e.getMessage());
        }
        return false;
    }

    @Override
    public Collection<KeyEntityType> getSecretKeysList(boolean withKeyEncoded) {
        Enumeration<String> aliases = null;
        Collection<KeyEntityType> keys = new ArrayList<>();
        try {
            aliases = this.keystore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                if (this.keystore.isKeyEntry(alias)) {
                    Key key;
                    try {
                        key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
                        if ((key instanceof SecretKey)) {
                            if (!withKeyEncoded)
                                keys.add(new KeyEntityType
                                    .Builder(alias, key.getAlgorithm())
                                    .keySizeInBits(key.getEncoded().length)
                                    .build()
                                );
                            else
                                keys.add(new KeyEntityType
                                    .Builder(alias, key.getAlgorithm())
                                    .keySizeInBits(key.getEncoded().length)
                                    .base64Key(getBase64EncodedKey(key.getEncoded()))
                                    .build()
                                );
                            
                        }
                    } catch (NoSuchAlgorithmException | UnrecoverableKeyException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (KeyStoreException e) {
            LOGGER.error("Could not retrieve a list of secret keys", e);
        }
        return keys;
    }

    @Override
    public KeyPair generateKeyPairWithSelfSignedCertificate(String alias, String algorithm, int keySize) {
        return null;
    }
    
    private String getBase64EncodedKey(byte[] key) {
        return Base64.getEncoder().encodeToString(key);
    }
    
}
