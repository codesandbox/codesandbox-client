import React, { useState } from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { FontPicker } from './FontPicker/index';
import { Container } from './elements';

export const AddFont = ({ addResource, addedResource }) => {
  const [activeFontFamily, setActiveFontFamily] = useState('Roboto');

  const addFont = async () => {
    if (activeFontFamily) {
      const font = activeFontFamily.trim().replace(/ /g, '+');
      const link = `https://fonts.googleapis.com/css?family=${font}&display=swap`;
      await addResource(link);
    }
  };

  const fontAlreadyExists = addedResource.filter(font =>
    font.includes(activeFontFamily)
  );

  return (
    <>
      <Container>
        <FontPicker
          activeFontFamily={activeFontFamily}
          onChange={nextFont => setActiveFontFamily(nextFont)}
        />
      </Container>
      <Container>
        <Button
          disabled={!activeFontFamily || fontAlreadyExists.length}
          block
          small
          onClick={addFont}
        >
          {fontAlreadyExists.length > 0
            ? 'Typeface already added'
            : 'Add Typeface'}
        </Button>
      </Container>
    </>
  );
};
