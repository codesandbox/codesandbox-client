export declare function normalizeKey(e: KeyboardEvent): any;
export declare function formatKey(key: string): string;
export declare const KEYBINDINGS: {
    'editor.open-quick-actions': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
    };
    workspace: {
        title: string;
        type: string;
        bindings: any[];
        signal: string;
    };
    'editor.close-tab': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
        payload: (state: any) => {
            tabIndex: any;
        };
    };
    'editor.zen-mode': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
        payload: (state: any) => {
            name: string;
            value: boolean;
        };
    };
    'editor.toggle-console': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
    };
    'editor.open-preferences': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
        payload: {
            modal: string;
        };
    };
    'source.dependencies.open': {
        title: string;
        type: string;
        bindings: any[];
        signal: string;
        payload: {
            modal: string;
        };
    };
    'source.modules.prettify': {
        title: string;
        type: string;
        bindings: any[];
        signal: string;
        payload: (state: any) => {
            moduleShortid: any;
        };
    };
    'source.modules.save': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
        payload: (state: any) => {
            moduleShortid: any;
        };
    };
    'source.modules.save-all': {
        title: string;
        type: string;
        bindings: string[][];
        signal: string;
    };
};
