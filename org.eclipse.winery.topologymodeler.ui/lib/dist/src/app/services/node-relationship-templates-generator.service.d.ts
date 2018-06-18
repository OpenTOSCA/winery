import { TNodeTemplate, TRelationshipTemplate, Visuals } from '../models/ttopology-template';
export declare class NodeRelationshipTemplatesGeneratorService {
    constructor();
    generateNodeAndRelationshipTemplates(nodeTemplateArray: Array<TNodeTemplate>, relationshipTemplateArray: Array<TRelationshipTemplate>, nodeVisuals: Visuals[], allRelationshipTemplates: Array<TRelationshipTemplate>): Array<any>;
}
