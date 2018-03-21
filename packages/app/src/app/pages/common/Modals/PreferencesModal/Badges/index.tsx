import * as React from 'react';
import { connect } from 'app/fluent';

import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';
import { Title } from '../elements';

export default connect()
  .with(({ state, signals }) => ({
    badges: state.user.badges,
    setBadgeVisibility: signals.preferences.setBadgeVisibility
  }))
  .to(
    function Badges({ badges, setBadgeVisibility }) {
      const badgesCount = badges.length;

      return (
        <div>
          <Title>Badges</Title>
          <strong>
            You currently have {badgesCount} badge{badgesCount === 1 ? '' : 's'}.
            You can click on the badges to toggle visibility.
          </strong>
          <Margin top={2}>
            {badges.map(badge => (
              <Badge
                key={badge.id}
                tooltip={false}
                onClick={b =>
                  setBadgeVisibility({
                    ...b,
                    visible: !b.visible,
                  })
                }
                badge={badge}
                visible={badge.visible}
                size={128}
              />
            ))}
          </Margin>
        </div>
      );
    }
  )
