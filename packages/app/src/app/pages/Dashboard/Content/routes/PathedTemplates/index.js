import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { uniq } from 'lodash-es';
import Loading from 'app/components/Loading';

import Sandboxes from '../../Sandboxes';
import Navigation from './Navigation';
import { LIST_TEMPLATES } from '../../../queries';

const PathedTemplates = props => {
  const path = '/' + (props.match.params.path || '');
  const { loading, error, data } = useQuery(LIST_TEMPLATES);

  document.title = `Templates - CodeSandbox`;

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  if (loading) {
    return <Loading />;
  }

  const possibleTemplates = data.me.templates.length
    ? uniq(data.me.templates.map(x => x.sandbox.source.template))
    : [];

  const sandboxes = data.me.templates.map(t => ({
    ...t.sandbox,
    title: t.title,
    description: t.description,
    color: t.color,
  }));

  return (
    <Sandboxes
      hideOrder
      hideFilters
      isLoading={loading}
      possibleTemplates={possibleTemplates}
      Header={<Navigation path={path} />}
      sandboxes={sandboxes}
    />
  );
};

export default PathedTemplates;
