import React, { useState, useEffect, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import { Button } from '@codesandbox/common/lib/components/Button';
import { ENTER, ESC } from '@codesandbox/common/lib/utils/keycodes';
import { WorkspaceInputContainer } from '../../elements';
import { ButtonContainer, Fonts, Font, FontName } from './elements';

const AddVersion = ({ addResource }) => {
  const [name, setName] = useState('');
  const [fonts, setFonts] = useState([]);
  const [showList, setShowList] = useState(false);
  const [defaultFonts, setDefaultFonts] = useState([]);

  const getFonts = useCallback(async () => {
    const { items } = await fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDQ9HOzvLFchvhfDG9MR0UeLpF8ScJshxU&sort=popularity'
    ).then(a => a.json());
    const justFamily = items.map(a => a.family);
    setFonts(justFamily);
    setDefaultFonts(justFamily);
  }, []);

  useEffect(() => {
    if (name.length > 2) {
      const selectedFonts = defaultFonts.filter(item =>
        item
          .trim()
          .toLowerCase()
          .includes(name.trim().toLowerCase())
      );

      setFonts(selectedFonts);
      if (name !== fonts.find(font => font === name)) {
        setShowList(true);
      }
    }

    if (name.length === 1) {
      getFonts();
    }
    // eslint-disable-next-line
  }, [name]);

  const addFont = async selectedFont => {
    if (name) {
      const font = selectedFont.trim().replace(/ /g, '+');
      const link = `https://fonts.googleapis.com/css?family=${font}&display=swap`;
      await addResource(link);
      setName('');
      setFonts(defaultFonts);
    }
  };

  const handleKeyUp = e => {
    if (e.keyCode === ENTER) {
      addFont(fonts[0]);
    }
    if (e.keyCode === ESC) {
      setShowList(false);
    }
  };

  const isValid = name !== '';
  return (
    <div style={{ position: 'relative' }}>
      <WorkspaceInputContainer>
        <input
          placeholder="Roboto"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyUp={handleKeyUp}
        />
      </WorkspaceInputContainer>
      {showList && (
        <Fonts>
          {fonts.map(font => (
            <Font>
              <FontName
                key={font}
                onClick={() => {
                  setName(font);
                  setShowList(false);
                }}
              >
                {font}
              </FontName>
            </Font>
          ))}
        </Fonts>
      )}
      <ButtonContainer>
        <Button
          disabled={!isValid}
          block
          small
          onClick={() => {
            setShowList(false);
            addFont(name);
          }}
        >
          Add Font
        </Button>
      </ButtonContainer>
    </div>
  );
};

export default AddVersion;
