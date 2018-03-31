import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

type Props = WithCerebral;

const AddVersion: React.SFC<Props> = ({ signals, children }) => {
    return (
        <div style={{ position: 'relative' }}>
            <ButtonContainer>
                <Button
                    block
                    small
                    onClick={() =>
                        signals.modalOpened({
                            modal: 'searchDependencies'
                        })}
                >
                    {children}
                </Button>
            </ButtonContainer>
        </div>
    );
};

export default connect<Props>()(AddVersion);
