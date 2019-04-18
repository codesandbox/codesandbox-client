/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  protocolAndHost,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import WideSandbox from '@codesandbox/common/lib/components/WideSandbox';

const openSandbox = id => {
  const url = sandboxUrl({ id });
  window.open(url, '_blank');
};

const ShowMore = styled.button`
  font-family: 'Poppins', sans-serif;

  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px 4px 0px 0px;
  margin-bottom: 1rem;
  font-size: 20px;
  color: ${props => props.theme.new.title};
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;

  cursor: pointer;
`;

const Container = styled.div`
  padding: 6rem 0;
  margin-bottom: 160px;
`;

const Title = styled.h3`
  font-family: Poppins;
  font-weight: 500;
  font-size: 38px;
  margin-bottom: 24px;
  color: ${props => props.theme.lightText};
`;

export const Sandboxes = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;

  > div {
    margin-left: 0;
    margin-right: 0;
  }

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export default () => {
  const [fetching, setFetching] = useState(false);
  const [sandboxes, setSandboxes] = useState([]);

  const loadSandboxes = async () => {
    setFetching(true);
    const data = await fetch(
      `${protocolAndHost()}/api/v1/sandboxes/picked`
    ).then(x => x.json());
    setFetching(false);
    setSandboxes(data.sandboxes.slice(0, 3));
  };

  useEffect(() => {
    loadSandboxes();
  }, []);

  return (
    <Container>
      <MaxWidth width={1440}>
        <Title>Explore</Title>
        <Sandboxes>
          {!fetching
            ? sandboxes.map((sandbox, i) => (
                <WideSandbox
                  key={i}
                  pickSandbox={({ id }) => openSandbox(id)}
                  sandbox={sandbox}
                />
              ))
            : new Array(3)
                .fill(undefined)
                .map((_, i) => <WideSandbox key={i} />)}
        </Sandboxes>
        <ShowMore onClick={() => window.open('/explore')}>
          Show more on Explore Page{' '}
        </ShowMore>
      </MaxWidth>
    </Container>
  );
};
