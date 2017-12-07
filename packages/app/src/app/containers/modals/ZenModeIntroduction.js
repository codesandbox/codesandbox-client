import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import modalActionCreators from 'app/store/modal/actions';
import Button from 'app/components/buttons/Button';
import Row from 'common/components/flex/Row';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Heading = styled.h2`
  margin-top: 0;
`;

const Explanation = styled.p`
  line-height: 1.3;
  margin-bottom: 2rem;
`;

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
const ZenModeIntroduction = ({
  modalActions,
}: {
  modalActions: typeof modalActionCreators,
}) => (
  <Container>
    <Heading>Zen Mode Explained</Heading>
    <Explanation>
      Zen Mode is perfect for giving instruction videos and presentations. You
      can toggle the sidebar by double tapping <tt>shift</tt>. You can leave Zen
      Mode by hovering over the file name above the editor and clicking the icon
      on the right.
    </Explanation>

    <Row justifyContent="space-around">
      <Button
        style={{ marginRight: '.5rem' }}
        onClick={modalActions.closeModal}
      >
        Close
      </Button>
    </Row>
  </Container>
);

export default connect(null, mapDispatchToProps)(ZenModeIntroduction);
