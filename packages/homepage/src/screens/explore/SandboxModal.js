import React from 'react';
import styled from 'styled-components';
import Preview from 'app/src/app/components/Preview';
import Modal from 'app/src/app/components/Modal';

import { CodeSandboxEmbed } from 'app/www/embed';

import { camelizeKeys } from 'humps';

const Container = styled.div`
  background-color: ${props => props.theme.background2};
  display: flex;
  flex-direction: column;
`;

const SandboxInfo = styled.div`
  padding: 1.5rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
`;

const SandboxTitle = styled.h1`
  font-size: 1.25rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  font-weight: 700;
`;

const SandboxDescription = styled.p`
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  color: ${props => props.theme.new.description};
`;

const StyledPreview = styled(Preview)`
  height: 600px;
`;

export default class SandboxModal extends React.PureComponent {
  state = {
    sandbox: undefined,
  };

  componentDidMount() {
    fetch(`http://localhost:3000/api/v1/sandboxes/${this.props.sandboxId}`)
      .then(x => x.json())
      .then(x => {
        this.setState({ sandbox: camelizeKeys(x.data) });
      });
  }

  render() {
    const { sandbox } = this.state;
    console.log(sandbox);
    console.log(CodeSandboxEmbed.default);
    return (
      <Modal onClose={this.props.onClose} isOpen width={800}>
        <Container>
          {this.state.sandbox ? (
            // <iframe
            //   src={`https://codesandbox.io/embed/${
            //     this.props.sandboxId
            //   }?view=preview`}
            //   style={{
            //     width: '100%',
            //     height: 500,
            //     border: 0,
            //   }}
            // />

            <CodeSandboxEmbed.default sandbox={this.state.sandbox} />
          ) : (
            <div style={{ flex: 1, backgroundColor: 'white' }} />
          )}
          {sandbox && (
            <SandboxInfo>
              <SandboxTitle>{sandbox.title}</SandboxTitle>
              <SandboxDescription>{sandbox.description}</SandboxDescription>
            </SandboxInfo>
          )}
        </Container>
      </Modal>
    );
  }
}
