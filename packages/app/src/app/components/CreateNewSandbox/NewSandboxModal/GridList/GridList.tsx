import React, { cloneElement, Children, useState } from 'react';
import { Group } from 'reakit/Group';
import { useRoverState, Rover } from 'reakit/Rover';
import { Container } from './elements';
import { NextIcon } from '../Icons/Next';

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export const GridList = ({ children, ...props }) => {
  const [numberOfClick, setNumberOfClick] = useState(0);
  const rover = useRoverState();
  const templates = chunk(children, 3);

  const move = () => {
    setNumberOfClick(n => n + 1);
  };

  const back = () => {
    setNumberOfClick(n => n - 1);
  };

  return (
    <Group as={Container} {...props}>
      {numberOfClick > 0 ? (
        <NextIcon
          onClick={back}
          style={{
            position: 'absolute',
            left: '0.5rem',
            transform: 'rotate(180deg)',
            marginTop: 40,
          }}
        />
      ) : null}
      <div
        style={{
          transition: 'transform 200ms ease',
          transform: `translateX(-${50 * numberOfClick}%)`,
          display: 'flex',
        }}
      >
        {templates.map((kids, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            {kids.map((child, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Rover key={idx} {...rover}>
                {itemProps => cloneElement(Children.only(child), itemProps)}
              </Rover>
            ))}
          </div>
        ))}
      </div>
      <NextIcon
        onClick={move}
        style={{ position: 'absolute', right: '0.5rem', marginTop: 40 }}
      />
    </Group>
  );
};
