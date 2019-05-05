import React, { useState } from 'react';
import AngularLogo from '@codesandbox/common/lib/components/logos/Angular';
import ReactLogo from '@codesandbox/common/lib/components/logos/React';
import VueLogo from '@codesandbox/common/lib/components/logos/Vue';
import PreactLogo from '@codesandbox/common/lib/components/logos/Preact';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import LoadInView from '../../../components/LoadInView';

import {
  Title,
  Grid,
  TemplateTitle,
  Icons,
  TagLine,
  TemplateName,
  IconContainer,
} from './elements';

const templates = [
  {
    name: 'React',
    link: 'new',
    logo: ReactLogo,
  },
  {
    name: 'Vue',
    link: 'vue',
    logo: VueLogo,
  },

  {
    name: 'Angular',
    link: 'angular',
    logo: AngularLogo,
  },
  {
    name: 'Preact',
    link: 'preact',
    logo: PreactLogo,
  },
];

export default () => {
  const [templateIndex, setTemplateIndex] = useState(0);

  const setTemplate = template => {
    setTemplateIndex(templates.indexOf(template));
  };

  return (
    <MaxWidth width={1440}>
      <Title>
        An Editor for <span>Web.</span>
      </Title>
      <TagLine>
        CodeSandbox is tailored for web projects. Start editing to use{' '}
        {templates[templateIndex].name}.
      </TagLine>
      <Grid>
        <section>
          <LoadInView style={{ height: 650 }}>
            <iframe
              src={`https://codesandbox.io/embed/${
                templates[templateIndex].link
              }?fontsize=14`}
              style={{
                borderRadius: 4,
                width: '100%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                border: 'none',
              }}
              height={650}
              title="sandbox"
            />
          </LoadInView>
        </section>
        <Icons>
          <TemplateTitle>Templates</TemplateTitle>
          {templates.map(template => (
            <IconContainer
              aria-label={template.name}
              selected={templates.indexOf(template) === templateIndex}
              onClick={() => setTemplate(template)}
            >
              {template.logo({
                width: 35,
              })}
              <TemplateName>{template.name}</TemplateName>
            </IconContainer>
          ))}
        </Icons>
      </Grid>
    </MaxWidth>
  );
};
