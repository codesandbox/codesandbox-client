import { UserQuery } from '@codesandbox/common/lib/types';
import { Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import React from 'react';

import { useCodesandboxMention } from './hooks/useCodesandboxMention';

type Props = {
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery }
  ) => void;
};

export const AddComment: React.FC<Props> = ({ onSubmit }) => {
  const [elements] = useCodesandboxMention({
    initialValue: '',
    initialMentions: {},
    onSubmit,
    fixed: true,
  });
  return (
    <Element
      paddingX={2}
      paddingY={4}
      css={css({
        zIndex: 2,
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        boxShadow: theme => `0px -32px 32px ${theme.colors.dialog.background}`,
      })}
    >
      <form css={{ position: 'relative' }}>{elements}</form>
    </Element>
  );
};
