import * as React from 'react';
export declare type Props = {
    setValue: (value: number) => void;
    value: number;
    step?: number;
    style?: React.CSSProperties;
};
export default class PreferenceInput extends React.PureComponent<Props> {
    handleChange: (e: any) => void;
    render(): JSX.Element;
}
