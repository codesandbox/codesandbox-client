import * as React from 'react';
import { connect } from 'app/fluent';
import { Link, RouteComponentProps } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import QuickActions from 'app/pages/Sandbox/QuickActions';

import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Centered from 'common/components/flex/Centered';
import Skeleton from 'app/components/Skeleton';

import Editor from './Editor';

type Props = RouteComponentProps<{
    id: string;
}>;

export default connect<Props>()
    .with(({ state, signals }) => ({
        isLoading: state.editor.isLoading,
        notFound: state.editor.notFound,
        error: state.editor.error,
        sandbox: state.editor.currentSandbox,
        sandboxChanged: signals.editor.sandboxChanged
    }))
    .toClass((props) =>
        DragDropContext(HTML5Backend)(
            class SandboxPage extends React.Component<typeof props> {
                componentWillMount() {
                    if (window.screen.availWidth < 800 && !document.location.search.includes('from-embed')) {
                        const addedSign = document.location.search ? '&' : '?';
                        document.location.href =
                            document.location.href.replace('/s/', '/embed/') + addedSign + 'codemirror=1';
                    } else {
                        this.fetchSandbox();
                    }
                }

                fetchSandbox = () => {
                    this.props.sandboxChanged({
                        id: this.props.match.params.id
                    });
                };

                componentDidUpdate(prevProps) {
                    if (prevProps.match.params.id !== this.props.match.params.id) {
                        this.fetchSandbox();
                    }
                }

                render() {
                    const { isLoading, notFound, error, sandbox } = this.props;

                    if (isLoading) {
                        return (
                            <Centered horizontal vertical>
                                <Skeleton
                                    titles={[
                                        {
                                            content: 'Loading sandbox...',
                                            delay: 0
                                        },
                                        {
                                            content: 'Fetching git repository...',
                                            delay: 2
                                        }
                                    ]}
                                />
                            </Centered>
                        );
                    }

                    if (notFound) {
                        return (
                            <Centered style={{ height: '100vh' }} horizontal vertical>
                                <Title>
                                    We could not find the Sandbox you{"'"}re looking for...
                                    <br />
                                    <br />
                                    <Link to="/s">Create Sandbox</Link>
                                </Title>
                            </Centered>
                        );
                    }

                    if (error) {
                        return (
                            <Centered style={{ height: '100vh' }} horizontal vertical>
                                <Title>An error occured when fetching the sandbox:</Title>
                                <SubTitle>{error}</SubTitle>
                                <br />
                                <br />
                                <Link to="/s">Create Sandbox</Link>
                            </Centered>
                        );
                    }

                    if (sandbox) {
                        document.title = `${sandbox.title || sandbox.id} - CodeSandbox`;
                    }

                    return (
                        <React.Fragment>
                            <Editor />
                            <QuickActions />
                        </React.Fragment>
                    );
                }
            }
        )
    );
