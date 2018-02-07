import React from 'react';
import styled, { css } from 'styled-components';

import MaxWidth from 'common/components/flex/MaxWidth';
import Column from 'common/components/flex/Column';
import Centered from 'common/components/flex/Centered';
import Padding from 'common/components/spacing/Padding';

import theme from 'common/theme';

import LoadInView from '../../../components/LoadInView';
import RollingText from '../../../components/RollingText';

import { Heading3 } from '../../../components/headings';

import FileType, {
  js,
  ts,
  scss,
  sass,
  less,
  stylus,
  image,
  html,
  cssGlobal,
  vue,
} from './icons';

import media from '../../../utils/media';

const Container = styled.div`
  transition: 0.3s ease box-shadow;
  border-radius: 2px;

  background-color: ${({ theme }) => theme.background};

  box-shadow: 0 3px 200px ${({ color }) => color.clearer(0.8)};

  display: flex;
  flex-direction: row;
  height: 255px;
  flex: 1;

  ${media.tablet`
    margin-top: 1rem;
    height: 320px;
  `};

  ${media.phone`
    margin-top: 1rem;
    height: 280px;
  `};
`;

const Pane = styled(MaxWidth)`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.4;
  border-radius: 4px;

  margin-top: 4rem;
  margin-bottom: 8rem;

  z-index: 2;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  ${media.phone`
    flex-direction: column;
  `};
`;

const Intro = styled(Column)`
  flex: 1;

  ${media.phone`
    order: -1;
  `};
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  margin-bottom: 4rem;
  flex: 1;
  min-width: 100%;

  ${media.phone`
    margin: 2rem 0;
  `};
`;

const IconContainer = styled.div`
  transition: 0.3s ease background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: 128px;
  height: 128px;

  ${media.phone`
    width: 96px;
    height: 96px;

    svg {
      width: 60px;
      height: 60px;
    }
  `};

  border-radius: 2px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  ${({ selected, template }) =>
    selected &&
    css`
      background-color: ${template.color.clearer(0.9)};

      &:hover {
        background-color: ${template.color.clearer(0.9)};
      }
    `};
`;

const TemplateName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-weight: 300;
  font-size: 2rem;
  padding: 2rem;
  border-radius: 2px;

  color: white;

  svg {
    display: block;
  }

  h4 {
    margin-bottom: 0;
    margin-top: 1rem;
    font-weight: 200;
    font-size: 2rem;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
  margin-top: 1rem;
`;

const TemplateIcons = styled.div`
  display: flex;

  font-size: 0.875rem;
  color: white;
  width: 100%;
  flex-wrap: wrap;

  > div {
    width: 25%;
    box-sizing: border-box;
    margin-top: 0.5rem;

    ${media.tablet`
      width: 50%;
    `};
  }
`;

const CSSTypes = styled.div`
  font-size: 0.875rem;
  color: white;
  margin-top: 0.5rem;
`;

const TEMPLATE_SUPPORT = {
  'create-react-app': {
    loaders: [js, ts, html, cssGlobal, image],
    css: ['Global'],
  },
  'vue-cli': {
    loaders: [js, ts, html, vue, scss, sass, less, stylus, cssGlobal, image],
    css: ['Global', 'Scoped', 'Modules'],
  },
  'preact-cli': {
    loaders: [js, html, scss, sass, less, cssGlobal, stylus, image],
    css: ['Global', 'Modules'],
  },
  svelte: { loaders: [js, html, image], css: ['Global', 'Scoped', 'Modules'] },
  'angular-cli': {
    loaders: [ts, html, scss, sass, less, stylus, cssGlobal, image],
    css: ['Global', 'Scoped'],
  },
};

export default class Frameworks extends React.Component {
  state = { templateIndex: 0 };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.templateIndex !== this.state.templateIndex;
  }

  setTemplate = template => {
    this.setState({ templateIndex: this.props.templates.indexOf(template) });
  };

  render() {
    const { templates } = this.props;
    const template = templates[this.state.templateIndex];

    return (
      <Pane width={1280}>
        <Flex>
          <Icons>
            {templates.map(({ Icon }, i) => (
              <IconContainer
                key={i}
                selected={templates[i] === template}
                template={templates[i]}
                onClick={() => {
                  this.setTemplate(templates[i]);
                }}
              >
                <Icon width={80} height={80} />
              </IconContainer>
            ))}
          </Icons>

          <Intro style={{ marginRight: '2rem' }}>
            <Heading3>Tailored for web applications</Heading3>
            <p>
              We know how overwhelming JavaScript development can be. With
              CodeSandbox we specifically focus on web application development
              to make the experience as smooth as possible. Just open your
              browser and start coding.
            </p>
          </Intro>

          <Container color={template.color}>
            <RollingText
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
              }}
              updateCheck={template}
            >
              <TemplateName color={template.color}>
                <template.Icon width={96} height={96} />
                <h4>{template.niceName}</h4>
              </TemplateName>
            </RollingText>
            <Padding style={{ width: '100%' }} top={1}>
              <HeaderTitle>Supported Loaders</HeaderTitle>
              <TemplateIcons color={template.color}>
                {TEMPLATE_SUPPORT[template.name].loaders.map((data, i) => (
                  <FileType
                    key={template.name + data.title}
                    iconSrc={data.svg}
                    title={data.title}
                    extension={data.extension}
                    i={i}
                  />
                ))}
              </TemplateIcons>

              <HeaderTitle>CSS Scoping Support</HeaderTitle>
              <CSSTypes>
                {TEMPLATE_SUPPORT[template.name].css.join(', ')}
              </CSSTypes>
            </Padding>
          </Container>
        </Flex>

        <Centered horizontal>
          <LoadInView style={{ height: 650 }}>
            <iframe
              src={`https://codesandbox.io/embed/${
                template.shortid
              }?fontsize=14`}
              style={{
                borderRadius: 4,
                width: '100%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                border: 'none',
                marginTop: '5rem',
                backgroundColor: theme.background2(),
              }}
              height={650}
              title="sandbox"
            />
          </LoadInView>
        </Centered>
      </Pane>
    );
  }
}
