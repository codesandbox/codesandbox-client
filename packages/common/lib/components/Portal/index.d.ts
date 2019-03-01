import * as React from 'react';
export interface Props {
    node: HTMLDivElement;
}
export default class Portal extends React.Component<Props> {
    defaultNode: HTMLDivElement;
    componentWillUnmount(): void;
    render(): any;
}
