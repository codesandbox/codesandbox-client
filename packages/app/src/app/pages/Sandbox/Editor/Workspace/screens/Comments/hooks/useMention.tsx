import React from 'react';
import getCaretCoordinates from 'textarea-caret';

function getMentionAtIndex(value, index, mentions) {
  const words = value.split(' ');
  // Based on current caret position, figure out if we have entered
  // a mention
  const { mention } = words.reduce(
    (aggr, word) => {
      if (aggr.mention) {
        return aggr;
      }

      const currentIndex = aggr.index;
      if (
        // The mention can lead with linebreaks
        word.match(/^\n+@|@/) &&
        index >= currentIndex &&
        index <= currentIndex + word.length &&
        !(word.substr(word.indexOf('@') + 1) in mentions)
      ) {
        const atIndex = word.indexOf('@');

        return {
          mention: {
            value: word,
            startIndex: currentIndex + atIndex,
            endIndex: currentIndex + word.length - 1,
          },
        };
      }

      return {
        index: currentIndex + word.length + 1, // 1 is for the spacing
      };
    },
    {
      index: 0,
      mention: null,
    }
  );

  return mention;
}

export const useMention = (
  { current },
  initialValue: string | (() => string) = '',
  initialMentions: {
    [mentionName: string]: any;
  } = {}
): [
  string,
  (value: string) => void,
  {
    query: null | string;
    top: number;
    left: number;
    add: (mentionName: string, meta: any) => void;
  },
  {
    [mentionName: string]: any;
  }
] => {
  const [value, setValue] = React.useState(initialValue);
  const [, forceRerender] = React.useState(0);
  const [mentions, setMentions] = React.useState(initialMentions);

  React.useEffect(() => {
    if (current) {
      // This handles rerendering on moving the selection
      // as well
      const onKeyUp = () => {
        forceRerender(i => i + 1);
      };

      current.addEventListener('keyup', onKeyUp);

      return () => {
        current.removeEventListener('keyup', onKeyUp);
      };
    }
    return () => {};
  }, [current]);

  if (!current) {
    return [
      value,
      setValue,
      {
        query: null,
        top: 0,
        left: 0,
        add: () => {
          throw new Error('You are trying to add a mention without a query');
        },
      },
      mentions,
    ];
  }

  const mention = getMentionAtIndex(value, current.selectionStart, mentions);

  const query =
    mention &&
    current.value.substr(
      mention.startIndex + 1,
      mention.endIndex - mention.startIndex
    );

  if (
    !mention ||
    (query.length >= 3 && !/^[a-z0-9_-]+[a-z0-9_.-]+[a-z0-9_-]+$/i.test(query))
  ) {
    return [
      value,
      // TODO: Check on changes if mentions are still there
      setValue,
      {
        query: null,
        top: 0,
        left: 0,
        add: () => {
          throw new Error('You are trying to add a mention without a query');
        },
      },
      mentions,
    ];
  }

  const caret = getCaretCoordinates(current, mention.startIndex);

  return [
    value,
    (newValue: string) => {
      const currentMentions = Object.keys(mentions).reduce((aggr, name) => {
        if (!newValue.includes(`@${name}`)) {
          return aggr;
        }

        aggr[name] = mentions[name];

        return aggr;
      }, {});
      setMentions(currentMentions);
      setValue(newValue);
    },
    {
      query,
      top: caret.top,
      left: caret.left,
      add: (mentionName, meta) => {
        setMentions(currentMentions => ({
          ...currentMentions,
          [mentionName]: meta,
        }));
        setValue(
          value.substr(0, mention.startIndex + 1) +
            mentionName +
            value.substr(mention.endIndex + 1)
        );
        const selectionEnd = mention.startIndex + mentionName.length + 1;
        setTimeout(() => {
          current.focus();
          current.selectionEnd = selectionEnd;
        });
      },
    },
    mentions,
  ];
};
