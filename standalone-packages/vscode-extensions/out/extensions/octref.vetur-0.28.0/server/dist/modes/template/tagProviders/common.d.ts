import { MarkupContent } from 'vscode-languageserver-types';
interface TagCollector {
    (tag: string, documentation: string | MarkupContent): void;
}
export interface Attribute {
    label: string;
    type?: string;
    documentation?: string | MarkupContent;
}
export interface AttributeCollector {
    (attribute: string, type?: string, documentation?: string | MarkupContent): void;
}
interface StandaloneAttribute {
    label: string;
    type?: string;
    documentation?: string | MarkupContent;
}
export declare enum Priority {
    UserCode = 0,
    Library = 1,
    Framework = 2,
    Platform = 3
}
export interface IHTMLTagProvider {
    getId(): string;
    collectTags(collector: TagCollector): void;
    collectAttributes(tag: string, collector: AttributeCollector): void;
    collectValues(tag: string, attribute: string, collector: (value: string) => void): void;
    readonly priority: Priority;
}
export interface ITagSet {
    [tag: string]: HTMLTagSpecification;
}
export declare class HTMLTagSpecification {
    documentation: string | MarkupContent;
    attributes: Attribute[];
    constructor(documentation: string | MarkupContent, attributes?: Attribute[]);
}
export interface IValueSets {
    [tag: string]: string[];
}
export declare function getSameTagInSet<T>(tagSet: Record<string, T>, tag: string): T | undefined;
export declare function collectTagsDefault(collector: TagCollector, tagSet: ITagSet): void;
export declare function collectAttributesDefault(tag: string, collector: AttributeCollector, tagSet: ITagSet, globalAttributes: StandaloneAttribute[]): void;
export declare function collectValuesDefault(tag: string, attribute: string, collector: (value: string) => void, tagSet: ITagSet, globalAttributes: StandaloneAttribute[], valueSets: IValueSets): void;
export declare function genAttribute(label: string, type?: string, documentation?: string | MarkupContent): Attribute;
export {};
