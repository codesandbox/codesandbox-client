import React, { useState, useMemo } from 'react';
import { Font } from '@samuelmeuli/font-manager';
import { List, SearchFonts, FontLI, FontFamily } from './elements';

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

  const updateSearch = (e: any) => setSearchTerm(e.target.value);

  const getFontId = (fontFamily: string): string =>
    fontFamily.replace(/\s+/g, '-').toLowerCase();

  const getFonts: Font[] = useMemo(
    () =>
      fonts.filter(f =>
        f.family.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [fonts, searchTerm]
  );
  return (
    <List expanded={expanded}>
      <SearchFonts
        type="text"
        value={searchTerm}
        onChange={updateSearch}
        placeholder="Search Typefaces"
      />
      {getFonts.map((font: Font) => (
        <FontLI key={font.family}>
          <FontFamily
            type="button"
            id={`font-button-${getFontId(font.family)}${suffix}`}
            active={font.family === activeFontFamily}
            onClick={onSelection}
            onKeyPress={onSelection}
          >
            {font.family}
          </FontFamily>
        </FontLI>
      ))}
    </List>
  );
};

export default FontList;
