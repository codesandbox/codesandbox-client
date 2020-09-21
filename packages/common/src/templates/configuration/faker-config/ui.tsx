import React, { useState, useEffect } from 'react';
import { Button, Stack, Element } from '@codesandbox/components';
import {
  ConfigDescription,
  PaddedConfig,
  ConfigItem,
  PaddedPreference,
} from '../elements';
import { ConfigurationUIProps } from '../types';

const ALLOWED_OPTIONS = [
  'name',
  'username',
  'email',
  'avatar_url',
  'pokemon',
  'boolean',
];

type File = {
  data?: {
    records: number;
    fields: object;
  };
};

type Value = {
  i: number;
  key: string;
  value: string;
};

export const ConfigWizard = (props: ConfigurationUIProps) => {
  const [records, setRecords] = useState<number>(2);
  const defaultState = {
    i: 0,
    key: '',
    value: '',
  };
  const [values, setValues] = useState<Value[]>([defaultState]);

  useEffect(() => {
    let file: File;
    try {
      file = JSON.parse(props.file);
    } catch {
      file = {};
    }

    if (file && file.data) {
      setRecords(file.data.records);
      const valuesFromFile = Object.keys(file.data.fields).reduce(
        (acc: Value[], curr: string, i: number) => {
          acc.push({
            i,
            key: curr,
            value: file.data.fields[curr],
          });

          return acc;
        },
        []
      );
      setValues(valuesFromFile);
    }
  }, [props.file]);

  const generateFile = async () => {
    const fields = values.reduce((acc: object, curr: Value) => {
      acc[curr.key] = '_' + curr.value;

      return acc;
    }, {});
    const data = {
      data: {
        records,
        fields,
      },
    };

    props.updateFile(JSON.stringify(data, null, 2));
    props.updateFaker(data);
  };

  const changeValues = (value: string, i: number, key: string) => {
    setValues((oldValues: Value[]) =>
      oldValues.map(oldValue => {
        if (oldValue.i === i) {
          oldValue[key] = value;
        }

        return oldValue;
      })
    );
  };

  return (
    <div>
      <Stack marginY={4}>
        <Button onClick={generateFile} autoWidth>
          Generate File
        </Button>
      </Stack>
      <PaddedConfig>
        <ConfigItem>
          <PaddedPreference
            title="Number of records"
            type="number"
            value={records}
            setValue={(r: number) => setRecords(r)}
          />
        </ConfigItem>
        <ConfigDescription>
          How many records would you want us to generate?
        </ConfigDescription>
      </PaddedConfig>
      <Element marginY={4}>
        <ConfigDescription>
          Add your what you would like in your data
        </ConfigDescription>
      </Element>
      {values.map((value, i) => (
        <PaddedConfig>
          <ConfigItem>
            <Element style={{ width: '100%' }} paddingRight={2}>
              <PaddedPreference
                title="Key"
                type="string"
                value={value.key}
                setValue={(v: string) => changeValues(v, i, 'key')}
              />
            </Element>
            <Element style={{ width: '100%' }} paddingLeft={2}>
              <PaddedPreference
                title="Value"
                type="dropdown"
                value={value.value}
                options={ALLOWED_OPTIONS}
                setValue={(v: string) => changeValues(v, i, 'value')}
              />
            </Element>
          </ConfigItem>
        </PaddedConfig>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setValues((v: Value[]) =>
            v.concat({ key: '', value: '', i: v[v.length - 1].i + 1 })
          )
        }
      >
        Add a new row
      </Button>
    </div>
  );
};

export default {
  ConfigWizard,
};
