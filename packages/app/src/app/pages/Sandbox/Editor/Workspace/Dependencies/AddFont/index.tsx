import { Button } from '@codesandbox/common/lib/components/Button';
import React, { FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { Container } from './elements';
import { FontPicker } from './FontPicker';

type Props = {
  addedFonts: string[];
};
export const AddFont: FunctionComponent<Props> = ({ addedFonts }) => {
  const {
    actions: {
      workspace: { externalResourceAdded },
    },
  } = useOvermind();
  const [activeFontFamily, setActiveFontFamily] = useState('Roboto');
  const fontAlreadyAdded = addedFonts.some(font =>
    font.includes(activeFontFamily)
  );

  const addFont = async () => {
    if (activeFontFamily) {
      const font = activeFontFamily.trim().replace(/ /g, '+');
      const link = `https://fonts.googleapis.com/css?family=${font}&display=swap`;

      await externalResourceAdded(link);
    }
  };

  return (
    <>
      <Container>
        <FontPicker
          activeFontFamily={activeFontFamily}
          onChange={font => setActiveFontFamily(font)}
        />
      </Container>

      <Container>
        <Button
          block
          disabled={!activeFontFamily || fontAlreadyAdded}
          onClick={addFont}
          small
        >
          {fontAlreadyAdded ? 'Typeface already added' : 'Add Typeface'}
        </Button>
      </Container>
    </>
  );
};
