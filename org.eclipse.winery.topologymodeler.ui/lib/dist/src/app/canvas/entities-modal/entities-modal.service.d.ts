import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';
import { TopologyModelerConfiguration } from '../../services/backend.service';
import { Subject } from 'rxjs';
import { ModalVariant } from './modal-model';
export declare class EntitiesModalService {
    private http;
    readonly headers: Headers;
    readonly options: RequestOptions;
    openModalEvent: Subject<OpenModalEvent>;
    openModalEvent$: Observable<OpenModalEvent>;
    configuration: TopologyModelerConfiguration;
    constructor(http: Http);
    /**
     * Requests all namespaces from the backend
     * @returns json of namespaces
     */
    requestNamespaces(all?: boolean): Observable<any>;
}
export declare class OpenModalEvent {
    currentNodeId: string;
    modalVariant: ModalVariant;
    modalName: string;
    modalTemplateName: string;
    modalTemplateNameSpace: string;
    modalType: string;
    constructor(currentNodeId: string, modalVariant: ModalVariant, modalName: string, modalTemplateName: string, modalTemplateNameSpace: string, modalType: string);
}
