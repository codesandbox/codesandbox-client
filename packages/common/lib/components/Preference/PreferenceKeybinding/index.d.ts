import * as React from 'react';
export declare type Props = {
    setValue: (value: Array<string[]>) => void;
    value: Array<string[]>;
};
export default class PreferenceKeybinding extends React.PureComponent<Props> {
    setValue: (index: any) => (value: any) => void;
    render(): JSX.Element;
}
