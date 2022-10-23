import React, { FormEvent, useState } from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { StyledButton } from 'app/components/dashboard/Button';
import { Textarea } from 'app/components/dashboard/Textarea';

// function validateEmail(email: string) {
//   // Test for "anything@anything.anything" and check for
//   // multiple @ signs.
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

export const TeamMembers: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { activeTeamInfo } = useAppState();
  const [addressesString, setAddressesString] = useState<string>();
  const [invalidEmails /* , setInvalidEmails */] = useState<string[]>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    /**
     * Submitting emails is a work in progress. We're not sure if we
     * can invite as many users at the same time.
     */

    // Remove spaces and split email addresses
    // const emails = addressesString.replace(' ', '').split(',');

    // // Validate emails
    // const invalid = emails.filter(email => {
    //   const isValidEmail = validateEmail(email);

    //   // Return when the email is not valid
    //   return !isValidEmail;
    // });

    // if (invalid.length === 0) {
    //   // Send invites
    //   emails.forEach(email => {
    //     // send invite
    //     // TODO: WIP
    //   });
    // } else {
    //   // Set error with invalid
    //   setInvalidEmails(invalid);
    // }
  };

  return (
    <Stack
      align="center"
      direction="vertical"
      gap={6}
      css={{
        paddingTop: '60px',
        paddingBottom: '48px',
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
        <Textarea
          label="Invite team members (Insert emails separated by a comma)"
          name="members"
          id="member"
          autoFocus
          required
          rows={3}
          value={addressesString}
          onChange={e => {
            setAddressesString(e.target.value);
          }}
        />
        {invalidEmails?.length > 0 ? (
          <Text size={2} variant="danger">
            There seems to be an error in the following addresses, please
            review:{' '}
            {invalidEmails.map((invalidEmail, index, arr) => {
              const isLastEmail = arr.length - 1 === index;
              return `${invalidEmail}${isLastEmail ? '.' : ', '}`;
            })}
          </Text>
        ) : null}
        <StyledButton type="submit" disabled>
          Invite members
        </StyledButton>
      </Stack>
      <Button onClick={onComplete} variant="link">
        Skip
      </Button>
    </Stack>
  );
};
