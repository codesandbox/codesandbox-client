import React from 'react';
import { render } from '@testing-library/react';
import { Icons } from '../index.ts';

Object.entries(Icons).forEach(([name, Icon]) => {
  describe(`${name}`, () => {
    describe(`valid`, () => {
      it(`renders an svg element`, () => {
        const { container } = render(<Icon />);
        expect(container.firstChild.nodeName).toBe(`svg`);
      });

      it(`включает настраиваемый класс при передаче через свойство 'className'`, () => {
        const { container } = render(<Icon className="custom" />);
        expect(container.firstChild.classList.contains(`custom`)).toBeTruthy();
      });

      it(`имеет значение по умолчанию witdh и height`, () => {
        const { container } = render(<Icon />);
        expect(container.firstChild.getAttribute(`width`)).toEqual(`32`);
        expect(container.firstChild.getAttribute(`height`)).toEqual(`32`);
      });

      it(`масштабирует ширину и высоту, когда опора шкалы установлена на числовое значение`, () => {
        const { container } = render(<Icon scale={2} />);
        expect(container.firstChild.getAttribute(`width`)).toEqual(`64`);
        expect(container.firstChild.getAttribute(`height`)).toEqual(`64`);
      });

      it(`все значки <defs> имеют разные идентификаторы`, () => {
        const { container } = render(<Icon />);
        const ids = Array.from(container.querySelectorAll('[id]')).map(
          element => element.id
        );
        expect(ids.length).toEqual(new Set(ids).size);
      });

      it(`каждый экземпляр значка генерирует уникальные идентификаторы`, () => {
        // визуализировать значок один раз
        const { container: frstContainer } = render(<Icon />);
        const frstIds = Array.from(frstContainer.querySelectorAll('[id]')).map(
          element => element.id
        );

        // визуализировать иконку во второй раз
        const { container: scndContainer } = render(<Icon />);
        const scndIds = Array.from(scndContainer.querySelectorAll('[id]')).map(
          element => element.id
        );

        // поместить все идентификаторы в один массив
        const ids = [...frstIds, ...scndIds];

        // убедитесь, что нет дубликатов
        expect(ids.length).toEqual(new Set(ids).size);
      });
    });
  });
});
