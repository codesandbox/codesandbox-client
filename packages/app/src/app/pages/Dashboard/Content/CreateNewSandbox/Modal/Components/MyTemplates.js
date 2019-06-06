import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Tags from '@codesandbox/common/lib/components/Tags';
import {
  Overlay,
  SandboxDescription,
} from '@codesandbox/common/lib/components/SandboxCard/elements';
import history from 'app/utils/history';
import { useQuery } from '@apollo/react-hooks';
import {
  Border,
  TemplateTitle,
  TemplateSubTitle,
  MyTemplates,
  MyTemplate,
  Title,
} from '../elements';
import { LIST_TEMPLATES } from '../../../../queries';

export default () => {
  const { data } = useQuery(LIST_TEMPLATES);

  if (data.me && !data.me.templates.length) return null;

  return (
    <>
      <Title>My Templates</Title>
      <MyTemplates>
        {data.me
          ? data.me.templates.map(template => {
              return (
                <MyTemplate
                  onClick={() => history.push(sandboxUrl(template.sandbox))}
                >
                  <img
                    height="109px"
                    src={
                      template.sandbox.screenshotUrl ||
                      'https://codesandbox.io/static/img/banner.png'
                    }
                    alt={template.title}
                  />
                  <Overlay>
                    <SandboxDescription>
                      {template.description}
                    </SandboxDescription>
                    {template.sandbox.tags && (
                      <Tags tags={template.sandbox.tags} />
                    )}
                  </Overlay>
                  <Border color={template.color} />
                  <div>
                    <TemplateTitle>{template.title}</TemplateTitle>
                    <TemplateSubTitle>{template.description}</TemplateSubTitle>
                  </div>
                </MyTemplate>
              );
            })
          : new Array(3).fill({}).map(() => (
              <MyTemplate>
                <img
                  height="109px"
                  alt="loading"
                  src="https://codesandbox.io/static/img/banner.png"
                />
                <Border />
                <div>
                  <TemplateTitle>Loading</TemplateTitle>
                </div>
              </MyTemplate>
            ))}
      </MyTemplates>
    </>
  );
};
