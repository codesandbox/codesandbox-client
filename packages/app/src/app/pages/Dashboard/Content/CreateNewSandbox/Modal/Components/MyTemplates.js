import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
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
  return (
    data.me && (
      <>
        <Title>My Templates</Title>
        <MyTemplates>
          {data.me.templates.map(template => {
            return (
              <MyTemplate
                onClick={() => history.push(sandboxUrl(template.sandbox))}
              >
                <img
                  height={109}
                  src={template.sandbox.screenshotUrl}
                  alt={template.title}
                />
                <Border color={template.color} />
                <div>
                  <TemplateTitle>{template.title}</TemplateTitle>
                  <TemplateSubTitle>{template.description}</TemplateSubTitle>
                </div>
              </MyTemplate>
            );
          })}
        </MyTemplates>
      </>
    )
  );
};
