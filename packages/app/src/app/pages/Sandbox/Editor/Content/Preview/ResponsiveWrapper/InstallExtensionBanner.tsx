import { useOvermind } from 'app/overmind';
import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div({
  position: 'absolute',
  height: 35,
  left: 0,
  top: 0,
  transition: 'top 0.5s ease-in',
  width: '100%',
  backgroundColor: 'red',
  zIndex: 3,
});

const ADDRESSBAR_HEIGHT = 35;
const RESPONSIVE_BAR_HEIGHT = 42;

export const InstallExtensionBanner = () => {
  const [isShowing, setShowing] = React.useState(false);
  const { state, actions } = useOvermind();

  React.useEffect(() => {
    setShowing(true);
  }, []);

  const isResponsive =
    state.preview.mode === 'responsive' ||
    state.preview.mode === 'responsive-add-comment';

  return (
    <Wrapper
      style={{
        top: isShowing
          ? isResponsive
            ? ADDRESSBAR_HEIGHT + RESPONSIVE_BAR_HEIGHT
            : ADDRESSBAR_HEIGHT
          : 0,
      }}
    >
      Get a better experience
      <button
        type="button"
        onClick={() => {
          actions.preview.installExtension();
        }}
      >
        install
      </button>
    </Wrapper>
  );
};
