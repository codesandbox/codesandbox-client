import React from 'react';
import styled from 'styled-components';

import Input from 'common/components/Input';
import Button from 'app/components/Button';

const InputContainer = styled.div`
  display: flex;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-size: 12px;
  margin: 0.5rem 0;
  font-style: italic;
`;

export default class EnvModal extends React.PureComponent {
  state = {
    name: this.props.name || '',
    value: this.props.value || '',
  };

  onNameChange = e => this.setState({ name: e.target.value });
  onValueChange = e => this.setState({ value: e.target.value });

  onCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCancel();
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onSubmit({ name: this.state.name, value: this.state.value });

    this.setState({ name: '', value: '' });
  };

  isValid = () => {
    if (/\s/.test(this.state.name)) {
      return "The name and the value can't contain spaces.";
    }

    return false;
  };

  render() {
    const errorMessage = this.isValid();
    return (
      <form style={{ width: '100%' }} onSubmit={this.onSubmit}>
        <div>
          <InputContainer
            style={{
              flexDirection: 'column',
              marginBottom: '.5rem',
            }}
          >
            <Input
              placeholder="Name"
              style={{
                marginLeft: 0,
                marginRight: 0,
                marginBottom: '.25rem',
                width: '100%',
              }}
              onChange={this.onNameChange}
              value={this.state.name}
            />
            <Input
              placeholder="Value"
              onChange={this.onValueChange}
              css={`
                margin-left: 0px;
                margin-right: 0px;
                width: 100%;
              `}
              value={this.state.value}
            />
          </InputContainer>
        </div>
        <div
          css={`
            display: 'flex';
          `}
        >
          {this.props.onCancel && (
            <Button
              onClick={this.onCancel}
              style={{ flex: 1, marginRight: '.25rem' }}
              red
              small
            >
              Cancel
            </Button>
          )}

          <Button
            style={{ flex: 1, marginLeft: this.props.onCancel ? '.25rem' : 0 }}
            block
            disabled={!this.state.name || !this.state.value || errorMessage}
            small
          >
            Save Secret
          </Button>
        </div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </form>
    );
  }
}
