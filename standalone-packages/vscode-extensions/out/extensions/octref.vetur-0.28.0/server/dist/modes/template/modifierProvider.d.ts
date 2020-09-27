import { MarkupContent } from 'vscode-languageserver-types';
export interface Modifier {
    label: string;
    documentation?: string | MarkupContent;
}
export declare function getModifierProvider(): {
    eventModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
    keyModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
    mouseModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
    systemModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
    propsModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
    vModelModifiers: {
        items: {
            label: string;
            documentation: string | MarkupContent | undefined;
        }[];
        priority: number;
    };
};
