import React, { FunctionComponent } from 'react';

import KeybindingInput from './KeybindingInput';

type Props = {
  setValue: (value: string[][]) => void;
  value: string[][];
};

export const PreferenceKeybinding: FunctionComponent<Props> = ({
  setValue: setValueProp,
  value: valueProp,
  ...props
}) => {
  const setValue = (index: number) => (value: string[]) => {
    const result = [...valueProp];
    result[index] = value;

    setValueProp(result);
  };

  return (
    <div>
      <KeybindingInput
        {...props}
        placeholder="First"
        setValue={setValue(0)}
        value={valueProp[0]}
      />

      {' - '}

      <KeybindingInput
        {...props}
        disabled={!valueProp[0] || valueProp[0].length === 0}
        placeholder="Second"
        setValue={setValue(1)}
        value={valueProp.length === 2 && valueProp[1]}
      />
    </div>
  );
};
