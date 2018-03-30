import * as React from 'react';
import * as moment from 'moment';
import { Sandbox } from 'app/store/modules/profile/types';

import { Date, Button } from './elements';

export type Props = {
    sandbox: Sandbox;
    active: boolean;
    setShowcasedSandbox: (id: string) => void;
};

export default class SandboxComponent extends React.PureComponent<Props> {
    setShowcase = () => {
        this.props.setShowcasedSandbox(this.props.sandbox.id);
    };

    render() {
        const { sandbox, active } = this.props;
        return (
            <Button active={active} onClick={this.setShowcase}>
                <div>
                    {sandbox.title || sandbox.id}
                    {active && ' (Selected)'}
                </div>
                <Date>{moment(sandbox.insertedAt).format('ll')}</Date>
            </Button>
        );
    }
}
