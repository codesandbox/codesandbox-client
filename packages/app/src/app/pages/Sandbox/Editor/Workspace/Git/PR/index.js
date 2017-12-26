import React from 'react';

import Progress from '../Progress';

export default class PR extends React.PureComponent {
  state = {
    newBranch: null,
    url: null,
  };

  componentDidMount() {
    this.awaitPR();
  }

  awaitPR = async () => {
    const { username, repo, branch, newUser, closeModal } = this.props;
    const { newBranch } = await this.props.promise;

    const newUrl = `https://github.com/${username}/${repo}/compare/${
      branch
    }...${newUser}:${newBranch}?expand=1`;

    setTimeout(() => {
      window.open(newUrl, '_blank');
      closeModal();
    }, 3000);

    this.setState({
      newBranch,
      url: newUrl,
    });
  };

  render() {
    const { url } = this.state;
    return (
      <Progress
        result={
          url && (
            <div>
              Done! We{"'"}ll now open the new sandbox of this PR and GitHub in
              3 seconds...
              <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
                <a href={url} target="_blank" rel="noreferrer noopener">
                  Click here if nothing happens.
                </a>
              </div>
            </div>
          )
        }
        message="Forking Repository & Creating PR..."
      />
    );
  }
}
