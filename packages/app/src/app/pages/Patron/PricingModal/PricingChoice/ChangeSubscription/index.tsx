import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import * as moment from 'moment';

import { SmallText, Buttons, StyledButton } from './elements';

type Props = WithCerebral & {
    date: string;
    cancelSubscription: () => void;
    updateSubscription: () => void;
};

const ChangeSubscription: React.SFC<Props> = ({ date, store, signals, cancelSubscription, updateSubscription }) => {
    const isLoading = store.patron.isUpdatingSubscription;
    const error = store.patron.error;

    if (error) {
        return (
            <div>
                There was a problem updating this subscription.
                <SmallText>{error}</SmallText>
                <Buttons>
                    <StyledButton onClick={() => signals.patron.tryAgainClicked()}>Try again</StyledButton>
                </Buttons>
            </div>
        );
    }

    let buttons = (
        <Buttons>
            <StyledButton onClick={() => cancelSubscription()} red>
                Cancel
            </StyledButton>
            <StyledButton onClick={() => updateSubscription()}>Update</StyledButton>
        </Buttons>
    );

    if (isLoading) {
        buttons = (
            <Buttons>
                <StyledButton disabled>Processing...</StyledButton>
            </Buttons>
        );
    }

    return (
        <div>
            {buttons}
            <SmallText>
                You will be billed every <strong>{moment(date).format('Do')}</strong> of the month, you can change or
                cancel your subscription at any time.
            </SmallText>
        </div>
    );
};

export default connect<Props>()(ChangeSubscription);
