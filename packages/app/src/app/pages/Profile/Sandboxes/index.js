import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';
import SandboxList from 'app/components/SandboxList';

import { Navigation, Notice } from './elements';

const PER_PAGE_COUNT = 15;

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
    if (
      prevProps.page !== this.props.page ||
      prevProps.source !== this.props.source
    ) {
      this.fetch();
    }
  }

  getLastPage = () => {
    if (this.props.source === 'currentSandboxes') {
      const { sandboxCount } = this.props.store.profile.current;

      return Math.ceil(sandboxCount / PER_PAGE_COUNT);
    }

    const { givenLikeCount } = this.props.store.profile.current;

    return Math.ceil(givenLikeCount / PER_PAGE_COUNT);
  };

  deleteSandbox = index => {
    this.props.signals.profile.deleteSandboxClicked({ index });
  };

  render() {
    const { store, source, page, baseUrl } = this.props;
    const isProfileCurrentUser = store.profile.isProfileCurrentUser.get();
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
          onDelete={source === 'currentSandboxes' && this.deleteSandbox}
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
