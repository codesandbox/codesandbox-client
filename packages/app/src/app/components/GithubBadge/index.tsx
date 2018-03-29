import * as React from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { BorderRadius, Text, Icon, StyledA } from './elements';

const DivOrA = ({ href, ...props }) =>
    href ? <StyledA target="_blank" rel="noopener noreferrer" href={href} {...props} /> : <div {...props} />;

type Props = {
    username: string;
    repo: string;
    url?: string;
    branch?: string;
};

const GithubBadge: React.SFC<Props> = ({ username, repo, url, branch }) => {
    return (
        <DivOrA href={url}>
            <BorderRadius hasUrl={!!url}>
                <Icon>
                    <GithubIcon />
                </Icon>
                <Text>
                    {username}/{repo}
                    {branch && branch !== 'master' ? `@${branch}` : ''}
                </Text>
            </BorderRadius>
        </DivOrA>
    );
};

export default GithubBadge;
