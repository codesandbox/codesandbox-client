import {
  FontManager,
  Font,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
} from '@samuelmeuli/font-manager';
import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { SelectedFont } from './elements';
import FontList from './List';

export const FontPicker = ({
  activeFontFamily = FONT_FAMILY_DEFAULT,
  onChange,
  apiKey,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [fontManager, setFontManager] = useState();

  useEffect(() => {
    const manager = new FontManager(
      apiKey,
      activeFontFamily,
      { ...OPTIONS_DEFAULTS, limit: 800 },
      onChange
    );
    setFontManager(manager);

    manager
      .init()
      .then(() => setLoadingStatus('finished'))
      .catch((err: Error) => {
        setLoadingStatus('error');
        console.error(err);
      });
    // eslint-disable-next-line
  }, []);

  const onSelection = (e: any): void => {
    const active = e.target.textContent;
    if (!active) {
      throw Error(`Missing font family in clicked font button`);
    }
    fontManager.setActiveFont(active);
    toggleExpanded();
  };

  const toggleExpanded = () => setExpanded(exp => !exp);

  const fonts: Font[] =
    fontManager && Array.from(fontManager.getFonts().values());

  console.log(fontManager.selectorSuffix);

  return (
    // id={`font-picker${fontManager && fontManager.selectorSuffix}`}

    <>
      <SelectedFont
        type="button"
        done={loadingStatus === 'finished'}
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
        disabled={loadingStatus === 'loading'}
      >
        {loadingStatus === 'loading' ? 'Loading Typefaces' : activeFontFamily}
      </SelectedFont>
      {loadingStatus === 'finished' && (
        <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
          <FontList
            fonts={fonts}
            onSelection={onSelection}
            activeFontFamily={activeFontFamily}
            expanded={expanded}
            suffix={fontManager.selectorSuffix}
          />
        </OutsideClickHandler>
      )}
    </>
  );
};

export default FontPicker;
