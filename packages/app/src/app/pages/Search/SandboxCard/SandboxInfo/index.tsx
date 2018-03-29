import * as React from 'react';
import * as moment from 'moment';

import FullHeartIcon from 'react-icons/lib/fa/heart';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import GithubBadge from 'app/components/GithubBadge';
import Stat from './Stat';
import { CenteredText, UpdatedAt, Stats, StyledUser } from './elements';
import { Git } from 'app/store/modules/git/types';

type Props = {
    author: {
        avatar_url: string;
        username: string;
    };
    updatedAt: number;
    viewCount: number;
    forkCount: number;
    likeCount: number;
    git: Git;
};

const SandboxInfo: React.SFC<Props> = ({ author, updatedAt, viewCount, forkCount, likeCount, git }) => {
    return (
        <CenteredText>
            {author && <StyledUser avatarUrl={author.avatar_url} username={author.username} />}
            {git && <GithubBadge username={git.username} repo={git.repo} />}

            <UpdatedAt>{moment(updatedAt * 1000).fromNow()}</UpdatedAt>

            <Stats>
                <Stat Icon={EyeIcon} count={viewCount} />
                <Stat Icon={FullHeartIcon} count={likeCount} />
                <Stat Icon={ForkIcon} count={forkCount} />
            </Stats>
        </CenteredText>
    );
};

export default SandboxInfo;
