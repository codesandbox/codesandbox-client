import * as React from 'react';
import { connect } from 'app/fluent';

import { sortBy } from 'lodash';
import DirectoryEntry from './DirectoryEntry/index';
import WorkspaceItem from '../WorkspaceItem';

import EditIcons from './DirectoryEntry/Entry/EditIcons';

export default connect()
    .with(({ state }) => ({
        sandbox: state.editor.currentSandbox,
        changedModuleShortids: state.editor.changedModuleShortids,
        mainModule: state.editor.mainModule,
        currentModule: state.editor.currentModule,
        isInProjectView: state.editor.isInProjectView,
        errors: state.editor.errors,
        corrections: state.editor.corrections
    }))
    .toClass(
        (props) =>
            class Files extends React.Component<typeof props> {
                directory: any;
                createModule = () => {
                    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
                    this.directory.onCreateModuleClick();
                };

                createDirectory = () => {
                    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
                    this.directory.onCreateDirectoryClick();
                };

                render() {
                    const {
                        sandbox,
                        changedModuleShortids,
                        mainModule,
                        isInProjectView,
                        currentModule,
                        errors,
                        corrections
                    } = this.props;

                    return (
                        <WorkspaceItem
                            defaultOpen
                            keepState
                            title="Files"
                            actions={
                                <EditIcons
                                    hovering
                                    onCreateFile={this.createModule}
                                    onCreateDirectory={this.createDirectory}
                                />
                            }
                        >
                            <DirectoryEntry
                                root
                                innerRef={(el) => {
                                    this.directory = el;
                                }}
                                title={sandbox.title || 'Project'}
                                changedModuleShortids={changedModuleShortids}
                                sandboxId={sandbox.id}
                                sandboxTemplate={sandbox.template}
                                mainModuleId={mainModule.id}
                                modules={sortBy((sandbox.modules as any).toJS(), 'title')}
                                directories={sortBy((sandbox.directories as any).toJS(), 'title')}
                                isInProjectView={isInProjectView}
                                currentModuleId={currentModule.id}
                                errors={errors}
                                corrections={corrections}
                                depth={-1}
                                id={null}
                                shortid={null}
                            />
                        </WorkspaceItem>
                    );
                }
            }
    );
