import * as React from 'react';

import { connect } from 'app/fluent';

import { sandboxUrl, githubRepoUrl, profileUrl } from 'common/utils/url-generator';

import UserWithAvatar from 'app/components/UserWithAvatar';
import Stats from 'app/pages/common/Stats';
import PrivacyStatus from 'app/components/PrivacyStatus';
import ConfirmLink from 'app/components/ConfirmLink';
import GithubBadge from 'app/components/GithubBadge';
import createEditableTags from 'app/components/EditableTags';
import Tags from 'app/components/Tags';

import getTemplateDefinition from 'common/templates';
import { WorkspaceInputContainer } from '../elements';

import {
    Item,
    UserLink,
    StatsContainer,
    PrivacyContainer,
    Title,
    Description,
    EditPen,
    PropertyValue,
    PropertyName
} from './elements';

type Props = {
    editable: boolean;
};

type State = {
    editingTitle: boolean;
    editingDescription: boolean;
};

export default connect<Props>()
    .with(({ state, signals }) => ({
        project: { ...state.workspace.project },
        tags: state.workspace.tags,
        isAllModulesSynced: state.editor.isAllModulesSynced,
        currentSandbox: state.editor.currentSandbox,
        notificationAdded: signals.notificationAdded,
        tagRemoved: signals.workspace.tagRemoved,
        tagAdded: signals.workspace.tagAdded,
        sandboxInfoUpdated: signals.workspace.sandboxInfoUpdated,
        valueChanged: signals.workspace.valueChanged,
        tagChanged: signals.workspace.tagChanged
    }))
    .toClass(
        (allProps) =>
            class Project extends React.Component<typeof allProps, State> {
                state = {
                    editingTitle: false,
                    editingDescription: false
                };

                setTitleEditing = () => {
                    this.setState({ editingTitle: true });
                };

                setDescriptionEditing = () => {
                    this.setState({ editingDescription: true });
                };

                changeTags = (newTags, removedTags) => {
                    const { tags } = this.props.currentSandbox;

                    if (tags.length > 5) {
                        this.props.notificationAdded('You can have a maximum of 5 tags', 'error');
                        return;
                    }

                    const tagRemoved = newTags.length < tags.length && removedTags.length === 1;
                    if (tagRemoved) {
                        removedTags.forEach((tag) => {
                            this.props.tagRemoved({ tag });
                        });
                    } else {
                        this.props.tagAdded();
                    }
                };

                updateSandboxInfo = () => {
                    this.props.sandboxInfoUpdated();
                    this.setState({
                        editingTitle: false,
                        editingDescription: false
                    });
                };

                renderInput = (props) => {
                    const { onChange, value, addTag, ...other } = props;

                    if (this.props.currentSandbox.tags.length === 5) {
                        return null;
                    }

                    return <input type="text" onChange={onChange} value={value} {...other} />;
                };

                render() {
                    const {
                        currentSandbox,
                        project,
                        editable,
                        valueChanged,
                        tagChanged,
                        tags,
                        isAllModulesSynced
                    } = this.props;
                    const sandbox = currentSandbox;

                    const template = getTemplateDefinition(sandbox.template);

                    const EditableTags = createEditableTags(template.color);

                    return (
                        <div style={{ marginBottom: '1rem' }}>
                            <Item style={{ marginTop: '.5rem' }}>
                                {this.state.editingTitle ? (
                                    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
                                        <input
                                            value={project.title}
                                            onChange={(event) => {
                                                valueChanged({
                                                    field: 'title',
                                                    value: event.target.value
                                                });
                                            }}
                                            type="text"
                                            onBlur={this.updateSandboxInfo}
                                            onKeyUp={(event) => {
                                                if (event.keyCode === 13) {
                                                    this.updateSandboxInfo();
                                                }
                                            }}
                                            ref={(el) => {
                                                if (el) {
                                                    el.focus();
                                                }
                                            }}
                                            placeholder="Title"
                                        />
                                    </WorkspaceInputContainer>
                                ) : (
                                    <Title>
                                        {project.title || sandbox.title || sandbox.id}
                                        {editable && <EditPen onClick={this.setTitleEditing} />}
                                    </Title>
                                )}
                                {this.state.editingDescription ? (
                                    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
                                        <textarea
                                            value={project.description}
                                            onChange={(event) => {
                                                valueChanged({
                                                    field: 'description',
                                                    value: event.target.value
                                                });
                                            }}
                                            onBlur={this.updateSandboxInfo}
                                            onKeyDown={(event) => {
                                                if (event.keyCode === 13) {
                                                    if (!event.shiftKey) {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        this.updateSandboxInfo();
                                                    }
                                                }
                                            }}
                                            ref={(el) => {
                                                if (el) {
                                                    el.focus();
                                                }
                                            }}
                                            rows={2}
                                            placeholder="Description"
                                        />
                                    </WorkspaceInputContainer>
                                ) : (
                                    <Description
                                        style={{
                                            fontStyle: sandbox.description ? 'normal' : 'italic',
                                            color: 'rgba(255, 255, 255, 0.7)'
                                        }}
                                    >
                                        {sandbox.description || (editable ? 'No description, create one!' : '')}
                                        {editable && <EditPen onClick={this.setDescriptionEditing} />}
                                    </Description>
                                )}
                            </Item>

                            {!!sandbox.author && (
                                <Item>
                                    <UserLink to={profileUrl(sandbox.author.username)}>
                                        <UserWithAvatar
                                            username={sandbox.author.username}
                                            avatarUrl={sandbox.author.avatarUrl}
                                            subscriptionSince={sandbox.author.subscriptionSince}
                                        />
                                    </UserLink>
                                </Item>
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
                                        value={(sandbox.tags as any).toJS()}
                                        onChange={this.changeTags}
                                        onChangeInput={(value) => {
                                            tagChanged({
                                                tagName: value
                                            });
                                        }}
                                        inputValue={tags.tagName}
                                        renderInput={this.renderInput}
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
                                        <ConfirmLink
                                            enabled={!isAllModulesSynced}
                                            message="You have unsaved changes. Are you sure you want to navigate away?"
                                            to={sandboxUrl(sandbox.forkedFromSandbox)}
                                        >
                                            {sandbox.forkedFromSandbox.title || sandbox.forkedFromSandbox.id}
                                        </ConfirmLink>
                                    </PropertyValue>
                                </Item>
                            )}
                            <Item flex>
                                <PropertyName>Privacy</PropertyName>
                                <PropertyValue>
                                    <PrivacyContainer>
                                        <PrivacyStatus privacy={sandbox.privacy} />
                                    </PrivacyContainer>
                                </PropertyValue>
                            </Item>
                            <Item flex>
                                <PropertyName>Template</PropertyName>
                                <PropertyValue>
                                    <a
                                        href={template.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        style={{ color: template.color() }}
                                    >
                                        {sandbox.template}
                                    </a>
                                </PropertyValue>
                            </Item>
                        </div>
                    );
                }
            }
    );
