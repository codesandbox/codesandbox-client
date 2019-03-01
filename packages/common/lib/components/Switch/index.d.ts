import * as React from 'react';
export declare type Props = {
    right: boolean;
    onClick: () => void;
    secondary: boolean;
    offMode: boolean;
    small: boolean;
    className?: string;
    style?: React.CSSProperties;
};
declare function Switch({ right, onClick, secondary, offMode, small, className, style, }: Props): JSX.Element;
export default Switch;
