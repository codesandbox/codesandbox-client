import { UserQuery } from '@codesandbox/common/lib/types';
import { Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import React from 'react';

import { MentionsTextArea } from './components/MentionsTextarea';

type Props = {
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery }
  ) => void;
};

export const AddComment: React.FC<Props> = ({ onSubmit }) => (
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
    <form css={css({ position: 'relative' })}>
      <MentionsTextArea initialValue="" onSubmit={onSubmit} />
    </form>
  </Element>
);
