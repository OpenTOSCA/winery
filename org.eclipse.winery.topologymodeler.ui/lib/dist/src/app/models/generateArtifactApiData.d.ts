/**
 * Copyright (c) 2017-2018 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Lukas Harzenetter - initial API and implementation
 *     Oliver Kopp - fix IA generation
 */
export declare class GenerateArtifactApiData {
    artifactName: string;
    artifactTemplate: string;
    artifactTemplateName: string;
    artifactTemplateNamespace: string;
    autoCreateArtifactTemplate: string;
    autoGenerateIA: string;
    artifactType: string;
    artifactSpecificContent: string;
    interfaceName: string;
    operationName: string;
    javaPackage: string;
}
export declare class QNameWithTypeApiData {
    localname: string;
    namespace: string;
    type: string;
}
