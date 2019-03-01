import * as React from 'react';
export declare type Props = {
    title: string;
    style?: React.CSSProperties;
    className?: string;
    tooltip?: string;
} & (BooleanPreference | StringPreference | DropdownPreference | KeybindingPreference | NumberPreference);
declare type SetValueT<T> = (value: T) => void;
export declare type BooleanPreference = {
    type: 'boolean';
    value: boolean;
    defaultValue?: boolean;
    setValue: SetValueT<boolean>;
};
export declare type StringPreference = {
    type: 'string';
    value: string;
    defaultValue?: string;
    setValue: SetValueT<string>;
};
export declare type DropdownPreference = {
    type: 'dropdown';
    options: string[];
    value: string;
    defaultValue?: string;
    setValue: SetValueT<string>;
    mapName?: (prev: string) => string;
};
export declare type KeybindingPreference = {
    type: 'keybinding';
    value: Array<string[]>;
    defaultValue?: Array<string[]>;
    setValue: SetValueT<Array<string[]>>;
};
export declare type NumberPreference = {
    type: 'number';
    value: number;
    defaultValue?: number;
    setValue: SetValueT<number>;
};
export default class Preference extends React.Component<Props> {
    getOptionComponent: () => JSX.Element;
    render(): JSX.Element;
}
export {};
