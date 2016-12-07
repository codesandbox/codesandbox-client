import React from 'react';
import styled from 'styled-components';
import EditIcon from 'react-icons/lib/go/pencil';
import slugify from 'slug';

const Container = styled.div`
  position: relative;
  padding: 1rem;
  margin: 0 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  border-bottom: 1px solid ${props => props.theme.background.lighten(0.5)};
`;

const Title = styled.h2`
  display: inline-block;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 300;
`;

const InputContainer = styled.div`
  display: inline-block;
  width: 100%;
  input {
    background-color: ${props => props.theme.background};
    font-size: 1.2rem;
    width: 100%;
    font-weight: 300;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    color: white;
  }
`;

const EditIconContainer = styled(EditIcon)`
  transition: 0.3s ease all;
  float: right;
  padding-top: 0.1rem;
  color: ${props => props.theme.background.lighten(1.5)()};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

type Props = {
  title: ?string;
  renameSandbox: (title: string) => void;
};

type State = {
  editing: boolean;
  newTitle: string;
};

export default class SandboxTitle extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      editing: false,
      newTitle: '',
    };
  }

  handleChange = (e) => {
    this.setState({ newTitle: e.target.value });
  }

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      // Enter or escape
      this.handleRename();
    }
  };

  handleRename = () => {
    const { newTitle } = this.state;

    this.props.renameSandbox(newTitle);

    this.setState({
      editing: false,
    });
  }

  select = el => el && el.select();

  state: State;
  props: Props;

  render() {
    const { title } = this.props;
    const { editing, newTitle } = this.state;
    if (!title) return null;

    return (
      <Container>
        {editing ?
          <div>
            <InputContainer>
              <input
                onKeyUp={this.handleKeyUp}
                ref={this.select}
                onChange={this.handleChange}
                onBlur={this.handleChange}
                value={newTitle}
              />
            </InputContainer>
          </div>
        :
          <div>
            <Title>{title}</Title>
            <EditIconContainer onClick={() => this.setState({ editing: true, newTitle: title })} />
          </div>
        }
      </Container>
    );
  }
}
