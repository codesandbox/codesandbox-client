import React, { useState } from 'react';
import FontPicker from 'font-picker-react';
import { WorkspaceInputContainer } from '../../elements';
import { FontPickerStyles } from './elements';

const AddVersion = ({ addResource }) => {
  const [activeFontFamily, setActiveFontFamily] = useState('Roboto');

  const addFont = async () => {
    if (activeFontFamily) {
      const font = activeFontFamily.trim().replace(/ /g, '+');
      const link = `https://fonts.googleapis.com/css?family=${font}&display=swap`;
      await addResource(link);
    }
  };

  return (
    <>
      <FontPickerStyles />
      <WorkspaceInputContainer>
        <FontPicker
          apiKey="AIzaSyDQ9HOzvLFchvhfDG9MR0UeLpF8ScJshxU"
          activeFontFamily={activeFontFamily}
          sort={'popularity'}
          onChange={nextFont => {
            setActiveFontFamily(nextFont.family);
            addFont();
          }}
          limit={300}
        />
      </WorkspaceInputContainer>
    </>
  );
};

export default AddVersion;
