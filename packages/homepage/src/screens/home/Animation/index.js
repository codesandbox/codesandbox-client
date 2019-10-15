import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Relative from '@codesandbox/common/lib/components/Relative';

import {
  angular,
  vue,
  react,
  parcel,
  gatsby,
  nuxt,
  next,
} from '@codesandbox/common/lib/templates';

import Background from './Background';
import HomeTitle from './Title';
import Cubes from './Cubes';
import Frameworks from '../Frameworks';

import getScrollPos from '../../../utils/scroll';
import { useMatchMedia } from '../../../hooks';
import media from '../../../utils/media';

const Container = styled(Centered)`
  position: relative;
  width: 100%;
  height: 100vh;
  flex: auto;
  flex-direction: row;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;

  ${media.tablet`
  display: block;
  flex-direction: column;
  margin-top: 6rem;
  margin-bottom: 8rem;

  height: initial;
`};
`;

const Message = styled.h2`
  text-align: center;
  font-weight: 200;

  color: white;
  font-size: 2.5rem;
  max-width: 1000px;
  line-height: 1.2;
  margin-bottom: 3rem;
  margin-top: 3rem;
  margin-right: 2rem;
  margin-left: 2rem;

  ${media.phone`
  font-size: 1.25rem;
`};
`;

const TEMPLATES = [parcel, react, vue, angular, gatsby, nuxt, next];

const Animation = () => {
  const templates = TEMPLATES.filter(tem => tem.showOnHomePage && tem.showCube);
  const reduceAnimation = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [templateIndex, setTemplateIndex] = React.useState(0);
  const [templateSelected, setTemplateSelected] = React.useState(false);
  const canvas = React.useRef();

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!templateSelected) {
        // @ts-ignore
        if (!window.scrolling && getScrollPos().y < window.innerHeight) {
          setTemplateIndex(index => (index + 1) % templates.length);
        }
      }
    }, 6000);

    return () => clearTimeout(id);
  }, [templateSelected, templates.length]);

  const setCanvas = canvasToSet => {
    canvas.current = canvasToSet;
  };

  const selectTemplate = template => {
    setTemplateIndex(templates.indexOf(template));
    setTemplateSelected(true);
  };

  const template = templates[templateIndex];

  return (
    <Relative>
      <Fullscreen>
        <Background
          templateIndex={templateIndex}
          template={template}
          setCanvas={setCanvas}
        />
        <Container horizontal>
          <HomeTitle template={template} />
          {!reduceAnimation && (
            <Media query="(min-width: 1280px)">
              <Cubes
                canvas={canvas.current}
                templates={templates}
                template={template}
                setTemplate={selectTemplate}
                reduceAnimation={reduceAnimation}
              />
            </Media>
          )}
        </Container>
      </Fullscreen>
      <Centered horizontal>
        <Message>
          CodeSandbox is an online editor that helps you create web
          applications, from prototype to deployment.
        </Message>
      </Centered>
      <Frameworks templates={TEMPLATES.filter(tem => tem.showOnHomePage)} />
    </Relative>
  );
};

export default React.memo(Animation);
