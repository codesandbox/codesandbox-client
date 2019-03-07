import React from 'react';
import Badge from 'common/lib/utils/badges/Badge';
import ContributorsBadge from 'common/lib/components/ContributorsBadge';
import CommunityBadge from 'common/lib/components/CommunityBadges';
import { H3 } from '../../../components/Typography';
import { BadgeWrapper, BadgeAside } from './elements';

export default ({ templateSandboxes, badges, username }) => {
  const hasBadges =
    !!Object.keys(templateSandboxes).find(
      key => templateSandboxes[key] >= 50
    ) || badges.length;

  return hasBadges ? (
    <BadgeAside>
      <H3>Achievement Badges</H3>
      <BadgeWrapper>
        {badges.map(badge => <Badge key={badge.id} badge={badge} size={64} />)}

        {Object.keys(templateSandboxes).map(
          key =>
            templateSandboxes[key] >= 50 && (
              <CommunityBadge
                template={key}
                key={key}
                sandboxesNumber={templateSandboxes[key]}
                style={{
                  width: 64,
                  height: 50,
                }}
              />
            )
        )}
        <ContributorsBadge
          username={username}
          style={{
            width: 64,
            height: 50,
          }}
        />
      </BadgeWrapper>
    </BadgeAside>
  ) : null;
};
