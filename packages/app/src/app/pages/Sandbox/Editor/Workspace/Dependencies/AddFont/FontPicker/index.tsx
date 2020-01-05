import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Portal } from 'reakit';

import { SelectedFont } from './elements';
import { FontList } from './List';

type Props = {
  activeFontFamily?: string;
  onChange: (font: string) => void;
};
export const FontPicker: FunctionComponent<Props> = ({
  activeFontFamily = 'Open Sans',
  onChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [style, setStyle] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (ref && ref.current) {
      const styles = ref.current.getBoundingClientRect();
      setStyle({
        x: styles.x,
        y: styles.y,
      });
    }
  }, [ref]);

  const toggleExpanded = () => setExpanded(exp => !exp);

  return (
    <>
      <SelectedFont
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
        ref={ref}
        type="button"
      >
        {activeFontFamily}
      </SelectedFont>

      <Portal>
        {expanded && (
          <div
            style={{
              position: 'fixed',
              zIndex: 11,
              top: style.y + 170,
              left: style.x,
            }}
          >
            <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
              <FontList
                activeFontFamily={activeFontFamily}
                onSelection={font => {
                  onChange(font);

                  setExpanded(false);
                }}
              />
            </OutsideClickHandler>
          </div>
        )}
      </Portal>
    </>
  );
};
