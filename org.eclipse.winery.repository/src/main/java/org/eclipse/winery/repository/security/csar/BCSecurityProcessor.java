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
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.eclipse.winery.repository.security.csar.datatypes.CertificateType;
import org.eclipse.winery.repository.security.csar.datatypes.KeyEntityType;
import org.eclipse.winery.repository.security.csar.datatypes.KeyPairType;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;
import org.eclipse.winery.repository.security.csar.support.SymmetricAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.KeyGenerator;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;

public class BCSecurityProcessor implements SecurityProcessor {
    
    private static final String CRYPTO_PROVIDER = "BC";
    private static final Logger LOGGER = LoggerFactory.getLogger(BCSecurityProcessor.class);
    
    private Configuration configuration;
    
    public BCSecurityProcessor(Configuration c) {
        this.configuration = c;
        Security.addProvider(new BouncyCastleProvider());
    }
    
    @Override
    public Key generateSecretKey(String alias, String algorithm, int keySize) throws GenericSecurityProcessorException {
        try {
            KeyGenerator keyGenerator;
            SymmetricAlgorithm chosenAlgorithm = SymmetricAlgorithm.valueOf(algorithm, keySize);
            keyGenerator = KeyGenerator.getInstance(chosenAlgorithm.getName(), CRYPTO_PROVIDER);
            assert keyGenerator != null;
            keyGenerator.init(chosenAlgorithm.getkeySizeInBits());
            return keyGenerator.generateKey();
            
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            LOGGER.error("Error generating a secret key", e);
            throw new GenericSecurityProcessorException("Could not generate the secret key with given properties");
        }
    }

    @Override
    public KeyPairType generateKeyPair(String algorithm, int keySize) {
        return null;
    }

    @Override
    public CertificateType generateSelfSignedCertificate(KeyPairType keypair) {
        return null;
    }
}
