import React, { useEffect } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { InfiniteHitsProvided } from 'react-instantsearch-core';
import { AlgoliaSandboxHit } from '@codesandbox/common/lib/types/algolia';
import { TemplateFragment } from 'app/graphql/types';
import { TemplateGrid } from '../elements';
import { TemplateCard } from '../TemplateCard';

type ResultsProps = InfiniteHitsProvided<AlgoliaSandboxHit> & {
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
};

const Results = (props: ResultsProps) => {
  const { hits } = props;
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
    sandbox: {
      id: hit.objectID,
      alias: hit.alias,
      title: hit.title,
      description: hit.description,
      insertedAt: new Date(hit.inserted_at).toString(),
      updatedAt: new Date(hit.updated_at).toString(),
      author: hit.author,
      isV2: false,
      source: {
        template: hit.template,
      },
      collection: {
        team: hit.team,
      },
    },
  }));

  return (
    <TemplateGrid>
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelectTemplate={props.onSelectTemplate}
          onOpenTemplate={props.onOpenTemplate}
        />
      ))}
      <div
        style={{ minHeight: 130, width: 1, backgroundColor: 'transparent' }}
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
