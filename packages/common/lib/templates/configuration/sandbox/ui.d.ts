import * as React from 'react';
import { Sandbox } from '../../../types';
declare type Props = {
    file: string;
    updateFile: (code: string) => void;
    sandbox: Sandbox;
};
export declare class ConfigWizard extends React.Component<Props> {
    bindValue: (file: Object, property: string) => {
        value: any;
        setValue: (p: any) => void;
    };
    render(): JSX.Element;
}
declare const _default: {
    ConfigWizard: typeof ConfigWizard;
};
export default _default;
