import React, { FunctionComponent, useState, useMemo } from 'react';
import { List, SearchFonts, FontLI, FontFamily, Arrow } from './elements';
import { fonts } from './fonts';

type Props = {
  onSelection: (e: any) => void;
  activeFontFamily: string;
};

export const FontList: FunctionComponent<Props> = ({
  onSelection,
  activeFontFamily,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearch = (e: any) => setSearchTerm(e.target.value);

  const getFonts: string[] = useMemo(
    () =>
      fonts.filter(f =>
        f.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [searchTerm]
  );
  return (
    <>
      <Arrow />
      <List>
        <SearchFonts
          type="text"
          value={searchTerm}
          onChange={updateSearch}
          placeholder="Search Typefaces"
        />
        {getFonts.map((font: string) => (
          <FontLI
            key={font}
            onClick={() => onSelection(font)}
            onKeyPress={() => onSelection(font)}
          >
            <FontFamily type="button" active={font === activeFontFamily}>
              {font}
            </FontFamily>
          </FontLI>
        ))}
      </List>
    </>
  );
};
