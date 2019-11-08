import React, { useEffect } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { InfiniteHitsProvided } from 'react-instantsearch-core';
import { AlgoliaSandboxHit } from '@codesandbox/common/lib/types/algolia';
import { TemplateType } from '@codesandbox/common/lib/templates';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { SandboxCard } from '../../SandboxCard';
import { Grid } from '../../elements';

type ResultsProps = InfiniteHitsProvided<AlgoliaSandboxHit> & {};

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

  return (
    <>
      <Grid columnCount={2}>
        {hits.map(hit => (
          <SandboxCard
            key={hit.objectID}
            title={hit.title || hit.alias || hit.objectID}
            iconUrl={hit.custom_template.icon_url}
            environment={hit.template as TemplateType}
            owner={hit.team ? hit.team.name : hit.author.username}
            url={sandboxUrl({
              id: hit.objectID,
              alias: hit.alias,
              git: hit.git
                ? {
                    repo: hit.git.repo,
                    username: hit.git.username,
                    path: hit.git.path,
                    branch: hit.git.branch,
                    commitSha: hit.git.commit_sha,
                  }
                : null,
            })}
            official={false}
            color={hit.custom_template.color}
            mine={false} // TODO
            templateId={hit.template}
            sandboxId={hit.objectID}
          />
        ))}
      </Grid>

      <div
        style={{ height: 10, width: 1, backgroundColor: 'transparent' }}
        ref={bottomDetectionEl}
        id="bottom-detection-element"
      />
    </>
  );
};

export const ExploreResults = connectInfiniteHits(Results);
