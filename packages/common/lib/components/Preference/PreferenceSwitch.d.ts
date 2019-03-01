import * as React from 'react';
export declare type Props = {
    value: boolean;
    setValue: (val: boolean) => void;
};
export default class PreferenceSwitch extends React.Component<Props> {
    handleClick: () => void;
    render(): JSX.Element;
}
