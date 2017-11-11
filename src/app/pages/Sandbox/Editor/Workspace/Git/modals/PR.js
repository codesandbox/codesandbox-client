import React from 'react';
import styled from 'styled-components';

import { Redirect } from 'react-router-dom';

import { sandboxUrl } from 'app/utils/url-generator';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.background};

  height: 100px;

  font-size: 1.125rem;
  padding: 1rem 2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 1.25rem;
  color: white;

  background-color: ${props => props.theme.background2};
`;

type Props = {
  promise: Promise<{ newBranch: string }>,
  username: string,
  repo: string,
  path: string,
  branch: string,
  newUser: string,
  closeModal: Function,
};

export default class PR extends React.PureComponent<Props> {
  state = {
    url: null,
    newBranch: null,
    redirect: null,
  };

  componentDidMount() {
    this.awaitPR();
  }

  awaitPR = async () => {
    const { username, repo, path, branch, newUser, closeModal } = this.props;
    const { newBranch } = await this.props.promise;

    const newUrl = `https://github.com/${username}/${repo}/compare/${branch}...${newUser}:${newBranch}?expand=1`;

    setTimeout(() => {
      window.open(newUrl, '_blank').focus();
      closeModal();
    }, 2000);

    this.setState({
      newBranch,
      redirect: sandboxUrl({
        git: { username: newUser, repo, branch: newBranch, path },
      }),
    });
  };

  render() {
    return (
      <div>
        <Header>Pull Request</Header>
        <Container>
          {this.state.newBranch
            ? 'Opening GitHub in 2 seconds...'
            : 'Forking Repository & Creating PR...'}
        </Container>

        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}
