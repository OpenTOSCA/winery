import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { EntityType, TTopologyTemplate, Visuals } from '../models/ttopology-template';
import { QNameWithTypeApiData } from '../models/generateArtifactApiData';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ToscaDiff } from '../models/ToscaDiff';
/**
 * Responsible for interchanging data between the app and the server.
 */
export declare class BackendService {
    private http;
    private activatedRoute;
    private alert;
    readonly headers: HttpHeaders;
    entityLoaded: {
        topologyTemplatesDiffAndVisuals: boolean;
        artifactTypes: boolean;
        artifactTemplates: boolean;
        policyTypes: boolean;
        policyTemplates: boolean;
        capabilityTypes: boolean;
        requirementTypes: boolean;
        groupedNodeTypes: boolean;
        ungroupedNodeTypes: boolean;
        relationshipTypes: boolean;
    };
    allEntitiesLoaded: boolean;
    configuration: TopologyModelerConfiguration;
    topologyTemplateURL: any;
    private serviceTemplate;
    serviceTemplate$: Observable<any>;
    private visuals;
    visuals$: Observable<any>;
    private policyTypes;
    policyTypes$: Observable<any>;
    private policyTemplates;
    policyTemplates$: Observable<any>;
    private capabilityTypes;
    capabilityTypes$: Observable<any>;
    private requirementTypes;
    requirementTypes$: Observable<any>;
    private artifactTypes;
    artifactTypes$: Observable<any>;
    private artifactTemplates;
    artifactTemplates$: Observable<any>;
    private groupedNodeTypes;
    groupedNodeTypes$: Observable<any>;
    private nodeTypes;
    nodeTypes$: Observable<any>;
    private relationshipTypes;
    relationshipTypes$: Observable<any>;
    private topologyTemplatesDiffAndVisuals;
    topologyTemplatesDiffAndVisuals$: Observable<[TTopologyTemplate, Visuals, ToscaDiff, TTopologyTemplate]>;
    constructor(http: HttpClient, activatedRoute: ActivatedRoute, alert: ToastrService);
    everythingLoaded(): Promise<{}>;
    /**
     * Requests topologyTemplate and visualappearances together. If the topology should be compared, it also gets
     * the old topology as well as the diff representation.
     * We use Observable.forkJoin to await all responses from the backend.
     * This is required
     * @returns data  The JSON from the server
     */
    requestTopologyTemplateAndVisuals(): Observable<any>;
    /**
     * Requests data from the server
     */
    requestServiceTemplate(): Observable<Object>;
    /**
     * Returns data that is later used by jsPlumb to render a relationship connector
     */
    requestRelationshipTypeVisualappearance(namespace: string, id: string): Observable<EntityType>;
    /**
     * Requests all visual appearances used for the NodeTemplates
     */
    requestAllNodeTemplateVisuals(): Observable<any>;
    /**
     * Requests all policy types from the backend
     */
    requestPolicyTypes(): Observable<any>;
    /**
     * Requests all requirement types from the backend
     */
    requestRequirementTypes(): Observable<any>;
    /**
     * Requests all capability types from the backend
     */
    requestCapabilityTypes(): Observable<any>;
    /**
     * Requests all grouped node types from the backend
     */
    requestGroupedNodeTypes(): Observable<any>;
    /**
     * Requests all ungrouped node types from the backend
     */
    requestNodeTypes(): Observable<any>;
    /**
     * Requests all policy templates from the backend
     */
    requestPolicyTemplates(): Observable<any>;
    /**
     * Requests all artifact types from the backend
     */
    requestArtifactTypes(): Observable<any>;
    /**
     * Requests all artifact templates from the backend
     */
    requestArtifactTemplates(): Observable<any>;
    /**
     * Requests all relationship types from the backend
     */
    requestRelationshipTypes(): Observable<any>;
    /**
     * Requests all namespaces from the backend
     */
    requestNamespaces(all?: boolean): Observable<any>;
    /**
     * This method retrieves a single Artifact Template from the backend.
     * @param artifact
     */
    requestArtifactTemplate(artifact: QNameWithTypeApiData): Observable<any>;
    /**
     * This method retrieves a single Policy Template from the backend.
     * @param artifact
     */
    requestPolicyTemplate(artifact: QNameWithTypeApiData): Observable<any>;
    /**
     * Saves the topologyTemplate back to the repository
     */
    saveTopologyTemplate(topologyTemplate: any): Observable<HttpResponse<string>>;
    /**
     * Imports the template.
     */
    importTopology(importedTemplateQName: string): Observable<HttpResponse<string>>;
    /**
     * Splits the template.
     */
    splitTopology(): Observable<HttpResponse<string>>;
    /**
     * Matches the template.
     */
    matchTopology(): Observable<HttpResponse<string>>;
    /**
     * Used for creating new artifact templates on the backend.
     * @param artifact
     */
    createNewArtifact(artifact: QNameWithTypeApiData): Observable<HttpResponse<string>>;
    /**
     * Used for getting the newly created artifact templates for further processing on the client.
     * @param artifact
     */
    getNewlyCreatedArtifact(artifact: QNameWithTypeApiData): Observable<any>;
    /**
     * Requests all topology template ids
     */
    requestAllTopologyTemplates(): Observable<EntityType[]>;
}
/**
 * Defines config of TopologyModeler.
 */
export declare class TopologyModelerConfiguration {
    readonly id: string;
    readonly ns: string;
    readonly repositoryURL: string;
    readonly uiURL: string;
    readonly compareTo: string;
}
