import React, { cloneElement, Children, useState } from 'react';
import { Group } from 'reakit/Group';
import { useRoverState, Rover } from 'reakit/Rover';
import {
  Container,
  Arrow,
  CarrouselWrapper,
  Carrousel,
  ArrowButton,
} from './elements';

const chunk = (arr: any[], size: number): any[] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const GridList = ({ children, ...props }) => {
  const [numberOfClick, setNumberOfClick] = useState(0);
  const rover = useRoverState();
  const templates = chunk(children, 3);

  const move = (n: number) => {
    setNumberOfClick(numberOfClicks => numberOfClicks + n);
  };

  return (
    <Group as={Container} {...props}>
      {numberOfClick > 0 ? (
        <ArrowButton
          type="button"
          aria-label="Next Templates"
          onClick={() => move(-1)}
        >
          <Arrow />
        </ArrowButton>
      ) : null}
      <Carrousel number={numberOfClick}>
        {templates.map((kids: any[], i: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <CarrouselWrapper key={i}>
            {kids.map((child: any[], idx: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Rover key={idx} {...rover}>
                {itemProps => cloneElement(Children.only(child), itemProps)}
              </Rover>
            ))}
          </CarrouselWrapper>
        ))}
      </Carrousel>
      {templates.length > 2 && templates.length - 2 !== numberOfClick && (
        <ArrowButton
          type="button"
          aria-label="Next Templates"
          onClick={() => move(1)}
          next
        >
          <Arrow next />
        </ArrowButton>
      )}
    </Group>
  );
};
