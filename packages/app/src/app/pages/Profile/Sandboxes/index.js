// @flow
import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
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

const Notice = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem 0;
  padding-bottom: 0;
`;

class Sandboxes extends React.Component {
  static defaultProps = {
    page: 1,
  };

  fetch(force = false) {
    const { signals, source, store, page } = this.props;

    if (store.profile.isLoadingSandboxes) {
      return;
    }

    if (force || !store.profile[source] || !store.profile[source].get(page)) {
      switch (source) {
        case 'currentSandboxes':
          signals.profile.sandboxesPageChanged({ page });
          break;
        case 'currentLikedSandboxes':
          signals.profile.likedSandboxesPageChanged({ page });
          break;
        default:
      }
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.fetch();
    }
  }

  getLastPage = () => {
    const { sandboxCount } = this.props.store.profile.current;

    return Math.ceil(sandboxCount / PER_PAGE_COUNT);
  };

  deleteSandbox = id => {
    this.props.signals.modalOpened({ name: 'deleteSandbox', props: { id } });
  };

  render() {
    const { store, source, page, baseUrl } = this.props;
    const isProfileCurrentUser = store.profile.isProfileCurrentUser;
    const isLoadingSandboxes = store.profile.isLoadingSandboxes;
    const sandboxes = store.profile[source];

    if (isLoadingSandboxes || !sandboxes || !sandboxes.get(page))
      return <div />;

    return (
      <div>
        {isProfileCurrentUser && (
          <Notice>
            You{"'"}re viewing your own profile, so you can see your private and
            unlisted sandboxes. Others can{"'"}t.
          </Notice>
        )}
        <SandboxList
          isCurrentUser={isProfileCurrentUser}
          sandboxes={sandboxes.get(page)}
          onDelete={this.deleteSandbox}
        />
        <Navigation>
          <div>
            {page > 1 && (
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page - 1}`}
              >
                {'<'}
              </Button>
            )}
            {this.getLastPage() !== page && (
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page + 1}`}
              >
                {'>'}
              </Button>
            )}
          </div>
        </Navigation>
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(Sandboxes));
