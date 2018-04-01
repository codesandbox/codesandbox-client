import * as React from 'react';

const pad = (t) => {
    if (`${t}`.length === 1) {
        return `0${t}`;
    }

    return `${t}`;
};

type Props = {
    time: number;
};

export default class Countdown extends React.PureComponent<Props> {
    timer: NodeJS.Timer;
    componentDidMount() {
        this.timer = setTimeout(this.tick, 1000);
    }

    tick = () => {
        this.forceUpdate();

        this.timer = setTimeout(this.tick, 1000);
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    getTimes = () => {
        const delta = Date.now() - this.props.time;

        const hours = Math.floor(delta / 1000 / 60 / 60);
        const minutes = Math.floor((delta - hours * 1000 * 60 * 60) / 1000 / 60);
        const seconds = Math.floor((delta - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000);

        return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
    };

    render() {
        const { hours, minutes, seconds } = this.getTimes();

        return (
            <div>
                {Number(hours) > 0 && `${hours}:`}
                {minutes}:{seconds}
            </div>
        );
    }
}
