import React, { useEffect } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { InfiniteHitsProvided } from 'react-instantsearch-core';
import { AlgoliaSandboxHit } from '@codesandbox/common/lib/types/algolia';
import { TemplateFragment } from 'app/graphql/types';
import { TemplateGrid } from '../elements';
import { TemplateCard } from '../TemplateCard';

type ResultsProps = InfiniteHitsProvided<AlgoliaSandboxHit> & {
  disableTemplates?: boolean;
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
  officialTemplates: TemplateFragment[];
};

const Results = (props: ResultsProps) => {
  const { disableTemplates, hits } = props;
  const bottomDetectionEl = React.useRef<HTMLDivElement>();

  useEffect(() => {
    let observer: IntersectionObserver;
    const onSentinelIntersection = (entries: IntersectionObserverEntry[]) => {
      const { hasMore, refineNext } = props;

      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore) {
          refineNext();
        }
      });
    };

    if (bottomDetectionEl.current) {
      observer = new IntersectionObserver(onSentinelIntersection);
      observer.observe(bottomDetectionEl.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [props]);

  const templates = hits.map(hit => ({
    id: hit.custom_template.id,
    color: hit.custom_template.color,
    iconUrl: hit.custom_template.icon_url,
    published: hit.custom_template.published,
    forks: hit.fork_count,
    sandbox: {
      id: hit.objectID,
      alias: hit.alias,
      title: hit.title,
      description: hit.description,
      insertedAt: new Date(hit.inserted_at).toString(),
      updatedAt: new Date(hit.updated_at).toString(),
      author: hit.author,
      isV2: hit.custom_template.v2,
      source: {
        template: hit.template,
      },
      team: hit.team,
    },
  }));

  return (
    <TemplateGrid>
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          disabled={disableTemplates}
          template={template}
          onSelectTemplate={props.onSelectTemplate}
          onOpenTemplate={props.onOpenTemplate}
          forks={template.forks}
          isOfficial={props.officialTemplates.some(t => t.id === template.id)}
        />
      ))}
      <div
        style={{ minHeight: 105, width: 1, backgroundColor: 'transparent' }}
        ref={bottomDetectionEl}
        id="bottom-detection-element"
      />
    </TemplateGrid>
  );
};

export const SearchResultList = connectInfiniteHits<
  ResultsProps,
  AlgoliaSandboxHit
>(Results);
