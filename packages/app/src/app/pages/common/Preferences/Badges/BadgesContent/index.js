import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';

function BadgesContent({ store, signals }) {
  const badgesCount = store.user.badges.length;

  return (
    <div>
      <strong>
        You currently have {badgesCount} badge{badgesCount === 1 ? '' : 's'}.
        You can click on the badges to toggle visibility.
      </strong>
      <Margin top={2}>
        {store.user.badges.map(b => (
          <Badge
            tooltip={false}
            onClick={signals.editor.preferences.badgeVisibilityChanged}
            badge={b}
            size={128}
          />
        ))}
      </Margin>
    </div>
  );
}

export default inject('store', 'signals')(observer(BadgesContent));
