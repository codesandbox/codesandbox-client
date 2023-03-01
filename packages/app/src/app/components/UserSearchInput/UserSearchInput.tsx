import React, { useEffect } from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import css from '@styled-system/css';
import { Input, List, ListAction } from '@codesandbox/components';
import { useAppState } from 'app/overmind';

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

interface IUserAutoComplete {
  inputValue: string;
  allowSelf?: boolean;
  children: (answer: {
    users: User[];
    loading: boolean;
    error: Error | null;
  }) => JSX.Element;
}

const UserAutoComplete = ({
  inputValue,
  children,
  allowSelf = false,
}: IUserAutoComplete) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const { user } = useAppState();

  useEffect(() => {
    setLoading(true);
    setError(null);

    let timeoutId: number;

    if (inputValue.length > 2 && !inputValue.includes('@')) {
      // Small debounce
      timeoutId = window.setTimeout(() => {
        fetch(`/api/v1/users/search?username=${inputValue}`)
          .then(x => x.json())
          .then(x => {
            const fetchedUsers = allowSelf
              ? x
              : x.filter(member => member.username !== user?.username);
            setUsers(fetchedUsers);
            setLoading(false);
          })
          .catch(e => {
            setError(e);
          });
      }, 300);
    } else {
      setUsers([]);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [allowSelf, inputValue, user]);

  return children({ users, loading, error });
};

interface IUserSearchInputProps {
  onInputValueChange: DownshiftProps<string>['onInputValueChange'];
  inputValue: string;
  allowSelf?: boolean;
  [key: string]: any;
}

// There is a conflict with 'as' typing (string vs 'select' | 'option', etc...)
const InputWithoutTypes = Input as any;

export const UserSearchInput = ({
  onInputValueChange,
  inputValue,
  allowSelf = false,
  ...props
}: IUserSearchInputProps) => (
  <Downshift
    inputValue={inputValue}
    onInputValueChange={onInputValueChange}
    selectedItem={inputValue}
  >
    {({
      getInputProps,
      getItemProps,
      getRootProps,
      getMenuProps,
      isOpen,
      selectedItem,
      inputValue: currentInputValue,
      highlightedIndex,
    }) => (
      <div style={{ width: '100%', position: 'relative' }}>
        <div
          {...getRootProps({ refKey: 'innerRef' }, { suppressRefError: true })}
        >
          <InputWithoutTypes
            {...props}
            {...getInputProps({
              placeholder: 'Enter username or email to invite team member',
            })}
            autoFocus
            spellcheck="false"
          />
        </div>

        <UserAutoComplete allowSelf={allowSelf} inputValue={currentInputValue}>
          {({ users, error }) =>
            users.length > 0 && !error && isOpen ? (
              <List
                css={css({
                  position: 'absolute',
                  width: '100%',
                  borderBottomLeftRadius: 'small',
                  borderBottomRightRadius: 'small',
                  boxShadow: 1,
                  fontSize: 3,
                  backgroundColor: 'dialog.background',
                  border: '1px solid',
                  borderColor: 'dialog.border',
                  zIndex: 20,
                })}
                {...getMenuProps({})}
              >
                {users.map((item, index) => (
                  <ListAction
                    key={item.id}
                    isActive={highlightedIndex === index}
                    {...getItemProps({
                      item: item.username,
                      index,
                      isSelected: selectedItem === item.username,
                    })}
                  >
                    <img
                      alt={item.username}
                      css={css({
                        borderRadius: 2,
                        marginRight: 2,
                      })}
                      width={24}
                      height={24}
                      src={item.avatar_url}
                    />{' '}
                    {item.username}
                  </ListAction>
                ))}
              </List>
            ) : null
          }
        </UserAutoComplete>
      </div>
    )}
  </Downshift>
);
