import React, { ChangeEvent, FunctionComponent } from 'react';

import { PrivacyStatus } from 'app/components/PrivacyStatus';
import { useOvermind } from 'app/overmind';

import { Item, PropertyName, PropertyValue } from '../elements';

import { PrivacyContainer, PrivacySelect } from './elements';

type Props = {
  editable: boolean;
};
export const Privacy: FunctionComponent<Props> = ({ editable }) => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      editor: {
        currentSandbox: { privacy },
      },
      isPatron,
    },
  } = useOvermind();

  return (
    <Item>
      <PropertyName>Privacy</PropertyName>

      <PropertyValue>
        <PrivacyContainer>
          {editable ? (
            <PrivacySelect
              disabled={!isPatron}
              onChange={({
                target: { value },
              }: ChangeEvent<HTMLSelectElement>) =>
                sandboxPrivacyChanged(Number(value) as 0 | 1 | 2)
              }
              value={privacy}
            >
              <option value={0}>Public</option>

              {isPatron && (
                <option value={1}>Unlisted (only available by url)</option>
              )}

              {isPatron && <option value={2}>Private</option>}
            </PrivacySelect>
          ) : (
            <PrivacyStatus privacy={privacy} />
          )}
        </PrivacyContainer>
      </PropertyValue>
    </Item>
  );
};
