import { UserQuery } from '@codesandbox/common/lib/types';
import { Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import React from 'react';

import { useCodesandboxCommentEditor } from './hooks/useCodesandboxCommentEditor';

type Props = {
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery },
    images: {
      [fileName: string]: { src: string; resolution: [number, number] };
    }
  ) => void;
};

export const AddComment: React.FC<Props> = ({ onSubmit }) => {
  const [elements] = useCodesandboxCommentEditor({
    initialValue: '',
    initialMentions: {},
    initialImages: {},
    onSubmit,
    fixed: true,
    props: {
      autosize: true,
      style: { lineHeight: 1.2, minHeight: 32 },
    },
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
