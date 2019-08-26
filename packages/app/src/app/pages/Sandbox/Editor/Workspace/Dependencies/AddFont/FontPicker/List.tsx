import React, { useState } from 'react';
import { Font } from '@samuelmeuli/font-manager';
import { List, SearchFonts, FontLI, FontFamily } from './elements';

function getFontId(fontFamily: string): string {
  return fontFamily.replace(/\s+/g, '-').toLowerCase();
}

type Props = {
  fonts: Font[];
  onSelection: (e: any) => void;
  activeFontFamily: string;
  expanded: boolean;
  suffix: string;
};

const FontList = ({
  fonts,
  onSelection,
  activeFontFamily,
  expanded,
  suffix,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearch = e => setSearchTerm(e.target.value);
  return (
    <List expanded={expanded}>
      <SearchFonts
        type="text"
        value={searchTerm}
        onChange={updateSearch}
        placeholder="Search Typefaces"
      />
      {fonts
        .filter(f =>
          f.family.toLowerCase().includes(searchTerm.trim().toLowerCase())
        )
        .map(font => {
          const isActive = font.family === activeFontFamily;
          const fontId = getFontId(font.family);
          return (
            <FontLI key={fontId}>
              <FontFamily
                type="button"
                id={`font-button-${fontId}${suffix}`}
                className={`font-button ${isActive ? 'active-font' : ''}`}
                onClick={onSelection}
                onKeyPress={onSelection}
              >
                {font.family}
              </FontFamily>
            </FontLI>
          );
        })}
    </List>
  );
};

export default FontList;
