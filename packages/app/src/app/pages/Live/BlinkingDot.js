import React, { useEffect, useState } from 'react';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import styled from 'styled-components';

const DotContainer = styled.div`
  font-size: 4rem;
  display: block;
  color: rgb(253, 36, 57);

  svg {
    transition: 0.3s ease opacity;
  }
`;

const BlinkingDot = () => {
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowing(show => !show);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <DotContainer>
      <RecordIcon style={{ opacity: showing ? 1 : 0 }} />
    </DotContainer>
  );
};

export default BlinkingDot;
