import React, { useState, useEffect, useRef } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Portal } from 'reakit';
import { SelectedFont } from './elements';
import { FontList } from './List';

export const FontPicker = ({ activeFontFamily = 'Open Sans', onChange }) => {
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
        ref={ref}
        type="button"
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
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
                onSelection={font => {
                  onChange(font);
                  setExpanded(false);
                }}
                activeFontFamily={activeFontFamily}
              />
            </OutsideClickHandler>
          </div>
        )}
      </Portal>
    </>
  );
};
