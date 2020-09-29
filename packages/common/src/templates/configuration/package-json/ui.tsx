import React from 'react';

import {
  ConfigItem,
  ConfigName,
  ConfigValue,
  ConfigDescription,
  PaddedConfig,
} from '../elements';

export const ConfigWizard = ({ file }) => {
  let error;
  try {
    JSON.parse(file);
  } catch (e) {
    error = e;
  }

  if (error) {
    return <div>Problem parsing file: {error.message}</div>;
  }

  return (
    <div>
      <PaddedConfig>
        <ConfigItem>
          <ConfigName>name</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <ConfigName>version</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
        <ConfigDescription>
          The version of the project, this is required together with the name.
          For non-libraries this is 1.0.0 most of the time.
        </ConfigDescription>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <ConfigName>description</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <ConfigName>keywords</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
        <ConfigDescription>
          Used to make the project more easily searchable. This helps people
          discover your package as it{"'"}s listed in npm search.
        </ConfigDescription>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <ConfigName>homepage</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
        <ConfigDescription>The url to the project homepage.</ConfigDescription>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <ConfigName>license</ConfigName>
          <ConfigValue>World</ConfigValue>
        </ConfigItem>
        <ConfigDescription>
          The license describes guidelines on the use and distribution of your
          project.{' '}
          <a
            href="https://choosealicense.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Choose a license
          </a>{' '}
          is a helpful resource for choosing a license.
        </ConfigDescription>
      </PaddedConfig>
    </div>
  );
};

export default {
  ConfigWizard,
};
