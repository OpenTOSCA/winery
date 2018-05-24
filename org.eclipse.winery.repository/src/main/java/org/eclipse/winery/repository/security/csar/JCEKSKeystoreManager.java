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
import org.eclipse.winery.repository.security.csar.datatypes.*;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.support.SupportedEncryptionAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.*;

public class JCEKSKeystoreManager implements KeystoreManager {
    
    private static final String KEYSTORE_PASSWORD = "password";
    private static final String KEYSTORE_TYPE = "JCEKS";
    private static final String KEYSTORE_NAME = "winery-keystore.jceks";
    private static final String BEGIN_CERT = "-----BEGIN CERTIFICATE-----";
    private static final String END_CERT = "-----END CERTIFICATE-----";
    private static final String LINE_SEPARATOR = System.getProperty("line.separator");
    
    private static final Logger LOGGER = LoggerFactory.getLogger(JCEKSKeystoreManager.class);
    
    private Configuration configuration;
    private KeyStore keystore;
    private String keystorePath;
    
    public JCEKSKeystoreManager(Configuration c) {
        // in case keystore's properties configuration is needed
        this.configuration = c;
        loadKeystore();
    }

    public JCEKSKeystoreManager() {
        this(null);
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
    public KeyPairInformation storeKeyPair(String alias, PrivateKey privateKey, Certificate[] certificates) throws GenericKeystoreManagerException {
        try {
            // TODO: validate certificate against private key            
            keystore.setKeyEntry(alias, privateKey, KEYSTORE_PASSWORD.toCharArray(), certificates);
            keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
            
            // TODO: correct the length calculation (use the length of the modulo), currently it's wrong 
            KeyEntityInformation privateKeyInfo = new KeyEntityInformation.Builder(alias, privateKey.getAlgorithm(), privateKey.getFormat())
                .keySizeInBits(privateKey.getEncoded().length)
                .base64Key(privateKey.getEncoded())
                .build();
            
            return new KeyPairInformation(privateKeyInfo, concatenateBase64PEMCertificates(certificates));
            
        } catch (KeyStoreException | IOException | CertificateException | NoSuchAlgorithmException e) {
            LOGGER.error("Could not store the provided keypair", e);
            throw new GenericKeystoreManagerException("Could not store the provided keypair");
        }
    }

    @Override
    public Key loadKey(String alias) throws GenericKeystoreManagerException {
        try {
            return this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            LOGGER.error("Error loading a key using the provided alias", e.getMessage());
            throw new GenericKeystoreManagerException("Error loading a key using the provided alias");
        }
    }
    
    private Key loadKey(String alias, KeyType type) throws GenericKeystoreManagerException {
        try {
            if (type != KeyType.PUBLIC) {
                Key key = this.keystore.getKey(alias, KEYSTORE_PASSWORD.toCharArray());
                if ((key instanceof SecretKey && KeyType.SECRET.equals(type)) || (key instanceof PrivateKey && KeyType.PRIVATE.equals(type))) {
                    return key;
                }
                else {
                    throw new UnrecoverableKeyException("Key with given alias does not exist");
                }
            }
            else {
                Certificate cert = this.keystore.getCertificate(alias);
                return cert.getPublicKey();
            }
        } catch (UnrecoverableKeyException | NoSuchAlgorithmException | KeyStoreException e) {
            LOGGER.error("Error loading a key using the provided alias", e.getMessage());
            throw new GenericKeystoreManagerException("Error loading a key using the provided alias");
        }
    }
    
    @Override
    public KeyEntityInformation loadKeyAsText(String alias, KeyType type) throws GenericKeystoreManagerException {
        try {
            Key key = loadKey(alias, type);
            byte[] encodedKey = key.getEncoded();
            return new KeyEntityInformation.Builder(alias, key.getAlgorithm(), key.getFormat())
                .base64Key(encodedKey)
                .keySizeInBits(encodedKey.length)
                .build();
        } catch (GenericKeystoreManagerException e) {
            throw new GenericKeystoreManagerException("Error loading a key using the provided alias");
        }
    }

    @Override
    public byte[] loadKeyAsByteArray(String alias, KeyType type) throws GenericKeystoreManagerException {
        try {
            Key key = loadKey(alias, type);
            return key.getEncoded();            
        } catch (GenericKeystoreManagerException e) {
            throw new GenericKeystoreManagerException("Error loading a key using the provided alias");
        }
    }

    private String convertToBase64PEMString(Certificate x509) throws GenericKeystoreManagerException {
        try {
            final Base64.Encoder encoder = Base64.getMimeEncoder(64, LINE_SEPARATOR.getBytes());
            final byte[] rawCrtText = x509.getEncoded();
            final String encodedCertText = new String(encoder.encode(rawCrtText));
            final StringBuilder sb = new StringBuilder();
            sb.append(BEGIN_CERT);
            sb.append(LINE_SEPARATOR);
            sb.append(encodedCertText);
            sb.append(LINE_SEPARATOR);
            sb.append(END_CERT);  
            
            return  sb.toString();
        } catch (CertificateEncodingException e) {
            throw new GenericKeystoreManagerException("Error converting a certificate to PEM string");
        }
    }
    
    private String concatenateBase64PEMCertificates(Certificate[] certs) throws GenericKeystoreManagerException {
        final StringBuilder sb = new StringBuilder();
        for (Certificate c : certs) {
            sb.append(convertToBase64PEMString(c));
        }
        return sb.toString();
    }
    
    @Override
    public String loadX509PEMCertificatesAsText(String alias) throws GenericKeystoreManagerException {
        try {
            final Certificate[] certs = this.keystore.getCertificateChain(alias);            
            return concatenateBase64PEMCertificates(certs);
        } catch (KeyStoreException e) {
            throw new GenericKeystoreManagerException("Error loading a certificate using the provided alias");
        }
    }

    @Override
    public byte[] loadCertificateAsByteArray(String alias) throws GenericKeystoreManagerException {
        try {
            return loadX509PEMCertificatesAsText(alias).getBytes();
        } catch (GenericKeystoreManagerException e) {
            throw new GenericKeystoreManagerException("Error loading a certificate using the provided alias");
        }
    }

    @Override
    public KeyPairInformation loadKeyPairAsText(String alias) throws GenericKeystoreManagerException {
        KeyEntityInformation privateKey = loadKeyAsText(alias, KeyType.PRIVATE);
        String cert = loadX509PEMCertificatesAsText(alias);
        return new KeyPairInformation(privateKey, cert);
    }

    @Override
    public int getKeystoreSize() throws GenericKeystoreManagerException {
        try {
            return this.keystore.size();
        } catch (KeyStoreException e) {
            LOGGER.error("Error while checking the size of the keystore", e);
            throw new GenericKeystoreManagerException(e.getMessage());
        }
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
    public void deleteAllKeyPairs() throws GenericKeystoreManagerException {
        try {
            for (KeyPairInformation keyPair : getKeyPairsList()) {
                deleteKeystoreEntry(keyPair.getPrivateKey().getAlias());
            }
            this.keystore.store(new FileOutputStream(this.keystorePath), KEYSTORE_PASSWORD.toCharArray());
        } catch (KeyStoreException | IOException | CertificateException | NoSuchAlgorithmException | GenericKeystoreManagerException e) {
            e.printStackTrace();
            throw new GenericKeystoreManagerException(e.getMessage());
        }
    }

    @Override
    public Collection<KeyPairInformation> getKeyPairsList() throws GenericKeystoreManagerException {
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
                            Certificate[] cert = this.keystore.getCertificateChain(alias);
                            KeyEntityInformation privateKey = new KeyEntityInformation.Builder(alias, key.getAlgorithm(), key.getFormat())
                                .keySizeInBits(key.getEncoded().length)
                                .base64Key(key.getEncoded())
                                .build();
                            
                            StringBuilder sb = new StringBuilder();
                            for (Certificate c : cert) {
                                sb.append(convertToBase64PEMString(c));
                                
                            }

                            KeyPairInformation kp = new KeyPairInformation(privateKey, sb.toString());
                            keypairs.add(kp);
                        }
                    } catch (NoSuchAlgorithmException | UnrecoverableKeyException e) {
                        LOGGER.error("Error retrieving keypairs list", e);
                        throw new GenericKeystoreManagerException("Error retrieving keypairs list");
                    } catch (GenericKeystoreManagerException exception) {
                        LOGGER.error("Error retrieving keypairs list", exception);
                        throw exception;
                    }
                }                    
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
        return keypairs;
    }

    @Override
    public Collection<CertificateInformation> getCertificatesList() throws GenericKeystoreManagerException {
        Enumeration<String> aliases;
        Collection<CertificateInformation> certificates = new ArrayList<>();
        try {
            aliases = this.keystore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                if (this.keystore.isCertificateEntry(alias)) {
                    Certificate cert;
                    cert = this.keystore.getCertificate(alias);
                    X509Certificate x = (X509Certificate) cert;
                    CertificateInformation c = new CertificateInformation(
                        x.getSerialNumber(), 
                        x.getSigAlgName(), 
                        x.getSubjectX500Principal().getName(), 
                        x.getNotBefore(), 
                        x.getNotAfter()
                    );
                    certificates.add(c);
                }
            }
            return certificates;
        } catch (KeyStoreException e) {
            LOGGER.error("Error retrieving certificates list", e);
            throw new GenericKeystoreManagerException("Error retrieving certificates list");
        }
    }

    @Override
    public KeystoreContentsInformation getKeystoreContentsInformation() throws GenericKeystoreManagerException {
        try {
            Collection<CertificateInformation> certs = getCertificatesList();
            Collection<KeyEntityInformation> keys = getSecretKeysList(false);
            Collection<KeyPairInformation> keypairs = getKeyPairsList();
            return new KeystoreContentsInformation(keys, keypairs, certs);
        } catch (GenericKeystoreManagerException e) {
            throw new GenericKeystoreManagerException(e.getMessage());
        }
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
