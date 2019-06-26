import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import TeamIcon from 'react-icons/lib/md/people';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import Stats from 'app/pages/common/Stats';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import EditableTags from 'app/components/EditableTags';
import Tags from '@codesandbox/common/lib/components/Tags';

import getTemplate from '@codesandbox/common/lib/templates';
import getTemplateDefinition from '@codesandbox/common/lib/templates';

import { useSignals, useStore } from 'app/store';
import {
  Item,
  UserLink,
  StatsContainer,
  PrivacyContainer,
  PropertyValue,
  PropertyName,
  PrivacySelect,
  Icon,
} from './elements';
import TitleComponent from './Title';
import FrozenComponent from './Frozen';
import DescriptionComponent from './Description';
import TemplateComponent from './Template';

// import AliasComponent from './Alias';

const Project = ({ editable }: { editable?: boolean }) => {
  const { editor, workspace, isPatron } = useStore();
  const { notificationAdded, workspace: workspaceSignals } = useSignals();
  const isServer = getTemplate(editor.currentSandbox.template).isServer;

  const changeTags = (newTags: string[], removedTags: string[]) => {
    const { tags } = editor.currentSandbox;

    if (tags.length > 5) {
      notificationAdded('You can have a maximum of 5 tags', 'error');
      return;
    }

    const tagRemoved = newTags.length < tags.length && removedTags.length === 1;
    if (tagRemoved) {
      removedTags.forEach(tag => {
        workspaceSignals.tagRemoved({ tag });
      });
    } else {
      workspaceSignals.tagAdded();
    }
  };

  const updateSandboxInfo = () => workspaceSignals.sandboxInfoUpdated();

  const renderInput = (props: any) => {
    const { onChange, value, addTag, ...other } = props;

    if (editor.currentSandbox.tags.length === 5) {
      return null;
    }

    return <input type="text" onChange={onChange} value={value} {...other} />;
  };

  const sandbox = editor.currentSandbox;

  const template = getTemplateDefinition(sandbox.template);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Item style={{ marginTop: '.5rem' }}>
        <TitleComponent
          updateSandboxInfo={updateSandboxInfo}
          editable={editable}
          title={workspace.project.title || getSandboxName(sandbox)}
        />
        <DescriptionComponent
          updateSandboxInfo={updateSandboxInfo}
          editable={editable}
        />
        {/* Disable until we also moved SSE over */}
        {/* <AliasComponent editable={editable} isPatron={store.isPatron} alias={workspace.project.alias || sandbox.alias} updateSandboxInfo={updateSandboxInfo} /> */}
      </Item>

      {!sandbox.team && !!sandbox.author && (
        <Item>
          <UserLink
            title={sandbox.author.username}
            to={profileUrl(sandbox.author.username)}
          >
            <UserWithAvatar
              username={sandbox.author.username}
              avatarUrl={sandbox.author.avatarUrl}
              subscriptionSince={sandbox.author.subscriptionSince}
            />
          </UserLink>
        </Item>
      )}

      {!!sandbox.team && (
        <Tooltip content="This sandbox is owned by this team">
          <Item style={{ color: 'white', display: 'flex' }}>
            <TeamIcon style={{ fontSize: '1.125em', marginRight: '.5rem' }} />
            <div>{sandbox.team.name}</div>
          </Item>
        </Tooltip>
      )}
      {!!sandbox.git && (
        <Item>
          <GithubBadge
            url={githubRepoUrl(sandbox.git)}
            username={sandbox.git.username}
            repo={sandbox.git.repo}
            branch={sandbox.git.branch}
          />
        </Item>
      )}
      <StatsContainer>
        <Stats sandbox={sandbox} />
      </StatsContainer>
      <Item>
        {editable ? (
          <EditableTags
            template={template}
            value={sandbox.tags.toJS()}
            onChange={changeTags}
            onChangeInput={value => {
              workspaceSignals.tagChanged({
                tagName: value,
              });
            }}
            maxTags={5}
            inputValue={workspace.tags.tagName}
            renderInput={renderInput}
            onlyUnique
          />
        ) : (
          <Tags style={{ fontSize: 13 }} tags={sandbox.tags} />
        )}
      </Item>

      {sandbox.forkedFromSandbox && (
        <Item flex>
          <PropertyName>Forked From</PropertyName>
          <PropertyValue>
            <Link to={sandboxUrl(sandbox.forkedFromSandbox)}>
              {sandbox.forkedFromSandbox.title || sandbox.forkedFromSandbox.id}
            </Link>
          </PropertyValue>
        </Item>
      )}
      <Item
        flex
        css={`
          align-items: center;
        `}
      >
        <PropertyName>
          Privacy{' '}
          {!isPatron && (
            <Tooltip
              placement="right"
              content={
                'Having private and unlisted Sandboxes is available as Patron.'
              }
            >
              <Icon />
            </Tooltip>
          )}
        </PropertyName>
        <PropertyValue>
          <PrivacyContainer>
            <PrivacySelect
              value={sandbox.privacy}
              disabled={!isPatron}
              onChange={event =>
                workspaceSignals.sandboxPrivacyChanged({
                  privacy: Number(event.target.value),
                })
              }
            >
              s<option value={0}>Public</option>
              {isPatron && (
                <option value={1}>Unlisted (only available by url)</option>
              )}
              {!isServer && isPatron && <option value={2}>Private</option>}
            </PrivacySelect>
          </PrivacyContainer>
        </PropertyValue>
      </Item>
      <Item flex>
        <PropertyName>Bundler</PropertyName>
        <PropertyValue>
          <a
            href={sandbox.customTemplate ? sandboxUrl(sandbox) : template.url}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: template.color() }}
          >
            {sandbox.customTemplate
              ? sandbox.customTemplate.title
              : sandbox.template}
          </a>
        </PropertyValue>
      </Item>
      {sandbox.owned ? (
        <>
          <FrozenComponent frozen={sandbox.isFrozen} />
          <TemplateComponent template={sandbox.customTemplate} />
        </>
      ) : null}
    </div>
  );
};

export default observer(Project);
