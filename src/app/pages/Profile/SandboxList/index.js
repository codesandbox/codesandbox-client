// @flow
import React from 'react';
import styled from 'styled-components';
import Button from 'app/components/buttons/Button';

import SandboxList from 'app/components/sandbox/SandboxList';

const PER_PAGE_COUNT = 15;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding-bottom: 2rem;
`;

type Props = {
  page: number,
  sandboxCount: number,
  baseUrl: string,
  username: string,
  fetchSandboxes: Function,
};

export default class Sandboxes extends React.PureComponent {
  props: Props;

  static defaultProps = {
    page: 1,
  };

  fetch() {
    const { fetchSandboxes, username, page, sandboxes } = this.props;

    if (!sandboxes || !sandboxes[page]) {
      fetchSandboxes(username, page);
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getLastPage = () => {
    const { sandboxCount } = this.props;

    return Math.ceil(sandboxCount / PER_PAGE_COUNT);
  };

  render() {
    const { sandboxes, page, baseUrl } = this.props;
    if (!sandboxes || !sandboxes[page]) return <div />;
    return (
      <div>
        <SandboxList sandboxes={sandboxes[page]} />
        <Navigation>
          <div>
            {page > 1 &&
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page - 1}`}
              >
                {'<'}
              </Button>}
            {this.getLastPage() !== page &&
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page + 1}`}
              >
                {'>'}
              </Button>}
          </div>
        </Navigation>
      </div>
    );
  }
}
