import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { LIST_TEMPLATES } from '../../queries';
import { SandboxCard } from '../SandboxCard';
import { GridList } from '../GridList';
import { Header } from '../elements';
import { SubHeader } from './elements';
import { all } from '../availableTemplates';

// Would be good to actually have this interface filled out
// Would be better if we could generate types from our GraphQL server
interface ListTemplatesResponse {
  me?: any;
}

export const Create = () => {
  const { data = {} } = useQuery<ListTemplatesResponse>(LIST_TEMPLATES, {
    variables: { showAll: true },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <Header>
        <span>Create Sandbox</span>
      </Header>
      <SubHeader>My Templates</SubHeader>
      {data.me && data.me.templates.length ? (
        <GridList>
          {data.me.templates.map((template, i) => (
            <SandboxCard
              key={template.niceName}
              template={template}
              // onClick={() => {
              //   if (selectTemplate) {
              //     selectTemplate({ shortid: template.sandbox.id });
              //   } else {
              //     history.push(sandboxUrl(template.sandbox));
              //   }
              // }}
            />
          ))}
        </GridList>
      ) : null}
      <SubHeader>Official Templates</SubHeader>
      <GridList aria-label="Official Templates">
        {all.map(template => (
          <SandboxCard official key={template.niceName} template={template} />
        ))}
      </GridList>
    </>
  );
};
