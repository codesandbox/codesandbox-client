import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import { sandboxUrl } from '../../../../../utils/url-generator';

const Item = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: .875rem;
`;

type Props = {
  id: string,
  title: string,
  description: string,
  forkedSandbox: ?{ title: string, id: string },
  updateSandboxInfo: (id: string, title: string, description: string) => void,
};

export default class Project extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      description: props.description,
    };
  }

  setValue = (field: string) => (e: Event) => {
    this.setState({ [field]: e.target.value });
  };

  updateSandboxInfo = () => {
    const { id, title: oldTitle, description: oldDescription } = this.props;
    const { title, description } = this.state;

    if (title !== oldTitle || description !== oldDescription) {
      this.props.updateSandboxInfo(id, title, description);
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter or escape
      this.updateSandboxInfo();
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
  };

  render() {
    const { forkedSandbox } = this.props;
    const { title, description } = this.state;
    return (
      <div>
        <WorkspaceSubtitle>Title</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <input
            value={title || ''}
            onChange={this.setValue('title')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
          />
        </WorkspaceInputContainer>
        <WorkspaceSubtitle>Description</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <textarea
            value={description || ''}
            onChange={this.setValue('description')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
            rows="5"
          />
        </WorkspaceInputContainer>
        {forkedSandbox &&
          <div>
            <WorkspaceSubtitle>Forked from</WorkspaceSubtitle>

            <Item>
              <Link to={sandboxUrl(forkedSandbox)}>
                {forkedSandbox.title || forkedSandbox.id}
              </Link>
            </Item>
          </div>}
      </div>
    );
  }
}
