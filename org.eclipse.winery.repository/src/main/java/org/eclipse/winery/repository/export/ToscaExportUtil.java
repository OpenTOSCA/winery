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
import org.eclipse.winery.repository.backend.constants.Filename;
import org.eclipse.winery.repository.datatypes.ids.elements.ArtifactTemplateFilesDirectoryId;
import org.eclipse.winery.repository.datatypes.ids.elements.DirectoryId;
import org.eclipse.winery.repository.datatypes.ids.elements.VisualAppearanceId;
import org.eclipse.winery.repository.exceptions.RepositoryCorruptException;
import org.eclipse.winery.repository.security.csar.*;
import org.eclipse.winery.repository.security.csar.exceptions.GenericKeystoreManagerException;
import org.eclipse.winery.repository.security.csar.exceptions.GenericSecurityProcessorException;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;
import org.w3c.dom.Document;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.namespace.QName;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
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
                ;
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
            this.enforceSecurityPoliciesForProperties(repository, entryDefinitions, referencedDefinitionsChildIds);
        }
        
        // references to files are already contained here
        // System.out.println(this.referencesToPathInCSARMap);
        
        this.writeDefinitionsElement(entryDefinitions, out);

        return referencedDefinitionsChildIds;
    }
    
    private void enforceSecurityPoliciesForProperties(IRepository repository, Definitions entryDefinitions, Collection<DefinitionsChildId> referencedDefinitionsChildIds) {
        for (TExtensibleElements element: entryDefinitions.getServiceTemplateOrNodeTypeOrNodeTypeImplementation()) {
            if (element instanceof TServiceTemplate) {
                for (TNodeTemplate templ: ((TServiceTemplate) element).getTopologyTemplate().getNodeTemplates()) {
                    NodeTypeId nTypeId = BackendUtils.getDefinitionsChildId(NodeTypeId.class, templ.getType());
                    TEntityType nodeType = repository.getElement(nTypeId);

                    if (Objects.nonNull(nodeType.getPolicies())) {
                        KeystoreManager keystoreManager = new JCEKSKeystoreManager();
                        SecurityProcessor securityProcessor = new BCSecurityProcessor();
                        
                        TPolicy encPolicy = nodeType.getPolicyByQName(QNames.WINERY_ENCRYPTION_POLICY_TYPE);
                        TPolicy encPropsPolicy = nodeType.getPolicyByQName(QNames.WINERY_ENCRYPTEDPROP_POLICY_TYPE);
                        
                        if (Objects.nonNull(encPolicy) && Objects.nonNull(encPropsPolicy)) {
                            PolicyTypeId encPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, encPolicy.getPolicyType());
                            PolicyTypeId encPropsPolicyTypeId = BackendUtils.getDefinitionsChildId(PolicyTypeId.class, encPropsPolicy.getPolicyType());
                            referencedDefinitionsChildIds.add(encPolicyTypeId);
                            referencedDefinitionsChildIds.add(encPropsPolicyTypeId);
                            
                            PolicyTemplateId encPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, encPolicy.getPolicyRef());
                            PolicyTemplateId encPropsPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, encPropsPolicy.getPolicyRef());
                            referencedDefinitionsChildIds.add(encPolicyTemplateId);
                            referencedDefinitionsChildIds.add(encPropsPolicyTemplateId);
                            
                            TPolicyTemplate encPropsPolicyTemplate = repository.getElement(encPropsPolicyTemplateId);
                            
                            String keyAlias = encPolicy.getPolicyRef().getLocalPart();
                            String props = encPropsPolicyTemplate.getProperties().getKVProperties().get(SecurityPolicyConstants.SEC_POL_PROPGROUPING_PROPERTY);
                            
                            if (keystoreManager.entityExists(keyAlias) && props.length() > 0) {
                                int numPropsSecured = 0;
                                try {
                                    Key encryptionKey = keystoreManager.loadKey(keyAlias);
                                    LinkedHashMap<String, String> templKVProperties = templ.getProperties().getKVProperties();
                                    for (String p : Arrays.asList(props.split("\\s+"))) {
                                        String encValue = securityProcessor.encryptString(encryptionKey, templKVProperties.get(p));
                                        templKVProperties.replace(p, encValue);
                                        numPropsSecured++;
                                    }
                                    templ.getProperties().setKVProperties(templKVProperties);
                                    if (numPropsSecured > 0) {
                                        encPolicy.setIsApplied(true);
                                        if (templ.getPolicies() == null) {
                                            templ.setPolicies(new TNodeTemplate.Policies());
                                        }
                                        templ.getPolicies().getPolicy().add(encPolicy);
                                    }
                                    
                                } catch (GenericKeystoreManagerException | GenericSecurityProcessorException e) {
                                    e.printStackTrace();
                                }
                            }
                        }

                        TPolicy signPolicy = nodeType.getPolicyByQName(QNames.WINERY_SIGNING_POLICY_TYPE);
                        TPolicy signPropsPolicy = nodeType.getPolicyByQName(QNames.WINERY_SIGNEDPROP_POLICY_TYPE);
                        if (Objects.nonNull(signPolicy) && Objects.nonNull(signPropsPolicy)) {
                            PolicyTemplateId signPropsPolicyTemplateId = BackendUtils.getDefinitionsChildId(PolicyTemplateId.class, signPropsPolicy.getPolicyRef());
                            TPolicyTemplate signPropsPolicyTemplate = repository.getElement(signPropsPolicyTemplateId);

                            String keyAlias = signPolicy.getPolicyRef().getLocalPart();
                            String props = signPropsPolicyTemplate.getProperties().getKVProperties().get(SecurityPolicyConstants.SEC_POL_PROPGROUPING_PROPERTY);

                            if (keystoreManager.entityExists(keyAlias) && props.length() > 0) {
                                int numPropsSecured = 0;
                                try {
                                    Key signingKey = keystoreManager.loadKey(keyAlias);
                                    LinkedHashMap<String, String> templKVProperties = templ.getProperties().getKVProperties();
                                    
                                    ArtifactTemplateId signatureArtifactTemplateId = generateSignatureArtifactTemplate(repository, templ.getName(), signPropsPolicyTemplate.getName());
                                    TArtifactTemplate signatureArtifactTemplate = repository.getElement(signatureArtifactTemplateId);
                                    referencedDefinitionsChildIds.add(signatureArtifactTemplateId);
                                    
                                    for (String p : Arrays.asList(props.split("\\s+"))) {
                                        
                                        numPropsSecured++;
                                    }
                                    
                                    if (numPropsSecured > 0) {
                                        signPolicy.setIsApplied(true);
                                        if (templ.getPolicies() == null) {
                                            templ.setPolicies(new TNodeTemplate.Policies());
                                        }
                                        templ.getPolicies().getPolicy().add(signPolicy);
                                        TDeploymentArtifacts dArtifacts = new TDeploymentArtifacts();
                                        
                                        dArtifacts.getDeploymentArtifact().add(
                                            new TDeploymentArtifact.Builder("DA_".concat(signatureArtifactTemplate.getName()), QNames.WINERY_SIGNATURE_ARTIFACT_TYPE)
                                                .setArtifactRef(signatureArtifactTemplateId.getQName())
                                                .build()
                                        );
                                        
                                        templ.setDeploymentArtifacts(dArtifacts);
                                    }

                                } catch (GenericKeystoreManagerException e) {
                                    e.printStackTrace();
                                }
                            }

                        }
                        
                    }
                }
            }
        }
    }
    
    private ArtifactTemplateId generateSignatureArtifactTemplate(IRepository repository, String nodeTemplateName, String signedPropsPolicyName) {
        String id = nodeTemplateName + "_" + signedPropsPolicyName;        
        DefinitionsChildId tcId = BackendUtils.getDefinitionsChildId(ArtifactTemplateId.class, Namespaces.URI_OPENTOSCA_ARTIFACTTEMPLATE, id, false);

        if (!repository.exists(tcId)) {
            repository.flagAsExisting(tcId);
            final Definitions definitions = repository.getDefinitions(tcId);
            final TExtensibleElements element = definitions.getElement();
            ((HasType) element).setType(QNames.WINERY_SIGNATURE_ARTIFACT_TYPE);
            ((HasName) element).setName(id);
            BackendUtils.initializeProperties(repository, (TEntityTemplate) element);

            try {
                BackendUtils.persist(tcId, definitions);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        //referencedDefinitionsChildIds.add(ArtifactTemplateId)
        return (ArtifactTemplateId) tcId;
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
