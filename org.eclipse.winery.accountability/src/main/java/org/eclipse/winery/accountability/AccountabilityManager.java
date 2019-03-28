/********************************************************************************
 * Copyright (c) 2018-2019 Contributors to the Eclipse Foundation
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
 ********************************************************************************/
package org.eclipse.winery.accountability;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Path;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import javax.crypto.SecretKey;

import org.eclipse.winery.accountability.exceptions.BlockchainException;
import org.eclipse.winery.accountability.model.FileProvenanceElement;
import org.eclipse.winery.accountability.model.ModelProvenanceElement;
import org.eclipse.winery.accountability.model.ProvenanceVerification;
import org.eclipse.winery.accountability.model.authorization.AuthorizationInfo;
import org.eclipse.winery.model.csar.toscametafile.TOSCAMetaFileAttributes;

public interface AccountabilityManager {

    /**
     * Verifies that the given set of files is contained in any previous transaction withing the given id. The files map must contain the
     * fileId as the key and the reference to the actual file as its value.
     *
     * @param processIdentifier Identifies of the collaboration process
     * @param manifestId        The identifier of the manifest file inside the given files map
     * @param files             The map of {@link TOSCAMetaFileAttributes} NAME attributes identifying the file inside the manifest pointing to the
     */
    CompletableFuture<Map<String, ProvenanceVerification>> verify(String processIdentifier, String manifestId, Map<String, File> files) throws BlockchainException;

    /**
     * Stores the given manifest file in as the fingerprint of the current state for the given process id.
     *
     * @param processIdentifier Identifies the provenance object .
     * @param fingerprint       The manifest file as a string describing the current state of the provenance object.
     */
    CompletableFuture<String> storeFingerprint(String processIdentifier, String fingerprint) throws BlockchainException;

    /**
     * Stores the given files in the immutable storage. Files that have been stored before are not stored again, and
     * will get the same address in the result.
     *
     * @param files Maps a file identifier with the file content to be immutably stored.
     * @return a map that maps the file identifiers, which are the keys of the input map, to the raw-addresses of these files
     * in the immutable storage.
     */
    CompletableFuture<Map<String, String>> storeState(Map<String, InputStream> files);

    /**
     * Stores a single file in the immutable storage. If the file has been stored before, it will bot be stored again,
     * and it will get the same resulting address.
     *
     * @param data the content of the file to be stored
     * @return the raw-address of the stored file in the immutable storage
     */
    CompletableFuture<String> storeState(InputStream data);

    /**
     * Retrieves a single file from the immutable storage.
     *
     * @param addressInImmutableStorage the raw-address of the file to be retrieved
     * @return the content of the file
     */
    CompletableFuture<InputStream> retrieveState(String addressInImmutableStorage);

    /**
     * Retrieves the history of the given provenance object.
     *
     * @param processIdentifier Identifies of the collaboration process
     */
    CompletableFuture<List<ModelProvenanceElement>> getHistory(String processIdentifier) throws BlockchainException;

    /**
     * Retrieves the history of a specific file inside the given provenance object.
     *
     * @param processIdentifier Identifies of the collaboration process
     * @param fileId            The {@link TOSCAMetaFileAttributes} NAME attribute of the file inside the manifest.
     */
    CompletableFuture<List<FileProvenanceElement>> getHistory(String processIdentifier, String fileId) throws BlockchainException;

    /**
     * Authorizes a new participant for the given collaboration process.
     *
     * @param processIdentifier         the identifier of the collaboration process
     * @param authorizedEthereumAddress the blockchain address of the participant we want to authorize
     * @param authorizedIdentity        the real-world-identity of the participant we want to authorize - e.g., his name
     * @return a completable future that, when completed, returns the transaction hash that contains the authorization information.
     */
    CompletableFuture<String> authorize(String processIdentifier, String authorizedEthereumAddress, String authorizedIdentity) throws BlockchainException;

    /**
     * Gets the authorization tree of a given process which allows various querying capabilities.
     *
     * @param processIdentifier the identifier of the collaboration process
     * @return a completable future that, when completed, returns the authorization tree.
     */
    CompletableFuture<AuthorizationInfo> getAuthorization(String processIdentifier) throws BlockchainException;

    /**
     * Creates a new blockchain keystore file
     * @param password a password to secure the file with
     * @return the full path of the generated keystore file.
     * @throws BlockchainException when an error occurs while creating the new keystore file. 
     */
    Path createNewKeystore(String password) throws BlockchainException;

    /**
     * Deploys the Authorization smart contract to the active blockchain network
     * 
     * @return a completable future that, when completed, returns the address of the contract.
     */
    CompletableFuture<String> deployAuthorizationSmartContract();

    /**
     * Deploys the Authorization smart contract to the active blockchain network
     * 
     * @return a completable future that, when completed, returns the address of the contract.
     */
    CompletableFuture<String> deployProvenanceSmartContract();

    /**
     * Deploys the permissions smart contract to the active blockchain network
     *
     * @return a completable future that, when completed, returns the address of the contract.
     */
    CompletableFuture<String> deployPermissionsSmartContract();

    /**
     * Sets the permissions given from the active user to a certain address.
     *
     * @param takerAddress   the address to set the permissions for.
     * @param permissions    the set of secret keys (permissions) to give.
     * @return a completable future that finishes when the transaction to set the permissions succeeds.
     */
    CompletableFuture<Void> setPermissions(String takerAddress, SecretKey[] permissions) throws BlockchainException;

    /**
     * Gets the set of permissions given to the active user.
     *
     * @param myPrivateKey The private key to decrypt the set of permissions given to the current user.
     * @return a completable future that, when completed, returns a map of the giver addresses associated
     * to the set of permissions they have given to the active user.
     */
    CompletableFuture<Map<String, SecretKey[]>> getMyPermissions(PrivateKey myPrivateKey) throws BlockchainException;

    /**
     * Gets the currently active blockchain identity
     * 
     * @return the identity of the currently active blockchain account
     */
    String getMyIdentity();

    /**
     * Sets the public key associated with the active blockchain user.
     * This key is used for encrypting taken permissions (as part of the key exchange process)
     * @param publicKey the EC public key to set.
     * @return a completable future that finishes when the transaction to set the public key succeeds. 
     * @throws BlockchainException if an error occurs while setting the public key
     */
    CompletableFuture<Void> setMyPublicKey(PublicKey publicKey) throws BlockchainException;

    /**
     * Gets the public key associated with a given blockchain user
     * @param address the address of the blockchain user for which we want to retrieve the public key. 
     * @return a completable future that returns the EC public key associated with the given blockchain when the operation
     * is done
     * @throws BlockchainException if an error occurs while retrieving the public key.
     */
    CompletableFuture<PublicKey> getParticipantPublicKey(String address) throws BlockchainException;
    
    /**
     * Releases resources attached to this instance.
     */
    void close();
}
