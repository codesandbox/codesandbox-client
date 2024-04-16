import { Element, Stack } from '@codesandbox/components';
import styled from 'styled-components';
import React from 'react';
import {
  GUTTER,
  ITEM_HEIGHT_GRID,
  ITEM_MIN_WIDTH,
} from '../VariableGrid/constants';
import { EmptyPage } from '../EmptyPage';

export const StyledWrapper = styled(Element)`
  position: relative;
  overflow: hidden;
`;

export const StyledInvisibleGrid = styled(EmptyPage.StyledGrid)`
  position: absolute;
  width: 100%;
  height: 0;
  visibility: hidden;
`;

export const StyledCarousel = styled(Stack)`
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-x: scroll;
  white-space: nowrap;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  display: flex;
  gap: ${GUTTER}px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  > * {
    scroll-snap-align: start;
    white-space: nowrap;
  }
`;

export type CarouselItem = {
  id: string;
  Component: React.FunctionComponent;
  props: Record<string, unknown>;
};

type CarouselProps = {
  items: CarouselItem[];
};

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const gridItemRef = React.useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = React.useState(ITEM_MIN_WIDTH);

  React.useEffect(() => {
    const onResize = () => {
      setColumnWidth(gridItemRef?.current?.offsetWidth);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <StyledWrapper>
      {/* Invisible grid to reference the width */}
      <StyledInvisibleGrid>
        <Element
          css={{
            width: '100%',
          }}
          ref={gridItemRef}
        />
      </StyledInvisibleGrid>
      {/* Carousel to render items with horizontal scroll */}
      <StyledCarousel as="ul" css={{ listStyle: 'none' }}>
        {items.map(({ id, Component, props }) => {
          return (
            <Element key={id} as="li">
              <Element
                style={{
                  width: `${columnWidth}px`,
                  height: `${ITEM_HEIGHT_GRID}px`,
                  whiteSpace: 'normal',
                }}
              >
                <Component {...props} />
              </Element>
            </Element>
          );
        })}
      </StyledCarousel>
    </StyledWrapper>
  );
};
