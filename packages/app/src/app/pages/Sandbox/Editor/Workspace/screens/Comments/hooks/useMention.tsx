import React from 'react';
import getCaretCoordinates from 'textarea-caret';

export const useMention = ({ ref, value, setValue }) => {
  const [mention, setMention] = React.useState(null);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [menuIndex, setMenuIndex] = React.useState(0);
  const [userResources, updateUserResources] = React.useState({});
  const query =
    mention &&
    ref.current.value.substr(
      mention.startIndex + 1,
      mention.endIndex - mention.startIndex
    );

  React.useEffect(() => {
    console.log('AN EFFECT', query);
    let timeoutId;
    if (query && query.length > 2) {
      setLoadingUsers(true);
      // Small debounce
      timeoutId = window.setTimeout(() => {
        fetch(`/api/v1/users/search?username=${query}`)
          .then(x => x.json())
          .then(x => {
            console.log(x);
            setLoadingUsers(false);
            setUsers(x);
          })
          .catch(e => {
            console.log(e);
            setLoadingUsers(false);
          });
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [query, mention]);

  const onKeyDown = event => {
    // If we have a mention and using the arrow keys or hitting enter
    if (
      mention &&
      (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13)
    ) {
      event.preventDefault();

      // Hitting enter adds the mention
      if (event.keyCode === 13) {
        updateUserResources({
          ...userResources,
          ['@' + users[menuIndex]]: '/whatever',
        });
        setValue(
          value.substr(0, mention.startIndex) +
            '@' +
            users[menuIndex].username +
            value.substr(mention.endIndex + 1)
        );
        setMenuIndex(0);
      } else {
        // Change selection in the mentions list
        const add = event.keyCode === 38 ? -1 : 1;
        const change = menuIndex + add;

        if (change < 0) {
          setMenuIndex(0);
        } else if (change > users.length - 1) {
          setMenuIndex(users.length - 1);
        } else {
          setMenuIndex(change);
        }
      }
    }
    // When hitting "@" at the very start or after a space, open
    // the users list
    if (
      event.key === '@' &&
      (!event.target.value[event.target.selectionStart - 1] ||
        event.target.value[event.target.selectionStart - 1] === ' ')
    ) {
      openUsersList();
    } else if (mention) {
      // If we have a mention and hit space we want to hide it
      if (event.keyCode === 32) {
        setMention(null);
      } else {
        // Or we want to update the mention range
        const newLength = event.target.value.length;
        const endIndex = mention.endIndex + (newLength - mention.length);
        setMention({
          ...mention,
          endIndex,
          length: newLength,
        });
      }
    }
  };

  const onKeyUp = React.useCallback(() => {
    // When we clear out all text we want to close mention
    if (!value.length) {
      setMention(null);
    }
    // If we have moved the selection out of range of existing mention,
    // close it
    if (
      mention &&
      (ref.current.selectionStart < mention.startIndex ||
        ref.current.selectionStart > mention.endIndex + 1)
    ) {
      setMention(null);
    } else {
      const words = value.split(' ');
      // Based on current caret position, figure out if we have entered
      // a mention
      const { mention: mentionNew } = words.reduce(
        (aggr, word) => {
          if (aggr.mention) {
            return aggr;
          }

          const currentIndex = aggr.index;
          if (
            word.startsWith('@') &&
            !userResources[word] &&
            ref.current.selectionStart >= currentIndex &&
            ref.current.selectionStart <= currentIndex + word.length
          ) {
            const caret = getCaretCoordinates(ref.current, currentIndex + 1);
            return {
              mention: {
                startIndex: currentIndex,
                endIndex: currentIndex + word.length - 1,
                length: ref.current.value.length,
                top: caret.top,
                left: caret.left,
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
      if (mentionNew) {
        setMention(mentionNew);
      }
    }
  }, [value, mention, ref, userResources]);

  // Replaces the comment content with links to mentions
  const output = Object.keys(userResources).reduce(
    (aggr, userMention) =>
      aggr.replace(
        userMention,
        `[${userMention}](user://${userResources[userMention]})`
      ),
    value
  );

  value
    .split(' ')
    .map(word => {
      if (userResources[word]) {
        return `[${word}](user://${userResources[word]})`;
      }

      return word;
    })
    .join(' ');

  // Opens the mentions list by looking at the current selection
  function openUsersList() {
    const caret = getCaretCoordinates(ref.current, ref.current.selectionEnd);
    setMention({
      startIndex: ref.current.selectionStart,
      endIndex: ref.current.selectionStart,
      length: ref.current.value.length,
      top: caret.top,
      left: caret.left,
    });
  }

  return [users, onKeyDown, onKeyUp, loadingUsers, mention, query];
};
