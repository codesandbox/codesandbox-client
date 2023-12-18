import React, { FormEvent, useState } from 'react';
import { Icon, Stack, Text, Button } from '@codesandbox/components';
import { useAppState, useEffects } from 'app/overmind';
import { Textarea } from 'app/components/dashboard/Textarea';
import { TeamMemberAuthorization } from 'app/graphql/types';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const Members: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { activeTeamInfo, activeWorkspaceAuthorization } = useAppState();
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

        onNextStep();
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
    <AnimatedStep>
      <Stack direction="vertical" gap={6} css={{ width: '350px' }}>
        <StepHeader
          title="Invite workspace members"
          onDismiss={onDismiss}
          onPrevStep={onPrevStep}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
        />
        <Stack as="form" onSubmit={handleSubmit} direction="vertical" gap={2}>
          <Text color="#fff">
            Insert email addresses separated by a comma. Members will be invited
            as editors.
          </Text>

          <Textarea
            id="member"
            name="members"
            value={addressesString}
            onChange={e => {
              setAddressesString(e.target.value);
            }}
            resize={false}
            rows={3}
            autoFocus
            required
          />

          {invalidEmails && invalidEmails.length > 0 ? (
            <Text size={3} variant="danger">
              {invalidEmails.length > 1
                ? 'There seem to be errors in some email addresses, '
                : 'Email is invalid, '}
              please review: {formatInvalidEmails(invalidEmails)}
            </Text>
          ) : null}

          {inviteError ? (
            <Text size={3} variant="danger">
              {inviteError}
            </Text>
          ) : null}

          <Stack gap={2}>
            <Button
              autoWidth
              loading={inviteLoading}
              type="submit"
              variant="secondary"
              size="large"
            >
              Send invites
            </Button>
            <Button
              autoWidth
              onClick={copyTeamInviteLink}
              variant="ghost"
              size="large"
            >
              <Icon
                size={12}
                style={{ marginRight: 8 }}
                name={linkCopied ? 'simpleCheck' : 'link'}
              />
              {linkCopied ? 'Link Copied!' : 'Copy Invite URL'}
            </Button>
          </Stack>
        </Stack>

        <Button onClick={onNextStep} size="large">
          Next
        </Button>
      </Stack>
    </AnimatedStep>
  );
};

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
