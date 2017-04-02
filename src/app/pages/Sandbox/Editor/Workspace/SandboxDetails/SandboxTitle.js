import React from 'react';
import styled from 'styled-components';
import EditIcon from 'react-icons/lib/go/pencil';

const Container = styled.div`
  position: relative;
  padding: 0;
  margin: 0;
  color: white;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 400;
  font-size: 1rem;
  margin-right: .5rem;
  text-overflow: ellipsis;
`;

const InputContainer = styled.div`
  display: inline-block;
  width: 100%;
  input {
    background-color: ${props => props.theme.background};
    font-size: 1rem;
    width: 100%;
    font-weight: 400;
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
  padding-left: 0.2rem;
  color: ${props => props.theme.background.lighten(1.5)()};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

type Props = {
  title: ?string,
  renameSandbox: (title: string) => void,
};

type State = {
  editing: boolean,
  newTitle: string,
};

export default class SandboxTitle extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      editing: false,
      newTitle: '',
    };
  }

  handleChange = e => {
    this.setState({ newTitle: e.target.value });
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      // Enter or escape
      this.handleRename();
    }
  };

  handleRename = () => {
    const { title } = this.props;
    const { newTitle } = this.state;
    if (newTitle !== title) {
      this.props.renameSandbox(newTitle);
    }

    this.setState({
      editing: false,
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.title !== this.props.title) {
      this.setState({ newTitle: nextProps.title });
    }
  };

  select = el => el && el.select();

  state: State;
  props: Props;

  render() {
    const { title } = this.props;
    const { editing, newTitle } = this.state;
    if (!title) return null;

    return (
      <Container>
        {editing
          ? <div>
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
          : <Flex>
              <Title>{title}</Title>
              <EditIconContainer
                onClick={() =>
                  this.setState({ editing: true, newTitle: title })}
              />
            </Flex>}
      </Container>
    );
  }
}
