/*******************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
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

import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { AdaptationAction, LiveModelingStates, NodeTemplateInstanceStates, ServiceTemplateInstanceStates } from '../models/enums';
import { BackendService } from './backend.service';
import { CsarUpload } from '../models/container/csar-upload.model';
import { ContainerService } from './container.service';
import { ErrorHandlerService } from './error-handler.service';
import { TRelationshipTemplate, TTopologyTemplate } from '../models/ttopology-template';
import { LiveModelingActions } from '../redux/actions/live-modeling.actions';
import { WineryActions } from '../redux/actions/winery.actions';
import { BsModalService } from 'ngx-bootstrap';
import { OverlayService } from './overlay.service';
import { LoggingService } from './logging.service';
import { catchError, concatMap, distinctUntilChanged, first, switchMap, takeWhile, tap, timeout } from 'rxjs/operators';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { Csar } from '../models/container/csar.model';
import { PlanInstance } from '../models/container/plan-instance.model';
import { InputParameter } from '../models/container/input-parameter.model';
import { InputParametersModalComponent } from '../live-modeling/modals/input-parameters-modal/input-parameters-modal.component';
import { ToastrService } from 'ngx-toastr';
import { NodeTemplateInstance } from '../models/container/node-template-instance.model';
import {
    AdaptInstanceError, CreateLiveModelingTemplateError, DeployInstanceError, LiveModelingError, NodeTemplateInstanceError, RetrieveInputParametersError,
    ServiceTemplateInstanceError, TerminateInstanceError, TimeoutError, TransformInstanceError, UploadCsarError
} from '../models/customErrors';
import { AdaptationPayload } from '../models/container/adaptation-payload.model';
import * as _ from 'lodash';
import { LiveModelingSettings } from '../models/liveModelingSettings';

@Injectable()
export class LiveModelingService {
    private currentCsarId: string;
    private currentServiceTemplateInstanceId: string;
    private currentTopologyTemplate: TTopologyTemplate;
    private lastSavedTopologyTemplate: TTopologyTemplate;
    private deployedTopologyTemplate: TTopologyTemplate;

    private settings: LiveModelingSettings;
    private state: LiveModelingStates;

    constructor(
        private ngRedux: NgRedux<IWineryState>,
        private liveModelingActions: LiveModelingActions,
        private wineryActions: WineryActions,
        private containerService: ContainerService,
        private backendService: BackendService,
        private errorHandler: ErrorHandlerService,
        private modalService: BsModalService,
        private overlayService: OverlayService,
        private loggingService: LoggingService,
        private toastrService: ToastrService) {

        this.ngRedux.select(state => state.liveModelingState.currentCsarId)
            .subscribe(csarId => this.currentCsarId = csarId);
        this.ngRedux.select(state => state.liveModelingState.currentServiceTemplateInstanceId)
            .subscribe(serviceTemplateInstanceId => this.currentServiceTemplateInstanceId = serviceTemplateInstanceId);
        this.ngRedux.select(state => state.wineryState.currentJsonTopology)
            .subscribe(topologyTemplate => this.currentTopologyTemplate = topologyTemplate);
        this.ngRedux.select(state => state.wineryState.lastSavedJsonTopology)
            .subscribe(topologyTemplate => this.lastSavedTopologyTemplate = topologyTemplate);
        this.ngRedux.select(state => state.liveModelingState.deployedJsonTopology)
            .subscribe(topologyTemplate => this.deployedTopologyTemplate = topologyTemplate);
        this.ngRedux.select(state => state.liveModelingState.state)
            .subscribe(state => this.state = state);
        this.ngRedux.select(state => state.liveModelingState.settings)
            .subscribe(settings => this.settings = settings);
    }

    public async init(startInstance: boolean, containerUrl?: string): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.DISABLED &&
                this.state !== LiveModelingStates.TERMINATED &&
                this.state !== LiveModelingStates.ERROR &&
                this.state !== LiveModelingStates.RECONFIGURATE
            ) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.INIT));
            this.clearData();
            if (containerUrl) {
                this.ngRedux.dispatch(this.liveModelingActions.setContainerUrl(containerUrl));
            }
            this.setAllNodeTemplateWorkingState(true);
            const csarId = await this.createLiveModelingServiceTemplate();
            await this.installCsarIfNeeded(csarId);
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentCsarId(csarId));
            this.setAllNodeTemplateWorkingState(false);
            await this.deploy(startInstance);
        } catch (error) {
            this.handleError(error);
        }
    }

    public async deploy(startInstance: boolean): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.INIT &&
                this.state !== LiveModelingStates.TERMINATED &&
                this.state !== LiveModelingStates.ERROR
            ) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.DEPLOY));
            const csarId = this.currentCsarId;
            this.setAllNodeTemplateWorkingState(true);
            this.setAllNodeTemplateInstanceState(NodeTemplateInstanceStates.NOT_AVAILABLE);
            let newInstanceId;
            if (startInstance) {
                const buildPlanInputParameters = await this.retrieveBuildPlanParametersAndShowModalIfNeeded(csarId);
                newInstanceId = await this.deployServiceTemplateInstance(csarId, buildPlanInputParameters);
            } else {
                newInstanceId = await this.initializeServiceTemplateInstance(csarId);
            }
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceId(newInstanceId));
            await this.setDeployedTopologyTemplate(csarId);
            this.setAllNodeTemplateWorkingState(false);
            await this.update();
        } catch (error) {
            this.handleError(error);
        }
    }

    public async update(): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.DEPLOY &&
                this.state !== LiveModelingStates.ENABLED &&
                this.state !== LiveModelingStates.RECONFIGURATE
            ) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.UPDATE));
            this.setAllNodeTemplateWorkingState(true);
            await this.updateLiveModelingData(this.currentCsarId, this.currentServiceTemplateInstanceId);
            this.setAllNodeTemplateWorkingState(false);
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.ENABLED));
        } catch (error) {
            this.handleError(error);
        }
    }

    public async redeploy(startInstance: boolean): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.ENABLED &&
                this.state !== LiveModelingStates.ERROR &&
                this.state !== LiveModelingStates.TERMINATED
            ) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.RECONFIGURATE));
            const oldCsarId = this.currentCsarId;
            const oldInstanceId = this.currentServiceTemplateInstanceId;
            this.setAllNodeTemplateWorkingState(true);
            if (oldInstanceId) {
                this.terminateServiceTemplateInstanceInBackground(oldCsarId, oldInstanceId).add(() => {
                    this.deleteApplicationInBackground(oldCsarId);
                });
            }
            this.setAllNodeTemplateWorkingState(false);
            await this.init(startInstance);
        } catch (error) {
            this.handleError(error);
        }
    }

    public async transform(): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.ENABLED) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.RECONFIGURATE));
            this.setAllNodeTemplateWorkingState(true);
            const sourceCsarId = this.currentCsarId;
            const oldInstanceId = this.currentServiceTemplateInstanceId;
            const targetCsarId = await this.createLiveModelingServiceTemplate();
            await this.installCsarIfNeeded(targetCsarId);
            const transformationPlanId = await this.containerService.generateTransformationPlan(sourceCsarId, targetCsarId).toPromise();
            const parameterPayload = await this.retrieveTransformPlanParametersAndShowModalIfNeeded(
                sourceCsarId, oldInstanceId, transformationPlanId);
            this.setAllNodeTemplateInstanceState(NodeTemplateInstanceStates.NOT_AVAILABLE);
            const newInstanceId = await this.transformServiceTemplateInstance(
                sourceCsarId, targetCsarId, oldInstanceId, parameterPayload);
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentCsarId(targetCsarId));
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceId(newInstanceId));
            await this.setDeployedTopologyTemplate(targetCsarId);
            this.setAllNodeTemplateWorkingState(false);
            await this.update();
        } catch (error) {
            this.handleError(error);
        }
    }

    public async adapt(nodeTemplateId: string, adaptationAction: AdaptationAction) {
        try {
            if (this.state !== LiveModelingStates.ENABLED) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.RECONFIGURATE));
            const csarId = this.currentCsarId;
            const serviceTemplateInstanceId = this.currentServiceTemplateInstanceId;
            const topologyTemplate = _.cloneDeep(this.currentTopologyTemplate);
            const adaptationPayload = this.generateAdaptationPayload(topologyTemplate, nodeTemplateId, adaptationAction);
            const workingNodeIds = _.union(adaptationPayload.source_node_templates, adaptationPayload.target_node_templates);

            for (const nodeId of workingNodeIds) {
                this.ngRedux.dispatch(this.wineryActions.setNodeWorking(nodeId, true));
            }

            // MOCK:
            // await this.adaptServiceTemplateInstanceMock(csarId, serviceTemplateInstanceId, topologyTemplate, adaptationPayload);
            await this.adaptServiceTemplateInstance(csarId, serviceTemplateInstanceId, adaptationPayload);

            await this.waitUntilNodeTemplateInstanceIsInState(
                csarId,
                serviceTemplateInstanceId,
                nodeTemplateId,
                adaptationAction === AdaptationAction.START_NODE ? NodeTemplateInstanceStates.STARTED : NodeTemplateInstanceStates.DELETED
            );

            for (const nodeId of workingNodeIds) {
                this.ngRedux.dispatch(this.wineryActions.setNodeWorking(nodeId, false));
            }
            await this.update();
        } catch (error) {
            this.handleError(error);
        }
    }

    public async terminate(): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.ENABLED) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.TERMINATE));
            this.setAllNodeTemplateWorkingState(true);
            await this.terminateServiceTemplateInstance(this.currentCsarId, this.currentServiceTemplateInstanceId);
            this.setAllNodeTemplateWorkingState(false);
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.TERMINATED));
        } catch (error) {
            this.handleError(error);
        }
    }

    public disable(): Promise<void> {
        try {
            if (this.state !== LiveModelingStates.ENABLED &&
                this.state !== LiveModelingStates.TERMINATED &&
                this.state !== LiveModelingStates.ERROR) {
                this.toastrService.error('Unauthorized action');
                return;
            }
            const csarId = this.currentCsarId;
            const instanceId = this.currentServiceTemplateInstanceId;
            if (this.state === LiveModelingStates.ENABLED && instanceId) {
                this.terminateServiceTemplateInstanceInBackground(csarId, instanceId).add(() => {
                    this.deleteApplicationInBackground(csarId);
                });
            } else {
                this.deleteApplicationInBackground(csarId);
            }
            this.deinitializeLiveModelingData();
            this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.DISABLED));
        } catch (error) {
            this.handleError(error);
        }
    }

    // Action methods

    private clearData(): void {
        this.loggingService.clearLogs();
    }

    private async createLiveModelingServiceTemplate(): Promise<string> {
        try {
            this.overlayService.showOverlay('Creating temporary live modeling template');
            const resp = await this.backendService.createLiveModelingServiceTemplate().toPromise();
            const csarId = resp.localname;
            const csarEnding = '.csar';
            const normalizedCsarId = csarId.endsWith(csarEnding) ? csarId : csarId + csarEnding;
            this.overlayService.hideOverlay();
            return normalizedCsarId;
        } catch (error) {
            throw new CreateLiveModelingTemplateError();
        }
    }

    private async installCsarIfNeeded(csarId: string): Promise<void> {
        try {
            const appInstalled = await this.containerService.isApplicationInstalled(csarId).toPromise();
            if (!appInstalled) {
                this.loggingService.logWarning('App not found, installing now...');
                const uploadPayload = new CsarUpload(this.getCsarResourceUrl(csarId), csarId, 'false');
                await this.containerService.installApplication(uploadPayload).toPromise();
            } else {
                this.loggingService.logInfo('App found. Skipping installation');
            }
        } catch (error) {
            throw new UploadCsarError();
        }
    }

    private getCsarResourceUrl(csarId: string): string {
        const csarQueryString = '?csar';
        const csarEnding = '.csar';
        const csarIdWithoutCsarSuffix = csarId.endsWith(csarEnding) ? csarId.slice(0, -csarEnding.length) : csarId;
        return this.backendService.configuration.repositoryURL + '/' +
            this.backendService.configuration.parentPath + '/' +
            encodeURIComponent(encodeURIComponent(this.backendService.configuration.ns)) + '/' +
            csarIdWithoutCsarSuffix + csarQueryString;
    }

    private async retrieveBuildPlanParametersAndShowModalIfNeeded(csarId: string): Promise<InputParameter[]> {
        try {
            const requiredBuildPlanInputParameters = await this.containerService.getRequiredBuildPlanInputParameters(csarId).toPromise();
            let buildPlanInputParameters = [];
            if (requiredBuildPlanInputParameters.length > 0) {
                buildPlanInputParameters = await this.requestInputParameters(requiredBuildPlanInputParameters);
            }
            return buildPlanInputParameters;
        } catch (error) {
            throw new RetrieveInputParametersError();
        }
    }

    private async deployServiceTemplateInstance(csarId: string, buildPlanInputParameters: InputParameter[]): Promise<string> {
        let correlationId;
        try {
            this.setAllNodeTemplateInstanceState(NodeTemplateInstanceStates.INITIAL);

            this.loggingService.logInfo('Deploying service template instance...');

            correlationId = await this.containerService.deployServiceTemplateInstance(csarId, buildPlanInputParameters).toPromise();

            this.loggingService.logInfo('Executing build plan with correlation id ' + correlationId);

            const newInstanceId = await this.waitForServiceTemplateInstanceIdAfterDeployment(csarId, correlationId).toPromise();

            this.loggingService.logInfo('Waiting for deployment of service template instance with id ' + newInstanceId);

            await this.waitUntilServiceTemplateInstanceIsInState(csarId, newInstanceId, ServiceTemplateInstanceStates.CREATED);

            this.loggingService.logSuccess('Successfully deployed service template instance with Id ' + newInstanceId);
            return newInstanceId;
        } catch (error) {
            throw new DeployInstanceError();
        } finally {
            try {
                const buildPlanLogs = await this.containerService.getBuildPlanLogs(csarId, correlationId).toPromise();
                for (const log of buildPlanLogs) {
                    this.loggingService.logContainer(log.message);
                }
            } catch (e) {
            }
        }
    }

    private waitForServiceTemplateInstanceIdAfterDeployment(csarId: string, correlationId: string): Observable<string> {
        return Observable.timer(0, this.settings.interval).pipe(
            concatMap(() => this.containerService.getServiceTemplateInstanceIdAfterDeployment(csarId, correlationId)),
            distinctUntilChanged(),
            first(resp => resp !== ''),
            timeout(this.settings.timeout)
        );
    }

    private async initializeServiceTemplateInstance(csarId: string) {
        const correlationId = Date.now().toString();
        const newInstanceId = await this.containerService.initializeServiceTemplateInstance(csarId, correlationId).toPromise();
        return newInstanceId;
    }

    private waitUntilServiceTemplateInstanceIsInState(
        csarId: string,
        serviceTemplateInstanceId: string,
        desiredInstanceState: ServiceTemplateInstanceStates
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            Observable.timer(0, this.settings.interval).pipe(
                concatMap(() => this.containerService.getServiceTemplateInstanceState(csarId, serviceTemplateInstanceId)),
                distinctUntilChanged(),
                timeout(this.settings.timeout),
                // TODO: fix
                // takeWhile(state => state !== desiredInstanceState && state !== ServiceTemplateInstanceStates.ERROR, true),
            ).subscribe(state => {
                this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceState(state));
                if (state === ServiceTemplateInstanceStates.ERROR) {
                    reject(new ServiceTemplateInstanceError());
                }
            }, () => {
                reject(new TimeoutError());
            }, () => {
                resolve();
            });
        });
    }

    private updateLiveModelingData(csarId: string, serviceTemplateInstanceId: string): Promise<any> {
        return forkJoin([
            this.updateCsar(csarId)
                .pipe(tap(resp => this.ngRedux.dispatch(this.liveModelingActions.setCurrentCsar(resp)))),
            this.updateBuildPlanInstance(csarId, serviceTemplateInstanceId)
                .pipe(tap(resp => this.ngRedux.dispatch(this.liveModelingActions.setCurrentBuildPlanInstance(resp)))),
            this.updateCurrentServiceTemplateInstanceState(csarId, serviceTemplateInstanceId)
                .pipe(tap(resp => this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceState(resp)))),
            this.updateNodeTemplateData(csarId, serviceTemplateInstanceId)
        ]).toPromise();
    }

    private updateCsar(csarId: string): Observable<Csar> {
        this.loggingService.logInfo('Fetching csar information');
        return this.containerService.getCsar(csarId).pipe(
            catchError(error => {
                this.loggingService.logWarning('Unable to fetch csar information');
                return of(null);
            })
        );
    }

    private updateBuildPlanInstance(csarId: string, serviceTemplateInstanceId: string): Observable<PlanInstance> {
        this.loggingService.logInfo(`Fetching service template instance build plan instance`);
        return this.containerService.getServiceTemplateInstanceBuildPlanInstance(csarId, serviceTemplateInstanceId).pipe(
            catchError(error => {
                this.loggingService.logWarning('Unable to fetch build plan instance');
                return of(null);
            })
        );
    }

    private updateNodeTemplateData(csarId: string, serviceTemplateInstanceId: string): Observable<NodeTemplateInstance[]> {
        this.loggingService.logInfo(`Fetching node template data`);
        return this.containerService.getNodeTemplates(csarId).pipe(
            switchMap(nodeTemplates => {
                const observables: Observable<NodeTemplateInstance>[] = [];
                for (const nodeTemplate of nodeTemplates) {
                    observables.push(this.containerService.getNodeTemplateInstance(
                        csarId, serviceTemplateInstanceId, nodeTemplate.id).pipe(
                        tap(resp => {
                            this.ngRedux.dispatch(this.wineryActions.setNodeInstanceState(resp.node_template_id, NodeTemplateInstanceStates[resp.state]));
                        }),
                        catchError(error => {
                            this.loggingService.logWarning(`Unable to fetch data for node ${nodeTemplate.id}`);
                            return of(null);
                        })
                    ));
                }
                return forkJoin(observables);
            }),
            catchError(error => {
                this.loggingService.logWarning('Unable to fetch node templates');
                return of(null);
            })
        );
    }

    private updateCurrentServiceTemplateInstanceState(csarId: string, serviceTemplateInstanceId: string): Observable<ServiceTemplateInstanceStates> {
        this.loggingService.logInfo(`Fetching service template instance state`);
        return this.containerService.getServiceTemplateInstanceState(csarId, serviceTemplateInstanceId).pipe(
            catchError(error => {
                this.loggingService.logWarning('Unable to fetch service template instance state');
                return of(ServiceTemplateInstanceStates.NOT_AVAILABLE);
            })
        );
    }

    private async retrieveTransformPlanParametersAndShowModalIfNeeded(
        csarId: string, serviceTemplateInstanceId: string, transformationPlanId: string): Promise<InputParameter[]> {
        try {
            const inputParameters = await this.containerService.getManagementPlanInputParameters(
                csarId,
                serviceTemplateInstanceId,
                transformationPlanId
            ).toPromise();

            let parameterPayload = [];
            if (inputParameters.length > 0) {
                parameterPayload = await this.requestInputParameters(inputParameters);
            }

            return parameterPayload;
        } catch (error) {
            throw new RetrieveInputParametersError();
        }
    }

    private async transformServiceTemplateInstance(
        sourceCsarId: string, targetCsarId: string, serviceTemplateInstanceId: string, transformationPayload: InputParameter[]): Promise<string> {
        let correlationId;
        try {
            this.setAllNodeTemplateInstanceState(NodeTemplateInstanceStates.INITIAL);
            const prevServiceTemplateInstanceId = serviceTemplateInstanceId;

            this.loggingService.logInfo('Transforming service template instance...');
            correlationId = await this.containerService.executeTransformationPlan(
                serviceTemplateInstanceId, sourceCsarId, targetCsarId, transformationPayload).toPromise();

            this.loggingService.logInfo('Executing transformation plan with correlation id ' + correlationId);

            await this.waitUntilServiceTemplateInstanceIsInState(sourceCsarId, serviceTemplateInstanceId, ServiceTemplateInstanceStates.MIGRATED);

            const newInstanceId = await this.waitForServiceTemplateInstanceIdAfterMigration(
                sourceCsarId, serviceTemplateInstanceId, correlationId, sourceCsarId, targetCsarId).toPromise();
            this.loggingService.logInfo('Waiting for transformation of service template instance with id ' + newInstanceId);

            await this.waitUntilServiceTemplateInstanceIsInState(targetCsarId, newInstanceId, ServiceTemplateInstanceStates.CREATED);

            this.loggingService.logSuccess(`Successfully transformed service template instance from ${prevServiceTemplateInstanceId} to ${newInstanceId}`);
            return newInstanceId;
        } catch (error) {
            throw new TransformInstanceError();
        } finally {
            try {
                const transformationPlanLogs = await this.containerService.getTransformationPlanLogs(
                    sourceCsarId, serviceTemplateInstanceId, correlationId, sourceCsarId, targetCsarId).toPromise();
                for (const log of transformationPlanLogs) {
                    this.loggingService.logContainer(log.message);
                }
            } catch (e) {
            }
        }
    }

    private waitForServiceTemplateInstanceIdAfterMigration(
        csarId: string,
        serviceTemplateInstanceId: string,
        correlationId: string,
        sourceCsarId: string,
        targetCsarId: string
    ): Observable<string> {
        const planId = this.containerService.getTransformationPlanId(sourceCsarId, targetCsarId);
        return Observable.timer(0, this.settings.interval).pipe(
            concatMap(() => this.containerService.getServiceTemplateInstanceIdAfterTransformation(csarId, serviceTemplateInstanceId, correlationId, planId)),
            distinctUntilChanged(),
            first(resp => resp !== ''),
            timeout(this.settings.timeout)
        );
    }

    private async adaptServiceTemplateInstance(
        csarId: string,
        serviceTemplateInstanceId: string,
        adaptationPayload: AdaptationPayload): Promise<string> {
        try {
            const adaptationPlan = await this.containerService.generateAdaptationPlan(csarId, adaptationPayload).toPromise();
            let parameterPayload = [];
            if (adaptationPlan.input_parameters.length > 0) {
                parameterPayload = await this.requestInputParameters(adaptationPlan.input_parameters);
            }
            return await this.containerService.executeManagementPlan(csarId, serviceTemplateInstanceId, adaptationPlan.id, parameterPayload).toPromise();
        } catch (error) {
            throw new AdaptInstanceError();
        }
    }

    private adaptServiceTemplateInstanceMock(
        csarId: string,
        serviceTemplateInstanceId: string,
        topologyTemplate: TTopologyTemplate,
        adaptationPayload: AdaptationPayload) {
        const startingNodes = adaptationPayload.target_node_templates;
        const stoppingNodes = topologyTemplate.nodeTemplates.filter(n => !startingNodes.includes(n.id)).map(n => n.id);

        const observables = [];
        startingNodes.forEach(nodeId => {
            observables.push(
                this.containerService.updateNodeTemplateInstanceState(csarId, serviceTemplateInstanceId, nodeId, NodeTemplateInstanceStates.STARTED));
        });
        stoppingNodes.forEach(nodeId => {
            observables.push(
                this.containerService.updateNodeTemplateInstanceState(csarId, serviceTemplateInstanceId, nodeId, NodeTemplateInstanceStates.DELETED));
        });
        return Observable.forkJoin(observables).toPromise();
    }

    private waitUntilNodeTemplateInstanceIsInState(
        csarId: string,
        serviceTemplateInstanceId: string,
        nodeTemplateId: string,
        desiredInstanceState: NodeTemplateInstanceStates
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            Observable.timer(0, this.settings.interval).pipe(
                concatMap(() => this.containerService.getNodeTemplateInstanceState(csarId, serviceTemplateInstanceId, nodeTemplateId)),
                distinctUntilChanged(),
                timeout(this.settings.timeout),
                // TODO: fix
                // takeWhile(state => state !== desiredInstanceState && state !== NodeTemplateInstanceStates.ERROR, true),
            ).subscribe(state => {
                if (state === NodeTemplateInstanceStates.ERROR) {
                    reject(new NodeTemplateInstanceError());
                }
            }, () => {
                reject(new TimeoutError());
            }, () => {
                resolve();
            });
        });
    }

    public fetchNodeTemplateInstanceData(nodeTemplateId: string): Observable<NodeTemplateInstance> {
        try {
            if (this.state === LiveModelingStates.DISABLED) {
                return of(null);
            }
            return this.containerService.getNodeTemplateInstance(this.currentCsarId, this.currentServiceTemplateInstanceId, nodeTemplateId).pipe(
                tap(resp => this.ngRedux.dispatch(this.wineryActions.setNodeInstanceState(nodeTemplateId, NodeTemplateInstanceStates[resp.state]))),
                catchError(error => {
                    this.loggingService.logWarning('Unable to fetch node template instance');
                    this.ngRedux.dispatch(this.wineryActions.setNodeInstanceState(nodeTemplateId, NodeTemplateInstanceStates.NOT_AVAILABLE));
                    return of(null);
                })
            );
        } catch (error) {
            return of(null);
        }
    }

    private async terminateServiceTemplateInstance(csarId: string, serviceTemplateInstanceId: string): Promise<void> {
        try {

            this.loggingService.logInfo(`Terminating service template instance ${serviceTemplateInstanceId}`);

            await this.containerService.executeTerminationPlan(csarId, serviceTemplateInstanceId).toPromise();

            this.loggingService.logInfo(`Waiting for deletion of service template instance with instance id ${serviceTemplateInstanceId}`);

            await this.waitUntilServiceTemplateInstanceIsInState(csarId, serviceTemplateInstanceId, ServiceTemplateInstanceStates.DELETED);

            this.setAllNodeTemplateInstanceState(NodeTemplateInstanceStates.NOT_AVAILABLE);
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceId(null));
            this.ngRedux.dispatch(this.liveModelingActions.setCurrentBuildPlanInstance(null));

            this.loggingService.logSuccess('Instance has been successfully deleted');
        } catch (error) {
            throw new TerminateInstanceError();
        }
    }

    private terminateServiceTemplateInstanceInBackground(csarId: string, serviceTemplateInstanceId: string): Subscription {
        return this.containerService.executeTerminationPlan(csarId, serviceTemplateInstanceId).subscribe(resp => {
            this.toastrService.info('Instance successfully terminated');
        }, error => {
            this.toastrService.error('There was an error while terminating the service template instance');
        });
    }

    private deleteApplicationInBackground(csarId: string): Subscription {
        return this.containerService.deleteApplication(csarId).subscribe(resp => {
            this.toastrService.info('Application successfully deleted');
        }, error => {
            this.toastrService.error('There was an error while deleting the application');
        });
    }

    private deinitializeLiveModelingData(): void {
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentCsar(null));
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentCsarId(null));
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceId(null));
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceState(null));
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentBuildPlanInstance(null));
        this.setAllNodeTemplateWorkingState(false);
        this.setAllNodeTemplateInstanceState(null);
    }

    // Helper methods

    private handleError(error: Error): void {
        this.updateLiveModelingData(this.currentCsarId, this.currentServiceTemplateInstanceId);

        if (error instanceof LiveModelingError) {
            this.toastrService.error(error.message);
            this.loggingService.logError(error.message);
        } else {
            const errorMessage = 'There was an unexpected error during operation';
            this.toastrService.error(errorMessage);
            this.loggingService.logError(errorMessage);
        }

        this.ngRedux.dispatch(this.liveModelingActions.setState(LiveModelingStates.ERROR));
        this.ngRedux.dispatch(this.liveModelingActions.setCurrentServiceTemplateInstanceState(ServiceTemplateInstanceStates.ERROR));
        this.overlayService.hideOverlay();
        this.setAllNodeTemplateWorkingState(false);
    }

    private setAllNodeTemplateWorkingState(working: boolean): void {
        for (const nodeTemplate of this.lastSavedTopologyTemplate.nodeTemplates) {
            this.ngRedux.dispatch(this.wineryActions.setNodeWorking(nodeTemplate.id, working));
        }
    }

    private setAllNodeTemplateInstanceState(state: NodeTemplateInstanceStates): void {
        for (const nodeTemplate of this.lastSavedTopologyTemplate.nodeTemplates) {
            this.ngRedux.dispatch(this.wineryActions.setNodeInstanceState(nodeTemplate.id, state));
        }
    }

    private async requestInputParameters(inputParameters: InputParameter[]): Promise<InputParameter[]> {
        const initialState = {
            inputParameters: inputParameters
        };
        const modalRef = this.modalService.show(InputParametersModalComponent, { initialState, backdrop: 'static' });
        await new Promise(resolve => {
            this.modalService.onHidden.subscribe(resp => {
                resolve();
            });
        });

        if (modalRef.content.cancelled) {
            return null;
        }

        return modalRef.content.inputParameters;
    }

    private generateAdaptationPayload(topologyTemplate: TTopologyTemplate, nodeTemplateId: string, adaptationAction: AdaptationAction): AdaptationPayload {
        // Calculate source node templates
        const source_node_templates = [];
        for (const nodeTemplate of topologyTemplate.nodeTemplates) {
            if (nodeTemplate.instanceState === NodeTemplateInstanceStates.STARTED) {
                source_node_templates.push(nodeTemplate.id);
            }
        }

        // Calculate source relationship templates
        const source_relationship_templates = [];
        for (const relationshipTemplate of topologyTemplate.relationshipTemplates) {
            if (source_node_templates.findIndex(n => n === relationshipTemplate.sourceElement.ref) > -1 &&
                source_node_templates.findIndex(n => n === relationshipTemplate.targetElement.ref) > -1
            ) {
                source_relationship_templates.push(relationshipTemplate.id);
            }
        }

        // Recursively calculate all node templates that are dependent
        const temp_node_templates = [];
        temp_node_templates.push(nodeTemplateId);
        const dependent_node_templates_set = new Set<string>();
        while (temp_node_templates.length > 0) {
            const nodeId = temp_node_templates.shift();
            dependent_node_templates_set.add(nodeId);
            let tempRelationships: TRelationshipTemplate[];
            if (adaptationAction === AdaptationAction.START_NODE) {
                tempRelationships = topologyTemplate.relationshipTemplates.filter(rel => rel.sourceElement.ref === nodeId);
            } else {
                tempRelationships = topologyTemplate.relationshipTemplates.filter(rel => rel.targetElement.ref === nodeId);
            }
            for (const tempRel of tempRelationships) {
                if (adaptationAction === AdaptationAction.START_NODE) {
                    temp_node_templates.push(tempRel.targetElement.ref);
                } else {
                    temp_node_templates.push(tempRel.sourceElement.ref);
                }
            }
        }

        // Holds all node templates that need to be started/stopped
        let target_node_templates;
        const dependent_node_templates = Array.from(dependent_node_templates_set);
        if (adaptationAction === AdaptationAction.START_NODE) {
            target_node_templates = _.union(source_node_templates, dependent_node_templates);
        } else {
            target_node_templates = source_node_templates.filter(n => !dependent_node_templates.includes(n));
        }

        // Calculate source relationship templates
        const target_relationship_templates = [];
        for (const relationshipTemplate of topologyTemplate.relationshipTemplates) {
            if (target_node_templates.findIndex(n => n === relationshipTemplate.sourceElement.ref) > -1 &&
                target_node_templates.findIndex(n => n === relationshipTemplate.targetElement.ref) > -1
            ) {
                target_relationship_templates.push(relationshipTemplate.id);
            }
        }

        return {
            source_node_templates: source_node_templates,
            source_relationship_templates: source_relationship_templates,
            target_node_templates: target_node_templates,
            target_relationship_templates: target_relationship_templates
        };
    }

    private async setDeployedTopologyTemplate(csarId: string) {
        const topologyTemplate = await this.getTopologyTemplate(csarId).toPromise();
        this.ngRedux.dispatch(this.liveModelingActions.setDeployedJsonTopology(topologyTemplate));
    }

    private getTopologyTemplate(csarId: string): Observable<TTopologyTemplate> {
        const csarEnding = '.csar';
        const csarIdWithoutCsarSuffix = csarId.endsWith(csarEnding) ? csarId.slice(0, -csarEnding.length) : csarId;
        return this.backendService.requestTopologyTemplate(csarIdWithoutCsarSuffix);
    }
}