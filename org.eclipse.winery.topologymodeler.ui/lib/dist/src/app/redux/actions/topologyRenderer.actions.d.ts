import { Action } from 'redux';
/**
 * Actions of the topologyRenderer
 */
export declare class TopologyRendererActions {
    static TOGGLE_POLICIES: string;
    static TOGGLE_TARGET_LOCATIONS: string;
    static TOGGLE_PROPERTIES: string;
    static TOGGLE_REQUIREMENTS_CAPABILITIES: string;
    static TOGGLE_DEPLOYMENT_ARTIFACTS: string;
    static TOGGLE_IDS: string;
    static TOGGLE_TYPES: string;
    static EXECUTE_LAYOUT: string;
    static EXECUTE_ALIGN_H: string;
    static EXECUTE_ALIGN_V: string;
    static IMPORT_TOPOLOGY: string;
    static SPLIT_TOPOLOGY: string;
    static MATCH_TOPOLOGY: string;
    togglePolicies(): Action;
    toggleTargetLocations(): Action;
    toggleProperties(): Action;
    toggleRequirementsCapabilities(): Action;
    toggleDeploymentArtifacts(): Action;
    toggleIds(): Action;
    toggleTypes(): Action;
    executeLayout(): Action;
    executeAlignH(): Action;
    executeAlignV(): Action;
    importTopology(): Action;
    splitTopology(): Action;
    matchTopology(): Action;
}
