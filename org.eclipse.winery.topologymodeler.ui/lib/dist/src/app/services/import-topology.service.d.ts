import { BackendService } from './backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { ToastrService } from "ngx-toastr";
export declare class ImportTopologyService {
    private alert;
    constructor(alert: ToastrService);
    /**
     * Does a POST request to the server with the imported topology template URL + 'merge'.
     * Saves and reloads the window.
     * @param serviceTemplate   the selected service template to fetch data from
     * @param backendService    the backend service for calling methods to interact with the server
     * @param errorHandler      the error handler which handles failed server requests
     */
    importTopologyTemplate(serviceTemplate: string, backendService: BackendService, errorHandler: ErrorHandlerService): void;
}
