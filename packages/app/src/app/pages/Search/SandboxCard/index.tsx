import * as React from 'react';
import { Highlight } from 'react-instantsearch/dom';

import Tags from 'app/components/Tags';

import { sandboxUrl } from 'common/utils/url-generator';
import Row from 'common/components/flex/Row';
import SandboxInfo from './SandboxInfo';
import { Container, StyledLink, Title, Description, TagContainer } from './elements';
import { SearchHit } from 'app/store/types';

type Props = {
    hit: SearchHit;
};

const SandboxCard: React.SFC<Props> = ({ hit }) => {
    return (
        <StyledLink to={sandboxUrl({ id: hit.objectID, git: hit.git })}>
            <Container template={hit.template}>
                <Row alignItems="flex-start">
                    <Title>{hit.title ? <Highlight attributeName="title" hit={hit} /> : hit.objectID}</Title>
                    <TagContainer>
                        <Tags
                            align="right"
                            style={{ margin: 0, marginTop: -2 }}
                            tags={(hit.tags || []).filter((tag) => tag.length < 20)}
                        />
                    </TagContainer>
                </Row>
                <Description>
                    <Highlight attributeName="description" hit={hit} />
                </Description>

                <SandboxInfo
                    git={hit.git}
                    author={hit.author}
                    updatedAt={hit.updated_at}
                    viewCount={hit.view_count}
                    forkCount={hit.fork_count}
                    likeCount={hit.like_count}
                />
            </Container>
        </StyledLink>
    );
};

export default SandboxCard;
