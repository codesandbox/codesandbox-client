import {
  Button,
  Text,
  Stack,
  Element,
  Collapsible,
  Textarea,
} from '@codesandbox/components';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import QRCode from 'qrcode.react';
import React from 'react';

import {
  BUTTON_URL,
  getButtonHTML,
  getButtonMarkdown,
  getEmbedUrl,
  getDevToLink,
  getTwitterLink,
} from './getCode';
import { Field } from '.';

export const SocialShare = ({ sandbox, mainModule, state, select }) => (
  <Collapsible title="Other Sharing Options">
    <Element paddingX={4}>
      <Text size={3} weight="bold" block marginBottom={2}>
        Share CodeSandbox Button
      </Text>
      <a href={sandboxUrl(sandbox)}>
        <img alt={getSandboxName(sandbox)} src={BUTTON_URL} />
      </a>
      <Field label="Markdown">
        <Textarea
          onFocus={select}
          value={getButtonMarkdown(sandbox, mainModule, state)}
          readOnly
        />
      </Field>
      <Field label="HTML">
        <Textarea
          onFocus={select}
          value={getButtonHTML(sandbox, mainModule, state)}
          readOnly
        />
      </Field>

      <Text size={3} marginTop={4} weight="bold" block marginBottom={2}>
        Share QR Code
      </Text>
      <QRCode
        value={getEmbedUrl(sandbox, mainModule, state)}
        size="100%"
        renderAs="svg"
      />
      <Text size={3} marginTop={4} weight="bold" block marginBottom={2}>
        Share on Social Media
      </Text>
      <Stack gap={2}>
        <Button as="a" autoWidth target="_blank" href={getDevToLink(sandbox)}>
          Share on DEV
        </Button>
        <Button
          as="a"
          autoWidth
          target="_blank"
          href={getTwitterLink(sandbox, mainModule, state)}
        >
          Share on Twitter
        </Button>
      </Stack>
    </Element>
  </Collapsible>
);
