import * as React from 'react';
export declare type Props = {
    setValue: (value: string) => void;
    value: string;
    placeholder?: string;
    isTextArea?: boolean;
};
export default class PreferenceText extends React.PureComponent<Props> {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    render(): React.DOMElement<{
        setValue: (value: string) => void;
        children?: React.ReactNode;
        style: {
            width: string;
        };
        value: string;
        placeholder: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }, Element>;
}
