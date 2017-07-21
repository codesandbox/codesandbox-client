import React from 'react';
import styled from 'styled-components';
import Margin from 'app/components/spacing/Margin';
import Button from 'app/components/buttons/Button';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

import Tag from './Tag';

const TagContainer = styled.div`
  margin: .75rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

type Props = {
  sandboxId: string,
  tags: Array<string>,
  isOwner: boolean,
  addTag: (tag: string) => void,
};

export default class Tags extends React.PureComponent {
  props: Props;
  state = {
    tagName: '',
  };

  onChange = e => {
    this.setState({ tagName: e.target.value });
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.addTag();
    }
  };

  addTag = async () => {
    const { tagName } = this.state;
    try {
      this.setState({ tagName: '' });
      await this.props.addTag(this.props.sandboxId, tagName);
    } catch (e) {
      console.error(e);
    }
  };

  removeTag = async (tagName: string) => {
    await this.props.removeTag(this.props.sandboxId, tagName);
  };

  render() {
    const { tags, isOwner } = this.props;
    return (
      <div>
        {tags.length > 0 &&
          <div>
            <WorkspaceSubtitle>Tags</WorkspaceSubtitle>
            <TagContainer>
              {tags.sort().map(tag =>
                <Margin key={tag} vertical={0.5} horizontal={0.25}>
                  <Tag removeTag={isOwner && this.removeTag} tag={tag} />
                </Margin>,
              )}
            </TagContainer>
          </div>}

        {isOwner &&
          <div>
            <WorkspaceSubtitle>Add up to 5 tags</WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <input
                onChange={this.onChange}
                value={this.state.tagName}
                onKeyUp={this.handleKeyUp}
                placeholder="Add a tag"
              />
            </WorkspaceInputContainer>
            <Margin horizontal={1} vertical={0.5}>
              <Button onClick={this.addTag} block small>
                Add Tag
              </Button>
            </Margin>
          </div>}
      </div>
    );
  }
}
