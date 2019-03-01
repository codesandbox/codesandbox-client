import * as React from 'react';
export declare type Props = {
    setValue: (value: string) => void;
    value: string;
    options: string[];
    mapName?: (param: string) => string;
};
export default class PreferenceInput extends React.PureComponent<Props> {
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    render(): JSX.Element;
}
