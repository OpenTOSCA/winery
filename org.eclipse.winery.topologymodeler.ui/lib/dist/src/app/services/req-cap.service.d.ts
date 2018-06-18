import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export declare class ReqCapService {
    private http;
    readonly options: {
        headers: HttpHeaders;
    };
    constructor(http: HttpClient);
    /**
     * Requests all requirement definitions of a node type from the backend
     * @param   nodeType - the node type of the node template
     * @returns
     */
    requestRequirementDefinitionsOfNodeType(nodeType: string): Observable<any>;
    /**
     * Requests all capability definitions of a node type from the backend
     * @param   nodeType - the node type of the node template
     * @returns
     */
    requestCapabilityDefinitionsOfNodeType(nodeType: string): Observable<any>;
}
