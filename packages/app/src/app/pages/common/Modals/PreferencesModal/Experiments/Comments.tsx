import { COMMENTS } from '@codesandbox/common/lib/utils/feature-flags';
import React, { useState, useEffect } from 'react';
import { Text } from '@codesandbox/components';

import { PaddedPreference } from '../elements';

export const Comments: React.FunctionComponent = () => {
  const [comments, setComments] = useState(false);
  useEffect(() => {
    if (COMMENTS) {
      return setComments(true);
    }
    return setComments(false);
  }, []);

  const setValue = (val: boolean) => {
    setComments(val);
    window.localStorage.setItem('COMMENTS_CODESANDBOX', val.toString());
    location.reload();
  };

  return (
    <>
      <PaddedPreference
        title="Comments"
        type="boolean"
        value={comments}
        setValue={setValue}
      />
      <Text
        size={3}
        variant="muted"
        marginTop={2}
        block
        style={{ maxWidth: '60%' }}
      >
        This will refresh the page, make sure to save your changes.
      </Text>
    </>
  );
};
