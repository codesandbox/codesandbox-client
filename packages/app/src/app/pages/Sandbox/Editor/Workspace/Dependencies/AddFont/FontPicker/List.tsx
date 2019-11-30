import React, {
  ChangeEvent,
  FunctionComponent,
  useMemo,
  useState,
} from 'react';

import { List, SearchFonts, FontLI, FontFamily, Arrow } from './elements';
import { fonts } from './fonts';

type Props = {
  activeFontFamily: string;
  onSelection: (font: string) => void;
};
export const FontList: FunctionComponent<Props> = ({
  activeFontFamily,
  onSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getFonts = useMemo(
    () =>
      fonts
        .slice(0, 200)
        .filter(font =>
          font.toLowerCase().includes(searchTerm.trim().toLowerCase())
        ),
    [searchTerm]
  );

  const updateSearch = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(value);

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

        {getFonts.map(font => (
          <FontLI
            key={font}
            onClick={() => onSelection(font)}
            onKeyPress={() => onSelection(font)}
          >
            <FontFamily active={font === activeFontFamily} type="button">
              {font}
            </FontFamily>
          </FontLI>
        ))}
      </List>
    </>
  );
};
