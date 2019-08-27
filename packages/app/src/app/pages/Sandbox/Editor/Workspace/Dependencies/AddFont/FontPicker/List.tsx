import React, { FunctionComponent, useState, useMemo } from 'react';
import { Font } from '@samuelmeuli/font-manager';
import { List, SearchFonts, FontLI, FontFamily, Arrow } from './elements';

type Props = {
  fonts: Font[];
  onSelection: (e: any) => void;
  activeFontFamily: string;
  expanded: boolean;
};

export const FontList: FunctionComponent<Props> = ({
  fonts,
  onSelection,
  activeFontFamily,
  expanded,
}) => {
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
    <>
      <Arrow />
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
              id={`font-button-${getFontId(font.family)}`}
              active={font.family === activeFontFamily}
              onClick={onSelection}
              onKeyPress={onSelection}
            >
              {font.family}
            </FontFamily>
          </FontLI>
        ))}
      </List>
    </>
  );
};
