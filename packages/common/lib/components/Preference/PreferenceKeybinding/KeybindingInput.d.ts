import * as React from 'react';
export declare type Props = {
    placeholder: string;
    value: string[];
    setValue: (val: string[]) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
};
export declare type State = {
    recordedKeys: string[];
    recording: boolean;
};
export default class KeybindingInput extends React.Component<Props, State> {
    state: State;
    handleChange: (e: any) => void;
    keypresses: number;
    handleKeyDown: (e: any) => void;
    handleKeyUp: (e: any) => void;
    handleKeyPress: (e: any) => void;
    handleFocus: () => void;
    handleBlur: () => void;
    render(): JSX.Element;
}
