import React, { useEffect } from 'react';
import Downshift from 'downshift';
import { Input } from '@codesandbox/components';
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
    if (inputValue.length > 2 || inputValue.includes('@')) {
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

export const UserSearchInput = () => (
  <Downshift>
    {({
      getLabelProps,
      getInputProps,
      getToggleButtonProps,
      getItemProps,
      isOpen,
      clearSelection,
      selectedItem,
      inputValue,
      highlightedIndex,
    }) => (
      <div style={{ width: '100%', position: 'relative' }}>
        <Input
          {...getInputProps({
            placeholder: 'Enter name or email address',
          })}
        />

        {isOpen ? (
          <UserAutoComplete inputValue={inputValue}>
            {({ users, error }) =>
              users.length > 0 && !error ? (
                <DropdownList as="ul" direction="vertical">
                  {users.map((item, index) => (
                    <DropdownItem
                      key={item}
                      {...getItemProps({
                        item,
                        index,
                        isActive: highlightedIndex === index,
                        isSelected: selectedItem === item,
                      })}
                    >
                      {item}
                    </DropdownItem>
                  ))}
                </DropdownList>
              ) : null
            }
          </UserAutoComplete>
        ) : null}
      </div>
    )}
  </Downshift>
);
