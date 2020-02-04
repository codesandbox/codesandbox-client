import React from 'react';

import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { DevToolProps, IViews } from '..';
import { Container } from './elements';

type Options = {
  viewId: string;
  availableViews: IViews;
};

type Props = DevToolProps & { options: Options };

const ViewNotFound: React.FC<Props> = (props: Props) => {
  const { hidden } = props;
  const { viewId, availableViews } = props.options as Options;

  if (hidden) {
    return null;
  }

  return (
    <Container>
      <Title>View {`"${viewId}"`} not found.</Title>
      <SubTitle>The available views is:</SubTitle>
      <ul>
        {Object.values(availableViews).map(v => (
          <li>
            {v.title} ({v.id})
          </li>
        ))}
      </ul>
    </Container>
  );
};

export const viewNotFound = (viewId: string, availableViews: IViews) => ({
  id: 'codesandbox.view-not-found',
  title: `Unknown View "${viewId}"`,
  Content: (props: DevToolProps) => (
    <ViewNotFound {...props} options={{ viewId, availableViews }} />
  ),
  actions: [],
});
