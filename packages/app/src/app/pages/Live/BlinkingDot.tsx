import * as React from 'react';
import styled from 'app/styled-components';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

const DotContainer = styled.div`
    font-size: 4rem;
    display: block;
    color: rgb(253, 36, 57);

    svg {
        transition: 0.3s ease opacity;
    }
`;

type Props = {};

type State = {
    showing: boolean;
};

export default class BlinkingDot extends React.PureComponent<Props, State> {
    state = {
        showing: true
    };
    timer: NodeJS.Timer;

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({ showing: !this.state.showing });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <DotContainer>
                <RecordIcon style={{ opacity: this.state.showing ? 1 : 0 }} />
            </DotContainer>
        );
    }
}
