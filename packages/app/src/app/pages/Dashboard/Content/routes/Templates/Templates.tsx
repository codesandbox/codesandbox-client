import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { observer } from 'mobx-react-lite';
import Loading from 'app/components/Loading';
import { useStore } from 'app/store';
import Sandboxes from '../../Sandboxes';
import { LIST_TEMPLATES } from '../../../queries';
import { Navigation } from './Navigation';
import { IMatch } from './types';

export const Templates = observer(
  // TODO: Replace with RouteComponentProps from react-router-dom
  ({ match }: { match: IMatch }) => {
    const { dashboard } = useStore();
    const { loading, error, data } = useQuery(LIST_TEMPLATES);

    useEffect(() => {
      document.title = `Templates - CodeSandbox`;
    }, []);

    if (error) {
      console.error(error);
      return <div>Error!</div>;
    }

    if (loading) {
      return <Loading />;
    }

    const possibleTemplates = data.me.templates.length
      ? [
          ...new Set(
            data.me.templates.map(
              ({
                sandbox: {
                  source: { template },
                },
              }) => template
            )
          ),
        ]
      : [];

    const sandboxes = data.me.templates.map(
      ({ sandbox, title, description, color }) => ({
        ...sandbox,
        title,
        description,
        color,
      })
    );

    return (
      <Sandboxes
        isLoading={loading}
        possibleTemplates={possibleTemplates}
        Header={<Navigation teamId={match.params.teamId} />}
        sandboxes={dashboard.getFilteredSandboxes(sandboxes)}
      />
    );
  }
);
