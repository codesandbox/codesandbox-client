import * as React from 'react';
import { Button, LoadingDiv, AnimatedRecordIcon } from './elements';

type Props = {
    isLoading: boolean;
    onClick: () => void;
};

type State = {
    hovering: boolean;
    showIcon: boolean;
};

export default class LiveButton extends React.PureComponent<Props, State> {
    state = {
        hovering: false,
        showIcon: true
    };
    timer?: NodeJS.Timer;

    componentDidUpdate() {
        if (this.state.hovering && !this.timer) {
            this.timer = setInterval(() => {
                this.setState({ showIcon: !this.state.showIcon });
            }, 1000);
        } else if (!this.state.hovering && this.timer) {
            clearInterval(this.timer);
            this.timer = null;

            // eslint-disable-next-line
            this.setState({ showIcon: true });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startHovering = () => {
        this.setState({ hovering: true });
    };

    stopHovering = () => {
        this.setState({ hovering: false });
    };

    render() {
        const { onClick, isLoading } = this.props;

        if (isLoading) {
            return <LoadingDiv>Creating Session</LoadingDiv>;
        }

        return (
            <Button onMouseEnter={this.startHovering} onMouseLeave={this.stopHovering} onClick={onClick}>
                <AnimatedRecordIcon style={{ opacity: this.state.showIcon ? 1 : 0 }} /> Go Live
            </Button>
        );
    }
}
