import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

const ZenModeIntroduction: React.SFC<WithCerebral> = ({ signals }) => {
    return (
        <Container>
            <Heading>Zen Mode Explained</Heading>
            <Explanation>
                Zen Mode is perfect for giving instruction videos and presentations. You can toggle the sidebar by
                double tapping <b>shift</b>. You can leave Zen Mode by hovering over the file name above the editor and
                clicking the icon on the right.
            </Explanation>

            <Row justifyContent="space-around">
                <Button
                    style={{ marginRight: '.5rem' }}
                    onClick={() => {
                        signals.modalClosed();
                    }}
                >
                    Close
                </Button>
            </Row>
        </Container>
    );
};

export default connect()(ZenModeIntroduction);
