import React from 'react';
import TextLoop from 'react-text-loop';
import styled from 'styled-components';

const ShuffleWords = styled.section`
  color: ${props => props.theme.homepage.white};
  font-size: 2em;
  font-family: 'MonoLisa', monospace;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 6rem;
  text-align: center;

  @media screen and (max-width: 900px) {
    font-size: 1.5rem;
  }

  @media screen and (max-width: 700px) {
    font-size: 1.2rem;
  }
`;

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const words = [
  'State',
  'Effect',
  'Ref',
  'Context',
  'Reducer',
  'Memo',
  'Callback',
  'ImperativeHandle',
  'LayoutEffect',
  'DebugValue',
];

export default () => (
  <ShuffleWords>
    import {'{ '}
    use
    <TextLoop interval={1500}>{shuffle(words).map(word => word)}</TextLoop>{' '}
    {'  }'} from {"'"}
    react
    {"'"}
  </ShuffleWords>
);
