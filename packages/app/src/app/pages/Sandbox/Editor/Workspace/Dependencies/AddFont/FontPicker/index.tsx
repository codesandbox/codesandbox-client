import {
  FontManager,
  Font,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
} from '@samuelmeuli/font-manager';
import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontFamily, SearchFonts, FontLI, List } from './elements';
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

  useEffect(() => {
    if (fontManager) fontManager.setOnChange(onChange);
    // eslint-disable-next-line
  }, [onChange]);

  useEffect(() => {
    if (fontManager) setActiveFontFamily(activeFontFamily);
    // eslint-disable-next-line
  }, [activeFontFamily]);

  const setActiveFontFamily = (active: string): void => {
    fontManager.setActiveFont(active);
  };

  const onSelection = (e): void => {
    const active = e.target.textContent;
    if (!active) {
      throw Error(`Missing font family in clicked font button`);
    }
    setActiveFontFamily(active);
    toggleExpanded();
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const fonts: Font[] =
    fontManager && Array.from(fontManager.getFonts().values());

  return (
    <div
      className={expanded ? 'expanded' : ''}
      id={`font-picker${fontManager && fontManager.selectorSuffix}`}
    >
      <button
        type="button"
        className="dropdown-button"
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
      >
        <p className="dropdown-font-family">{activeFontFamily}</p>
        <p className={`dropdown-icon ${loadingStatus}`} />
      </button>
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
    </div>
  );
};

export default FontPicker;
