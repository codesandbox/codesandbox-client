import { Input } from '@codesandbox/components';
import * as React from 'react';
import { CustomFormField } from '../RegistryForm';

type UsernamePasswordProps = {
  setAuthKey: (key: string) => void;
  disabled: boolean;
  authKey: string;
};

export const UsernamePassword = ({
  disabled,
  setAuthKey,
  authKey,
}: UsernamePasswordProps) => {
  let [initialUsername, initialPassword] = Buffer.from(
    String(authKey),
    'base64'
  )
    .toString('utf-8')
    .split(':');

  if (!initialPassword || !authKey.endsWith('=')) {
    // Meaning that we parsed wrong
    initialUsername = '';
    initialPassword = '';
  }

  const [username, setUsername] = React.useState(initialUsername);
  const [token, setToken] = React.useState(initialPassword);

  React.useEffect(() => {
    if (!username || !token) {
      return;
    }

    // First unencode the token, this is what npm does as well
    const unencodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const key = `${username}:${unencodedToken}`;
    const base64Data = Buffer.from(key);
    const newAuthKey = base64Data.toString('base64');
    setAuthKey(newAuthKey);
  }, [username, token, setAuthKey]);

  return (
    <>
      <CustomFormField label="Username (username field in .npmrc)">
        <Input
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
          disabled={disabled}
        />
      </CustomFormField>

      <CustomFormField label="Access Token or Password (_password field in .npmrc)">
        <Input
          value={token}
          required
          onChange={e => setToken(e.target.value)}
          disabled={disabled}
          type="password"
        />
      </CustomFormField>
    </>
  );
};
