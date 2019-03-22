export interface CSSRecord {
    name: string;
    desc?: string;
    browsers?: string;
    restriction?: string;
    values?: CSSRecord[];
}
export interface CSSData {
    css: {
        atdirectives: CSSRecord[];
        pseudoclasses: CSSRecord[];
        pseudoelements: CSSRecord[];
        properties: CSSRecord[];
    };
}
export declare const data: CSSData;
