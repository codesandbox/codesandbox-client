export interface VLSFormatConfig {
    defaultFormatter: {
        [lang: string]: string;
    };
    defaultFormatterOptions: {
        'prettier': any;
        [lang: string]: any;
    };
    scriptInitialIndent: boolean;
    styleInitialIndent: boolean;
    options: {
        tabSize: number;
        useTabs: boolean;
    };
}
