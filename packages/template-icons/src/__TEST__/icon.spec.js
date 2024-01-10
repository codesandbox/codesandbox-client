import React from 'react';
import { render } from '@testing-library/react';
import { Icons } from '../index.ts';

const testIf = (condition, ...args) =>
  condition ? test(...args) : test.skip(...args);

Object.entries(Icons).forEach(([name, Icon]) => {
  describe(`${name}`, () => {
    describe(`valid`, () => {
      it(`renders an svg element`, () => {
        const { container } = render(<Icon />);
        expect(container.firstChild.nodeName).toBe(`svg`);
      });

      it(`includes a custom class when passed in via the 'className' prop`, () => {
        const { container } = render(<Icon className="custom" />);
        expect(container.firstChild.classList.contains(`custom`)).toBeTruthy();
      });

      it(`has default witdh and height`, () => {
        const { container } = render(<Icon />);
        expect(container.firstChild.getAttribute(`width`)).toEqual(`32`);
        expect(container.firstChild.getAttribute(`height`)).toEqual(`32`);
      });

      it(`scales the width and height when the scale prop is set to a numeric value`, () => {
        const { container } = render(<Icon scale={2} />);
        expect(container.firstChild.getAttribute(`width`)).toEqual(`64`);
        expect(container.firstChild.getAttribute(`height`)).toEqual(`64`);
      });

      it(`all icon <defs> have different ids`, () => {
        const { container } = render(<Icon />);
        const ids = Array.from(container.querySelectorAll('[id]')).map(
          element => element.id
        );
        expect(ids.length).toEqual(new Set(ids).size);
      });

      // Because ViteIcon, NextIcon and AstroIcon have linear gradients with
      // ids this will result in the same ids for all the instances.
      // We can skip this test for those icons.
      testIf(
        !['ViteIcon', 'NextIcon', 'AstroIcon'].includes(name),
        `each icon instance generates unique ids`,
        () => {
          // render the icon once
          const { container: frstContainer } = render(<Icon />);
          const frstIds = Array.from(
            frstContainer.querySelectorAll('[id]')
          ).map(element => element.id);

          // render the icon for the 2nd time
          const { container: scndContainer } = render(<Icon />);
          const scndIds = Array.from(
            scndContainer.querySelectorAll('[id]')
          ).map(element => element.id);

          // put all ids into a single array
          const ids = [...frstIds, ...scndIds];

          // make sure there are not duplicates
          expect(ids.length).toEqual(new Set(ids).size);
        }
      );
    });
  });
});
