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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WineryNotificationService } from '../../../wineryNotificationModule/wineryNotification.service';
import { ArtifactsService } from './artifacts.service';
import { TArtifact } from '../../../../../../topologymodeler/src/app/models/ttopology-template';
import { ModalDirective } from 'ngx-bootstrap';
import { NameAndQNameApiData, NameAndQNameApiDataList } from '../../../wineryQNameSelector/wineryNameAndQNameApiData';
import { ArtifactsTableData } from './artifactsTableData';

@Component({
    selector: 'winery-instance-artifacts',
    templateUrl: 'artifacts.component.html',
    providers: [ArtifactsService,
        WineryNotificationService],
})
export class ArtifactsComponent implements OnInit {

    loading: boolean;

    @Input() currentNodeData: any;

    artifacts: TArtifact[] = [];
    columns = [
        { title: 'Name', name: 'name' },
        { title: 'Type', name: 'type' },
        { title: 'File', name: 'file' },
        { title: 'Deployment Path', name: 'targetLocation' }
    ];

    @ViewChild('addModal') addModal: ModalDirective;
    artifactTypes: NameAndQNameApiDataList = { classes: null };
    artifactToBeAdded: TArtifact = new TArtifact('', null, '', '');
    selectedYamlArtifactAllowedTypes = '';
    selectedYamlArtifactFile: File;
    artifactsTableDataList: Array<ArtifactsTableData> = [];

    constructor(private service: ArtifactsService) {
    }

    ngOnInit(): void {
        this.getArtifactsResourceApiData();
        this.getAllArtifacts('artifacttypes');
    }

    onAddClick() {
        this.addModal.show();
    }

    onRemoveClick($event: any) {

    }

    private getArtifactsResourceApiData() {
        this.service.getArtifactsData().subscribe(
            data => this.handleArtifactsDefinitionsData(data),
            error => this.handleError(error)
        );
    }

    private getAllArtifacts(types: string) {
        this.service.getAllArtifacts(types).subscribe(
            data => this.handleArtifactsData(data),
            error => this.handleError(error)
        );
    }

    private handleError(error: any) {
    }

    private handleArtifactsData(data: NameAndQNameApiData[]) {
        this.artifactTypes.classes = data;
    }

    private handleArtifactsDefinitionsData(data: TArtifact[]) {
        for (const entry of data) {
            const name = entry.id;
            const type = entry.type;
            const file = entry.file;
            const targetLocation = entry.targetLocation;
            this.artifactsTableDataList.push(new ArtifactsTableData(name, type, file, targetLocation));
        }
    }

    onSelectedArtifactTypeChanged(value: string) {
        this.artifactToBeAdded.type = value;
    }

    yamlArtifactFileSelected(files: any) {
        if (files.length > 0) {
            this.selectedYamlArtifactFile = files[0];
        } else {
            this.selectedYamlArtifactFile = undefined;
        }
    }

    downloadYamlArtifactFile() {

    }

    addArtifact() {
        this.addModal.hide();
        this.addNewArtifact(this.artifactToBeAdded);
    }

    private addNewArtifact(artifactToBeAdded: TArtifact) {
        this.loading = true;
        this.service.sendPostRequest(artifactToBeAdded).subscribe(
            data => this.handlePostResponse(),
            error => this.handleError(error)
        );
    }

    private handlePostResponse() {
        this.loading = false;
        this.getArtifactsResourceApiData();
    }
}
