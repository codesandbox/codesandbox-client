import * as React from 'react';
import { LinkButton, AButton, Button } from './elements';

export type Props = {
    disabled?: boolean;
    red?: boolean;
    primary?: boolean;
    secondary?: boolean;
    small?: boolean;
    style?: React.CSSProperties;
    to?: string;
    href?: string;
    block?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    type?: string;
    target?: string;
};

const ButtonComponent: React.SFC<Props> = ({ small = false, style = {}, ...props }) => {
    const newStyle = {
        ...style,
        ...small
            ? {
                  padding: '0.5em 0.75em',
                  fontSize: '0.875em'
              }
            : {
                  padding: '0.65em 2.25em'
              }
    };

    // Link
    if (props.to) {
        return <LinkButton style={newStyle} {...props} />;
    }

    if (props.href) {
        return <AButton style={newStyle} {...props} />;
    }

    return <Button style={newStyle} {...props} />;
};

export default ButtonComponent;
