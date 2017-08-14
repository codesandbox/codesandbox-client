import React from 'react';
import Margin from 'app/components/spacing/Margin';
import Button from 'app/components/buttons/Button';
import Tags from 'app/components/sandbox/Tags';
import { translate } from 'react-i18next';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  sandboxId: string,
  tags: Array<string>,
  isOwner: boolean,
  addTag: (tag: string) => void,
  t: Function,
};

class TagsWorkspace extends React.PureComponent {
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
    const { tags, isOwner, t } = this.props;
    return (
      <div>
        {tags.length > 0 &&
          <div>
            <WorkspaceSubtitle>
              {t('title.tags')}
            </WorkspaceSubtitle>
            <div style={{ fontSize: '.875rem' }}>
              <Tags tags={tags} removeTag={isOwner && this.removeTag} />
            </div>
          </div>}

        {isOwner &&
          <div>
            <WorkspaceSubtitle>
              {t('tags.title')}
            </WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <input
                onChange={this.onChange}
                value={this.state.tagName}
                onKeyUp={this.handleKeyUp}
                placeholder={t('tags.addTagPlaceholder')}
              />
            </WorkspaceInputContainer>
            <Margin horizontal={1} vertical={0.5}>
              <Button
                onClick={this.addTag}
                disabled={tags.length >= 5}
                block
                small
              >
                {t('tags.addTagButton')}
              </Button>
            </Margin>
          </div>}
      </div>
    );
  }
}

export default translate('workspace')(TagsWorkspace);
