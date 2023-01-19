import React, { FormEvent, useState } from 'react';
import { Button, Icon, Stack, Text } from '@codesandbox/components';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { StyledButton } from 'app/components/dashboard/Button';
import { Textarea } from 'app/components/dashboard/Textarea';
import { TeamMemberAuthorization } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';

function validateEmail(email: string) {
  // Test for "anything@anything.anything" and check for
  // multiple @ signs.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatInvalidEmails(invalidEmails: string[]) {
  const isSingleEmail = invalidEmails.length === 1;

  if (isSingleEmail) {
    return `${invalidEmails[0]}.`;
  }

  return invalidEmails.map((invalidEmail, index, arr) => {
    const isFirstEmail = index === 0;
    const isLastEmail = arr.length - 1 === index;

    return `${
      isLastEmail
        ? ` and ${invalidEmail}.`
        : `${isFirstEmail ? '' : ', '}${invalidEmail}`
    }`;
  });
}

export const TeamMembers: React.FC<{
  hideSkip?: boolean;
  onComplete: () => void;
}> = ({ hideSkip, onComplete }) => {
  const { activeTeamInfo, activeWorkspaceAuthorization } = useAppState();
  const actions = useActions();
  const { gql } = useEffects();
  const { copyToClipboard } = useEffects().browser;
  const [addressesString, setAddressesString] = useState<string>('');
  const [invalidEmails, setInvalidEmails] = useState<string[] | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = React.useState(false);

  const copyLinkTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  if (!activeTeamInfo) {
    return null;
  }

  const inviteLink = teamInviteLink(activeTeamInfo.inviteToken);

  const copyTeamInviteLink = () => {
    copyToClipboard(inviteLink);
    setLinkCopied(true);

    if (copyLinkTimeoutRef.current) {
      clearTimeout(copyLinkTimeoutRef.current);
    }

    actions.track({
      name: 'Dashboard - Copied Team Invite URL',
      data: { place: 'modal', inviteLink },
    });

    copyLinkTimeoutRef.current = setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    // Split email addresses
    const emails = addressesString.split(',').map(email => {
      const spaceRegex = /\s/g;

      if (spaceRegex.test(email.charAt(0))) {
        // remove space from start
        return email.substring(1);
      }
      if (spaceRegex.test(email.charAt(email.length - 1))) {
        // remove space from end
        return email.substring(0, email.length - 1);
      }

      return email;
    });

    // Validate emails
    const invalid = emails.filter(email => {
      const isValidEmail = validateEmail(email);

      // Return when the email is not valid
      return !isValidEmail;
    });

    if (invalid.length === 0) {
      setInvalidEmails(null);
      setInviteLoading(true);

      track('New Team - Invite Members', {
        codesandbox: 'V1',
        event_source: 'UI',
      });

      // Invite via email
      try {
        await gql.mutations.inviteToTeamViaEmail({
          teamId: activeTeamInfo.id,
          email: addressesString,
          authorization:
            activeWorkspaceAuthorization === TeamMemberAuthorization.Admin
              ? TeamMemberAuthorization.Write
              : TeamMemberAuthorization.Read,
        });
        setInviteLoading(false);

        onComplete();
      } catch (error) {
        // Setting it here instead of finally so the error message
        // does not appear before the loading is removed.
        setInviteLoading(false);

        // ❗️ TODO: Validate if this works!
        // Copied logic from inviteToTeam function in dashboard/actions.ts
        const message =
          error?.response?.errors?.[0]?.message ||
          'There was a problem sending the invitations.';

        setInviteError(message);
      }
    } else {
      // Set error with invalid
      setInvalidEmails(invalid);
    }
  };

  return (
    <>
      <Stack
        align="center"
        direction="vertical"
        gap={6}
        css={{
          paddingTop: '60px',
          paddingBottom: '40px',
          maxWidth: '370px',
          width: '100%',
        }}
      >
        <Text
          as="h2"
          size={32}
          weight="500"
          align="center"
          css={{
            margin: 0,
            color: '#ffffff',
            fontFamily: 'Everett, sans-serif',
            lineHeight: '42px',
            letterSpacing: '-0.01em',
          }}
        >
          {activeTeamInfo.name}
        </Text>
        <Stack
          as="form"
          onSubmit={handleSubmit}
          direction="vertical"
          gap={6}
          css={{ width: '100%' }}
        >
          <Stack gap={4} direction="vertical">
            <Textarea
              id="member"
              label="Invite team members (Insert emails separated by a comma)"
              name="members"
              value={addressesString}
              onChange={e => {
                setAddressesString(e.target.value);
              }}
              css={{
                resize: 'none',
              }}
              rows={3}
              autoFocus
              required
            />

            {invalidEmails && invalidEmails.length > 0 ? (
              <Text size={2} variant="danger">
                {invalidEmails.length > 1
                  ? 'There seem to be errors in some email addresses, '
                  : 'Email is invalid, '}
                please review: {formatInvalidEmails(invalidEmails)}
              </Text>
            ) : null}

            {inviteError ? (
              <Text size={2} variant="danger">
                {inviteError}
              </Text>
            ) : null}

            <StyledButton loading={inviteLoading} type="submit">
              Invite members
            </StyledButton>
          </Stack>
          <Text
            css={{
              margin: 0,
            }}
            align="center"
            as="p"
            size={2}
            variant="muted"
          >
            Team members will be invited as{' '}
            <Text color="#C2C2C2">
              {
                // The modal is visible only to admins and editors.
                {
                  [TeamMemberAuthorization.Admin]: 'editors',
                  [TeamMemberAuthorization.Write]: 'viewers',
                }[activeWorkspaceAuthorization]
              }
            </Text>
            .
          </Text>
        </Stack>
      </Stack>
      <Stack
        css={{
          width: '100%',
          padding: '48px 56px',
        }}
        justify={hideSkip ? 'center' : 'space-between'}
      >
        <Button
          css={{ width: 'auto' }}
          onClick={copyTeamInviteLink}
          variant="link"
        >
          <Icon
            size={12}
            style={{ marginRight: 8 }}
            name={linkCopied ? 'simpleCheck' : 'link'}
          />
          {linkCopied ? 'Link Copied!' : 'Copy Invite URL'}
        </Button>
        {hideSkip ? null : (
          <Button
            css={{ width: 'auto' }}
            onClick={() => {
              track('New Team - Skip Team Invite', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              onComplete();
            }}
            variant="link"
          >
            Skip
          </Button>
        )}
      </Stack>
    </>
  );
};
