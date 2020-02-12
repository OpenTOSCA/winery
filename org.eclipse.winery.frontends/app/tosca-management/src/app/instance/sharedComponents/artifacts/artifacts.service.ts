import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NameAndQNameApiData } from '../../../wineryQNameSelector/wineryNameAndQNameApiData';
import { Observable } from 'rxjs';
import { backendBaseURL } from '../../../configuration';
import { TArtifact } from '../../../../../../topologymodeler/src/app/models/ttopology-template';

/*******************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
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

@Injectable()
export class ArtifactsService {

    constructor(private http: HttpClient, private route: Router) {
    }

    getAllArtifacts(types: string) {
        return this.sendJsonRequest<NameAndQNameApiData[]>('/' + types);
    }

    private sendJsonRequest<T>(requestPath: string): Observable<T> {
        return this.http.get<T>(backendBaseURL + requestPath);
    }

    getArtifactsData() {
        return this.sendJsonRequest<TArtifact []>(this.route.url);
    }

    sendPostRequest(artifactToBeAdded: TArtifact) {
        console.log(artifactToBeAdded);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http
            .post(
                backendBaseURL + this.route.url + '/',
                artifactToBeAdded,
                { headers: headers, observe: 'response', responseType: 'text' }
            );
    }
}
