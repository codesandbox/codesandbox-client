import React, { useEffect } from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Navigation from 'app/pages/common/Navigation';
import { inject, hooksObserver } from 'app/componentConnectors';
import history from 'app/utils/history';
import { NewSandboxModal } from '../Dashboard/Content/CreateNewSandbox/NewSandboxModal';

const createSandbox = template => {
  history.push(sandboxUrl({ id: template.shortid }));
};

const NewSandbox = ({ signals: { sandboxPageMounted } }) => {
  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <MaxWidth
      css={`
        height: 100vh;
      `}
    >
      <Margin horizontal={1.5} style={{ height: '100%' }} vertical={1.5}>
        <Navigation title="New Sandbox" />

        <Margin top={5}>
          <Centered horizontal vertical>
            <Margin style={{ maxWidth: '100%', width: 900 }} top={2}>
              <NewSandboxModal createSandbox={createSandbox} width={980} />
            </Margin>
          </Centered>
        </Margin>
      </Margin>
    </MaxWidth>
  );
};

export default inject('signals')(hooksObserver(NewSandbox));
