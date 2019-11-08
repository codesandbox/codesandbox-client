import React from 'react';
import { TemplateFragment } from 'app/graphql/types';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { useKey } from 'react-use';
import history from 'app/utils/history';
import { isMac } from '@codesandbox/common/lib/utils/platform';
import { SandboxCard } from '../SandboxCard';
import { SubHeader, Grid } from '../elements';

export interface ITemplateInfo {
  title: string;
  key: string;
  templates: TemplateFragment[];
}

interface ITemplateListProps {
  templateInfos: ITemplateInfo[];
}

const COLUMN_COUNT = 2;
const MODIFIER_KEY = isMac ? '⌘' : '⇧';

const getNumber = (e: KeyboardEvent): number => {
  if (e.code && e.code.startsWith('Digit')) {
    return parseInt(e.code.replace('Digit', ''), 10);
  }

  return NaN;
};

export const TemplateList = ({ templateInfos }: ITemplateListProps) => {
  const { state, actions } = useOvermind();
  const [focusedTemplateIndex, setFocusedTemplate] = React.useState(0);

  const openSandbox = (
    sandbox: TemplateFragment['sandbox'],
    openNewWindow = false
  ) => {
    const url = sandboxUrl(sandbox);
    if (openNewWindow === true) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }

    return actions.modalClosed();
  };

  const getTemplateInfoByIndex = (index: number) => {
    let count = 0;
    let i = 0;
    while (index >= count && i < templateInfos.length) {
      count += templateInfos[i].templates.length;
      i++;
    }
    return {
      templateInfo: templateInfos[i - 1],
      offset: count - templateInfos[i - 1].templates.length,
    };
  };

  const getTemplateByIndex = (index: number) => {
    const { templateInfo, offset } = getTemplateInfoByIndex(index);

    const indexInTemplateInfo = index - offset;
    return templateInfo.templates[indexInTemplateInfo];
  };

  /**
   * Ensures that the next set is in bound of 0 and the max template count
   */
  const safeSetFocusedTemplate = (setter: (newPos: number) => number) => {
    const totalCount = templateInfos.reduce(
      (total, templateInfo) => total + templateInfo.templates.length,
      0
    );

    return setFocusedTemplate(i =>
      Math.max(0, Math.min(setter(i), totalCount - 1))
    );
  };

  useKey('ArrowRight', evt => {
    evt.preventDefault();
    safeSetFocusedTemplate(i => i + 1);
  });

  useKey('ArrowLeft', evt => {
    evt.preventDefault();
    safeSetFocusedTemplate(i => i - 1);
  });

  useKey(
    'ArrowDown',
    evt => {
      evt.preventDefault();
      const { templateInfo } = getTemplateInfoByIndex(focusedTemplateIndex);

      safeSetFocusedTemplate(
        i => i + Math.min(COLUMN_COUNT, templateInfo.templates.length)
      );
    },
    {},
    [focusedTemplateIndex]
  );

  useKey(
    'ArrowUp',
    evt => {
      evt.preventDefault();
      const { templateInfo } = getTemplateInfoByIndex(focusedTemplateIndex);
      const previousTemplateInfo =
        templateInfos[templateInfos.indexOf(templateInfo) - 1] || templateInfo;

      safeSetFocusedTemplate(
        i => i - Math.min(COLUMN_COUNT, previousTemplateInfo.templates.length)
      );
    },
    {},
    [focusedTemplateIndex]
  );

  /**
   * Our listener for CMD/CTRL + Num calls
   */
  useKey(
    e => {
      const num = getNumber(e);
      const modifierCheck = isMac ? e.metaKey : e.shiftKey;
      return num > 0 && num < 10 && modifierCheck;
    },
    e => {
      const num = getNumber(e);

      const template = getTemplateByIndex(num - 1);
      openSandbox(template.sandbox);
    }
  );

  /**
   * Our listener for Enter calls
   */
  useKey('Enter', e => {
    const template = getTemplateByIndex(focusedTemplateIndex);
    openSandbox(template.sandbox);
  });

  let offset = 0;
  return (
    <>
      {templateInfos.map(({ templates, title, key }, templateInfoIndex) => {
        if (templateInfoIndex > 0) {
          offset += templateInfos[templateInfoIndex - 1].templates.length;
        }

        if (templates.length === 0) {
          return null;
        }

        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <SubHeader>{title}</SubHeader>
            <Grid columnCount={COLUMN_COUNT}>
              {templates.map((template, i) => {
                const index = offset + i;
                const focused = focusedTemplateIndex === offset + i;

                const shortKey = index < 9 ? `${MODIFIER_KEY}${index + 1}` : '';
                const detailText = focused ? '↵' : shortKey;

                return (
                  <SandboxCard
                    key={template.id}
                    title={template.sandbox.title}
                    iconUrl={template.iconUrl}
                    // @ts-ignore
                    environment={template.sandbox.source.template}
                    url={sandboxUrl(template.sandbox)}
                    color={template.color}
                    owner={template.sandbox.author.username}
                    templateId={template.id}
                    sandboxId={template.sandbox.id}
                    mine={
                      template.sandbox.author.username ===
                      (state.user && state.user.username)
                    }
                    focused={focused}
                    detailText={detailText}
                  />
                );
              })}
            </Grid>
          </div>
        );
      })}
    </>
  );
};
