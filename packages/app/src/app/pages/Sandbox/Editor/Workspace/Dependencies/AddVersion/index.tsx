import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

const AddVersion: React.SFC<WithCerebral> = ({ signals, children }) => {
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

export default connect()(AddVersion);
