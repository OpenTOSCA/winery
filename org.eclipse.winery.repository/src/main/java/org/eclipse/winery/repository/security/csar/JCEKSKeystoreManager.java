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
import org.apache.commons.io.IOUtils;
import org.eclipse.winery.common.RepositoryFileReference;
import org.eclipse.winery.common.ids.admin.KeystoreId;
import org.eclipse.winery.repository.backend.filebased.FilebasedRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.support.SymmetricAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.util.*;

public class JCEKSKeystoreManager implements KeystoreManager {
    
    private static final String KEYSTORE_PASSWORD = "password";
    private static final String KEYSTORE_TYPE = "JCEKS";
    private static final String KEYSTORE_NAME = "winery-keystore.jceks";
    private static final Logger LOGGER = LoggerFactory.getLogger(JCEKSKeystoreManager.class);
    
    private Configuration configuration;
    private KeyStore keystore;
    private String keystorePath;
    
    public JCEKSKeystoreManager(Configuration c) {
        // in case keystore's properties configuration is needed
        this.configuration = c;
        loadKeystore();
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
    public KeyEntityType storeSecretKey(String alias, String algorithm, InputStream uploadedInputStream) throws GenericKeystoreManagerException {
        try {
            byte[] key = IOUtils.toByteArray(uploadedInputStream);
            SymmetricAlgorithm chosenAlgorithm = SymmetricAlgorithm.valueOf(algorithm, key);
            int keySize = key.length;
            SecretKey originalKey = new SecretKeySpec(key, 0, keySize, chosenAlgorithm.getName());
            return storeSecretKey(alias, originalKey);
        } catch (IOException e) {
            LOGGER.error("Error while storing a secret key", e);
            throw new GenericKeystoreManagerException("Could not store the provided secret key");
        }
    }
    
    @Override
    public KeyEntityType storeSecretKey(String alias, Key key) throws GenericKeystoreManagerException {
        try {
            keystore.setKeyEntry(alias, key, KEYSTORE_PASSWORD.toCharArray(), null);
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            return new KeyEntityType
                .Builder(alias, key.getAlgorithm(), key.getFormat())
                .keySizeInBits(key.getEncoded().length)
                .base64Key(key.getEncoded())
                .build();
        } catch (CertificateException | NoSuchAlgorithmException | IOException | KeyStoreException e) {
            LOGGER.error("Error while storing a secret key", e);
            throw new GenericKeystoreManagerException("Could not store the provided secret key");
        }
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
                return new KeyEntityType.Builder(alias, key.getAlgorithm(), key.getFormat())
                    .base64Key(encodedKey)
                    .keySizeInBits(encodedKey.length)
                    .build();
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
        Enumeration<String> aliases;
        Collection<KeyPair> keypairs = new ArrayList<>();
        try {
            aliases = this.keystore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                if (this.keystore.isKeyEntry(alias)) {
                    Key key;
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
    public Collection<SymmetricAlgorithm> getSupportedSymmetricEncryptionAlgorithms() {
        return Arrays.asList(SymmetricAlgorithm.values());
    }

    @Override
    public Collection<KeyEntityType> getSecretKeysList(boolean withKeyEncoded) {
        Enumeration<String> aliases;
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
                                    .Builder(alias, key.getAlgorithm(), key.getFormat())
                                    .keySizeInBits(key.getEncoded().length)
                                    .build()
                                );
                            else
                                keys.add(new KeyEntityType
                                    .Builder(alias, key.getAlgorithm(), key.getFormat())
                                    .keySizeInBits(key.getEncoded().length)
                                    .base64Key(key.getEncoded())
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
    
}
