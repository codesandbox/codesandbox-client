import * as React from 'react';
import { connect } from 'app/fluent';
import { RouteComponentProps } from 'react-router-dom';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch/dom';
import qs from 'qs';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import Row from 'common/components/flex/Row';

import Navigation from 'app/pages/common/Navigation';
import { ALGOLIA_API_KEY, ALGOLIA_APPLICATION_ID, ALGOLIA_DEFAULT_INDEX } from 'common/utils/config';

import './search.css';
import Results from './Results';
import Filters from './Filters';
import { Content, StyledTitle } from './elements';

const SEARCHABLE_THINGS = [ 'dependency', 'user', 'sandbox title', 'sandbox tag', 'github repository' ];

const updateAfter = 700;

const getRandomSearch = () => SEARCHABLE_THINGS[Math.floor(Math.random() * SEARCHABLE_THINGS.length)];

const createURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
    searchState ? `${props.location.pathname}${createURL(searchState)}` : '';

type Props = RouteComponentProps<{}>;

type State = {
    searchState: string;
};

export default connect<Props>()
    .with(({ signals }) => ({
        searchMounted: signals.searchMounted
    }))
    .toClass(
        (allProps) =>
            class Search extends React.PureComponent<typeof allProps, State> {
                unlisten;
                debouncedSetState: NodeJS.Timer;
                constructor(props) {
                    super(props);
                    this.state = { searchState: qs.parse(props.location.search.slice(1)) };

                    this.unlisten = this.props.history.listen((location, action) => {
                        if (action === 'PUSH') {
                            this.setState({
                                searchState: qs.parse(location.search.slice(1))
                            });
                        }
                    });
                }

                componentWillUnmount() {
                    this.unlisten();
                }

                componentDidMount() {
                    this.props.searchMounted();
                }

                onSearchStateChange = (searchState) => {
                    clearTimeout(this.debouncedSetState);
                    this.debouncedSetState = setTimeout(() => {
                        this.props.history.push(searchStateToUrl(this.props, searchState), searchState);
                    }, updateAfter);
                    this.setState({ searchState });
                };

                render() {
                    document.title = 'Search - CodeSandbox';
                    return (
                        <MaxWidth>
                            <Margin vertical={1.5} horizontal={1.5}>
                                <Navigation title="Search" />
                                <Content>
                                    <MaxWidth width={1024}>
                                        <InstantSearch
                                            appId={ALGOLIA_APPLICATION_ID}
                                            apiKey={ALGOLIA_API_KEY}
                                            indexName={ALGOLIA_DEFAULT_INDEX}
                                            searchState={this.state.searchState}
                                            onSearchStateChange={this.onSearchStateChange}
                                            createURL={createURL}
                                        >
                                            <StyledTitle>Sandbox Search</StyledTitle>
                                            <PoweredBy />
                                            <SearchBox
                                                autoFocus
                                                translations={{
                                                    placeholder: `Search for a ${getRandomSearch()}...`
                                                }}
                                            />
                                            <Row alignItems="flex-start">
                                                <Results />
                                                <Filters />
                                            </Row>
                                        </InstantSearch>
                                    </MaxWidth>
                                </Content>
                            </Margin>
                        </MaxWidth>
                    );
                }
            }
    );
