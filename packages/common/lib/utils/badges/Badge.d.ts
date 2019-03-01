import * as React from 'react';
declare type Props = {
    badge: {
        id: string;
        name: string;
        visible: boolean;
    };
    size: number;
    onClick?: Function;
    tooltip?: string | false;
    visible?: boolean;
};
export default class Badge extends React.Component<Props> {
    handleClick: () => void;
    render(): JSX.Element;
}
export {};
