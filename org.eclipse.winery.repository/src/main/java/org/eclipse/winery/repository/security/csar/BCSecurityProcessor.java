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

import com.google.common.base.Strings;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.io.IOUtils;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x509.AuthorityKeyIdentifier;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.cert.CertIOException;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.X509KeyUsage;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;
import org.eclipse.winery.repository.security.csar.support.SupportedEncryptionAlgorithm;
import org.eclipse.winery.repository.security.csar.support.SupportedsSignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Calendar;
import java.util.Date;

public class BCSecurityProcessor implements SecurityProcessor {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(BCSecurityProcessor.class);
    
    private Configuration configuration;
    
    public BCSecurityProcessor(Configuration c) {
        this.configuration = c;
        Security.addProvider(new BouncyCastleProvider());
    }
    
    @Override
    public Key generateSecretKey(String algorithm, int keySize) throws GenericSecurityProcessorException {
        try {
            KeyGenerator keyGenerator;
            // validate if the chosen algorithm and key size are supported
            SupportedEncryptionAlgorithm chosenAlgorithm = SupportedEncryptionAlgorithm.valueOf(algorithm, keySize);
            keyGenerator = KeyGenerator.getInstance(chosenAlgorithm.getName(), BouncyCastleProvider.PROVIDER_NAME);
            keyGenerator.init(chosenAlgorithm.getkeySizeInBits(), new SecureRandom());
            return keyGenerator.generateKey();
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            LOGGER.error("Error generating a secret key", e);
            throw new GenericSecurityProcessorException("Could not generate the secret key with given properties");
        } catch (IllegalArgumentException e) {
            LOGGER.error("Requested combination of the algorithm and key size is not supported", e);
            throw new GenericSecurityProcessorException("Requested combination of the algorithm and key size is not supported");
        }
        
    }

    @Override
    public KeyPair generateKeyPair(String algorithm, int keySize) throws GenericSecurityProcessorException {
        try {
            SupportedEncryptionAlgorithm chosenAlgorithm = SupportedEncryptionAlgorithm.valueOf(algorithm, keySize);
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(algorithm, BouncyCastleProvider.PROVIDER_NAME);
            keyPairGenerator.initialize(chosenAlgorithm.getkeySizeInBits(), new SecureRandom());
            KeyPair pair = keyPairGenerator.generateKeyPair();
            return pair;
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            LOGGER.error("Error generating a keypair", e);
            throw new GenericSecurityProcessorException("Could not generate the secret key with given properties");
        } catch (IllegalArgumentException e) {
            LOGGER.error("Requested combination of the algorithm and key size is not supported", e);
            throw new GenericSecurityProcessorException("Requested combination of the algorithm and key size is not supported");
        }
    }

    @Override
    public Certificate generateSelfSignedCertificate(KeyPair keypair, String signatureAlgorithm, String commonName, String orgUnit, String org, String loc, String state, String country) throws GenericSecurityProcessorException {
        if (Strings.isNullOrEmpty(signatureAlgorithm)) {
            try {
                signatureAlgorithm = SupportedsSignatureAlgorithm.getDefaultOptionForAlgorithm(keypair.getPrivate().getAlgorithm());
            } catch (IllegalArgumentException e) {
                LOGGER.error("Requested signature algorithm is not supported", e);
                throw new GenericSecurityProcessorException("Requested signature algorithm is not supported");
            }
        }
        try {
            X500Name dn = buildX500Name(commonName, orgUnit, org, loc, state, country);
            
            long now = System.currentTimeMillis();
            Date startDate = new Date(now);
            BigInteger certSerialNumber = new BigInteger(Long.toString(now));
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            calendar.add(Calendar.YEAR, 1); // <-- 1 Yr validity

            Date endDate = calendar.getTime();            
            
            ContentSigner sigGen = new JcaContentSignerBuilder(signatureAlgorithm)
                .setProvider(BouncyCastleProvider.PROVIDER_NAME)
                .build(keypair.getPrivate());
            
            X509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(
                dn, 
                certSerialNumber, 
                startDate,
                endDate,
                dn,
                keypair.getPublic()
            ).addExtension(new ASN1ObjectIdentifier("2.5.29.35"), false, new AuthorityKeyIdentifier(keypair.getPublic().getEncoded())
            ).addExtension(new ASN1ObjectIdentifier("2.5.29.19"), false, new BasicConstraints(false) // true if it is allowed to sign other certs
            ).addExtension(new ASN1ObjectIdentifier("2.5.29.15"), true, new X509KeyUsage(
                X509KeyUsage.digitalSignature |
                X509KeyUsage.nonRepudiation   |
                X509KeyUsage.keyEncipherment  |
                X509KeyUsage.dataEncipherment)
            );

            X509CertificateHolder certHolder = certBuilder.build(sigGen);
            X509Certificate c = new JcaX509CertificateConverter().setProvider(BouncyCastleProvider.PROVIDER_NAME).getCertificate(certHolder);
            
            return new JcaX509CertificateConverter().setProvider(BouncyCastleProvider.PROVIDER_NAME).getCertificate(certHolder);
            
        } catch (OperatorCreationException | CertIOException | CertificateException e) {
            LOGGER.error("Error generating a self-signed certificate", e);
            throw new GenericSecurityProcessorException("Error generating a self-signed certificate");
        }
    }

    @Override
    public SecretKey getSecretKeyFromInputStream(String algorithm, InputStream secretKeyInputStream) throws GenericSecurityProcessorException {
        try {
            byte[] key = new byte[0];
            key = IOUtils.toByteArray(secretKeyInputStream);
            SupportedEncryptionAlgorithm chosenAlgorithm = SupportedEncryptionAlgorithm.valueOf(algorithm, key);
            int keySize = key.length;
            return new SecretKeySpec(key, 0, keySize, chosenAlgorithm.getName());
        } catch (IOException | IllegalArgumentException e) {
            LOGGER.error("Error processing the provided secret key", e);
            throw new GenericSecurityProcessorException("Error processing the provided secret key");
        }
    }

    @Override
    public PrivateKey getPKCS8PrivateKeyFromInputStream(String algorithm, InputStream privateKeyInputStream) throws GenericSecurityProcessorException {
        try {
            byte[] privateKeyByteArray;
            privateKeyByteArray = IOUtils.toByteArray(privateKeyInputStream);
            KeyFactory keyFactory = KeyFactory.getInstance(algorithm);
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyByteArray);
            return keyFactory.generatePrivate(privateKeySpec);
        } catch (InvalidKeySpecException | NoSuchAlgorithmException | IOException e) {
            LOGGER.error("Error processing the provided private key", e);
            throw new GenericSecurityProcessorException("Error processing the provided private key");
        }
    }

    @Override
    public PublicKey getX509EncodedPublicKeyFromInputStream(String algorithm, InputStream publicKeyInputStream) throws GenericSecurityProcessorException {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance(algorithm);
            byte[] publicKeyByteArray = new byte[0];
            publicKeyByteArray = IOUtils.toByteArray(publicKeyInputStream);
            X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyByteArray);
            return keyFactory.generatePublic(publicKeySpec);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            LOGGER.error("Error processing the provided public key", e);
            throw new GenericSecurityProcessorException("Error processing the provided public key");
        }
    }

    @Override
    public Certificate getX509CertificateFromInputStream(InputStream certInputStream) throws GenericSecurityProcessorException {
        try {
            return CertificateFactory.getInstance("X509").generateCertificate(certInputStream);
        } catch (CertificateException e) {
            LOGGER.error("Error processing the provided X509 certificate", e);
            throw new GenericSecurityProcessorException("Error processing the provided X509 certificate");
        }
    }

    public X500Name buildX500Name(String commonName, String orgUnit, String org, String loc, String state, String country) throws GenericSecurityProcessorException {
        
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN, commonName);
        builder.addRDN(BCStyle.OU, orgUnit);
        builder.addRDN(BCStyle.O, org);
        builder.addRDN(BCStyle.L, loc);
        builder.addRDN(BCStyle.ST, state);
        builder.addRDN(BCStyle.C, country);

        return builder.build();
    }
}
