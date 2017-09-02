import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import userActionCreators from 'app/store/user/actions';
import modalActionCreators from 'app/store/modal/actions';
import Button from '../../components/buttons/Button';
import Row from '../../components/flex/Row';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Heading = styled.h2`margin-top: 0;`;

const Explanation = styled.p`
  line-height: 1.3;
  margin-bottom: 2rem;
`;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
const SignOutNotice = ({
  userActions,
  modalActions,
}: {
  userActions: typeof userActionCreators,
  modalActions: typeof modalActionCreators,
}) => (
  <Container>
    <Heading>You have been signed out</Heading>
    <Explanation>
      CodeSandbox has migrated to a system where authorization tokens can be
      managed and revoked, and we had to sign everyone out for this.
      <br />
      <br />But don{"'"}t worry, you can sign in right again!
    </Explanation>

    <Row justifyContent="space-around">
      <Button
        block
        style={{ marginRight: '.5rem' }}
        red
        onClick={modalActions.closeModal}
      >
        Close
      </Button>
      <Button
        block
        style={{ marginLeft: '.5rem' }}
        onClick={() => userActions.signIn().then(modalActions.closeModal)}
      >
        Sign in
      </Button>
    </Row>
  </Container>
);

export default connect(null, mapDispatchToProps)(SignOutNotice);
