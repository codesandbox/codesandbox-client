// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'app/components/buttons/Button';
import type { PaginatedSandboxes } from 'common/types';

import SandboxList from 'app/components/sandbox/SandboxList';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

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
  sandboxes: PaginatedSandboxes,
  sandboxActions: typeof sandboxActionCreators,
  isCurrentUser: boolean;
};

class Sandboxes extends React.PureComponent {
  props: Props;

  static defaultProps = {
    page: 1,
  };

  fetch(force = false) {
    const { fetchSandboxes, username, page, sandboxes } = this.props;

    if (force || !sandboxes || !sandboxes[page]) {
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

  deleteSandbox = async (id: string) => {
    const really = confirm(`Are you sure you want to delete this sandbox?`); // TODO: confirm???
    if (really) {
      await this.props.sandboxActions.deleteSandbox(id);
      this.fetch(true);
    }
  };

  render() {
    const { sandboxes, isCurrentUser, page, baseUrl } = this.props;
    if (!sandboxes || !sandboxes[page]) return <div />;
    return (
      <div>
        <SandboxList
          isCurrentUser={isCurrentUser}
          sandboxes={sandboxes[page]}
          onDelete={this.deleteSandbox}
        />
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

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sandboxes);
