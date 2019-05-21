import Centered from '@codesandbox/common/lib/components/flex/Centered';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { inject } from 'mobx-react';
import React, { useEffect } from 'react';

import Navigation from 'app/pages/common/Navigation';
import history from 'app/utils/history';

import NewSandboxModal from '../Dashboard/Content/CreateNewSandbox/Modal';

const createSandbox = template => {
  history.push(sandboxUrl({ id: template.shortid }));
};

const NewSandbox = ({ signals: { sandboxPageMounted } }) => {
  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <MaxWidth>
      <Margin horizontal={1.5} style={{ height: '100%' }} vertical={1.5}>
        <Navigation title="New Sandbox" />

        <Margin top={5}>
          <Centered horizontal vertical>
            <Margin style={{ maxWidth: '100%', width: 900 }} top={2}>
              <NewSandboxModal createSandbox={createSandbox} width={950} />
            </Margin>
          </Centered>
        </Margin>
      </Margin>
    </MaxWidth>
  );
};

export default inject('signals')(NewSandbox);
