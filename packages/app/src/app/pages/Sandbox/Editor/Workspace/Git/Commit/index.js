import React from 'react';

import Progress from '../Progress';

export default class Commit extends React.PureComponent {
  state = {
    message: null,
  };

  componentDidMount() {
    this.awaitCommit();
  }

  awaitCommit = async () => {
    const { username, repo, branch, newUser, closeModal } = this.props;
    const { newBranch, merge } = await this.props.promise;

    let message = null;

    if (newBranch) {
      const newUrl = `https://github.com/${username}/${repo}/compare/${
        branch
      }...${newUser}:${newBranch}?expand=1`;
      message = (
        <div>
          There was a merge conflict while committing, you can open a PR
          instead.
          <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
            <a href={newUrl} target="_blank" rel="noreferrer noopener">
              Click here to open a PR
            </a>
          </div>
        </div>
      );
    } else if (merge) {
      message = (
        <div>
          Success! There were other commits, so we merged your changes in and
          opened an up to date sandbox.
        </div>
      );
    } else {
      message = <div>Success!</div>;

      setTimeout(() => {
        closeModal();
      }, 1000);
    }

    this.setState({
      message,
    });
  };

  render() {
    const { message } = this.state;
    return <Progress result={message} message="Creating Commit..." />;
  }
}
