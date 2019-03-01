import * as React from 'react';
declare type Props = {
    file: string;
    updateFile: (code: string) => void;
};
export declare class ConfigWizard extends React.Component<Props> {
    bindValue: (file: Object, property: string) => {
        value: any;
        setValue: (value: any) => void;
    };
    render(): JSX.Element;
}
declare const _default: {
    ConfigWizard: typeof ConfigWizard;
};
export default _default;
