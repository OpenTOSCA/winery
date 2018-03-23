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
import org.eclipse.winery.repository.security.csar.datatypes.CertificateInformation;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityInformation;
import org.eclipse.winery.repository.security.csar.datatypes.KeyPairInformation;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.support.SupportedEncryptionAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
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
    public KeyEntityInformation storeSecretKey(String alias, Key key) throws GenericKeystoreManagerException {
        try {
            keystore.setKeyEntry(alias, key, KEYSTORE_PASSWORD.toCharArray(), null);
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            return new KeyEntityInformation
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
    public KeyPairInformation storeKeyPair(String alias, PrivateKey privateKey, Certificate cert) throws GenericKeystoreManagerException {
        try {
            PublicKey pub = cert.getPublicKey();
            // TODO: validate certificate against private key            
            keystore.setKeyEntry(alias, privateKey, KEYSTORE_PASSWORD.toCharArray(), new Certificate[]{cert});
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            
            // TODO: correct the length calculation (use the length of the modulo), currently it's wrong 
            KeyEntityInformation privateKeyInfo = new KeyEntityInformation.Builder(alias, privateKey.getAlgorithm(), privateKey.getFormat())
                .keySizeInBits(privateKey.getEncoded().length)
                .base64Key(privateKey.getEncoded())
                .build();
            KeyEntityInformation publicKeyInfo = new KeyEntityInformation.Builder(alias, pub.getAlgorithm(), pub.getFormat())
                .keySizeInBits(pub.getEncoded().length)
                .base64Key(pub.getEncoded())
                .build();
            X509Certificate x = (X509Certificate) cert;
            CertificateInformation certInfo = new CertificateInformation(x.getSerialNumber(), x.getSigAlgName(), x.getSubjectX500Principal().getName(),
                x.getNotBefore(), x.getNotAfter());

            return new KeyPairInformation(privateKeyInfo, publicKeyInfo, certInfo);
        } catch (KeyStoreException | IOException | CertificateException | NoSuchAlgorithmException e) {
            LOGGER.error("Could not store the provided keypair", e);
            throw new GenericKeystoreManagerException("Could not store the provided keypair");
        }
    }

    @Override
    public KeyPairInformation storeKeyPair(String alias, KeyPair keypair, Certificate cert) throws GenericKeystoreManagerException {
        return storeKeyPair(alias, keypair.getPrivate(), cert);
    }

    @Override
    public KeyEntityInformation loadSecretKey(String alias) throws GenericKeystoreManagerException {
        try {
            Key key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
            if ((key instanceof SecretKey)) {
                byte[] encodedKey = key.getEncoded();
                key.getFormat();
                return new KeyEntityInformation.Builder(alias, key.getAlgorithm(), key.getFormat())
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
            for (KeyEntityInformation secretKey : getSecretKeysList(false)) {
                deleteKeystoreEntry(secretKey.getAlias());
            }
            this.keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | IOException | CertificateException | NoSuchAlgorithmException | GenericKeystoreManagerException e) {
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
    }

    @Override
    public Collection<KeyPairInformation> getKeyPairsList() {
        Enumeration<String> aliases;
        Collection<KeyPairInformation> keypairs = new ArrayList<>();
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
                            KeyEntityInformation privateKey = new KeyEntityInformation.Builder(alias, key.getAlgorithm(), key.getFormat())
                                .keySizeInBits(key.getEncoded().length)
                                .base64Key(key.getEncoded())
                                .build();
                            PublicKey pub = cert.getPublicKey();
                            KeyEntityInformation publicKey = new KeyEntityInformation.Builder(alias, pub.getAlgorithm(), pub.getFormat())
                                .keySizeInBits(pub.getEncoded().length)
                                .base64Key(pub.getEncoded())
                                .build();
                            X509Certificate x = (X509Certificate) cert;
                            CertificateInformation c = new CertificateInformation(x.getSerialNumber(), x.getSigAlgName(), x.getSubjectX500Principal().getName(),
                                x.getNotBefore(), x.getNotAfter());

                            KeyPairInformation kp = new KeyPairInformation(privateKey, publicKey, c);
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
    public Collection<SupportedEncryptionAlgorithm> getSupportedSymmetricEncryptionAlgorithms() {
        return Arrays.asList(SupportedEncryptionAlgorithm.values());
    }

    @Override
    public Collection<KeyEntityInformation> getSecretKeysList(boolean withKeyEncoded) {
        Enumeration<String> aliases;
        Collection<KeyEntityInformation> keys = new ArrayList<>();
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
                                keys.add(new KeyEntityInformation
                                    .Builder(alias, key.getAlgorithm(), key.getFormat())
                                    .keySizeInBits(key.getEncoded().length)
                                    .build()
                                );
                            else
                                keys.add(new KeyEntityInformation
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
