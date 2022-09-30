import { gitHubRepoPattern } from '@codesandbox/common/lib/utils/url-generator';
import { Button, Element, Input, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React from 'react';
import { getOwnerAndNameFromInput } from './utils';

type UrlState = {
  raw: string;
  parsed: { owner: string; name: string } | null;
  error: string | null;
};

const Step1: React.FC = () => {
  const [url, setUrl] = React.useState<UrlState>({
    raw: '',
    parsed: null,
    error: null,
  });

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setUrl({ raw: value, parsed: null, error: null });
    } else if (!gitHubRepoPattern.test(value)) {
      setUrl({
        raw: value,
        parsed: null,
        error: 'The URL provided is not valid.',
      });
    } else {
      const { owner, name } = getOwnerAndNameFromInput(value.trim());
      setUrl({
        raw: value,
        parsed: {
          owner,
          name,
        },
        error: null,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Stack direction="vertical" gap={4}>
      <Text
        as="h2"
        id="form-title"
        css={{
          fontSize: '16px',
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Enter the GitHub repository URL to import
      </Text>
      <form onSubmit={handleFormSubmit}>
        <Stack gap={2}>
          <Input
            aria-describedby="form-title form-error"
            aria-invalid={Boolean(url.error)}
            onChange={handleUrlInputChange}
            placeholder="GitHub Repository URL"
            type="text"
            value={url.raw}
            required
          />
          <Button disabled={Boolean(url.error)} type="submit" autoWidth>
            Import
          </Button>
        </Stack>
        <Element aria-atomic="true" id="form-error" role="alert">
          {url.error ? (
            <Text
              as="small"
              css={css({
                display: 'block',
                marginTop: 2,
                color: 'errorForeground',
                fontSize: 12,
              })}
            >
              {url.error}
            </Text>
          ) : null}
        </Element>
      </form>
    </Stack>
  );
};

export const Import: React.FC = () => {
  return (
    <Stack direction="vertical" css={{ width: '100%', height: '100%' }}>
      <Step1 />
    </Stack>
  );
};
