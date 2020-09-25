import { TextDocument } from 'vscode-languageserver';
import { Definition } from 'vscode-languageserver-types';
import { LanguageModes } from '../embeddedSupport/languageModes';
/**
 * State associated with a specific Vue file
 * The state is shared between different modes
 */
export interface VueFileInfo {
    /**
     * The defualt export component info from script section
     */
    componentInfo: ComponentInfo;
}
export interface ComponentInfo {
    name?: string;
    definition?: Definition;
    childComponents?: ChildComponent[];
    /**
     * Todo: Extract type info in cases like
     * props: {
     *   foo: String
     * }
     */
    props?: PropInfo[];
    data?: DataInfo[];
    computed?: ComputedInfo[];
    methods?: MethodInfo[];
}
export interface ChildComponent {
    name: string;
    documentation?: string;
    definition?: {
        path: string;
        start: number;
        end: number;
    };
    info?: VueFileInfo;
}
export interface PropInfo {
    name: string;
    /**
     * `true` if
     * props: {
     *   foo: { ... }
     * }
     *
     * `false` if
     * - `props: ['foo']`
     * - `props: { foo: String }`
     *
     */
    hasObjectValidator: boolean;
    required: boolean;
    isBoundToModel: boolean;
    documentation?: string;
    typeString?: string;
}
export interface DataInfo {
    name: string;
    documentation?: string;
}
export interface ComputedInfo {
    name: string;
    documentation?: string;
}
export interface MethodInfo {
    name: string;
    documentation?: string;
}
export declare class VueInfoService {
    private languageModes;
    private vueFileInfo;
    constructor();
    init(languageModes: LanguageModes): void;
    updateInfo(doc: TextDocument, info: VueFileInfo): void;
    getInfo(doc: TextDocument): VueFileInfo | undefined;
}
