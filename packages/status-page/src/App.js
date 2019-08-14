import React from 'react';
import { useDowntime } from './hooks/useDowntime';
import Header from './components/Header';
import Downtimes from './components/Downtimes';
import styled from 'styled-components';

const Main = styled.main`
  background: #000000;
  box-shadow: 0px 2px 0.25rem rgba(0, 0, 0, 0.25),
    0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  width: 890px;
  min-height: 660px;
  padding: 2.5rem;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Footer = styled.span`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1rem;

  color: rgba(255, 255, 255, 0.6);
`;

function App() {
  const [downtimes, up, loading] = useDowntime();

  return (
    <Wrapper>
      <Main>
        <Header up={up} loading={loading} />
        <Downtimes downtimes={downtimes} />
      </Main>
      <Footer>
        Updates provided via the{' '}
        <a href="https://twitter.com/csbstatus">@csbstatus</a> twitter
        feed—follow us there!
      </Footer>
    </Wrapper>
  );
}

export default App;
