import React, { useEffect } from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import css from '@styled-system/css';
import { Input, List, ListItem, ListAction } from '@codesandbox/components';
import { DropdownList, DropdownItem } from './elements';

interface IUserAutoComplete {
  inputValue: string;
  children: (answer: {
    users: string[];
    loading: boolean;
    error: Error | null;
  }) => JSX.Element;
}

const UserAutoComplete = ({ inputValue, children }: IUserAutoComplete) => {
  const [users, setUsers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    if (inputValue.length > 2 && !inputValue.includes('@')) {
      fetch(`/api/v1/users/search?username=${inputValue}`)
        .then(x => x.json())
        .then(x => {
          setUsers(x.map(user => user.username));
          setLoading(false);
        })
        .catch(e => {
          setError(e);
        });
    } else {
      setUsers([]);
    }
  }, [inputValue]);

  return children({ users, loading, error });
};

interface IUserSearchInputProps {
  onInputValueChange: DownshiftProps<string>['onInputValueChange'];
  inputValue: string;
  [key: string]: any;
}

export const UserSearchInput = ({
  onInputValueChange,
  inputValue,
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
        <div {...getRootProps({}, { suppressRefError: true })}>
          <Input
            {...props}
            {...getInputProps({
              placeholder: 'Enter name or email address',
            })}
          />
        </div>

        <UserAutoComplete inputValue={currentInputValue}>
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
                })}
                {...getMenuProps({})}
              >
                {users.map((item, index) => (
                  <ListAction
                    key={item}
                    isActive={highlightedIndex === index}
                    {...getItemProps({
                      item,
                      index,
                      isSelected: selectedItem === item,
                    })}
                  >
                    {item}
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
