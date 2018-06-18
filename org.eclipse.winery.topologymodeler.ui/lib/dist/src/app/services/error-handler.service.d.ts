import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
export declare class ErrorHandlerService {
    private alert;
    constructor(alert: ToastrService);
    /**
     * Error handler.
     * @param error    the error
     */
    handleError(error: HttpErrorResponse): void;
}
