/*******************************************************************************
 * Copyright (c) 2012-2017 Contributors to the Eclipse Foundation
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
package org.eclipse.winery.repository.export;

import org.apache.tika.mime.MediaType;
import org.eclipse.winery.common.RepositoryFileReference;
import org.eclipse.winery.common.Util;
import org.eclipse.winery.common.ids.definitions.*;
import org.eclipse.winery.common.ids.definitions.imports.GenericImportId;
import org.eclipse.winery.common.ids.elements.PlanId;
import org.eclipse.winery.common.ids.elements.PlansId;
import org.eclipse.winery.model.tosca.*;
import org.eclipse.winery.model.tosca.TEntityType.PropertiesDefinition;
import org.eclipse.winery.model.tosca.constants.Namespaces;
import org.eclipse.winery.model.tosca.constants.QNames;
import org.eclipse.winery.model.tosca.kvproperties.WinerysPropertiesDefinition;
import org.eclipse.winery.model.tosca.utils.ModelUtilities;
import org.eclipse.winery.repository.JAXBSupport;
import org.eclipse.winery.repository.backend.BackendUtils;
import org.eclipse.winery.repository.backend.IRepository;
import org.eclipse.winery.repository.backend.RepositoryFactory;
import org.eclipse.winery.repository.backend.constants.Filename;
import org.eclipse.winery.repository.backend.filebased.FilebasedRepository;
import org.eclipse.winery.repository.configuration.Environment;
import org.eclipse.winery.repository.datatypes.ids.elements.ArtifactTemplateFilesDirectoryId;
import org.eclipse.winery.repository.datatypes.ids.elements.DirectoryId;
import org.eclipse.winery.repository.datatypes.ids.elements.VisualAppearanceId;
import org.eclipse.winery.repository.exceptions.RepositoryCorruptException;
import org.eclipse.winery.repository.security.csar.*;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;
import org.eclipse.winery.repository.security.csar.support.SupportedDigestAlgorithm;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;
import org.w3c.dom.Document;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.namespace.QName;
import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.util.*;

public class ToscaExportUtil {
    
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(ToscaExportUtil.class);

    /*
     * these two are GLOBAL VARIABLES leading to the fact that this class has to
     * be constructed for each export
     */

    // collects the references to be put in the CSAR and the assigned path in
    // the CSAR MANIFEST
    // this allows to use other paths in the CSAR than on the local storage
    private Map<RepositoryFileReference, String> referencesToPathInCSARMap = null;
    
    private SecurityProcessor securityProcessor = null;
    private KeystoreManager keystoreManager = null;
    private String digestAlgorithm;
    private Map<String, String> definitionsDigests = new HashMap<>();
    
    /**
     * Currently a very simple approach to configure the export
     */
    private Map<String, Object> exportConfiguration;

    public enum ExportProperties {
        INCLUDEXYCOORDINATES, REPOSITORY_URI, APPLY_SECURITY_POLICIES
    }

    /**
     * Writes the <em>complete</em> tosca xml into the given outputstream
     *
     * @param id                  the id of the definition child to export
     * @param out                 outputstream to write to
     * @param exportConfiguration the configuration map for the export.
     * @return a collection of DefinitionsChildIds referenced by the given component
     */
    public Collection<DefinitionsChildId> exportTOSCA(IRepository repository, DefinitionsChildId id, OutputStream out, Map<String, Object> exportConfiguration) throws IOException, JAXBException, RepositoryCorruptException {
        this.exportConfiguration = exportConfiguration;
        this.initializeExport();
        return this.writeDefinitionsElement(repository, id, out);
    }

    private void initializeExport() {
        this.setDefaultExportConfiguration();
        // quick hack to avoid NPE
        if (this.referencesToPathInCSARMap == null) {
            this.referencesToPathInCSARMap = new HashMap<>();
        }
    }

    /**
     * Quick hack to set defaults. Typically, a configuration builder or similar is used
     */
    private void setDefaultExportConfiguration() {
        this.checkConfig(ExportProperties.INCLUDEXYCOORDINATES, Boolean.FALSE);
    }

    private void checkConfig(ExportProperties propKey, Boolean bo) {
        if (!this.exportConfiguration.containsKey(propKey.toString())) {
            this.exportConfiguration.put(propKey.toString(), bo);
        }
    }

    /**
     * Writes the <em>complete</em> TOSCA XML into the given output stream. Additionally, a the artifactMap is filled to
     * enable the CSAR exporter to create necessary entries in TOSCA-Meta and to add them to the CSAR itself
     *
     * @param id                        the component instance to export
     * @param out                       outputstream to write to
     * @param exportConfiguration       Configures the exporter
     * @param referencesToPathInCSARMap collects the references to export. It is updated during the export
     * @return a collection of DefinitionsChildIds referenced by the given component
     */
    protected Collection<DefinitionsChildId> exportTOSCA(IRepository repository, DefinitionsChildId id, OutputStream out, Map<RepositoryFileReference, String> referencesToPathInCSARMap, Map<String, Object> exportConfiguration) throws IOException, JAXBException, RepositoryCorruptException {
        this.referencesToPathInCSARMap = referencesToPathInCSARMap;
        return this.exportTOSCA(repository, id, out, exportConfiguration);
    }

    /**
     * Called when the entry resource is definitions backed
     */
    private void writeDefinitionsElement(Definitions entryDefinitions, OutputStream out) throws JAXBException {
        Marshaller m = JAXBSupport.createMarshaller(true);
        m.marshal(entryDefinitions, out);
    }

    /**
     * Writes the Definitions belonging to the given definitgion children to the output stream
     *
     * @return a collection of DefinitionsChildIds referenced by the given component
     * @throws RepositoryCorruptException if tcId does not exist
     */
    private Collection<DefinitionsChildId> writeDefinitionsElement(IRepository repository, DefinitionsChildId tcId, OutputStream out) throws JAXBException, RepositoryCorruptException, IOException {
        if (!repository.exists(tcId)) {
            String error = "Component instance " + tcId.toReadableString() + " does not exist.";
            ToscaExportUtil.LOGGER.error(error);
            throw new RepositoryCorruptException(error);
        }

        this.getPrepareForExport(repository, tcId);

        Definitions entryDefinitions = repository.getDefinitions(tcId);

        // BEGIN: Definitions modification
        // the "imports" collection contains the imports of Definitions, not of other definitions
        // the other definitions are stored in entryDefinitions.getImport()
        // we modify the internal definitions object directly. It is not written back to the storage. Therefore, we do not need to clone it

        // the imports (pointing to not-definitions (xsd, wsdl, ...)) already have a correct relative URL. (quick hack)
        URI uri = (URI) this.exportConfiguration.get(ToscaExportUtil.ExportProperties.REPOSITORY_URI.toString());
        if (uri != null) {
            // we are in the plain-XML mode, the URLs of the imports have to be adjusted
            for (TImport i : entryDefinitions.getImport()) {
                String loc = i.getLocation();
                if (!loc.startsWith("../")) {
                    LOGGER.warn("Location is not relative for id " + tcId.toReadableString());
                }
                
                loc = loc.substring(3);
                loc = uri + loc;
                // now the location is an absolute URL
                i.setLocation(loc);
            }
        }

        // files of imports have to be added to the CSAR, too
        for (TImport i : entryDefinitions.getImport()) {
            String loc = i.getLocation();
            if (Util.isRelativeURI(loc)) {
                // locally stored, add to CSAR
                GenericImportId iid = new GenericImportId(i);
                String fileName = Util.getLastURIPart(loc);
                fileName = Util.URLdecode(fileName);
                RepositoryFileReference ref = new RepositoryFileReference(iid, fileName);
                this.putRefAsReferencedItemInCsar(ref);
            }
        }

        Collection<DefinitionsChildId> referencedDefinitionsChildIds = repository.getReferencedDefinitionsChildIds(tcId);

        // adjust imports: add imports of definitions to it
        Collection<TImport> imports = new ArrayList<>();
        for (DefinitionsChildId id : referencedDefinitionsChildIds) {
            this.addToImports(repository, id, imports);
        }
        entryDefinitions.getImport().addAll(imports);

        if (entryDefinitions.getElement() instanceof TEntityType) {
            TEntityType entityType = (TEntityType) entryDefinitions.getElement();

            // we have an entity type with a possible properties definition
            WinerysPropertiesDefinition wpd = entityType.getWinerysPropertiesDefinition();
            if (wpd != null) {
                if (wpd.getIsDerivedFromXSD() == null) {
                    // Write WPD only to file if it exists and is NOT derived from an XSD (which may happen during import)

                    String wrapperElementNamespace = wpd.getNamespace();
                    String wrapperElementLocalName = wpd.getElementName();

                    // BEGIN: add import and put into CSAR

                    TImport imp = new TImport();
                    entryDefinitions.getImport().add(imp);

                    // fill known import values
                    imp.setImportType(XMLConstants.W3C_XML_SCHEMA_NS_URI);
                    imp.setNamespace(wrapperElementNamespace);
                    // add "winerysPropertiesDefinition" flag to import tag to support
                    Map<QName, String> otherAttributes = imp.getOtherAttributes();
                    otherAttributes.put(QNames.QNAME_WINERYS_PROPERTIES_DEFINITION_ATTRIBUTE, "true");

                    // Determine location
                    String loc = BackendUtils.getImportLocationForWinerysPropertiesDefinitionXSD((EntityTypeId) tcId, uri, wrapperElementLocalName);
                    if (uri == null) {
                        ToscaExportUtil.LOGGER.trace("CSAR Export mode. Putting XSD into CSAR");
                        // CSAR Export mode
                        // XSD has to be put into the CSAR
                        Document document = ModelUtilities.getWinerysPropertiesDefinitionXsdAsDocument(wpd);

                        // loc in import is URLencoded, loc on filesystem isn't
                        String locInCSAR = Util.URLdecode(loc);
                        // furthermore, the path has to start from the root of the CSAR; currently, it starts from Definitions/
                        locInCSAR = locInCSAR.substring(3);
                        ToscaExportUtil.LOGGER.trace("Location in CSAR: {}", locInCSAR);
                        this.referencesToPathInCSARMap.put(new DummyRepositoryFileReferenceForGeneratedXSD(document), locInCSAR);
                    }
                    imp.setLocation(loc);

                    // END: add import and put into CSAR

                    // BEGIN: generate TOSCA conforming PropertiesDefinition

                    PropertiesDefinition propertiesDefinition = new PropertiesDefinition();
                    propertiesDefinition.setType(new QName(wrapperElementNamespace, wrapperElementLocalName));
                    entityType.setPropertiesDefinition(propertiesDefinition);

                    // END: generate TOSCA conforming PropertiesDefinition
                } else {
                    //noinspection StatementWithEmptyBody
                    // otherwise WPD exists, but is derived from XSD
                    // we DO NOT have to remove the winery properties definition from the output to allow "debugging" of the CSAR
                }
            }
        }

        // END: Definitions modification
        
        // Enforce security policies for definitions
        if (this.exportConfiguration.containsKey(ExportProperties.APPLY_SECURITY_POLICIES.name()) &&
            (Boolean) this.exportConfiguration.get(ExportProperties.APPLY_SECURITY_POLICIES.name())) {
            this.securityProcessor = new BCSecurityProcessor();
            this.keystoreManager = new JCEKSKeystoreManager();
            this.digestAlgorithm = SupportedDigestAlgorithm.SHA256.name();
            this.enforceSecurityPolicies(repository, tcId, entryDefinitions, referencedDefinitionsChildIds);

            try {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                this.writeDefinitionsElement(entryDefinitions, byteArrayOutputStream);
                String checksum = securityProcessor.calculateDigest(byteArrayOutputStream.toByteArray(), this.digestAlgorithm);
                String defName = CsarExporter.getDefinitionsPathInsideCSAR(repository, tcId);
                definitionsDigests.put(defName, checksum);
            } catch (GenericSecurityProcessorException e) {
                e.printStackTrace();
            }
        }
        
        this.writeDefinitionsElement(entryDefinitions, out);

        return referencedDefinitionsChildIds;
    }
    
    public Map<String, String> getDefinitionsDigests() {
        return this.definitionsDigests;
    }
    
    private void enforceSecurityPolicies(IRepository repository, DefinitionsChildId tcId, Definitions entryDefinitions, Collection<DefinitionsChildId> referencedDefinitionsChildIds) {
        for (TExtensibleElements element: entryDefinitions.getServiceTemplateOrNodeTypeOrNodeTypeImplementation()) {
            if (element instanceof TServiceTemplate) {
                TServiceTemplate serviceTemplate = (TServiceTemplate) element;
                for (TNodeTemplate nodeTemplate: serviceTemplate.getTopologyTemplate().getNodeTemplates()) {
                    enforcePropertyEncryption(repository, entryDefinitions, nodeTemplate, referencedDefinitionsChildIds);
                    enforcePropertySigning(repository, entryDefinitions, tcId, serviceTemplate, nodeTemplate, referencedDefinitionsChildIds);                    
                }
            }
        }
        for (TArtifactTemplate element: entryDefinitions.getArtifactTemplates()) {
            enforceArtifactsSigningAndEncryption(repository, (ArtifactTemplateId) tcId, entryDefinitions, element, referencedDefinitionsChildIds);
        }        
    }

    private void enforceArtifactsSigningAndEncryption(IRepository repository, ArtifactTemplateId tcId, Definitions entryDefinitions, TArtifactTemplate artifactTemplate, Collection<DefinitionsChildId> referencedDefinitionsChildIds) {
        final TPolicy signingPolicy = artifactTemplate.getSigningPolicy();
        final TPolicy encPolicy = artifactTemplate.getEncryptionPolicy();
        
        DirectoryId fileDir = new ArtifactTemplateFilesDirectoryId(tcId);
        SortedSet<RepositoryFileReference> files = RepositoryFactory.getRepository().getContainedFiles(fileDir);
        
        if (Objects.nonNull(signingPolicy) && !signingPolicy.getIsApplied()) {
            PolicyTypeId signPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, signingPolicy.getPolicyType());
            referencedDefinitionsChildIds.add(signPolicyTypeId);
            PolicyTemplateId signPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, signingPolicy.getPolicyRef());
            referencedDefinitionsChildIds.add(signPolicyTemplateId);

            Collection<TImport> imports = new ArrayList<>();
            this.addToImports(repository, signPolicyTypeId, imports);
            this.addToImports(repository, signPolicyTemplateId, imports);
            entryDefinitions.getImport().addAll(imports);

            TArtifactTemplate.ArtifactReferences refs = artifactTemplate.getArtifactReferences();
            
            if (Objects.nonNull(refs) && refs.getArtifactReference().size() > 0) {
                String signingKeyAlias = signingPolicy.getPolicyRef().getLocalPart();
                try {
                    Key signingKey = this.keystoreManager.loadKey(signingKeyAlias);
                    signFilesOfArtifactTemplate(repository, tcId, artifactTemplate, signingKey, files, SecureCSARConstants.ARTIFACT_SIGN_MODE_PLAIN);

                    if (Objects.nonNull(encPolicy) && !encPolicy.getIsApplied()) {
                        String ecnryptionKeyAlias = encPolicy.getPolicyRef().getLocalPart();
                        Key encryptionKey = this.keystoreManager.loadKey(ecnryptionKeyAlias);
                        encryptFilesOfArtifactTemplate(repository, artifactTemplate, encryptionKey, files);
                        // Sign encrypted artifact as well
                        signFilesOfArtifactTemplate(repository, tcId, artifactTemplate, signingKey, files, SecureCSARConstants.ARTIFACT_SIGN_MODE_ENCRYPTED);
                    }
                    
                } catch (GenericKeystoreManagerException e) {
                    e.printStackTrace();
                }
            }
        }
        else {
            if (Objects.nonNull(encPolicy) && !encPolicy.getIsApplied()) {
                PolicyTypeId encPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, signingPolicy.getPolicyType());
                referencedDefinitionsChildIds.add(encPolicyTypeId);
                PolicyTemplateId encPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, signingPolicy.getPolicyRef());
                referencedDefinitionsChildIds.add(encPolicyTemplateId);

                Collection<TImport> imports = new ArrayList<>();
                this.addToImports(repository, encPolicyTypeId, imports);
                this.addToImports(repository, encPolicyTemplateId, imports);
                entryDefinitions.getImport().addAll(imports);
                
                try {
                    String ecnryptionKeyAlias = encPolicy.getPolicyRef().getLocalPart();
                    Key encryptionKey = this.keystoreManager.loadKey(ecnryptionKeyAlias);
                    encryptFilesOfArtifactTemplate(repository, artifactTemplate, encryptionKey, files);
                } catch (GenericKeystoreManagerException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
    private void signFilesOfArtifactTemplate(IRepository repository, ArtifactTemplateId tcId, TArtifactTemplate artifactTemplate, Key signingKey, Set<RepositoryFileReference> files, String mode) {
        try {
            for (RepositoryFileReference fileRef : files) {
                if (!fileRef.getFileName().contains(SecureCSARConstants.ARTIFACT_SIGN_MODE_PLAIN) || !fileRef.getFileName().contains(SecureCSARConstants.ARTIFACT_SIGN_MODE_ENCRYPTED)) {
                    byte[] fileBytes = Files.readAllBytes(((FilebasedRepository) repository).ref2AbsolutePath(fileRef));
                    byte[] blockSignatureFileContent = this.securityProcessor.signBytes(signingKey, fileBytes);
                    // generate signature block file                
                    String blockSignatureFileName = fileRef.getFileName().concat(mode).concat(SecureCSARConstants.ARTIFACT_SIGNEXTENSION);
                    RepositoryFileReference blockSignatureFileRef = addFileToArtifactTemplate(tcId, artifactTemplate, blockSignatureFileName, blockSignatureFileContent);
                    String blockSignatureFilePath = BackendUtils.getPathInsideRepo(blockSignatureFileRef);
                    this.referencesToPathInCSARMap.put(blockSignatureFileRef, blockSignatureFilePath);

                    artifactTemplate.getSigningPolicy().setIsApplied(true);
                }
            }
        } catch ( IOException | GenericSecurityProcessorException e) {
            e.printStackTrace();
        }        
    }

    private void encryptFilesOfArtifactTemplate(IRepository repository, TArtifactTemplate artifactTemplate, Key encryptionKey, Set<RepositoryFileReference> files) {
        try {
            for (RepositoryFileReference fileRef : files) {
                if (!fileRef.getFileName().contains(SecureCSARConstants.ARTIFACT_SIGN_MODE_PLAIN) || !fileRef.getFileName().contains(SecureCSARConstants.ARTIFACT_SIGN_MODE_ENCRYPTED)) {
                    Path p = ((FilebasedRepository) repository).ref2AbsolutePath(fileRef);
                    byte[] fileBytes = Files.readAllBytes(p);
                    byte[] encryptedFileBytes = this.securityProcessor.encryptByteArray(encryptionKey, fileBytes);
                    // side-effect: file in the repository is encrypted now
                    Files.write(p, encryptedFileBytes);

                    artifactTemplate.getEncryptionPolicy().setIsApplied(true);
                }
            }
        } catch ( IOException | GenericSecurityProcessorException e) {
            e.printStackTrace();
        }
    }
    
    private void enforcePropertySigning(IRepository repository, Definitions entryDefinitions, DefinitionsChildId tcId, TServiceTemplate serviceTemplate, TNodeTemplate nodeTemplate, Collection<DefinitionsChildId> referencedDefinitionsChildIds) {
        final NodeTypeId nTypeId = BackendUtils.getDefinitionsChildId(NodeTypeId.class, nodeTemplate.getType());
        final TEntityType nodeType = repository.getElement(nTypeId);

        if (Objects.nonNull(nodeType.getPolicies())) {
            TPolicy signTypeLevelPolicy = nodeType.getPolicyByQName(QNames.WINERY_SIGNING_POLICY_TYPE);
            TPolicy signTypeLevelPropsPolicy = nodeType.getPolicyByQName(QNames.WINERY_SIGNEDPROP_POLICY_TYPE);

            TPolicy signTemplateLevelPolicy = nodeTemplate.getPolicyByQName(QNames.WINERY_SIGNING_POLICY_TYPE);
            
            if (Objects.nonNull(signTypeLevelPolicy) && Objects.nonNull(signTypeLevelPropsPolicy)) {
                if (Objects.isNull(signTemplateLevelPolicy) || !signTemplateLevelPolicy.getIsApplied()) {
                    
                    PolicyTypeId signPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, signTypeLevelPolicy.getPolicyType());
                    PolicyTypeId signPropsPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, signTypeLevelPropsPolicy.getPolicyType());
                    referencedDefinitionsChildIds.add(signPolicyTypeId);
                    referencedDefinitionsChildIds.add(signPropsPolicyTypeId);

                    PolicyTemplateId signPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, signTypeLevelPolicy.getPolicyRef());
                    PolicyTemplateId signPropsPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, signTypeLevelPropsPolicy.getPolicyRef());
                    referencedDefinitionsChildIds.add(signPolicyTemplateId);
                    referencedDefinitionsChildIds.add(signPropsPolicyTemplateId);

                    Collection<TImport> imports = new ArrayList<>();
                    this.addToImports(repository, signPolicyTypeId, imports);
                    this.addToImports(repository, signPolicyTemplateId, imports);
                    this.addToImports(repository, signPropsPolicyTypeId, imports);
                    this.addToImports(repository, signPropsPolicyTemplateId, imports);

                    TPolicyTemplate signPropsPolicyTemplate = repository.getElement(signPropsPolicyTemplateId);

                    String keyAlias = signTypeLevelPolicy.getPolicyRef().getLocalPart();
                    String spaceSeparatedPropertyNames = signPropsPolicyTemplate.getProperties().getKVProperties().get(SecureCSARConstants.SEC_POL_PROPGROUPING_PROPERTY);

                    if (this.keystoreManager.entityExists(keyAlias)) {
                        List<String> propertyNames = Arrays.asList(spaceSeparatedPropertyNames.split("\\s+"));

                        if (propertyNames.size() > 0) {
                            try {
                                Key signingKey = this.keystoreManager.loadKey(keyAlias);

                                // Generate Atempl and add it to referencedDefinitionsChildIds so that it's exported
                                String signatureATName = generateSignatureArtifactTemplateName(nodeTemplate.getName(), signPropsPolicyTemplate.getName());
                                ArtifactTemplateId signatureArtifactTemplateId = generateArtifactTemplate(repository, QNames.WINERY_SIGNATURE_ARTIFACT_TYPE, signatureATName, true);
                                TArtifactTemplate signatureArtifactTemplate = repository.getElement(signatureArtifactTemplateId);
                                ArtifactTypeId signatureArtifactTypeId = BackendUtils.getDefinitionsChildId(ArtifactTypeId.class, signatureArtifactTemplate.getType());

                                Map<String, String> artifactTemplateKVProperties = nodeTemplate.getProperties().getKVProperties();
                                Map<String, String> propertiesDigests = calculatePropertiesDigests(propertyNames, artifactTemplateKVProperties); 
                                String signedPropertiesManifestContent = generateSignedPropertiesManifestContent(propertiesDigests);

                                if (!signedPropertiesManifestContent.isEmpty()) {
                                    // generate Properties Digests Manifest
                                    String manifestName = generateSignedPropertiesManifestName(signatureArtifactTemplate.getId());
                                    RepositoryFileReference manifestPathRef = addFileToArtifactTemplate(signatureArtifactTemplateId, signatureArtifactTemplate, manifestName, signedPropertiesManifestContent);
                                    String manifestPath = BackendUtils.getPathInsideRepo(manifestPathRef);
                                    this.referencesToPathInCSARMap.put(manifestPathRef, manifestPath);
                                    
                                    if (Objects.isNull(nodeTemplate.getDeploymentArtifacts())) {
                                        nodeTemplate.setDeploymentArtifacts(new TDeploymentArtifacts());
                                    }

                                    TDeploymentArtifact propsManifest = new TDeploymentArtifact.Builder("DA_".concat(manifestName), QNames.WINERY_SIGNATURE_ARTIFACT_TYPE)
                                        .setArtifactRef(signatureArtifactTemplateId.getQName())
                                        .build();
                                    nodeTemplate.getDeploymentArtifacts().getDeploymentArtifact().add(propsManifest);

                                    // generate SF
                                    byte[] manifestBytes = Files.readAllBytes(((FilebasedRepository) repository).ref2AbsolutePath(manifestPathRef)); 
                                    String manifestDigest = this.securityProcessor.calculateDigest(manifestBytes, this.digestAlgorithm);
                                    String signedPropertiesSignatureFileContent = generateSignedPropertiesSignatureFile(manifestDigest, propertiesDigests);
                                    String signedPropertiesSignatureFileName = generatePropertiesSignatureFileName(signatureArtifactTemplate.getId());
                                    RepositoryFileReference signedPropertiesSignatureFileRef = addFileToArtifactTemplate(signatureArtifactTemplateId, signatureArtifactTemplate, signedPropertiesSignatureFileName, signedPropertiesSignatureFileContent);
                                    String signedPropertiesSignatureFilePath = BackendUtils.getPathInsideRepo(signedPropertiesSignatureFileRef);
                                    this.referencesToPathInCSARMap.put(signedPropertiesSignatureFileRef, signedPropertiesSignatureFilePath);

                                    TDeploymentArtifact signedPropertiesSignatureFile = new TDeploymentArtifact.Builder("DA_".concat(signedPropertiesSignatureFileName), QNames.WINERY_SIGNATURE_ARTIFACT_TYPE)
                                        .setArtifactRef(signatureArtifactTemplateId.getQName())
                                        .build();
                                    nodeTemplate.getDeploymentArtifacts().getDeploymentArtifact().add(signedPropertiesSignatureFile);

                                    // generate signature block file
                                    byte[] signatureFileBytes = Files.readAllBytes(((FilebasedRepository) repository).ref2AbsolutePath(signedPropertiesSignatureFileRef));
                                    byte[] blockSignatureFileContent =  this.securityProcessor.signBytes(signingKey, signatureFileBytes);
                                    String blockSignatureFileName = signatureArtifactTemplate.getId().concat(SecureCSARConstants.ARTIFACT_SIGNEXTENSION);
                                    RepositoryFileReference blockSignatureFileRef = addFileToArtifactTemplate(signatureArtifactTemplateId, signatureArtifactTemplate, blockSignatureFileName, blockSignatureFileContent);
                                    String blockSignatureFilePath = BackendUtils.getPathInsideRepo(blockSignatureFileRef);
                                    this.referencesToPathInCSARMap.put(blockSignatureFileRef, blockSignatureFilePath);

                                    TDeploymentArtifact blockSignatureFile = new TDeploymentArtifact.Builder("DA_".concat(blockSignatureFileName), QNames.WINERY_SIGNATURE_ARTIFACT_TYPE)
                                        .setArtifactRef(signatureArtifactTemplateId.getQName())
                                        .build();
                                    nodeTemplate.getDeploymentArtifacts().getDeploymentArtifact().add(blockSignatureFile);
                                    
                                    signTypeLevelPolicy.setIsApplied(true);
                                    if (nodeTemplate.getPolicies() == null) {
                                        nodeTemplate.setPolicies(new TNodeTemplate.Policies());
                                    }
                                    nodeTemplate.getPolicies().getPolicy().add(signTypeLevelPolicy);

                                    BackendUtils.persist(tcId, serviceTemplate);
                                }

                                referencedDefinitionsChildIds.add(signatureArtifactTypeId);
                                referencedDefinitionsChildIds.add(signatureArtifactTemplateId);

                                this.addToImports(repository, signatureArtifactTypeId, imports);
                                this.addToImports(repository, signatureArtifactTemplateId, imports);
                                entryDefinitions.getImport().addAll(imports);

                            } catch (GenericKeystoreManagerException | GenericSecurityProcessorException | IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
            }
        }
    }
    
    private Map<String, String> calculatePropertiesDigests(List<String> propertyNames, Map<String, String> artifactTemplateKVProperties) {
        Map<String, String> propDiests = new HashMap<>();
        String digest;
        for (String p : propertyNames) {
            try {
                digest = this.securityProcessor.calculateDigest(artifactTemplateKVProperties.get(p), this.digestAlgorithm);
                propDiests.put(p, digest);
            } catch (GenericSecurityProcessorException e) {
                e.printStackTrace();
            }            
        }
        return propDiests;
    }
    
    private String generateSignedPropertiesManifestContent(Map<String, String> propertiesDigests) {
        if (propertiesDigests.size() == 0) {
            return "";
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("Signed-Properties-Manifest: 1.0");
        sb.append(System.lineSeparator());
        sb.append("Digest-Algorithm: ");
        sb.append(this.digestAlgorithm);
        sb.append(System.lineSeparator());
        sb.append("Created-By: Winery ");
        sb.append(Environment.getVersion());
        sb.append(System.lineSeparator());

        for (String p : propertiesDigests.keySet()) {
            sb.append(System.lineSeparator());
            sb.append("Name: ");
            sb.append(p);
            sb.append(System.lineSeparator());
            sb.append("Digest: ");
            sb.append(propertiesDigests.get(p));
            sb.append(System.lineSeparator());
        }
        
        return sb.toString();
    }

    private String generateSignedPropertiesSignatureFile(String manifestDigest, Map<String, String> propsDigests) {
        StringBuilder sb = new StringBuilder();
        sb.append("Signature-Version: 1.0");
        sb.append(System.lineSeparator());
        sb.append("Digest-Algorithm: ");
        sb.append(this.digestAlgorithm);
        sb.append(System.lineSeparator());
        sb.append("Digest-Manifest: ");
        sb.append(manifestDigest);
        sb.append(System.lineSeparator());
        sb.append("Created-By: Winery ");
        sb.append(Environment.getVersion());
        sb.append(System.lineSeparator());
        String digest;
        for (String p : propsDigests.keySet()) {
            try {
                digest = this.securityProcessor.calculateDigest(propsDigests.get(p), this.digestAlgorithm);
                sb.append(System.lineSeparator());
                sb.append("Name: ");
                sb.append(p);
                sb.append(System.lineSeparator());
                sb.append("Digest: ");
                sb.append(digest);
                sb.append(System.lineSeparator());
            } catch (GenericSecurityProcessorException e) {
                e.printStackTrace();
            }            
        }
        
        return sb.toString();
    }

    private void enforcePropertyEncryption(IRepository repository, Definitions entryDefinitions, TNodeTemplate nodeTemplate, Collection<DefinitionsChildId> referencedDefinitionsChildIds) {
        final NodeTypeId nTypeId = BackendUtils.getDefinitionsChildId(NodeTypeId.class, nodeTemplate.getType());
        final TEntityType nodeType = repository.getElement(nTypeId);

        if (Objects.nonNull(nodeType.getPolicies())) {
            
            TPolicy encTypeLevelPolicy = nodeType.getPolicyByQName(QNames.WINERY_ENCRYPTION_POLICY_TYPE);
            TPolicy encTypeLevelPropsPolicy = nodeType.getPolicyByQName(QNames.WINERY_ENCRYPTEDPROP_POLICY_TYPE);

            TPolicy encTemplateLevelPolicy = nodeTemplate.getPolicyByQName(QNames.WINERY_ENCRYPTION_POLICY_TYPE);
            
            if (Objects.nonNull(encTypeLevelPolicy) && Objects.nonNull(encTypeLevelPropsPolicy)) {
                if (Objects.isNull(encTemplateLevelPolicy) || !encTemplateLevelPolicy.getIsApplied()) {
                    PolicyTypeId encPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, encTypeLevelPolicy.getPolicyType());
                    PolicyTypeId encPropsPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, encTypeLevelPropsPolicy.getPolicyType());
                    referencedDefinitionsChildIds.add(encPolicyTypeId);
                    referencedDefinitionsChildIds.add(encPropsPolicyTypeId);

                    PolicyTemplateId encPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, encTypeLevelPolicy.getPolicyRef());
                    PolicyTemplateId encPropsPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, encTypeLevelPropsPolicy.getPolicyRef());
                    referencedDefinitionsChildIds.add(encPolicyTemplateId);
                    referencedDefinitionsChildIds.add(encPropsPolicyTemplateId);

                    Collection<TImport> imports = new ArrayList<>();
                    this.addToImports(repository, encPolicyTypeId, imports);
                    this.addToImports(repository, encPolicyTemplateId, imports);
                    this.addToImports(repository, encPropsPolicyTypeId, imports);
                    this.addToImports(repository, encPropsPolicyTemplateId, imports);
                    entryDefinitions.getImport().addAll(imports);
                    
                    TPolicyTemplate encPropsPolicyTemplate = repository.getElement(encPropsPolicyTemplateId);
                    String keyAlias = encTypeLevelPolicy.getPolicyRef().getLocalPart();
                    String props = encPropsPolicyTemplate.getProperties().getKVProperties().get(SecureCSARConstants.SEC_POL_PROPGROUPING_PROPERTY);

                    if (this.keystoreManager.entityExists(keyAlias) && props.length() > 0) {
                        int numPropsSecured = 0;
                        try {
                            Key encryptionKey = this.keystoreManager.loadKey(keyAlias);
                            LinkedHashMap<String, String> templKVProperties = nodeTemplate.getProperties().getKVProperties();
                            for (String p : Arrays.asList(props.split("\\s+"))) {
                                String encValue = this.securityProcessor.encryptString(encryptionKey, templKVProperties.get(p));
                                templKVProperties.replace(p, encValue);
                                numPropsSecured++;
                            }
                            nodeTemplate.getProperties().setKVProperties(templKVProperties);
                            if (numPropsSecured > 0) {
                                encTypeLevelPolicy.setIsApplied(true);
                                if (nodeTemplate.getPolicies() == null) {
                                    nodeTemplate.setPolicies(new TNodeTemplate.Policies());
                                }
                                nodeTemplate.getPolicies().getPolicy().add(encTypeLevelPolicy);
                            }

                        } catch (GenericKeystoreManagerException | GenericSecurityProcessorException e) {
                            e.printStackTrace();
                        }
                    }
                }                
            }
        }
    }
    
    private String generateSignatureArtifactTemplateName(String nodeTemplateName, String signedPropsPolicyName) {
        return nodeTemplateName.concat("_").concat(signedPropsPolicyName);
    }

    private String generateSignedPropertiesManifestName(String fileName) {
        return fileName.concat(SecureCSARConstants.ARTIFACT_SIGNPROP_MANIFEST_EXTENSION);
    }

    private String generatePropertiesSignatureFileName(String fileName) {
        return fileName.concat(SecureCSARConstants.ARTIFACT_SIGNPROP_SF_EXTENSION);
    }
    
    private ArtifactTemplateId generateArtifactTemplate(IRepository repository, QName artifactType, String id, boolean overwrite) {
        ArtifactTemplateId atId = BackendUtils.getDefinitionsChildId(ArtifactTemplateId.class, Namespaces.URI_OPENTOSCA_ARTIFACTTEMPLATE, id, false);
        try {
            if (repository.exists(atId)) {
                if (overwrite) {
                    repository.forceDelete(atId);
                }
                else {
                    return atId;
                }
            }
            repository.flagAsExisting(atId);
            final TArtifactTemplate artifactTemplate = repository.getElement(atId);
            artifactTemplate.setType(artifactType);
            artifactTemplate.setName(id);
            BackendUtils.initializeProperties(repository, artifactTemplate);
            BackendUtils.persist(atId, artifactTemplate);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return atId;
    }
    
    private RepositoryFileReference addFileToArtifactTemplate(ArtifactTemplateId atId, TArtifactTemplate artifactTemplate, String name, Object content) {
        DirectoryId fileDir = new ArtifactTemplateFilesDirectoryId(atId);
        
        if (Objects.isNull(artifactTemplate.getArtifactReferences())) {
            artifactTemplate.setArtifactReferences(new TArtifactTemplate.ArtifactReferences());
        }
        List<TArtifactReference> artRefList = artifactTemplate.getArtifactReferences().getArtifactReference();

        RepositoryFileReference ref = new RepositoryFileReference(fileDir, name);
        String path = Util.getUrlPath(ref);

        if (content instanceof String) {
            putTextToFileInRepository(ref,(String) content);
        }
        else {
            ByteArrayInputStream bis = new ByteArrayInputStream((byte[]) content);
            putBytesToFileInRepository(ref,bis);
        }

        TArtifactReference artRef = new TArtifactReference();
        artRef.setReference(path);
        artRefList.add(artRef);

        try {
            BackendUtils.persist(atId, artifactTemplate);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return ref;
    }
    
    private void putTextToFileInRepository(RepositoryFileReference ref, String content) {
        try {
            RepositoryFactory.getRepository().putContentToFile(ref,content, MediaType.TEXT_PLAIN);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void putBytesToFileInRepository(RepositoryFileReference ref, InputStream is) {
        try {
            RepositoryFactory.getRepository().putContentToFile(ref,is, MediaType.OCTET_STREAM);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Prepares the given id for export. Mostly, the contained files are added to the CSAR.
     */
    private void getPrepareForExport(IRepository repository, DefinitionsChildId id) throws RepositoryCorruptException, IOException {
        // prepareForExport adds the contained files to the CSAR, not the referenced ones.
        // These are added later
        if (id instanceof ServiceTemplateId) {
            this.prepareForExport(repository, (ServiceTemplateId) id);
        } else if (id instanceof RelationshipTypeId) {
            this.addVisualAppearanceToCSAR(repository, (RelationshipTypeId) id);
        } else if (id instanceof NodeTypeId) {
            this.addVisualAppearanceToCSAR(repository, (NodeTypeId) id);
        } else if (id instanceof ArtifactTemplateId) {
            this.prepareForExport(repository, (ArtifactTemplateId) id);
        }
    }

    /**
     * Adds the given id as import to the given imports collection
     */
    private void addToImports(IRepository repository, DefinitionsChildId id, Collection<TImport> imports) {
        TImport imp = new TImport();
        imp.setImportType(Namespaces.TOSCA_NAMESPACE);
        imp.setNamespace(id.getNamespace().getDecoded());
        URI uri = (URI) this.exportConfiguration.get(ToscaExportUtil.ExportProperties.REPOSITORY_URI.toString());
        if (uri == null) {
            // self-contained mode
            // all Definitions are contained in "Definitions" directory, therefore, we provide the filename only
            // references are resolved relatively from a definitions element (COS01, line 425)
            String fn = CsarExporter.getDefinitionsFileName(repository, id);
            fn = Util.URLencode(fn);
            imp.setLocation(fn);
        } else {
            String path = Util.getUrlPath(id);
            path = path + "?definitions";
            URI absoluteURI = uri.resolve(path);
            imp.setLocation(absoluteURI.toString());
        }
        imports.add(imp);

        // FIXME: Currently the depended elements (such as the artifact templates linked to a node type implementation) are gathered by the corresponding "addXY" method.
        // Reason: the corresponding TDefinitions element is *not* updated if a related element is added/removed.
        // That means: The imports are not changed.
        // The current issue is that TOSCA allows imports of Definitions only and the repository has the concrete elements as main structure
        // Although during save the import can be updated (by fetching the associated resource and get the definitions of it),
        // The concrete definitions cannot be determined without
        //  a) having a complete index of all definitions in the repository
        //  b) crawling through the *complete* repository
        // Possibly the current solution, just lazily adding all dependent elements is the better solution.
    }

    /**
     * Synchronizes the plan model references and adds the plans to the csar (putRefAsReferencedItemInCsar)
     */
    private void prepareForExport(IRepository repository, ServiceTemplateId id) throws IOException {
        // ensure that the plans stored locally are the same ones as stored in the definitions
        BackendUtils.synchronizeReferences(id);

        // add all plans as reference in the CSAR
        // the data model is consistent with the repository
        // we crawl through the repository to as putRefAsReferencedItemInCsar expects a repository file reference
        PlansId plansContainerId = new PlansId(id);
        SortedSet<PlanId> nestedPlans = repository.getNestedIds(plansContainerId, PlanId.class);
        for (PlanId planId : nestedPlans) {
            SortedSet<RepositoryFileReference> containedFiles = repository.getContainedFiles(planId);
            // even if we currently support only one file in the directory, we just add everything
            for (RepositoryFileReference ref : containedFiles) {
                this.putRefAsReferencedItemInCsar(ref);
            }
        }
    }

    /**
     * Determines the referenced definition children Ids and also updates the references in the Artifact Template
     *
     * @return a collection of referenced definition child Ids
     */
    private void prepareForExport(IRepository repository, ArtifactTemplateId id) throws RepositoryCorruptException, IOException {
        // Export files

        // This method is called BEFORE the concrete definitions element is written.
        // Therefore, we adapt the content of the attached files to the really existing files
        BackendUtils.synchronizeReferences(id);

        DirectoryId fileDir = new ArtifactTemplateFilesDirectoryId(id);
        SortedSet<RepositoryFileReference> files = repository.getContainedFiles(fileDir);
        for (RepositoryFileReference ref : files) {
            // Even if writing a TOSCA only (!this.writingCSAR),
            // we put the virtual path in the TOSCA
            // Reason: Winery is mostly used as a service and local storage
            // reference to not make sense
            // The old implementation had absolutePath.toUri().toString();
            // there, but this does not work when using a cloud blob store.

            this.putRefAsReferencedItemInCsar(ref);
        }
    }

    /**
     * Puts the given reference as item in the CSAR
     * <p>
     * Thereby, it uses the global variable referencesToPathInCSARMap
     */
    private void putRefAsReferencedItemInCsar(RepositoryFileReference ref) {
        // Determine path
        String path = BackendUtils.getPathInsideRepo(ref);

        // put mapping reference to path into global map
        // the path is the same as put in "synchronizeReferences"
        this.referencesToPathInCSARMap.put(ref, path);
    }

    private void addVisualAppearanceToCSAR(IRepository repository, TopologyGraphElementEntityTypeId id) {
        VisualAppearanceId visId = new VisualAppearanceId(id);
        if (repository.exists(visId)) {
            // we do NOT check for the id, but simply check for bigIcon.png (only exists in NodeType) and smallIcon.png (exists in NodeType and RelationshipType)

            RepositoryFileReference ref = new RepositoryFileReference(visId, Filename.FILENAME_BIG_ICON);
            if (repository.exists(ref)) {
                this.referencesToPathInCSARMap.put(ref, BackendUtils.getPathInsideRepo(ref));
            }

            ref = new RepositoryFileReference(visId, Filename.FILENAME_SMALL_ICON);
            if (repository.exists(ref)) {
                this.referencesToPathInCSARMap.put(ref, BackendUtils.getPathInsideRepo(ref));
            }
        }
    }
}
